/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 * 
 * @author Rim Dallali
 */

import * as express from "express";

const router = express.Router();

router.use(express.json());


const userStat = "/user_stat"


/*
* Get method for the user stat
*/
router.use(userStat, async (req, res) => {

    // Get the name from the url and search for the stats in the database.
    let user = req.query.name;
    console.log(user);

    // Should create a json object or just use the model and return it in res.json

    // For now hard coded. 
    let stats = {
        "Avg Words/Min": 30,
        "Accuracy": 74,
        "Games Played": 80,
        "Win": 34,
        "Lose": 43,
        "Draw": 23,
        "Rank": 12 
    };

    res.status(200).json(stats);
});

router.use("/", async function (_, res) {
    console.log("here")
    res.json("Success! Getting to the api!");
});


router.use(async function (_, res) {
    res.status(404).json({ error: "Not Found" });
});

export default router;