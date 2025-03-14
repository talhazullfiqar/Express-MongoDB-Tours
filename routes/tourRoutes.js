const express = require("express");
const routes = express.Router();
const tourController = require("../controllers/tourController");

//routes
routes.get("/", tourController.getTours);
routes.get("/:tid", tourController.getToursById);
routes.post("/", tourController.createTour);
routes.patch("/:tid", tourController.updateTourById);
routes.delete("/", tourController.deleteTours);
routes.delete("/:tid", tourController.deleteTourById);

//exports
module.exports = routes;
