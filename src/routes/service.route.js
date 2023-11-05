const express = require("express");
const router = express.Router();
const {
  getAllServices,
  createService,
  getService,
  deleteService,
  updateService,
  getServiceByPath,
} = require("./../controllers/service.controller");

router.route("/").get(getAllServices).post(createService);

router.route("/:id").get(getService).delete(deleteService).patch(updateService);

router.get("/get_by_path/:path", getServiceByPath);

module.exports = router;
