/**
 * This module imports and gives the api router an alias and uses it
 * it also exposes the build server as a "public" folder and exports itself
 */

import api from "./api.js";
import express from "express";

const app = express();

app.use(express.static("./client/build/"));
app.get("/*", function(req, res) {
    res.sendFile("./client/build/index.html")
});
app.use("/api", api);

//default 404 route
app.use(function (_, res) {
    res.status(404).json({ error: "Not Found" });
});

export default app;