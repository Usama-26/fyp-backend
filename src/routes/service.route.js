const express = require("express");
const router = express.Router();

const {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceByPath,
} = require("./../controllers/service.controller");

// Get all services
router.get("/", getAllServices);

// Create a new service
router.post("/", createService);

// Update a service by ID
router.patch("/:id", updateService);

// Delete a service by ID
router.delete("/:id", deleteService);

// Get a service by path
router.get("/:path", getServiceByPath);

module.exports = router;
