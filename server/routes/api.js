/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 * 
 * @author Rim Dallali
 */

import * as express from "express";
import User from "../database/models/user.js";
// import Quote from "../database/models/quote.js"; currently unused
import UserStat from "../database/models/userStat.js";
import { userSchema, userStatSchema } from "../database/validation.js";

const router = express.Router();

router.use(express.json());


const userStat = "/user_stat";
const quote = "/quote";
const user = "/user";
const leaderboard = "/leaderboard";

/**
 * Check to see in the database if the username exists or not.
 * @param {string} name, username of the new User. 
 * @returns boolean depending on if the username exists or not. 
 */
async function checkName(name){
    try {
        const databaseName = await User.findOne({username: name});
        // Name exists.
        if (databaseName !== null){
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
 * Get the Id of the User then return the UserStats of the User.
 * @param {string} name, username of the new User. 
 * @returns boolean depending on if the username exists or not. 
 */
async function getUserStats(name){
    try {
        const databaseUser = await User.findOne({username: name});
        if (databaseUser !== null){
            const stats = await UserStat.findOne({id: databaseUser.id});
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
function getAverage(stat, newStat, games){
    let unAverage = stat * games;
    let newTotal = unAverage + newStat;
    return newTotal / (games + 1);
}

// change to put after
router.put(userStat, async(req, res) =>{
    let name = req.body.username;
    let newWpm = req.body.wpm;
    let newAccuracy = req.body.accuracy;
    let win = req.body.win;
    let lose = req.body.lose;
    let draw = req.body.draw;

    const previousStats = await getUserStats(name);

    const filter = { id: previousStats.id }

    const update = {
        "user": previousStats.id,
        "max_wpm": newWpm > previousStats.max_wpm ? newWpm : previousStats.max_wpm,
        "wpm": getAverage(previousStats.wpm, newWpm, previousStats.games_count),
        "max_accuracy":
            newAccuracy > previousStats.max_accuracy ? newAccuracy : previousStats.max_accuracy,
        "accuracy": getAverage(previousStats.accuracy, newAccuracy, previousStats.games_count),
        "games_count": previousStats.games_count + 1,
        "win": previousStats.win + win,
        "lose": previousStats.lose + lose,
        "draw": previousStats.draw + draw,
        "date": Date.now()
    }

    userStatSchema.parse(update)
    await UserStat.findOneAndUpdate(filter, update);

    res.status(200).json({message: "Stats updated"})
})


/**
 * Post endpoint that creates User containing
 * username and temporary profileURL
 */
router.post(user, async (req, res) =>{
    try {
        const name = req.body.username;
        if (await checkName(name) === false){
            // create the user

            const user = new User({
                "username": name,
                "picture_url": "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png"
            });

            userSchema.parse(user);

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

            userStatSchema.parse(stats)
            let userStatsObject = await UserStat.create(stats)
            await userStatsObject.save() 

            const message = "User created successfully";
            console.log(message);
            res.status(200).send(message);

        // user already exist
        } else{
            res.status(400).json({error: "Username Already Taken"});
        }

    } catch (err) {
        console.error(`Error: ${err}`);
        res.status(400).send(`<h1>400! User could not be created. Please refill the form.</h1>`);
    }
});


/**
 * Get endpoint that  json object containing the user
 * and their game statistics
 */
router.get(user, async (req, res) => {    

    let user;
    let stats;
    try{
        // query for user that matches username
        user = await User.findOne({username: req.body.username});
        // query for user's game statistics
        stats = await getUserStats(user.username);
    } catch (err) {
        console.error("Could not obtain userstats ", err);
        res.status(400).json({ error: "Could not obtain user stats."})
    }

    let returnData = {
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

    res.status(200).json(returnData);
});

/**
 * endpoint randomly picks a hardcoded quote and sends it to the user
 */
router.get(quote, async (_, res) => {
    const quotes = 
    [
        "This is a random quote that I wrote on the spot.",
        "Did you know that the critically acclaimed MMORPG Final Fantasy XIV has a free trial, " +
        "and includes the entirety of A Realm Reborn AND the award-winning Heavensward expansion " +
        "up to level 60 with no restrictions on playtime? Sign up, and enjoy Eorzea today! " +
        "https://secure.square-enix.com/account/app/svc/ffxivregister?lng=en-gb",
        "The Shining (1980) is a horror film directed by Stanley Kubrick. " +
        "It follows a family who heads to an isolated hotel for the winter, where a sinister " +
        "presence influences the father into violence. His psychic son sees horrific forebodings " +
        "from both past and future. The movie is praised for its chilling atmosphere, grand " +
        "vision, and Kubrick's unique editing and set mis-arrangements. It captures the viewer's " +
        "attention with its terror and eccentric direction, and its cold-eyed view of the man's " +
        "mind gone overboard. It is considered one of the most terrifying films ever made, " +
        "and is a perfect example of how the presence of evil can be dormant in all of our minds.",
        "Let your plans be dark and impenetrable as night, " +
        "and when you move, fall like a thunderbolt.",
        "'I Have No Mouth, and I Must Scream' is a post-apocalyptic science fiction short story " +
        // eslint-disable-next-line max-len
        "by American writer Harlan Ellison. It was first published in the March 1967 issue of IF: " +
        "Worlds of Science Fiction and won a Hugo Award in 1968. The story follows a group of " +
        // eslint-disable-next-line max-len
        "five humans who are the only survivors of a genocide operation by a supercomputer called " +
        "AM. AM keeps them captive in an underground housing complex and tortures them for its " + 
        "own pleasure. The group eventually makes a desperate journey to an ice cave in search of" +
        // eslint-disable-next-line max-len
        " canned food, only to find that they have no means of opening it. In a moment of clarity, " +
        // eslint-disable-next-line max-len
        "Ted realizes their only escape is through death and kills the other four. AM then focuses " +
        // eslint-disable-next-line max-len
        "all its rage on Ted, transforming him into a 'great soft jelly thing' incapable of causing " +
        "itself harm. The story ends with Ted's famous line, 'I have no mouth. And I must scream.'",
        "In the midst of chaos, there is also opportunity",
        "Who wishes to fight must first count the cost",
        "It is easy to love your friend, but sometimes the hardest lesson to learn " +
        "is to love your enemy"
    ];
    const randQuote = Math.floor(Math.random() * quotes.length);
    res.status(200).json({ body: quotes[randQuote] });
});

/**
 * Get endpoint that returns a hardcoded json object containing
 * leaderboard info such as rank, wpm, username and temporary profileURL
 */
router.get(leaderboard, async (_, res) => {
    const leaderboard = [
        {
            rank: 1, 
            profilePicture: "https://picsum.photos/id/237/200/300", 
            username: "Bob Bobson", 
            wpm: 70,
            accuracy: 60
        }, 
        {
            rank: 2, 
            profilePicture: "https://picsum.photos/id/217/200/300", 
            username: "John Cena", 
            wpm: 123,
            accuracy: 83
        }, 
        {
            rank: 3, 
            profilePicture: "https://picsum.photos/id/133/200/300", 
            username: "Julia Blob", 
            wpm: 89,
            accuracy: 100
        },  
    ];

    res.status(200).json(leaderboard);
});

router.use("/", async (_, res) => {
    console.log("here")
    res.json("Success! Getting to the api!");
});


router.use(async (_, res) => {
    res.status(404).json({ error: "Not Found" });
});

export default router;