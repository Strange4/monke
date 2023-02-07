/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 * 
 * @author Rim Dallali
 */

import * as express from "express";

const router = express.Router();

router.use(express.json());

router.use("/", async function (_, res) {
    console.log("here")
    res.json("Success! Getting to the api!");
});


router.use(function (_, res) {
    res.status(404).json({ error: "Not Found" });
});

export default router;