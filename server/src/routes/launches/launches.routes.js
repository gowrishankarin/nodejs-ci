const express = require("express");
const launchesRouter = express.Router();
const launchesController = require("./launches.controller");

launchesRouter.post("/", launchesController.httpCreateLaunch);
launchesRouter.get("/", launchesController.httpGetLaunches);
launchesRouter.get("/:launchId", launchesController.httpGetLaunch);
launchesRouter.delete("/:launchId", launchesController.httpAbortLaunch);

module.exports = launchesRouter;
