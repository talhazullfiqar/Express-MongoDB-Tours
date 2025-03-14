const HttpError = require("../error/Error");
const User = require("../model/userModal");

async function getAllUsers(req, res, next) {
  const users = await User.find();

  res.status(200).json({ status: "success", users });
}

exports.getAllUsers = getAllUsers;
