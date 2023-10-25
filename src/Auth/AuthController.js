const User = require('../models/user.model');
const userController = require('../controllers/user.controller');
const bcrypt = require('bcrypt');


// Register user
async function register(req, res) {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if the user already exists with the provided email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        status: 'fail',
        message: 'User with this email already exists',
      });
    }

    // If the user does not exist, create a new user
    const userData = {
      firstName,
      lastName,
      username,
      email,
      password, // Password will be hashed in the "createUser" method
    };

    // Use the createUser method from the user controller to create the user
    const newUser = await userController.createUser(userData);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: newUser, // You can include user data in the response if needed
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

// Login user
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email.',
      });
    }

    // Compare the entered password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid password.',
      });
    }

    // If email and password are valid, send a success response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: user, // You can include user data here if needed
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

module.exports = {
  register,
  login,
};
