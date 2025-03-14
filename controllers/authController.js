const User = require("../model/userModal");
const HttpError = require("../error/Error");

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

    res.status(201).json({ status: "✅ User Successfully Created", newUser });
  } catch (err) {
    const error = new HttpError(500, "Something WentWrong");
    return next(error);
  }
}

exports.signUp = signUp;
