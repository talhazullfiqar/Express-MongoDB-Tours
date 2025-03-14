//imports
require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const tourRoutes = require("./routes/tourRoutes");
const HttpError = require("./error/Error");
const errorController = require("./controllers/errorController");

//todo middleware
app.use(express.json());
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

//* routes error Handling
app.all("*", (req, res, next) => {
  const err = new HttpError(
    404,
    `Can not find ${req.originalUrl} on this Server!`
  );
  next(err);
});

//! error Handling
app.use(errorController.globalErrorHandler);

//exports
module.exports = app;
