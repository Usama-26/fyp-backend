const jwt = require("jsonwebtoken");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/user.model");

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    return next(new AppError("User already exists", 400));
  }
  const newUser = await User.create(req.body);
  const token = generateToken({ id: newUser._id, type: newUser.userType });
  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new AppError("User Doesn't exist", 400));
  }
  if (!(await user.comparePassword(password))) {
    return next(new AppError("Incorrect password", 401));
  }
  const token = generateToken({ id: user._id, type: user.userType });

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});
