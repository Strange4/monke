/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 */

import * as express from "express";
import User from "../database/models/user.js";
import Quote from "../database/models/quote.js";
import UserStat from "../database/models/userStat.js";
import Picture from "../database/models/picture.js";
import { userSchema, userStatSchema } from "../database/validation.js";

const router = express.Router();

router.use(express.json());


const userStat = "/user_stat";
const quote = "/quote";
const user = "/user";
const leaderboard = "/leaderboard";

const SUCCESS = 200;
const ERROR = 400;

/**
 * Check to see in the database if the username exists or not.
 * @param {string} name, username of the new User. 
 * @returns boolean depending on if the username exists or not. 
 */
async function checkName(name) {
    try {
        const nameQuery = await User.findOne({ username: name });
        // Name exists.
        if (nameQuery !== null) {
            return true;
            // Name does not exists.
        } else {
            console.log(`Could not find user with name: ${name}`);
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

/**
 * Check to see in the database if the username exists or not.
 * @param {string} email, email of the new User. 
 * @returns boolean depending on if the email exists or not. 
 */
async function checkEmail(newEmail) {
    try {
        const emailQuery = await User.findOne({ email: newEmail });
        // Name exists.
        if (emailQuery !== null) {
            return true;
            // Name does not exists.
        } else {
            console.log(`Could not find user with email: ${newEmail}`);
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}


/**
 * Get the Id of the User then return the UserStats of the User.
 * @param {string} name, username of the new User. 
 * @returns boolean depending on if the username exists or not. 
 */
async function getUserStats(name) {
    try {
        const databaseUser = await User.findOne({ username: name });
        if (databaseUser !== null) {
            const stats = await UserStat.findOne({ user: databaseUser.id });
            return stats;
        } else {
            console.log(`Could not find user with name: ${name}`);
        }
    } catch (err) {
        console.error(err);
    }
}


/**
 * Return the average of a stat
 * @param {Number} stat, the previous average of the stat.
 * @param {Number} newStat, the new stat obtain after a game has been complete. 
 * @param {Number} games, the total number of games.
 * @returns Average of the stat
 */
function getAverage(stat, newStat, games) {
    if (games === 0) {
        return newStat;
    } else {
        let unAverage = stat * games;
        let newTotal = unAverage + newStat;
        return newTotal / (games + 1);
    }
}


router.put(userStat, async (req, res) => {
    let name = req.body.username;
    let newWpm = req.body.wpm;
    let newAccuracy = req.body.accuracy;
    let win = req.body.win;
    let lose = req.body.lose;
    let draw = req.body.draw;

    const previousStats = await getUserStats(name);
    const user = await User.findOne({ username: name })
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
    userStatSchema.parse(update)
    await UserStat.findOneAndUpdate(filter, update);

    res.status(SUCCESS).json({ message: "Stats updated" })
})


router.get(user, async (req, res) => {
    try{
        //----------------change these 2 to get from the email from google.
        const name = req.query.name;
        const pic = req.query.pic;


        const email = req.query.email;
        let user = await User.findOne({email: email})
     
        // Create the user.
        if (user === null){
            // create the user
            const newUser = new User({
                // change username and pic to thta of the email from google account.
                "username": name,
                "picture_url": pic,
                "email": email
            });

            userSchema.parse(newUser);

            let userObject = await User.create(newUser);
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

            userStatSchema.parse(stats)
            let userStatsObject = await UserStat.create(stats)
            await userStatsObject.save()
        }
        
        // query for user that matches username
        user = await User.findOne({ email: email });
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
    } catch(err) {
        console.error(`Error: ${err}`);
        res.status(ERROR).send(`<h1>400! User could not be found.</h1>`);
    }
})


// /**
//  * Post endpoint that creates User containing
//  * username and temporary profileURL
//  */
// router.post(user, async (req, res) => {
//     try {
//         const picName = ["profile_gear", "profile_keyboard", "profile_mac", "profile_user", "profile_pc", "default_user_image"];
//         const name = req.body.username;
//         const email = req.body.email;
//         const picture = req.body.picture;

//         if (await checkName(name) === false
//             && await checkEmail(email) === false
//             && picName.includes(picture)) {

//             // Get the link for the picture
//             const pictureQuery = await Picture.findOne({ "picture_name": picture });

//             // create the user
//             const user = new User({
//                 "username": name,
//                 "picture_url": pictureQuery.url,
//                 "email": email
//             });

//             userSchema.parse(user);

//             let userObject = await User.create(user);
//             await userObject.save();

//             //Stat creation
//             const stats = new UserStat({
//                 "user": userObject.id,
//                 "max_wpm": 0,
//                 "wpm": 0,
//                 "max_accuracy": 0,
//                 "accuracy": 0,
//                 "games_count": 0,
//                 "win": 0,
//                 "lose": 0,
//                 "draw": 0,
//                 "date": null
//             })

//             userStatSchema.parse(stats)
//             let userStatsObject = await UserStat.create(stats)
//             await userStatsObject.save()

//             const message = "User created successfully";
//             console.log(message);
//             res.status(SUCCESS).send(message);

//             // user not valid
//         } else if (await checkName(name) === true && await checkEmail(email) === true) {
//             res.status(ERROR).json({ error: "Username and Email Already Taken" });
//         } else if (await checkName(name) === true) {
//             res.status(ERROR).json({ error: "Username Already Taken" });
//         } else if (await checkEmail(email) === true) {
//             res.status(ERROR).json({ error: "Email Already Taken" });
//         } else {
//             res.status(ERROR).json({ error: `Picture Name Invalid | Valid Names: profile_gear, profile_keyboard, profile_mac, profile_user, profile_pc, default_user_image` });
//         }
//     } catch (err) {
//         console.error(`Error: ${err}`);
//         res.status(ERROR).send(`<h1>400! User could not be created. Please refill the form.</h1>`);
//     }
// });


// /**
//  * Get endpoint that  json object containing the user
//  * and their game statistics
//  */
// router.get(user, async (req, res) => {

//     try {
//         // query for user that matches username
//         const user = await User.findOne({ username: req.body.username });
//         // query for user's game statistics
//         const stats = await getUserStats(user.username);

//         let data = {
//             "username": user.username,
//             "image": user.picture_url,
//             "wpm": stats.wpm,
//             "max_wpm": stats.max_wpm,
//             "accuracy": stats.accuracy,
//             "max_accuracy": stats.max_accuracy,
//             "games_count": stats.games_count,
//             "win": stats.win,
//             "lose": stats.lose,
//             "draw": stats.draw,
//             "date": stats.date
//         };

//         res.status(SUCCESS).json(data);

//     } catch (err) {
//         console.error("Could not obtain userstats ", err);
//         res.status(ERROR).json({ error: "Could not obtain user stats." })
//     }
// });

/**
 * Endpoint returns a quote to the client.
 */
router.get(quote, async (req, res) => {
    let statusCode = SUCCESS;
    let message;

    // verify if difficulty is NaN and not undefined
    if (isNaN(req.body.difficulty) && req.body.difficulty !== undefined) {
        console.error("Invalid number input for quotes");
        statusCode = ERROR;
        message = { "error": "Input for difficulty is not a valid number" };
    } else {
        try {
            message = await queryQuotes(req.body.difficulty);
        } catch (err) {
            statusCode = ERROR;
            message = { "error": "unable to retrieve quote" };
        }
    }
    res.status(statusCode).json(message);
});

/**
 * Function will query database for quotes with given difficulty then
 * pick and return one quote randomly from resulting list.
 * If said list is length of 1, return that single quote.
 * @param {number} difficultyVal : represents difficulty level of desired quotes
 * @returns Object, is a json that holds the body of the quote.
 */
async function queryQuotes(difficultyVal) {
    let quotes, message;

    // selects all quotes if difficultyVal is undefined otherwise query by difficulty
    quotes = difficultyVal === undefined ?
        await Quote.find() : await Quote.find({ difficulty: difficultyVal });

    if (quotes.length > 0) {
        // if len quotes > 1 randomize index to pick from quotes, otherwise assign 0
        const quoteIndex =
            quotes.length > 1 ? Math.floor(Math.random() * quotes.length) : 0;
        message = { "body": quotes[quoteIndex].quote };
    } else {
        message = { "body": "There are no quotes available with that difficulty." };
    }

    return message;
}

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
router.get(leaderboard, async (_, res) => {
    try {
        const stats = [];
        const users = await User.find();
        for (const user of users) {
            const userStats = await UserStat.findOne({ user: user.id });
            stats.push({
                "profilePicture": user.picture_url,
                "username": user.username,
                "wpm": userStats.max_wpm,
                "accuracy": userStats.max_accuracy
            });
        }
        res.status(SUCCESS).json(sortRank(stats));
    } catch (err) {
        console.error(err);
    }
});

router.use("/", async (_, res) => {
    res.json("Success! Getting to the api!");
});


router.use(async (_, res) => {
    res.status(ERROR).json({ error: "Not Found" });
});

export default router;