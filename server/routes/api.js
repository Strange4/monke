/* eslint-disable camelcase */
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
import { ImgParser } from "./validation.js";
import createHttpError from "http-errors";
import { Azure } from "../database/azure.js"
import multer from 'multer';
const upload = multer();
const azure = Azure.getAzureInstance();
const userStatEnpoint = "/user_stat";
const quoteEnpoint = "/quote";
const userEnpoint = "/user";
const leaderboardEndpoint = "/leaderboard";
import { csrfSync } from "csrf-sync";
const csrfProtect = csrfSync();

const router = express.Router();
router.use(express.json());
router.use(quoteEnpoint, quoteRouter);
//route that create a CSRF token and sends it back to the client
router.get("/csrf-token", function (req, res) {
    console.log("here")
    res.json({ token: csrfProtect.generateToken(req) });
});

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
    if (!email) {
        next(new createHttpError.BadRequest("Can't find or create the user because no email was provided"));
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

    // updates the average of that value if it is defined only
    const updated = {
        ...(wpm && { "user_stats.wpm": getAverage(user.user_stats.wpm, wpm, user.user_stats.games_count) }),
        ...(accuracy && { "user_stats.accuracy": getAverage(user.user_stats.accuracy, accuracy, user.user_stats.games_count) }),
        ...(win && { "user_stats.win": getAverage(user.user_stats.win, win, user.user_stats.games_count) }),
        ...(lose && { "user_stats.lose": getAverage(user.user_stats.lose, lose, user.user_stats.games_count) }),
        ...(draw && { "user_stats.draw": getAverage(user.user_stats.draw, draw, user.user_stats.games_count) }),
        "user_stats.games_count": user.user_stats.games_count + 1
    }
    if (wpm > user.user_stats.max_wpm) {
        updated["user_stats.date"] = new Date();
        updated["user_stats.max_wpm"] = Math.max(user.user_stats.max_wpm, wpm);
        updated["user_stats.max_accuracy"] = Math.max(user.user_stats.max_accuracy, accuracy);
    }
    await user.updateOne({ $set: { ...updated } });
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
    if (!email) {
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
    const rank = await User.countDocuments({ wpm: { "$lte": user.user_stats.wpm } });
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
    const users = await User.find().limit(maxItems).sort({ wpm: 'desc' }).lean();
    res.json(users);
});

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
        const blobClient = azure.getContainerClient().getBlockBlobClient(blobName);
        const options = { blobHTTPHeaders: { blobContentType: req.file.mimetype } };
        await blobClient.uploadData(req.file.buffer, options);

        // Uploading data to mongodb.
        let url = azure.getBlobPublicUrl() + blobName;
        let user = await User.findOneAndUpdate(
            { email: email }, { "picture_url": url }, { returnNewDocument: true }
        );

        try {
            await user.save();
        } catch (error) {
            next(new createHttpError.BadRequest({
                message: "values do not comply with user stats schema",
                error: error.message
            }));
            return;
        }
        res.status(200).send("Updated user profile picture successfully");
    } catch (err) {
        console.error(`Image validation error: ${err}`);
        res.status(400).send(`<h1>400! Picture could not be uploaded to the database.</h1>`);
    }
})

router.put("/update_username", async (req, res) => {
    if (!dbIsConnected()) {
        next(new createError.InternalServerError("Database is unavailable"));
        return;
    }
    const email = Constraints.email(req.body.email);
    if (!email) {
        next(
            new createHttpError.BadRequest(
                "Can't find or update the user because no email was provided"
            )
        );
        return;
    }
    let newUsername = req.body.username;
    if (newUsername) {
        let user = await User.findOneAndUpdate(
            { email: email }, { username: newUsername }, { returnNewDocument: true }
        );

        try {
            await user.save();
        } catch (error) {
            next(new createHttpError.BadRequest({
                message: "values do not comply with user stats schema",
                error: error.message
            }));
            return;
        }
        res.status(200).send(user);
    } else {
        next(
            new createHttpError.BadRequest(
                "Can't update the user because the username provided was invalid"
            )
        );
        return;
    }
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