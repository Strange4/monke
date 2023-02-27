/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 */

import * as express from "express";
import User from "../database/models/user.js";

import UserStat from "../database/models/userStat.js";
import Picture from "../database/models/picture.js";
import { userSchema, userStatSchema } from "../database/validation.js";
import createError from "http-errors";
import Database from "../database/mongo.js";
import { QUOTE, USER, USER_STAT, PIC } from "../database/mongo.js";

import { getQuote, getUserStats, checkName, checkEmail } from "../controller/mongoHelper.js";

const router = express.Router();
const database = new Database();

router.use(express.json());


const userStat = "/user_stat";
const quote = "/quote";
const user = "/user";
const leaderboard = "/leaderboard";

const SUCCESS = 200;
const ERROR = 400;
const INTERNAL_SE = 500;

/**
 * Return the average of a stat
 * @param {Number} stat, the previous average of the stat.
 * @param {Number} newStat, the new stat obtain after a game has been complete. 
 * @param {Number} games, the total number of games.
 * @returns Average of the stat
 */
function getAverage(stat, newStat, games) {
    if (games === 0){
        return newStat;
    } else{
        let unAverage = stat * games;
        let newTotal = unAverage + newStat;
        return newTotal / (games + 1);
    }
}


router.put(userStat, async (req, res, next) => {
    let name = req.body.username;
    let newWpm = req.body.wpm;
    let newAccuracy = req.body.accuracy;
    let win = req.body.win;
    let lose = req.body.lose;
    let draw = req.body.draw;

    if(database.isConnected()){
        const user = await database.findOne(USER, { username: name });
        
        // check if user exists
        if(user?.id !== undefined){
            const previousStats = await getUserStats(name);
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
    
            let validSchema;
            try{
                userStatSchema.parse(update);
                validSchema = true;
            } catch (err){
                validSchema = false;
                next(createError(ERROR, {"error": "stat values do not comply with schema"} ));
            }
            if(validSchema){
                await database.findOneAndUpdate(USER_STAT, filter, update);
                res.status(SUCCESS).json({message: "Stats updated"});
            }            
        } else {
            console.log(user);
            next(createError(ERROR, {"error": "Username does not exist on database."}));
        }
    } else {
        next(INTERNAL_SE, { "error": "Database unavailable, try again later."});
    }
})


/**
 * Post endpoint that creates User containing
 * username and temporary profileURL
 */
router.post(user, async (req, res) => {
    if(database.isConnected()){
        try {
            const picName = ["profile_gear", "profile_keyboard", "profile_mac",
                "profile_user", "profile_pc", "default_user_image"];
            const name = req.body.username;
            const email = req.body.email;
            const picture = req.body.picture;

            if (await checkName(name) === false 
            && await checkEmail(email) === false 
            && picName.includes(picture)){
                
                // Get the link for the picture
                const pictureQuery = await database.findOne(PIC, {"picture_name": picture});

                // create the user
                const user = new User({
                    "username": name,
                    "picture_url": pictureQuery.url,
                    "email": email
                });
                
                try{
                    userSchema.parse(user);
                } catch (err) {
                    res.status(ERROR, { "error": "values do not comply with user schema"});
                }
                

                let userObject = await User.create(user);
                await userObject.save();

                //Stat creation
                const stats = new UserStat({
                    "user": userObject.id,
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

                try{
                    userStatSchema.parse(stats);
                } catch (err){
                    next(ERROR, {"error": "values does not comply with user stat schema"});
                }
                let userStatsObject = await UserStat.create(stats)
                await userStatsObject.save()

                const message = "User created successfully";
                console.log(message);
                res.status(SUCCESS).send(message);

            // user not valid
            } else{
                if (await checkName(name) === true && await checkEmail(email) === true)
                    next(ERROR, {"error": "Username and Email Already Taken"});
                else if (await checkName(name) === true)
                    next(ERROR, {"error": "Username Already Taken"});
                else if(await checkEmail(email) === true)
                    next(ERROR, {"error": "Email Already Taken"});
                else
                    next(ERROR, {"error": `Picture Name Invalid | Valid Names: profile_gear, profile_keyboard, profile_mac, profile_user, profile_pc, default_user_image`});
            }

        } catch (err) {
            console.log(err);
            next(createError(ERROR,
                { "error": "User could not be created. Please refill the form."})
            );
        }
    } else{
        next(createError(INTERNAL_SE, { "error": "Database unavailable, try again later."}));
    }
});


/**
 * Get endpoint that  json object containing the user
 * and their game statistics
 */
router.get(user, async (req, res, next) => {
    if(database.isConnected()){
        try {
            // query for user that matches username
            const user = await database.findOne(USER, { username: req.body.username });
            // query for user's game statistics
            const stats = await getUserStats(user.username);

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

        } catch (err) {
            console.error("Could not obtain userstats ", err);
            next(createError(INTERNAL_SE, { error: "Could not obtain user stats."}));
        }
    }
});

/**
 * Endpoint returns a quote to the client.
 */
router.get(quote, async (req, res, next) => { 
    let statusCode = SUCCESS;
    let message;

    // verify if difficulty is NaN and not undefined
    if(isNaN(req.body.difficulty) && req.body.difficulty !== undefined){
        statusCode = ERROR;
        message = { "error": "Input for difficulty is not a valid number" };
        next(createError(statusCode, message)); 
    } else {
        try{
            message = await getQuote(req.body.difficulty);
        } catch (err) {
            // rather than return an error return a quote as per Mauricio's suggestion.
            message = { "body": "Unable to retrieve quote from database, please try again later."};
        }
        res.status(statusCode).json(message);
    }
});

/**
 * Sort the users into rank depending on wpm and accuracy, then returns the sorted leaderboard.
 * @param {*} users, Leadeaboard JSON Object without sorting and no rank field.
 * @returns Array of JSON object that represents the leaderboard.
 */
function sortRank(users) {
    const leaderboard = [];
    const userCount = users.length;
    let rank = 1;

    while (leaderboard.length !== userCount){
        let picture = users[0].profilePicture;
        let username = users[0].username;
        let wpm = 0;
        let accuracy = 0;
        let index = 0;
        for (let i = 0; i < users.length; i++){
            if (users[i].wpm > wpm){
                picture = users[i].profilePicture;
                username = users[i].username;
                wpm = users[i].wpm;
                accuracy = users[i].accuracy;
                index = i;
            } else if(users[i].wpm === wpm && users[i].accuracy > accuracy){
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
router.get(leaderboard, async (_, res) => {
    try {
        const stats = [];
        const users = await database.find(USER);
        for (const user of users){
            const userStats = await database.findOne(USER_STAT, {user: user.id});
            stats.push({
                "profilePicture": user.picture_url,
                "username": user.username,
                "wpm": userStats.max_wpm,
                "accuracy": userStats.max_accuracy
            });
        }
        res.status(SUCCESS).json(sortRank(stats));
    } catch (err){
        res.status(INTERNAL_SE).json( { "error": "Unable to retrieve leaderboard data."} );
    }
});

// middleware for handling errors
router.use((error, req, res, next) => {
    // console.log(error);
    res.status(error.status).json( { "error": error.error, "type": error.message } );
});

router.use(function (_, res) {
    res.status(404).json({ error: "Not Found" });
});

export default router;