const express = require("express");
const routes = express.Router();
const authController = require("../controllers/authController");

routes.post("/signup", authController.signUp);

module.exports = routes;
