const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  getCategoryByPath,
} = require("./../controllers/category.controller");
const { protect } = require("../controllers/auth.controller");

router.route("/").post(protect, createCategory).get(getAllCategories);

router
  .route("/:id")
  .get(getCategory)
  .patch(protect, updateCategory)
  .delete(protect, deleteCategory);

router.get("/get_by_path/:path", getCategoryByPath);

module.exports = router;