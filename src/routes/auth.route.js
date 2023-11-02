const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  resetPassword,
} = require("./../controllers/auth.controller");

// User registration
router.post("/signup", signup);

// User login
router.post("/login", login);

// Reset Password
router.post("/passwordReset", resetPassword);

module.exports = router;
