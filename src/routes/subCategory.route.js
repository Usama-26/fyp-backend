const express = require("express");
const router = express.Router();
const {
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByPath,
} = require("./../controllers/subCategory.controller");

// Get all subcategories
router.get("/", getAllSubCategories);

// Create a new subcategory
router.post("/", createSubCategory);

// Update a subcategory by ID
router.patch("/:id", updateSubCategory);

// Delete a subcategory by ID
router.delete("/:id", deleteSubCategory);

// Get a subcategory by path
router.get("/:path", getSubCategoryByPath);

module.exports = router;
