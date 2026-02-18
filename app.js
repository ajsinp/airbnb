if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


// Core Modules
const path = require("path");

// External Modules
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

// Local Modules
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsControllers = require("./controllers/errors");

const app = express();

// ======================
// ENV VARIABLES
// ======================
const DB_PATH = process.env.MONGO_URI;
const PORT = process.env.PORT || 3001;

// ======================
// VIEW ENGINE
// ======================
app.set("view engine", "ejs");
app.set("views", "views");

// ======================
// SESSION STORE
// ======================
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

// ======================
// MIDDLEWARE
// ======================
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "SuperSecretKey",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Custom Middleware
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// ======================
// ROUTES
// ======================
app.use(authRouter);
app.use(storeRouter);

// Protect /host routes
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use("/host", hostRouter);

// Root Route (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.redirect("/login");
});

// ======================
// 404 ERROR
// ======================
app.use(errorsControllers.pageNotFound);

// ======================
// DATABASE CONNECTION
// ======================
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
