/**
 * This module imports and gives the api router an alias and uses it
 * it also exposes the build server as a "public" folder and exports itself
 * 
 * @author Rim Dallali
 */

import api from "./api.js";
import express from "express";

const app = express();

app.use(express.static("client/build/"));
app.use("/api", api);

//default 404 route
app.use(function (req, res) {
  res.status(404).json({ error: "Not Found." });
});

export default app;