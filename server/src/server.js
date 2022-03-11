const http = require("http");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");
const { verify } = require("crypto");

require("dotenv").config();
const config = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const verifyCallback = (accessToken, refreshToken, profile, cb) => {
  console.log("Google profile ", profile);
  cb(null, profile);
};

passport.use(
  new Strategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
    verifyCallback
  )
);

// Save the session to cookie
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// Read the session from the cookie
passport.deserializeUser((obj, cb) => {
  // User.findById(obj).then(user => {
  //   cb(null, user)
  // });;
  cb(null, obj);
});
const app = require("./app");
app.use(helmet());
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);
app.use(passport.initialize());
app.use(passport.session());

const checkLoggedIn = (req, res, next) => {
  console.log("Current user is ", req.user);
  const isLoggedIn = req.isAuthenticated() && req.user; // TODO
  if (!isLoggedIn) {
    return res
      .status(401)
      .json({ error: "You are not authorized to view this page" });
  }
  next();
};

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("Google auth success");
    // res.redirect("/");
  }
);
app.get("/auth/logout", (req, res) => {
  req.logout();
  return res.redirect("/");
});

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("Your personal secret value is 42!");
});

app.get("/failure", (req, res) => {
  res.status(400).json({ error: "Authentication failed" });
});

const { mongoConnect } = require("./services/mongo");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");
const { doesNotMatch } = require("assert");

const credentials = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT),
};

const server = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
  // httpsServer.listen(process.env.HTTPS_PORT, () => {
  //   console.log(`Secured Server is listening on port ${PORT + 1}`);
  // });
};
startServer();

// openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
