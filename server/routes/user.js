import express from 'express';
import { getAverage } from "../controller/util.js";
import { Constraints } from "../database/validation.js";
import createHttpError from "http-errors";
import User from "../database/models/user.js";


const router = express.Router();

/**
 * Updates the stats of a user using their email.
 * Updates only the fields sent
 * if a field has the wrong type it will not be updated
 */
router.put("/user_stat", async (req, res, next) => {
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
    const rank = await user.getRank();
    res.json({
        rank,
        ...user.toObject()
    });
});

export const usersRouter = router;