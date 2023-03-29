/* eslint-disable camelcase */
import express from 'express';
import { getAverage } from "../controller/util.js";
import { Constraints } from "../database/validation.js";
import createHttpError from "http-errors";
import User from "../database/models/user.js";
import { ImgParser } from "../controller/validation.js";
import multer from 'multer';
import * as Azure from "../database/azure.js";
import { isAuthenticated } from "./authentication.js";



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
router.use(isAuthenticated);

/**
 * Updates the stats of a user using their email.
 * Updates only the fields sent
 * if a field has the wrong type it will not be updated
 */
router.put("/user_stat", async (req, res, next) => {
    const email = req.session.user.user.email;
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
    const win = Constraints.boolean(req.body.win);
    const lose = Constraints.boolean(req.body.lose);
    const draw = Constraints.boolean(req.body.draw);
    const gameCount = user.user_stats.games_count;

    // updates the average of that value if it is defined only
    const updated = {
        ...wpm && { 
            "user_stats.wpm": getAverage(user.user_stats.wpm, wpm, gameCount) },
        ...accuracy && { 
            "user_stats.accuracy": getAverage(user.user_stats.accuracy, accuracy, gameCount) },
        ...win && { 
            "user_stats.win": user.user_stats.win + 1},
        ...lose && { 
            "user_stats.lose": user.user_stats.lose + 1},
        ...draw && { 
            "user_stats.draw": user.user_stats.draw + 1},
        "user_stats.games_count": gameCount + 1
    }
    if (wpm && wpm > user.user_stats.max_wpm) {
        updated["user_stats.date"] = new Date();
        updated["user_stats.max_wpm"] = Math.max(user.user_stats.max_wpm, wpm);
        if(!accuracy){
            const message = "The accuracy wasn't set and the user has a new PB. Ignoring request";
            next(new createHttpError.BadRequest(message))
            return;
        }
        updated["user_stats.max_accuracy"] = Math.max(user.user_stats.max_accuracy, accuracy);
    }
    await user.updateOne({ $set: { ...updated } });
    const cleanUser = user.toObject();
    delete cleanUser.email;
    const rank = await user.getRank();
    res.json({
        rank,
        ...cleanUser
    });
});

/**
 * Get endpoint that json object containing the user
 * and their game statistics
 */
router.post("/user", async (req, res, next) => {
    const email = req.session.user.email;
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
    const cleanUser = user.toObject();
    delete cleanUser.email;
    const rank = await user.getRank();
    res.json({
        rank,
        ...cleanUser
    });
});

/**
 * Put endpoint used to update the username of a user.
 * The user email and new username is sent, newly updated user is returned
 */
router.put("/update_username", async (req, res, next) => {
    const email = req.session.user.email;
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
    const cleanUser = user.toObject();
    delete cleanUser.email;
    const rank = await user.getRank();
    res.json({
        rank,
        ...cleanUser
    });
});

/**
 * Put endpoint used to update the profile picture of a user.
 * The user email and new Image is sent, newly updated user is returned
 */
router.put("/update_avatar", upload.single('image'), async (req, res, next) => {
    const email = req.session.user.email;
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
        const cleanUser = user.toObject();
        delete cleanUser.email;
        const rank = await user.getRank();
        res.json({
            rank,
            ...cleanUser
        });
    } catch (err) {
        res.status(400).send(`<h1>400! Picture could not be uploaded to the database.</h1>`);
    }
});

export const usersRouter = router;