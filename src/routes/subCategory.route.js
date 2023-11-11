const express = require("express");
const router = express.Router();
const {
  getAllSubCategories,
  createSubCategory,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategoryByPath,
  getByCategory,
} = require("./../controllers/subCategory.controller");
const { protect } = require("../controllers/auth.controller");

router.route("/").get(getAllSubCategories).post(protect, createSubCategory);

router
  .route("/:id")
  .get(getSubCategory)
  .patch(protect, updateSubCategory)
  .delete(protect, deleteSubCategory);

router.get("/get_by_path/:path", getSubCategoryByPath);

router.get("/find_by_category/:categoryId", getByCategory);

module.exports = router;
