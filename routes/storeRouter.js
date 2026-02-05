//Core Modules

const path = require("path");

//External modules
const express = require("express");
const storeRouter = express.Router();

//Local Module
const storeController = require("../controllers/storeController");
storeRouter.get("/", storeController.getIndex);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/favourites", storeController.getFavouriteList);


storeRouter.get("/homes/:homeId",storeController.getHomesDetails);
storeRouter.post("/favourites",storeController.postAddToFavourites);

module.exports = storeRouter;
