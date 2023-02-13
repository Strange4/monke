/**
 * this module imports the app module and starts a local express server
 * 
 * @author Rim Dallali
 */

import app from "../routes/app.js";
import connectToDatabase from "../database/mongo.js";
import mongoose from "mongoose";
//import express from "express"

const PORT = process.env.EXPRESS_PORT || 8080;

connectToDatabase();

mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    //app.use(express.static("../client/build"));
    app.listen(PORT, () => {
        console.log("Server Started on port: http://localhost:" + PORT);
    })
});
