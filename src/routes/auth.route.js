const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  sendResetPassMail,
  protect,
  getCurrentUser,
  resetPassword,
  updatePassword,
  withGoogle,
  verifyEmail,
  sendVerificationEmail,
} = require("./../controllers/auth.controller");

router.post("/signup", signup);

router.post("/login", login);

router.get("/google", withGoogle);

router.post("/forgetPassword", sendResetPassMail);

router.post("/resetPassword", resetPassword);

router.patch("/updatePassword/:id", protect, updatePassword);

router.post("/verify_email", verifyEmail);

router.get("/getCurrentUser", protect, getCurrentUser);

router.post("/emailSend", sendVerificationEmail);

module.exports = router;
