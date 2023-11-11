const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/user.model");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const nodemailer = require("nodemailer");
const { hash } = require("bcrypt");

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    if (user.with_google) {
      return next(
        new AppError(
          "This user was previously joined by a different authentication method."
        )
      );
    } else {
      return next(new AppError("This user already exists. Try login."));
    }
  }

  const newUser = await User.create(req.body);
  const token = generateToken({ id: newUser._id, type: newUser.user_type });

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

  if (user.with_google) {
    return next(
      new AppError("This user wasn't signed in by this method.", 400)
    );
  }

  if (!(await user.comparePassword(password))) {
    return next(new AppError("Incorrect email or password", 400));
  }

  const token = generateToken({ id: user._id, type: user.user_type });

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

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.withGoogle = catchAsync(async (req, res, next) => {
  const googleToken = req.headers["google-auth-token"];
  const userType = req.headers["user-type"];
  const decoded = jwt.decode(googleToken);
  const user = await User.findOne({ email: decoded.email });

  let token;

  if (user) {
    console.log("111", user);
    if (user.with_google) {
      token = generateToken({ id: user._id, type: user.user_type });

      return res.status(200).json({
        status: "success",
        token,
        data: user,
      });
    } else {
      return next(
        new AppError("This user wasn't signed in by this method.", 400)
      );
    }
  }

  const userData = {
    email: decoded.email,
    firstName: decoded.given_name,
    lastName: decoded.family_name,
    email_verified: decoded.email_verified,
    with_google: true,
    user_type: userType,
  };

  const newUser = await User.create(userData);
  token = generateToken({ id: newUser._id, type: newUser.user_type });

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
});

exports.sendResetPassMail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new AppError("Email not found", 400));
  }

  if (user.with_google) {
    return next(
      new AppError("User signed in with google. Can't reset password", 400)
    );
  }

  // Generate a reset token
  const resetToken = generateToken({ id: email });

  // Construct the reset link
  const resetLink = `http://localhost:3000/auth/reset_password?token=${resetToken}`;

  // Create a transporter using SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "taimoorahamed95959@gmail.com",
      pass: "5HUmBnIY7jO38dys",
    },
  });

  const mailOptions = {
    from: "support@workchain.com",
    to: email,
    subject: "Password Reset Request",
    text: "This is a test email",
    html: `<p>To reset your password, please click on the following link: <a href="${resetLink}">here</a></p>`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return next(new AppError(`Error sending email: ${error}}`, 400));
    } else {
      res.status(200).json({
        status: "success",
        message:
          "Password reset link sent to " + email + " Kindly check your inbox.",
      });
    }
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const email = decoded.id;

  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?!.*\s).+$/;

  if (!passwordPattern.test(password)) {
    return next(
      new Error(
        "Password must contain at least 1 character and 1 number without whitespaces."
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.findOneAndUpdate(
    { email: email },
    { password: hashedPassword },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
  });
});
