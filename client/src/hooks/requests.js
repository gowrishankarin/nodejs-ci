const API_URL = "http://localhost:8000/v1";
async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const planets = await fetch(`${API_URL}/planets`);
  return planets.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const launches = await fetch(`${API_URL}/launches`);
  const launchesData = await launches.json();
  return launchesData.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
    const response = await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
    return response;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
    // return { ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
