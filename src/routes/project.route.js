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
  getFreelancerProjects,
  sendDeliverables,
} = require("./../controllers/project.controller");

router
  .route("/")
  .post(protect, upload.array("attachments"), createProject)
  .get(getAllProjects);

router.get("/get_client_projects/:id", protect, getClientProjects);
router.get("/get_freelancer_projects/:id", protect, getFreelancerProjects);

router
  .route("/:id")
  .get(getProjectById)
  .delete(protect, deleteProject)
  .patch(upload.array("attachments"), updateProject);

router.patch(
  "/send_deliverables/:id",
  protect,
  upload.array("deliverables"),
  sendDeliverables
);
module.exports = router;
