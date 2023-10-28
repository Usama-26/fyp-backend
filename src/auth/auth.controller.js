const User = require("../Auth/AuthModel");
const jwt = require("jsonwebtoken");

// User registration
async function register(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      token,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}

// User login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, "your-secret-key", {
    expiresIn: "1h", // Set your desired expiration time
  });
}

module.exports = {
  register,
  login,
};
