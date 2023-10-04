const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/user.controller");

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").delete(deleteUser).patch(updateUser);

router.route("/:id").get(getUserById);

module.exports = router;
