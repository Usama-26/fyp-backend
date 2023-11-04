const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  resetPassword,
  protect,
  getCurrentUser,
} = require("./../controllers/auth.controller");

router.post("/signup", signup);

router.post("/login", login);

router.post("/resetPassword", resetPassword);

router.get("/getCurrentUser", protect, getCurrentUser);

module.exports = router;
