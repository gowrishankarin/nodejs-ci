const axios = require("axios");
const launches = require("./launches.mongo.js");

// const launches = new Map();
let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;
// const launch = {
//   flightNumber: 100, // flight_number
//   mission: "Kepler Exploration X", // name
//   rocket: "Falcon 9", // rocket.name
//   launchDate: new Date("December 27, 2030"), // date_local
//   target: "Kepler-442 b", // NA
//   customers: ["ZTM", "NASA"],
//   upcoming: true, // upcoming
//   success: true, // success
// };

// launches.set(launch.flightNumber, launch);

const saveLaunch = async (launchTmp) => {
  console.log("Save Launch", launchTmp.flightNumber);
  await launches.findOneAndUpdate(
    {
      flightNumber: launchTmp.flightNumber,
    },
    launchTmp,
    { upsert: true }
  );
};

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches";

const populateData = async () => {
  const response = await axios.post(`${SPACEX_API_URL}/query`, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem launch");
    throw new Error("Downloading launch data failed!!!");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });
    const launchNew = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.launch_date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: customers,
    };
    console.log(`${launchNew.flightNumber} - ${launchNew.mission}`);

    await saveLaunch(launchNew);
  }
};

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already downloaded!!!");
    return;
  }
  console.log("Downloading launch data...");
  await populateData();
}
// saveLaunch(launch);

const getAllLaunches = async (skip, limit) => {
  // return Array.from(launches.values());
  console.log(skip, limit);
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};

const addNewLaunch = (newLaunch) => {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(newLaunch, {
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
};

const scheduleNewLaunch = async (launchTmp) => {
  const planet = await launches.findOne({
    keplerName: launchTmp.target,
  });

  if (!planet) {
    throw new Error("No matching planets found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launchTmp, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
};

const getLaunch = (flightNumber) => {
  const launch = launches.get(flightNumber);
  if (launch) {
    return launch;
  }
  return null;
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches
    .findOne({}, { _id: 0, __v: 0 })
    .sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

const findLaunch = async (filter) => {
  const launch = await launches.findOne(filter);
  if (launch) {
    return launch;
  }
  return null;
};

const existsLaunchWithId = async (flightNumber) => {
  return await findLaunch({ flightNumber: flightNumber });
};

const abortLaunch = async (flightNumber) => {
  // const isLaunchExist = launches.has(flightNumber);
  const launchNow = existsLaunchWithId(flightNumber);
  if (launchNow) {
    // const launch = launches.get(flightNumber);
    launch.upcoming = false;
    launch.success = false;
    const abortedLaunch = await launches.updateOne(
      { flightNumber: flightNumber },
      launch
    );
    return { oborted: "ok" };
  } else {
    return null;
  }
};

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  getLaunch,
  abortLaunch,
  loadLaunchData,
};
