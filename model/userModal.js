const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = new Schema({
  name: { type: String, required: [true, "Please enter your Name"] },
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid Email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please Enter a Password"],
    unique: true,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please Enter a Password"],
    validate: {
      validator: function (cpass) {
        return cpass === this.password;
      },
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

module.exports = mongoose.model("User", UserSchema);
