const User = require("../model/userModal");
const HttpError = require("../error/Error");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { decode } = require("punycode");

//! CREATING JWT TOKEN
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

//! PROTECTING TOUR BY CHECKING TOKEN/USER LOGIN
async function protect(req, res, next) {
  let token;
  let decoded;
  //accessing token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    const error = new HttpError(401, "Please Login to get access");
    return next(error);
  }
  //token verification
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (err) {
    const error = new HttpError(
      401,
      "Invalid or Expired token please login Again"
    );
    return next(error);
  }
  //checking user existance
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    const error = new HttpError(401, "User does not exist");
    return next(error);
  }
  // checking if user changed password
  if (freshUser.passwordChangedAt(decoded.iat)) {
    const error = new HttpError(401, "Recently Changed password login again");
    return next(error);
  }

  req.user = freshUser;
  next();
}

//! RESTRICTIONS CHECK
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new HttpError(
        403,
        "You do not have permission to perform this Action"
      );
      return next(error);
    }
    next();
  };
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

//* FORGOT PASSWORD
async function forgotPassword(req, res, next) {
  const { email } = req.body;
  const user = await User.find({ email });

  if (!user) {
    const error = new HttpError(
      404,
      "No user found assosiacted with this email address"
    );
    return next(error);
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
}
//* RESET PASSWORD
function resetPassword(req, res, next) {}

//? EXPORTS
exports.signUp = signUp;
exports.logIn = logIn;
exports.protect = protect;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.restrictTo = restrictTo;
