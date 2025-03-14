//imports
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const tourRoutes = require("./routes/tourRoutes");
const HttpError = require("./error/Error");
const errorController = require("./controllers/errorController");
//variables
const databaseConnection = process.env.MONGODB_URI.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

//middleware
app.use(express.json());
app.use("/api/v1/tours", tourRoutes);

// routes error Handling
app.all("*", (req, res, next) => {
  const err = new HttpError(
    404,
    `Can not find ${req.originalUrl} on this Server!`
  );
  next(err);
});

// error Handling
app.use(errorController.globalErrorHandler);
//database connection
mongoose
  .connect(databaseConnection)
  .then((con) =>
    console.log(`✅ MongoDB Connected Successfully to: ${con.connection.name}`)
  )
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

//exports
module.exports = app;
