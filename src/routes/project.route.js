const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/auth.controller");
const upload = require("../middlewares/multerStorage");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getClientProjects,
} = require("./../controllers/project.controller");

router.route("/").post(protect, createProject).get(getAllProjects);

router.get("/get_client_projects/:id", protect, getClientProjects);

router
  .route("/:id")
  .get(getProjectById)
  .delete(protect, deleteProject)
  .patch(protect, upload.array("attachments"), updateProject);

module.exports = router;
