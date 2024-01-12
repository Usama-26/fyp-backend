const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { StreamChat } = require("stream-chat");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Freelancer = require("../models/user.model").FreelancerSchema;
const Client = require("../models/user.model").ClientSchema;

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
}

dotenv.config({ path: `${__dirname}/../../config.env` });
const streamChat = StreamChat.getInstance(
  process.env.GETSTREAM_API_KEY,
  process.env.GETSTREAM_API_SECRET
);

exports.signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Finding Existing User
  const freelancer = await Freelancer.findOne({ email: email });
  const client = await Client.findOne({ email: email });

  const user = freelancer || client;

  // Checking If exisiting user is signed up with Google
  if (user) {
    if (user.with_google) {
      return next(
        new AppError(
          "This user was previously joined by using Google OAuth 2.0."
        )
      );
    } else {
      return next(new AppError("This user already exists. Try login."));
    }
  }

  // User Creation
  let newUser;

  if (req.body.user_type === "freelancer") {
    newUser = await Freelancer.create(req.body);
  } else if (req.body.user_type === "client") {
    newUser = await Client.create(req.body);
  }
  if (!newUser) {
    return next(new AppError("Failed to create a new user.", 500));
  }
  const token = generateToken({ id: newUser._id, type: newUser.user_type });

  // Email Sending
  const verificationLink = `https://localhost:8000/api/v1/auth/verify_email?token=${token}`;
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "taimoorahamed95959@gmail.com",
      pass: "5HUmBnIY7jO38dys",
    },
  });
  const mailOptions = {
    from: "support@chainwork.com",
    to: newUser.email,
    subject: "Welcome to ChainWork",
    text: "Please verify your email to continue exploring all the features of chainwork.",
    html: `<p>To verfiy your email, please click on the following link: <a href="${verificationLink}">here</a></p>`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return next(new AppError(`Error sending email: ${error}}`, 400));
    } else {
    }
  });

  res.status(200).json({
    status: "success",
    token,
    data: newUser,
    message:
      "Email verification link sent to " +
      user +
      " Kindly check your inbox. Link expires in 1 hour.",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const freelancer = await Freelancer.findOne({ email: email });
  const client = await Client.findOne({ email: email });

  const user = freelancer || client;

  if (!user) {
    return next(new AppError("User not found.", 400));
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

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freelancer = await Freelancer.findById(decoded.id);
  const client = await Client.findById(decoded.id);

  const currentUser = freelancer || client;

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.withGoogle = catchAsync(async (req, res, next) => {
  const googleToken = req.headers["google-auth-token"];
  const userType = req.headers["user-type"];
  const decoded = jwt.decode(googleToken);

  const freelancer = await Freelancer.findOne({ email: decoded.email });
  const client = await Client.findOne({ email: decoded.email });

  const user = freelancer || client;

  let token;

  if (user) {
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

  let newUser;

  if (userData.user_type === "freelancer") {
    newUser = await Freelancer.create(userData);
  } else if (userData.user_type === "client") {
    newUser = await Client.create(userData);
  }

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

  const freelancer = await Freelancer.findOne({ email: email });
  const client = await Client.findOne({ email: email });

  const user = freelancer || client;

  if (!user) {
    return next(new AppError("Email not found.", 400));
  }

  if (user.with_google) {
    return next(
      new AppError("User signed in with google. Can't reset password", 400)
    );
  }

  const resetToken = generateToken({ id: email });

  const resetLink = `http://localhost:3000/auth/reset_password?token=${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "taimoorahamed95959@gmail.com",
      pass: "5HUmBnIY7jO38dys",
    },
  });

  const mailOptions = {
    from: "ChainWork Support <support@chainwork.com>",
    to: email,
    subject: "Password Reset Request",
    text: "You made password reset request.",
    html: `<p>To reset your password, please click on the following link: <a href="${resetLink}">here</a></p>`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return next(new AppError(`Error sending email: ${error}}`, 400));
    } else {
      res.status(200).json({
        status: "success",
        message:
          "Password reset link sent to " +
          email +
          " Kindly check your inbox. Link expires in 1 hour.",
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

  const freelancer = await Freelancer.findOneAndUpdate(
    { email: email },
    { password: hashedPassword },
    { new: true }
  );
  const client = await Client.findOneAndUpdate(
    { email: email },
    { password: hashedPassword },
    { new: true }
  );

  const user = freelancer || client;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const freelancer = await Freelancer.findById(req.params.id);
  const client = await Client.findById(req.params.id);
  const user = client || freelancer;

  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  let updatedUser;
  const hashedPassword = await bcrypt.hash(req.body.newPass, 12);

  if (!user.password) {
    if (user.user_type === "freelancer") {
      updatedUser = await Freelancer.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
        },
        { new: true }
      );
    } else if (user.user_type === "client") {
      updatedUser = await Client.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
        },
        { new: true }
      );
    }
  }

  if (!(await user.comparePassword(req.body.currentPass))) {
    return next(
      new AppError(
        "Current Password is Incorrect, Try Again or Reset Password",
        400
      )
    );
  } else {
    if (user.user_type === "freelancer") {
      updatedUser = await Freelancer.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
        },
        { new: true }
      );
    } else if (user.user_type === "client") {
      updatedUser = await Client.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
        },
        { new: true }
      );
    }
  }

  res
    .status(200)
    .json({ status: "success", message: "Password Successfully Updated." });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const email = decoded.id;

  const freelancer = await Freelancer.findOne({ email: email });
  const client = await Client.findOne({ email: email });

  const user = freelancer || client;

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.email_verified = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email verification successful.",
  });
});

exports.sendVerificationEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const freelancer = await Freelancer.findOne({ email: email });
  const client = await Client.findOne({ email: email });

  const user = freelancer || client;

  if (!user) {
    return next(new AppError("Email not found.", 400));
  }

  if (user.with_google) {
    return next(
      new AppError("User signed in with google. Can't reset password", 400)
    );
  }

  const token = generateToken({ id: user.email });

  const verificationLink = `https://fyp-backend.up.railway.app/api/v1/auth/verify_email?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "taimoorahamed95959@gmail.com",
      pass: "5HUmBnIY7jO38dys",
    },
  });

  const mailOptions = {
    from: "support@chainwork.com",
    to: email,
    subject: "Welcome to ChainWork",
    text: "Please verify your email to continue exploring all the features of ChainWork.",
    html: `<p>To verfiy your email, please click on the following link: <a href="${verificationLink}">here</a></p>`,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return next(new AppError(`Error sending email: ${error}}`, 400));
    } else {
    }
  });

  res.status(200).json({
    status: "success",
    token: token,
    message:
      "Email verification link sent to " +
      email +
      " Kindly check your inbox. Link expires in 1 hour.",
  });
});
