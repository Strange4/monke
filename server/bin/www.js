/**
 * this module imports the app module and starts a local express server
 * 
 * @author Rim Dallali
 */

import app from "../routes/app.js";
import getDBConnection from "../database/mongo.js";
import mongoose from "mongoose";
//import express from "express"

const PORT = process.env.PORT || 8080;

getDBConnection();

mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    //app.use(express.static("../client/build"));
    app.listen(PORT, () => {
        console.log("Server Started on port: http://localhost:" + PORT);
    })
});
