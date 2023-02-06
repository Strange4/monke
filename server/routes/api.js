/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 * 
 * @author Rim Dallali
 */

import * as express from "express";

const router = express.Router();

router.use(express.json());

const apiRoute = "/api/";

router.use("/", async function (_, res) {
  console.log("here")
  res.json("Success! Getting to the api!");
});


router.use(async function (_, res) {
  res.status(404).json({ error: "Not Found" });
});

/*
* Get method for the user stat
*/
router.get(`${apiRoute}user_stat`, async () => {

})

export default router;