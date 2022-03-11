import { useMemo } from "react";
import { Appear, Button, Frame, Loading, Paragraph } from "arwes";
import Clickable from "../components/Clickable";
import { Link } from "react-router-dom";

const Launch = (props) => {
  const selectorBody = useMemo(() => {
    return props.planets?.map((planet) => (
      <option value={planet.keplerName} key={planet.keplerName}>
        {planet.keplerName}
      </option>
    ));
  }, [props.planets]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Appear id="launch" animate show={props.entered}>
      <Paragraph>
        Schedule a mission launch for interstellar travel to one of the Kepler
        Exoplanets.
      </Paragraph>
      <Paragraph>
        Only confirmed planets matching the following criteria are available for
        the earliest scheduled missions:
      </Paragraph>
      <ul>
        <li>Planetary radius &lt; 1.6 times Earth's radius</li>
        <li>
          Effective stellar flux &gt; 0.36 times Earth's value and &lt; 1.11
          times Earth's value
        </li>
      </ul>

      <form
        onSubmit={props.submitLaunch}
        style={{
          display: "inline-grid",
          gridTemplateColumns: "auto auto",
          gridGap: "10px 20px",
        }}
      >
        <label htmlFor="launch-day">Launch Date</label>
        <input
          type="date"
          id="launch-day"
          name="launch-day"
          min={today}
          max="2040-12-31"
          defaultValue={today}
        />
        <label htmlFor="mission-name">Mission Name</label>
        <input type="text" id="mission-name" name="mission-name" />
        <label htmlFor="rocket-name">Rocket Type</label>
        <input
          type="text"
          id="rocket-name"
          name="rocket-name"
          defaultValue="Explorer IS1"
        />
        <label htmlFor="planets-selector">Destination Exoplanet</label>
        <select id="planets-selector" name="planets-selector">
          {selectorBody}
        </select>
        <Clickable>
          <Button
            animate
            show={props.entered}
            type="submit"
            layer="success"
            disabled={props.isPendingLaunch}
          >
            Launch Mission ✔
          </Button>
        </Clickable>
        {props.isPendingLaunch && <Loading animate small />}
      </form>
      <hr />
      <Frame animate show={props.entered} corners={4}>
        <ul>
          <li>
            {/* <Link to="http://localhost:8000/secret">Show Me</Link> */}
            <form action="http://localhost:8000/secret">
              <button type="submit" className="google-button">
                Show Me
              </button>
            </form>
          </li>{" "}
          <li>
            {" "}
            <Link to="http://localhost:8000/auth/google">Google Login</Link>
          </li>
          <li>
            {" "}
            <form action="http://localhost:8000/auth/google">
              <button type="submit" className="google-button">
                <span className="google-button__icon">
                  <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z"
                      id="Shape"
                      fill="#EA4335"
                    />
                    <path
                      d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z"
                      id="Shape"
                      fill="#FBBC05"
                    />
                    <path
                      d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z"
                      id="Shape"
                      fill="#4285F4"
                    />
                    <path
                      d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z"
                      fill="#34A853"
                    />
                  </svg>
                </span>
                <span className="google-button__text">sign in with Google</span>
              </button>
            </form>
          </li>
          <li>
            {" "}
            <form action="http://localhost:8000/auth/logout">
              <button type="submit" className="google-button">
                Logout
              </button>
            </form>
          </li>
        </ul>
      </Frame>
    </Appear>
  );
};

export default Launch;
