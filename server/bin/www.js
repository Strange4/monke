/**
 * this module imports the app module and starts a local express server
 * 
 * @author Rim Dallali
 */

import app from "../routes/app.js";
import Database from "../database/mongo.js";
import express from "express"
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.EXPRESS_PORT || 8080;

(async ()=> {
    let db = new Database();
    await db.connectToDatabase();
    app.use(express.static("../client/build"));
    app.listen(PORT, () => {
        console.log("Server Started on port: http://localhost:" + PORT);
    })
})();

    

