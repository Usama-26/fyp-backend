const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  sendResetPassMail,
  protect,
  getCurrentUser,
  resetPassword,
  withGoogle
} = require("./../controllers/auth.controller");

router.post("/signup", protect, signup);

router.post("/login", protect, login);

router.get("/google", protect, withGoogle);

router.post("/forgetPassword", protect, sendResetPassMail);

router.post("/resetPassword", protect, resetPassword);

router.get("/getCurrentUser", protect, getCurrentUser);

module.exports = router;
