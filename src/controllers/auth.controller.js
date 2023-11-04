const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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
    return next(
      new AppError("A user with this email already exists. Try login.", 400)
    );
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
    return next(new AppError("Incorrect email or password.", 400));
  }

  if (!(await user.comparePassword(password))) {
    return next(new AppError("Incorrect email or password", 400));
  }

  const token = generateToken({ id: user._id, type: user.userType });

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not Logged In", 401));
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});
