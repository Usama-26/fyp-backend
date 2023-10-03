const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").delete(deleteUser).patch(updateUser);

module.exports = router;
