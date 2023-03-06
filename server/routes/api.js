/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 */

import express from "express";
import User from "../database/models/user.js";
import mongoose from "mongoose";
import { Constraints } from "../database/validation.js";
import { quoteRouter } from "./quotes.js";
import { getAverage } from "./util.js";
import createHttpError from "http-errors";

const userStatEnpoint = "/user_stat";
const quoteEnpoint = "/quote";
const userEnpoint = "/user";
const leaderboardEndpoint = "/leaderboard";

const router = express.Router();
router.use(express.json());
router.use(quoteEnpoint, quoteRouter);

/**
 * Updates the stats of a user using their email.
 * Updates only the fields sent
 * if a field has the wrong type it will not be updated
 */
router.put(userStatEnpoint, async (req, res, next) => {
    
    if (!dbIsConnected()) {
        next(new createHttpError.InternalServerError("Database is unavailable"));
        return;
    }
    const email = Constraints.email(req.body.email);
    if(!email){
        next(new createHttpError.BadRequest("Can't find or create the user because no email was provided"));
        return;
    }

    const user = await User.findOne({ email });
    
    if(user === null){
        next(new createHttpError.BadRequest("user with that email does not exist on database"));
        return;
    }
    const wpm = Constraints.positiveNumber(req.body.wpm);
    const accuracy = Constraints.positiveNumber(req.body.accuracy);
    const win = Constraints.positiveInt(req.body.win);
    const lose = Constraints.positiveInt(req.body.lose);
    const draw = Constraints.positiveInt(req.body.draw);

    // updates the average of that value if it is defined only
    const updated = {
        ...(wpm && { "user_stats.wpm": getAverage(user.user_stats.wpm, wpm, user.user_stats.games_count) }),
        ...(accuracy && { "user_stats.accuracy": getAverage(user.user_stats.accuracy, accuracy, user.user_stats.games_count) }),
        ...(win && { "user_stats.win": getAverage(user.user_stats.win, win, user.user_stats.games_count) }),
        ...(lose && { "user_stats.lose": getAverage(user.user_stats.lose, lose, user.user_stats.games_count) }),
        ...(draw && { "user_stats.draw": getAverage(user.user_stats.draw, draw, user.user_stats.games_count) }),
        "user_stats.games_count": user.user_stats.games_count + 1
    }
    if(wpm > user.user_stats.max_wpm){
        updated["user_stats.date"] = new Date();
        updated["user_stats.max_wpm"] = Math.max(user.user_stats.max_wpm, wpm);
        updated["user_stats.max_accuracy"] = Math.max(user.user_stats.max_accuracy, accuracy);
    }
    await user.updateOne({$set: {...updated}});
    try{
        await user.save();
    } catch(error){
        next(new createHttpError.BadRequest({
            message: "values do not comply with user_stats chema",
            error
        }));
        return;
    }
    res.json(user);
});

/**
 * Get endpoint that  json object containing the user
 * and their game statistics
 */
router.post(userEnpoint, async (req, res, next) => {
    if (!dbIsConnected()) {
        next(new createHttpError.InternalServerError("Database is unavailable"));
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
        
        user = new User({
            username,
            picture_url,
            email,
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
    user = await user.toObject();
    const rank = await User.countDocuments({wpm: { "$lte": user.user_stats.wpm }});
    res.json({
        rank,
        ...user
    });
})

/**
 * Get endpoint that returns a hardcoded json object containing
 * leaderboard info such as rank, wpm, username and temporary profileURL
 */
router.get(leaderboardEndpoint, async (req, res, next) => {
    if (!dbIsConnected()) {
        next(new createHttpError.InternalServerError("Error while getting the leaderboard"));
        return;
    }
    const maxItems = Constraints.positiveInt(req.query.max) || 10;
    const users = await User.find().limit(maxItems).sort({wpm: 'desc'}).lean();
    res.json(users);
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