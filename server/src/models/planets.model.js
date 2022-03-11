const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
// const { resourceLimits } = require("worker_threads");

const planetsS = require("./planets.mongo.js");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/*
const promise = new Promise((resolve, reject) => {

});
promise.then(result => {

})
*/
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(parse({ delimiter: ",", comment: "#", columns: true }))
      .on("data", async (data) => {
        // resourceLimits.push(data);

        if (isHabitablePlanet(data)) {
          // planets.push(data);
          // insert + update = upsert (inserts only when the object doesn't exist)
          // await planets.create({ keplerName: data.kepler_name });
          // await planetsS.updateOne(
          //   {
          //     keplerName: data.kepler_name,
          //   },
          //   {
          //     keplerName: data.kepler_name,
          //   },
          //   { upsert: true }
          // );
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const planets = await getPlanets();
        resolve(planets);

        const numOfPlanetsFound = planets.length;
        console.log(`Total: ${numOfPlanetsFound} \n`, planets[0]);
        console.log(planets.map((planet) => planet["kepler_name"]));
        console.log("done");
      });
  });
}

// const planets = [
//   {
//     id: 1,
//     name: "Mercury",
//   },
//   {
//     id: 2,
//     name: "Venus",
//   },
//   {
//     id: 3,
//     name: "Earth",
//   },
//   {
//     id: 4,
//     name: "Mars",
//   },
//   {
//     id: 5,
//     name: "Jupiter",
//   },
//   {
//     id: 6,
//     name: "Saturn",
//   },
//   {
//     id: 7,
//     name: "Uranus",
//   },
//   {
//     id: 8,
//     name: "Neptune",
//   },
//   {
//     id: 9,
//     name: "Pluto",
//   },
// ];

const createPlanet = (aPlanet) => {
  planets.push(aPlanet);
};

const getPlanets = () => {
  // return planets;
  return planetsS.find({});
};

const getPlanetCount = () => {
  return planets.length;
};

const getPlanet = (id) => {
  return planets[id];
};

const savePlanet = async (planet) => {
  try {
    await planetsS.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      { upsert: true }
    );
  } catch (err) {
    console.log(`Could not save the planet: ${err}`);
  }
};

module.exports = {
  getPlanets,
  createPlanet,
  loadPlanetsData,
  getPlanetCount,
  getPlanet,
};
