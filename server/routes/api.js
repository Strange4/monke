/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 */

import * as express from "express";
import User from "../database/models/user.js";

import UserStat from "../database/models/userStat.js";
import { userSchema, userStatSchema } from "../database/validation.js";
import createError from "http-errors";
import Database from "../database/mongo.js";
import { USER, USER_STAT } from "../database/mongo.js";
import { quoteRouter } from "./quotes.js";
import { getAverage } from "./util.js";

import { getQuote, getUserStats } from "../controller/mongoHelper.js";
import bodyParser from "body-parser";

const router = express.Router();
const database = new Database();

router.use(express.json());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



const userStat = "/user_stat";
const quote = "/quote";
const user = "/user";
const leaderboard = "/leaderboard";
router.use(quote, quoteRouter);

export const SUCCESS = 200;
export const BAD_REQUEST = 400;
export const INTERNAL_SE = 500;

router.put(userStat, async (req, res, next) => {
    console.log(req.body)
    let email = req.body.email;
    let newWpm = req.body.wpm;
    let newAccuracy = req.body.accuracy;
    let win = req.body.win;
    let lose = req.body.lose;
    let draw = req.body.draw;

    if (database.isConnected()) {
        // user = await User.findOne({ email: email });
        const user = await User.findOne({email: email});

        // check if user exists
        console.log("HE")
        console.log(email)
        console.log(user)
        if (user?.id !== undefined) {
            const previousStats = await getUserStats(email);
            const filter = { user: user.id, id: previousStats.id }

            let update;
            if (newWpm > previousStats.max_wpm) {
                update = {
                    "max_wpm": newWpm,
                    "wpm": getAverage(previousStats.wpm, newWpm, previousStats.games_count),
                    "max_accuracy": newAccuracy,
                    "accuracy": getAverage(previousStats.accuracy, newAccuracy, previousStats.games_count),
                    "games_count": previousStats.games_count + 1,
                    "win": previousStats.win + win,
                    "lose": previousStats.lose + lose,
                    "draw": previousStats.draw + draw,
                    "date": Date.now()
                }

            } else if (newWpm === previousStats.max_wpm && newAccuracy > previousStats.max_accuracy) {
                update = {
                    "max_wpm": newWpm,
                    "wpm": getAverage(previousStats.wpm, newWpm, previousStats.games_count),
                    "max_accuracy": newAccuracy,
                    "accuracy": getAverage(previousStats.accuracy, newAccuracy, previousStats.games_count),
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
                    "accuracy": getAverage(previousStats.accuracy, newAccuracy, previousStats.games_count),
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
                // console.log(err);
                isValidSchema = false;
                next(createError(BAD_REQUEST, { "error": "stat values do not comply with schema" }));
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
router.post(user, async (req, res, next) => {
    if (database.isConnected()) {
        const email = req.body.user.email;
        let user = await User.findOne({ email: email })
        console.log(req.body)
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
        console.log("HERE")
        console.log(user)
        // query for user's game statistics
        const stats = await getUserStats(user.email);

        let data = {
            "username": user.username,
            "image": user.picture_url,
            "wpm": stats.wpm,
            "max_wpm": stats.max_wpm,
            "accuracy": stats.accuracy,
            "max_accuracy": stats.max_accuracy,
            "games_count": stats.games_count,
            "win": stats.win,
            "lose": stats.lose,
            "draw": stats.draw,
            "date": stats.date
        };
        res.status(SUCCESS).json(data);
    } else {
        next(createError(INTERNAL_SE, { "error": "Database unavailable, try again later." }));
    }
})


/**
 * Sort the users into rank depending on wpm and accuracy, then returns the sorted leaderboard.
 * @param {*} users, Leadeaboard JSON Object without sorting and no rank field.
 * @returns Array of JSON object that represents the leaderboard.
 */
function sortRank(users) {
    const leaderboard = [];
    const userCount = users.length;
    let rank = 1;

    while (leaderboard.length !== userCount) {
        let picture = users[0].profilePicture;
        let username = users[0].username;
        let wpm = 0;
        let accuracy = 0;
        let index = 0;
        for (let i = 0; i < users.length; i++) {
            if (users[i].wpm > wpm) {
                picture = users[i].profilePicture;
                username = users[i].username;
                wpm = users[i].wpm;
                accuracy = users[i].accuracy;
                index = i;
            } else if (users[i].wpm === wpm && users[i].accuracy > accuracy) {
                picture = users[i].profilePicture;
                username = users[i].username;
                wpm = users[i].wpm;
                accuracy = users[i].accuracy;
                index = i;
            }
        }

        leaderboard.push({
            "rank": rank++,
            "profilePicture": picture,
            "username": username,
            "wpm": wpm,
            "accuracy": accuracy
        });
        users.splice(index, 1);
    }

    return leaderboard;
}

/**
 * Get endpoint that returns a hardcoded json object containing
 * leaderboard info such as rank, wpm, username and temporary profileURL
 */
router.get(leaderboard, async (_, res, next) => {
    if (database.isConnected()) {
        User.find({}).populate({
            path: "user_stats",
            select: ["wpm", "accuracy"]
        }).exec((error, users)=>{
            const leaderboard = [];
            users.forEach(user => {
                const leaderboardEntry = {
                    profilePicture: user.picture_url,
                    username: user.username,
                }
                leaderboardEntry.wpm = 0,
                leaderboardEntry.accuracy = 0
                if(user.user_stats){
                    leaderboardEntry.wpm = user.user_stats.wpm;
                    leaderboardEntry.accuracy = user.user_stats.accuracy;
                }
                console.log(leaderboardEntry);
                leaderboard.push(leaderboardEntry);
            });
            res.status(SUCCESS).json(leaderboard);
        })
        // const users = (await database.find(USER_STAT)).sort({ "wpm": 'desc'});
        // for (const user of users) {
            
        //     stats.push({
        //         "profilePicture": user.picture_url,
        //         "username": user.username,
        //         "wpm": user.user_stat,
        //         "accuracy": userStats.max_accuracy
        //     });
        // }

    } else {
        next(createError(INTERNAL_SE, { "error": "Unable to retrieve leaderboard data." }));
    }
});

// middleware for handling errors
router.use((error, _, res) => {
    // console.log(error);
    res.status(error.status).json({ "error": error.error, "type": error.message });
});

router.use(function (_, res) {
    res.status(404).json({ error: "Not Found" });
});

export default router;