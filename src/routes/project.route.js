const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/auth.controller");

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getClientProjects,
} = require("./../controllers/project.controller");
const upload = require("../middlewares/multerStorage");

router
  .route("/")
  .post(protect, upload.array("attachments"), createProject)
  .get(getAllProjects);

router.get("/get_client_projects/:id", protect, getClientProjects);

router
  .route("/:id")
  .get(getProjectById)
  .delete(protect, deleteProject)
  .patch(protect, updateProject);

module.exports = router;
