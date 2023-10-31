const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategoryByPath,
  getFilteredCategories,
} = require("./../controllers/category.controller");

// Create a new category
router.route("/").post(createCategory).get(getAllCategories);

router.route("/filtered").get(getFilteredCategories);

// Get a category by its path
router.get("/:path", getCategoryByPath);

module.exports = router;
