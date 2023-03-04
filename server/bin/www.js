/**
 * this module imports the app module and starts a local express server
 */

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import app from "../routes/app.js";
import Database from "../database/mongo.js";
import express from "express"
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.EXPRESS_PORT || 8080;

(async ()=> {
    let db = new Database();
    await db.connectToDatabase();
    const buildPath = path.resolve(__dirname, "..", "..", "client", "build");
    app.use(express.static(buildPath));
    app.listen(PORT, () => {
        console.log("Server Started on port: http://localhost:" + PORT);
    })
})();