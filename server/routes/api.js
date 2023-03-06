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

const router = express.Router();
router.use(express.json());
router.use(quoteEnpoint, quoteRouter);
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
    const user = await User.findOne({ email: email });

    if (user === null) {
        next(new createHttpError.BadRequest("user with that email does not exist on database"));
        return;
    }
    const wpm = req.body.wpm;
    const accuracy = req.body.accuracy;
    const win = req.body.win;
    const lose = req.body.lose;
    const draw = req.body.draw;


    const games_count = user.user_stats.games_count += 1;

    // updates the average of that value if it is defined only
    const updated = {
        ...(wpm && { wpm: getAverage(user.user_stats.wpm, wpm, games_count) }),
        ...(accuracy && { accuracy: getAverage(user.user_stats.accuracy, accuracy, games_count) }),
        ...(win && { win: getAverage(user.user_stats.win, win, games_count) }),
        ...(lose && { lose: getAverage(user.user_stats.lose, lose, games_count) }),
        ...(draw && { draw: getAverage(user.user_stats.draw, draw, games_count) }),
        games_count
    }
    if (wpm > user.user_stats.wpm) {
        updated.date = new Date();
        updated.max_wpm = Math.max(user.user_stats.max_wpm, wpm);
        updated.max_accuracy = Math.max(user.user_stats.max_accuracy, accuracy);
    }
    user.user_stats = updated;
    try {
        await user.save();
    } catch (error) {
        next(new createHttpError.BadRequest({
            message: "values do not comply with user_stats chema",
            error
        }));
        return;
    }
    res.json({ message: "Stats updated" });
})

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

router.post("/update_avatar", upload.single('image'), async (req, res) => {
    if (!dbIsConnected()) {
        next(new createError.InternalServerError("Database is unavailable"));
        return;
    }
    //Image validation
    if (req.file === undefined) {
        console.log("Image is undefined.");
        res.status(400).send(`<h1>400! Picture could not be uploaded to the database. Please selected a good image.</h1>`);
    } else {
        console.log(req.file)
        try {
            ImgParser.parse(req.file);

            // Upload to azure
            const blobName = req.body.fileName;
            const blobClient = azure.getContainerClient().getBlockBlobClient(blobName);
            //set mimetype as determined from browser with file upload control
            const options = { blobHTTPHeaders: { blobContentType: req.file.mimetype } };
            await blobClient.uploadData(req.file.buffer, options);

            console.log("Picture uploaded to Azure successfully");

            // Uploading data to mongodb.
            let url = azure.getBlobPublicUrl() + blobName;
            // let data;
            // let mongoData = {
            //     username: req.body.username,
            //     pictureURI: url
            // }
            console.log(url)
            // try {
            // data = ImageURLParser.parse(mongoData);
            // } catch (err) {
            //     return;
            // }
            // let mongoPicture = await PictureModel.create(data);
            //DO UPDATING HERE
            // await mongoPicture.save();

            console.log("picture URL upload to mongo succesful");
            const message = "Picture uploaded to Azure and Mongo successfully";
            console.log(message);
            res.status(200).send(message);
        }
        catch (err) {
            console.error(`Image validation error: ${err}`);
            res.status(400).send(`<h1>400! Picture could not be uploaded to the database. Please selected a good image.</h1>`);
        }
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
        res.status(SUCCESS).json("user updated");
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