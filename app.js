//Core Module
const path = require('path');

// External Module
const express = require('express');

// Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtil");
const errorsControllers = require('./controllers/errors')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());
app.use(storeRouter);
app.use("/host",hostRouter);

app.use(express.static(path.join(rootDir,'public')))



app.use(errorsControllers.pageNotFound)

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server runing on address http://localhost:${PORT}`)
})