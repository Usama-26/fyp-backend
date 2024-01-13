const express = require("express");
const { getAllLanguages } = require("../controllers/language.controller");
const router = express.Router();

router.route("/").get(getAllLanguages);

module.exports = router;
