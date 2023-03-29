/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 */

import express from "express";
import User from "../database/models/user.js";
import mongoose from "mongoose";
import { Constraints } from "../database/validation.js";
import { quoteRouter } from "./quotes.js";
import { usersRouter } from "./user.js";
import createHttpError from "http-errors";
import { v4 } from "uuid";

const router = express.Router();

router.use(dbConnected);
router.use("/quote", quoteRouter);
/**
 * Get endpoint that returns a hardcoded json object containing
 * leaderboard info such as rank, wpm, username and temporary profileURL
 */
router.get("/leaderboard", async (req, res) => {
    const maxItems = Constraints.positiveInt(req.query.max) || 10;
    const users = await User
        .find().limit(maxItems)
        .sort({"user_stats.max_wpm": 'desc', "user_stats.max_accuracy": "desc"}).lean();
    res.json(users);
});

router.get("/lobby", (_, res) => {
    let roomID = v4()
    res.json(roomID)
});

router.use(express.json());
router.use(usersRouter);

function dbConnected(_, __, next){
    // the node_env could be changed to mock the connection state instead
    if(mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== "test"){
        next(new createHttpError.InternalServerError("Database is unavailable"));
        if(!process.env.ATLAS_URI){
            console.error("Trying to reconnect to the db but there is no atlas uri");
            return;
        }
        mongoose.connect(process.env.ATLAS_URI, {dbName: "QuotesDatabase"})
            .catch(() => {});
        return;
    }
    next();
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