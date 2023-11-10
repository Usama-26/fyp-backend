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

router.route("/").get(getAllSubCategories).post(createSubCategory);

router
  .route("/:id")
  .get(getSubCategory)
  .patch(updateSubCategory)
  .delete(deleteSubCategory);

router.get("/get_by_path/:path", getSubCategoryByPath);

router.get("/find_by_category/:categoryId", getByCategory);

module.exports = router;
