/**
 * This module imports and gives the api router an alias and uses it
 * it also exposes the build server as a "public" folder and exports itself
 */

import api from "./api.js";
import express from "express";
import { authRouter } from "./authentication.js";
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const buildPath = path.resolve(__dirname, "..", "..", "client", "build");
app.use(express.static(buildPath));
function html(req, _, next) {
    if (req.accepts('html')) {
        return next()
    } else {
        return next('route')
    }
}
const secret = process.env.SECRET;
if (!secret) {
    throw new Error("The secret wasn't found in the environment variables");
}

app.use(session({
    secret: secret,
    name: 'id',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 3600000,
        secure: false,
        httpOnly: true,
        sameSite: 'strict'
    }
}));
app.use("/authentication", authRouter);
app.use("/api", api);
app.get("*", html, function (_, res) {
    res.redirect("/");
});

//default 404 route
app.use(function (_, res) {
    res.status(404).json({ error: "Not Found" });
});

export default app;