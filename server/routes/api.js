/* eslint-disable camelcase */
/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 */

import * as express from "express";
import User from "../database/models/user.js";
import mongoose from "mongoose";
import UserStat from "../database/models/userStat.js";
import { Constraints, userStatSchema } from "../database/validation.js";
import createError from "http-errors";
import Database from "../database/mongo.js";
import { USER_STAT } from "../database/mongo.js";
import { quoteRouter } from "./quotes.js";
import { getAverage } from "./util.js";

import { getUserStats } from "../controller/mongoHelper.js";
import createHttpError from "http-errors";

const router = express.Router();
const database = new Database();

const userStatEnpoint = "/user_stat";
const quoteEnpoint = "/quote";
const userEnpoint = "/user";
const leaderboardEndpoint = "/leaderboard";

export const SUCCESS = 200;
export const BAD_REQUEST = 400;
export const INTERNAL_SE = 500;

router.use(express.json());
router.use(quoteEnpoint, quoteRouter);
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
            const filter = { _id: previousStats._id }

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
    if (!dbIsConnected()) {
        next(new createError.InternalServerError("Database is unavailable"));
        return;
    }
    const email = Constraints.email(req.body.email);
    if(!email){
        next(new createHttpError.BadRequest("Can't find or create the user because no email was provided"));
        return;
    }
    let user = await User.findOne({ email: email });
    // Create the user.
    if (user === null) {
        const username = req.body.username;
        const picture_url = req.body.picture_url;
        const stats = await new UserStat().save();
        user = new User({
            username,
            picture_url,
            email,
            user_stats: stats._id
        });
        try {
            await user.save();
        } catch (error) {
            next(new createHttpError.BadRequest({
                message: "values do not comply with user stats schema",
                error: error.message
            }));
            return;
        }
    }
    res.status(SUCCESS).json((await user.populate("user_stats")).toObject());
})

/**
 * Get endpoint that returns a hardcoded json object containing
 * leaderboard info such as rank, wpm, username and temporary profileURL
 */
router.get(leaderboardEndpoint, async (req, res, next) => {
    if (!dbIsConnected()) {
        next(new createError.InternalServerError("Error while getting the leaderboard"));
        return;
    }
    const maxItems = Constraints.positiveInt(req.query.max) || 10;
    
    // todo: set a max number of users to return
    User.find({}).limit(maxItems).populate({
        path: "user_stats", select: ["wpm", "accuracy"]
    }).sort({"user_stats.wpm": "desc"}).exec((error, users) => {
        if (error) {
            console.log(`there is a fucky wucky when fetching the leader board`);
            console.error(error);
            next(new createError.InternalServerError("Error while getting the leaderboard"));
            return;
        }
        res.status(SUCCESS).json(users);
    });
});

router.put("/update_user", async (req, res) => {
    if (!dbIsConnected()) {
        next(new createError.InternalServerError("Database is unavailable"));
        return;
    }
    const email = Constraints.email(req.body.email);
    if (!email) {
        next(new createHttpError.BadRequest("Can't find or update the user because no email was provided"));
        return;
    }
    let user = await User.findOne({ email: email });
    // Create the user.
    if (user) {
        console.log(user)
        // const username = req.body.username;
        // const picture_url = req.body.picture_url;

        // user = new User({
        //     username,
        //     picture_url,
        //     email,
        //     user_stats: user.user_stats
        // });
        // try {
        //     await user.save();
        // } catch (error) {
        //     next(new createHttpError.BadRequest({
        //         message: "values do not comply with user schema",
        //         error: error.message
        //     }));
        //     return;
        // }
    }
    res.status(SUCCESS).json("user updated");
});

function dbIsConnected() {
    return mongoose.connection.readyState === 1;
}

function handleHttpErrors(error, _, res, next) {
    if (error instanceof createHttpError.HttpError) {
        res.status(error.status).json({ "error": error.message });
        return;
    }
    next(error);
}
router.use(handleHttpErrors);
export default router;