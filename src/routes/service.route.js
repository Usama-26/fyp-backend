const express = require("express");
const router = express.Router();
const {
  getAllServices,
  createService,
  getService,
  deleteService,
  updateService,
  getServiceByPath,
  getBySubCategory
} = require("./../controllers/service.controller");
const { getByCategory } = require("../controllers/subCategory.controller");
const { protect } = require("../controllers/auth.controller");

router.route("/").get(getAllServices).post(protect, createService);

router.route("/:id").get(getService).delete(protect, deleteService).patch(protect, updateService);

router.get("/get_by_path/:path", getServiceByPath);

router.get("/find_by_subcategory/:subcategoryId", getBySubCategory);

module.exports = router;
