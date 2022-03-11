const {
  getPlanets,
  createPlanet,
  getPlanetCount,
  getPlanet,
} = require("../../models/planets.model");

const httpCreatePlanet = (req, res) => {
  if (!req.body.name) {
    res.status(400).send("Name is required");
    return;
  }
  const aPlanet = {
    name: req.body.name,
    id: getPlanetCount(),
  };
  createPlanet(aPlanet);
  res.status(201).json(aPlanet);
};

const httpGetPlanets = async (req, res) => {
  return res.status(200).json(await getPlanets());
};

const httpGetPlanet = (req, res) => {
  const planetId = Number(req.params.planetId);
  if (planetId > getPlanetCount()) {
    res.status(404).send("Planet not found");
    return;
  } else {
    res.status(200).json(getPlanet(planetId));
  }
};

module.exports = {
  httpCreatePlanet,
  httpGetPlanets,
  httpGetPlanet,
};
