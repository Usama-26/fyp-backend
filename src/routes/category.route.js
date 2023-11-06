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

router.route("/").post(createCategory).get(getAllCategories);

router
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

router.get("/get_by_path/:path", getCategoryByPath);

module.exports = router;