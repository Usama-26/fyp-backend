const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .delete(userController.deleteAll);

module.exports = router;
