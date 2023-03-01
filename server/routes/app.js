/**
 * This module imports and gives the api router an alias and uses it
 * it also exposes the build server as a "public" folder and exports itself
 */

import api from "./api.js";
import authentication from "./authentication.js"
import express from "express";

const app = express();

app.use(express.static("./client/build/"));

function html (req, _, next) {
    if (req.accepts('html')) {
        return next()
    } else {
        return next('route')
    }
}

app.use("/api", api);
app.use("/authentication", authentication);

app.get("*", html, function(_, res) {
    res.sendFile("index.html", {root: "./client/build/"})
});

//default 404 route
app.use(function (_, res) {
    res.status(404).json({ error: "Not Found" });
});

export default app;