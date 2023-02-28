/**
 * this module imports the app module and starts a local express server
 */

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
import app from "../routes/app.js";
import connectToDatabase from "../database/mongo.js";
import mongoose from "mongoose";
import express from "express"
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.EXPRESS_PORT || 8080;

connectToDatabase();

mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    const buildPath = path.resolve(__dirname, "..", "..", "client", "build");
    app.use(express.static(buildPath));
    app.listen(PORT, () => {
        console.log("Server Started on port: http://localhost:" + PORT);
    })
});
