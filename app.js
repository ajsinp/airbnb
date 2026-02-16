require("dotenv").config();


//Core Module
const path = require("path");

// External Module
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const DB_PATH = process.env.MONGO_URI;

// Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsControllers = require("./controllers/errors");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

app.use(express.urlencoded());
app.use(
  session({
    secret: "Ajay Singh",
    resave: false,
    saveUninitialized: true,
    store
  }),
);
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});
app.use(authRouter);
app.use(storeRouter);
app.use("/host", hostRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use(express.static(path.join(rootDir, "public")));

app.use(errorsControllers.pageNotFound);

const PORT = process.env.PORT || 3001;

mongoose
  .connect(DB_PATH)
  .then((result) => {
    console.log("Connectec to MongoDb");
    app.listen(PORT, () => {
      console.log(`Server runing on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting mongoose", err);
  });
