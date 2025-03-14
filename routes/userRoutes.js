const express = require("express");
const routes = express.Router();
const authController = require("../controllers/authController");
const usersController = require("../controllers/userController");

routes.get("/", usersController.getAllUsers);
routes.post("/login", authController.logIn);
routes.post("/signup", authController.signUp);

module.exports = routes;
