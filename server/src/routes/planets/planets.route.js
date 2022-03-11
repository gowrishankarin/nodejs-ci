const express = require("express");
const planetsRouter = express.Router();
const planetsController = require("./planets.controller");

planetsRouter.post("/", planetsController.httpCreatePlanet);
planetsRouter.get("/", planetsController.httpGetPlanets);
planetsRouter.get("/:planetId", planetsController.httpGetPlanet);

module.exports = planetsRouter;
