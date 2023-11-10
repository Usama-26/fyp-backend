const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/user.controller");
const { protect } = require("../controllers/auth.controller");

router.route("/").get(getAllUsers).post(protect, createUser);

router.route("/:id").delete(protect, deleteUser).patch(protect, updateUser).get(getUserById);

module.exports = router;
