require("dotenv").config();
// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const MongoStore = require("connect-mongo").default;
const DB_PATH = process.env.MONGO_URI;

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { default: mongoose } = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions"
    })
  })
);

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session?.isLoggedIn || false;
  res.locals.user = req.session?.user || null;
  next();
});

app.use(authRouter)
app.use(storeRouter);

app.use("/host", (req, res, next) => {
  if (
    req.session.isLoggedIn &&
    req.session.user &&
    req.session.user.userType === "host"
  ) {
    return next();
  }
  return res.redirect("/");
});

app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

const PORT = process.env.PORT;

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});