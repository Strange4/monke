/* eslint-disable camelcase */
/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 */

import express from "express";
import User from "../database/models/user.js";
import mongoose from "mongoose";
import { Constraints } from "../database/validation.js";
import { getAverage } from "../controller/util.js";
import { ImgParser } from "../controller/validation.js";
import createHttpError from "http-errors";
import * as Azure from "../database/azure.js"
import multer from 'multer';

const upload = multer({
    limits: {fieldSize: 5242880},
    fileFilter: (_, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            return callback(null, true)
        }
        callback(new Error("Error occured with uploading"))
    }
});

const router = express.Router();
router.use(express.json());

/**
 * Updates the stats of a user using their email.
 * Updates only the fields sent
 * if a field has the wrong type it will not be updated
 */
router.put("/user_stat", async (req, res, next) => {
    if (!dbIsConnected()) {
        next(new createHttpError.InternalServerError("Database is unavailable"));
        return;
    }
    const email = Constraints.email(req.body.email);
    if (!email) {
        next(new createHttpError.BadRequest(
            "Can't find or create the user because no email was provided"
        ));
        return;
    }

    const user = await User.findOne({ email });

    if (user === null) {
        next(new createHttpError.BadRequest("user with that email does not exist on database"));
        return;
    }
    const wpm = Constraints.positiveNumber(req.body.wpm);
    const accuracy = Constraints.positiveNumber(req.body.accuracy);
    const win = Constraints.positiveInt(req.body.win);
    const lose = Constraints.positiveInt(req.body.lose);
    const draw = Constraints.positiveInt(req.body.draw);
    const gameCount = user.user_stats.games_count;

    // updates the average of that value if it is defined only
    const updated = {
        ...wpm && { 
            "user_stats.wpm": getAverage(user.user_stats.wpm, wpm, gameCount) },
        ...accuracy && { 
            "user_stats.accuracy": getAverage(user.user_stats.accuracy, accuracy, gameCount) },
        ...win && { 
            "user_stats.win": getAverage(user.user_stats.win, win, gameCount) },
        ...lose && { 
            "user_stats.lose": getAverage(user.user_stats.lose, lose, gameCount) },
        ...draw && { 
            "user_stats.draw": getAverage(user.user_stats.draw, draw, gameCount) },
        "user_stats.games_count": gameCount + 1
    }
    if (wpm > user.user_stats.max_wpm) {
        updated["user_stats.date"] = new Date();
        updated["user_stats.max_wpm"] = Math.max(user.user_stats.max_wpm, wpm);
        updated["user_stats.max_accuracy"] = Math.max(user.user_stats.max_accuracy, accuracy);
    }
    await user.updateOne({ $set: { ...updated } });
    const rank = await user.getRank();
    res.json({
        rank,
        ...user.toObject()
    });
});

/**
 * Get endpoint that json object containing the user
 * and their game statistics
 */
router.post("/user", async (req, res, next) => {
    if (!dbIsConnected() && process.env.NODE_ENV !== "test") {
        next(new createHttpError.InternalServerError("Database is unavailable"));
        return;
    }
    const email = Constraints.email(req.body.email);
    if (!email) {
        next(new createHttpError.BadRequest(
            "Can't find or create the user because no email was provided"
        ));
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
    const rank = await user.getRank();
    res.json({
        rank,
        ...user.toObject()
    });
})

/**
 * Get endpoint that returns a hardcoded json object containing
 * leaderboard info such as rank, wpm, username and temporary profileURL
 */
router.get("/leaderboard", async (req, res) => {
    if (!dbIsConnected() && process.env.NODE_ENV !== "test") {
        next(new createHttpError.InternalServerError("Error while getting the leaderboard"));
        return;
    }
    const maxItems = Constraints.positiveInt(req.query.max) || 10;
    const users = await User
        .find().limit(maxItems)
        .sort({"user_stats.max_wpm": 'desc', "user_stats.max_accuracy": "desc"}).lean();
    res.json(users);
});

/**
 * Put endpoint used to update the profile picture of a user.
 * The user email and new Image is sent, newly updated user is returned
 */
router.put("/update_avatar", upload.single('image'), async (req, res) => {
    if (!dbIsConnected()) {
        next(new createError.InternalServerError("Database is unavailable"));
        return;
    }
    const email = Constraints.email(req.body.email);
    if (!email) {
        next(new createHttpError.BadRequest("Can't find the user because no email was provided"));
        return;
    }
    if (req.file === undefined) {
        next(new createHttpError.BadRequest("Image was not sent correctly"));
        return;
    }
    try {
        ImgParser.parse(req.file);
        const blobName = req.body.fileName;
        const blobClient = Azure.getContainerClient().getBlockBlobClient(blobName);
        const options = { blobHTTPHeaders: { blobContentType: req.file.mimetype } };
        await blobClient.uploadData(req.file.buffer, options);

        // Uploading data to mongodb.
        const url = Azure.getBlobPublicUrl() + blobName;
        const user = await User.findOneAndUpdate({email}, { "picture_url": url }, { "new": true });

        try {
            await user.save();
        } catch (error) {
            next(new createHttpError.BadRequest({
                message: "values do not comply with user stats schema",
                error: error.message
            }));
            return;
        }
        const rank = await user.getRank();
        res.json({
            rank,
            ...user.toObject()
        });
    } catch (err) {
        res.status(400).send(`<h1>400! Picture could not be uploaded to the database.</h1>`);
    }
})

/**
 * Put endpoint used to update the username of a user.
 * The user email and new username is sent, newly updated user is returned
 */
router.put("/update_username", async (req, res) => {
    if (!dbIsConnected()) {
        next(new createError.InternalServerError("Database is unavailable"));
        return;
    }
    const email = Constraints.email(req.body.email);
    const newName = req.body.username;
    if (!email || !newName) {
        next(new createHttpError.BadRequest("no email or username was provided"));
        return;
    }
    const user = await User.findOneAndUpdate({ email }, { username: newName }, { "new": true });
    try {
        await user.save();
    } catch (error) {
        next(new createHttpError.BadRequest({
            message: "values do not comply with user stats schema",
            error: error.message
        }));
        return;
    }
    const rank = await user.getRank();
    res.json({
        rank,
        ...user.toObject()
    });
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