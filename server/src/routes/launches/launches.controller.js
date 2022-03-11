const {
  getAllLaunches,
  // addNewLaunch,
  scheduleNewLaunch,
  getLaunch,
  abortLaunch,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");
const httpCreateLaunch = (req, res) => {
  if (
    !req.body.mission ||
    !req.body.rocket ||
    !req.body.launchDate ||
    !req.body.target
  ) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  const launchDate = new Date(req.body.launchDate);
  if (isNaN(launchDate)) {
    return res.status(400).json({ message: "Invalid Date" });
  }
  const aLaunch = {
    mission: req.body.mission,
    rocket: req.body.rocket,
    launchDate: launchDate,
    target: req.body.target,
  };
  scheduleNewLaunch(aLaunch);
  return res.status(201).json(aLaunch);
};

const httpGetLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
};

const httpGetLaunch = (req, res) => {
  const launchId = Number(req.params.flightNumber);
  const launch = getLaunch(launchId);
  if (launch) {
    return res.status(200).json(launch);
  } else {
    return res.status(404).send("Launch not found");
  }
};

const httpAbortLaunch = (req, res) => {
  const flightNumber = Number(req.params.launchId);
  const launch = abortLaunch(flightNumber);
  if (launch) {
    // abortLaunch(launchId);
    return res.status(200).json(launch);
  } else {
    return res.status(404).send("Launch not found");
  }
};

module.exports = {
  httpCreateLaunch,
  httpGetLaunches,
  httpGetLaunch,
  httpAbortLaunch,
};
