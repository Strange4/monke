/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 */

import * as express from "express";
import User from "../database/models/user.js";
import mongoose from "mongoose";
import UserStat from "../database/models/userStat.js";
import { userSchema, userStatSchema } from "../database/validation.js";
import createError from "http-errors";
import Database from "../database/mongo.js";
import { USER, USER_STAT } from "../database/mongo.js";
import { quoteRouter } from "./quotes.js";
import { getAverage } from "./util.js";

import { getUserStats } from "../controller/mongoHelper.js";
import bodyParser from "body-parser";
import createHttpError from "http-errors";

const router = express.Router();
const database = new Database();

router.use(express.json());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const userStatEnpoint = "/user_stat";
const quoteEnpoint = "/quote";
const userEnpoint = "/user";
const leaderboardEndpoint = "/leaderboard";
router.use(quoteEnpoint, quoteRouter);

export const SUCCESS = 200;
export const BAD_REQUEST = 400;
export const INTERNAL_SE = 500;

router.put(userStatEnpoint, async (req, res, next) => {
    let email = req.body.email;
    let newWpm = req.body.wpm;
    let newAcc = req.body.accuracy;
    let win = req.body.win;
    let lose = req.body.lose;
    let draw = req.body.draw;

    if (database.isConnected()) {
        // user = await User.findOne({ email: email });
        const user = await User.findOne({ email: email });

        // check if user exists
        if (user?.id !== undefined) {
            const previousStats = await getUserStats(email);
            const filter = { user: user.id, id: previousStats.id }

            let update;
            if (newWpm > previousStats.max_wpm) {
                update = {
                    "max_wpm": newWpm,
                    "wpm": getAverage(previousStats.wpm, newWpm, previousStats.games_count),
                    "max_accuracy": newAcc,
                    "accuracy":
                        getAverage(previousStats.accuracy, newAcc, previousStats.games_count),
                    "games_count": previousStats.games_count + 1,
                    "win": previousStats.win + win,
                    "lose": previousStats.lose + lose,
                    "draw": previousStats.draw + draw,
                    "date": Date.now()
                }

            } else if (newWpm === previousStats.max_wpm && newAcc > previousStats.max_accuracy) {
                update = {
                    "max_wpm": newWpm,
                    "wpm": getAverage(previousStats.wpm, newWpm, previousStats.games_count),
                    "max_accuracy": newAcc,
                    "accuracy":
                        getAverage(previousStats.accuracy, newAcc, previousStats.games_count),
                    "games_count": previousStats.games_count + 1,
                    "win": previousStats.win + win,
                    "lose": previousStats.lose + lose,
                    "draw": previousStats.draw + draw,
                    "date": Date.now()
                }
            } else {
                // Update average only
                update = {
                    "wpm": getAverage(previousStats.wpm, newWpm, previousStats.games_count),
                    "accuracy":
                        getAverage(previousStats.accuracy, newAcc, previousStats.games_count),
                    "games_count": previousStats.games_count + 1,
                    "win": previousStats.win + win,
                    "lose": previousStats.lose + lose,
                    "draw": previousStats.draw + draw,
                    "date": previousStats.date
                }
            }

            let isValidSchema;
            try {
                userStatSchema.parse(update);
                isValidSchema = true;
            } catch (err) {
                isValidSchema = false;
                next(createError(BAD_REQUEST,
                    { "error": "stat values do not comply with schema" }
                ));
            }
            if (isValidSchema) {
                await database.findOneAndUpdate(USER_STAT, filter, update);
                res.status(SUCCESS).json({ message: "Stats updated" });
            }
            userStatSchema.parse(update)
            await UserStat.findOneAndUpdate(filter, update);
        } else {
            next(createError(BAD_REQUEST, { "error": "Username does not exist on database. " }));
        }
    } else {
        next(INTERNAL_SE, { "error": "Database unavailable, try again later." });
    }
})

/**
 * Get endpoint that  json object containing the user
 * and their game statistics
 */
router.post(userEnpoint, async (req, res, next) => {
    if (database.isConnected()) {
        const email = req.body.user.email;
        let user = await User.findOne({ email: email })
        // Create the user.
        if (user === null) {
            const name = req.body.user.username;
            const pic = req.body.user.pic;
            // create the user
            const newUser = new User({
                "username": name,
                "picture_url": pic,
                "email": email
            });
            try {
                userSchema.parse(newUser);
                const userObject = await User.create(newUser);
                await userObject.save();
            } catch (err) {
                res.json({ "error": "values do not comply with user schema" });
                next()
            }

            //Stat creation
            const stats = new UserStat({
                "user": newUser.id,
                "max_wpm": 0,
                "wpm": 0,
                "max_accuracy": 0,
                "accuracy": 0,
                "games_count": 0,
                "win": 0,
                "lose": 0,
                "draw": 0,
                "date": null
            })
            try {
                userStatSchema.parse(stats)
                let userStatsObject = await UserStat.create(stats)
                await userStatsObject.save()
            } catch (err) {
                res.json({ "error": "values do not comply with user stats schema" });
                next()
            }
        }

        // query for user that matches username
        user = await User.findOne({ email: email });

        // query for user's game statistics
        const stats = await getUserStats(user.email);

        //TODO PROBLEM HERE
        let data = {
            "username": user.username,
            "image": user.picture_url,
            "wpm": stats?.wpm || 0,
            "max_wpm": stats?.max_wpm || 0,
            "accuracy": stats?.accuracy || 0,
            "max_accuracy": stats?.max_accuracy || 0,
            "games_count": stats?.games_count || 0,
            "win": stats?.win || 0,
            "lose": stats?.lose || 0,
            "draw": stats?.draw || 0,
            "date": stats.date || "could not retrieve date"
        };
        res.status(SUCCESS).json(data);
    } else {
        next(createError(INTERNAL_SE, { "error": "Database unavailable, try again later." }));
    }
})

/**
 * Get endpoint that returns a hardcoded json object containing
 * leaderboard info such as rank, wpm, username and temporary profileURL
 */
router.get(leaderboardEndpoint, async (_, res, next) => {
    const dbIsConnected = mongoose.connection.readyState == 1;
    if(!dbIsConnected){        
        next(new createError.InternalServerError("Error while getting the leaderboard"));
        return;
    }
    User.find({}).populate({ path: "user_stats", select: ["wpm", "accuracy"] }).lean().exec((error, users) => {
        if (error) {
            console.log(`there is a fucky wucky when fetching the leader board`);
            console.error(error);
            next(new createError.InternalServerError("Error while getting the leaderboard"));
            return;''
        }
        res.status(SUCCESS).json(users);
    });
});

function handleHttpErrors(error, _, res, next){
    if(error instanceof createHttpError.HttpError){
        res.status(error.status).json({ "error": error.message });
        return;
    }
    next(error);
}
router.use(handleHttpErrors);
export default router;