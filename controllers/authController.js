const User = require("../model/userModal");
const HttpError = require("../error/Error");
const jwt = require("jsonwebtoken");

//! CREATING JWT TOKEN
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

//* SIGNUP USER
async function signUp(req, res, next) {
  const { name, email, photo, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new HttpError(409, "User Already Exist");
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    photo,
    password,
    passwordConfirm,
  });

  try {
    await newUser.save();

    const jwtToken = signToken(newUser._id);
    res
      .status(201)
      .json({ status: "✅ User Successfully Created", jwtToken, newUser });
  } catch (err) {
    const error = new HttpError(500, "Something WentWrong");
    return next(error);
  }
}

//* LOGIN USER
async function logIn(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new HttpError(400, "Please provide email and password");
    return next(error);
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    const correct = await user.correctPassword(password, user.password);
    if (!user || !correct) {
      const error = new HttpError(401, "incorrect Email or Password");
      return next(error);
    }
    const jwtToken = signToken(user._id);
    res.status(200).json({
      status: "success",
      jwtToken,
    });
  } catch (err) {
    const error = new HttpError(500, "Something went Wrong");
    return next(error);
  }
}

//? EXPORTS
exports.signUp = signUp;
exports.logIn = logIn;
