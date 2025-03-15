const express = require("express");
const routes = express.Router();
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
//routes
routes.get("/", authController.protect, tourController.getTours);
routes.get("/:tid", tourController.getToursById);
routes.post("/", tourController.createTour);
routes.patch("/:tid", tourController.updateTourById);
routes.delete("/", tourController.deleteTours);
routes.delete(
  "/:tid",
  authController.protect,
  authController.restrictTo("admin"),
  tourController.deleteTourById
);

//exports
module.exports = routes;
