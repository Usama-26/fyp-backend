const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First Name is not provided."],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is not provided."],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "A username is required to create a user."],
    minLength: [8, "A username should be minimum of 8 characters"],
    maxLength: [24, "A username should be maximum of 24 characters"],
    validate: {
      validator: function (val) {
        return /^[a-z0-9_]{8,24}$/.test(val);
      },
      message:
        "A username should contain only lowercase letters, numbers and underscores.",
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Provide an email address to create a user profile."],
    validate: {
      validator: validator.isEmail,
      message: "Entered email is invalid.",
    },
  },
  password: {
    type: String,
    required: [true, "A password must be set to secure user account."],
    minLength: [8, "The password should be at least 8 characters long"],
    maxLength: [24, "The password should be utmost 24 characters long"],
  },
});

userSchema.pre("save", async function (next) {
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?!.*\s).+$/;
  if (this.isModified("password")) {
    if (!passwordPattern.test(this.password)) {
      return next(
        new Error(
          "Password must contain at least 1 character and 1 number without whitespaces."
        )
      );
    }

    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
