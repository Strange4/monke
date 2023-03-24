/**
 * this module imports the app module and starts a local express server
 */

import app from "../routes/app.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { setUp } from '../websocket/server.js';
dotenv.config();
const PORT = process.env.EXPRESS_PORT || 8080;

(async ()=> {
    mongoose.set("strictQuery", true);
    try{
        await mongoose.connect(process.env.ATLAS_URI, {dbName: "QuotesDatabase"});
    } catch(_){
        console.log("Couldn't connect to the database");
    }
    let server = app.listen(PORT, () => {
        console.log("Server Started on port: http://localhost:" + PORT);
    })

    setUp(server)

})();