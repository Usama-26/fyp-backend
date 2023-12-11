const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllFreelancers,
  getAllClients,
  getUserById,
  deleteClient,
  deleteFreelancer,
  updateClient,
  updateFreelancer,
  createClient,
  createFreelancer,
  getUserByEmail,
  updateProfilePhoto,
} = require("../controllers/user.controller");
const { protect } = require("../controllers/auth.controller");
const upload = require("../middlewares/multerStorage");

router.route("/").get(getAllUsers);

router.route("/freelancers").get(getAllFreelancers).post(createFreelancer);

router.route("/clients").get(getAllClients).post(createClient);

router.route("/email/:id").get(getUserByEmail);

router
  .route("/update_profile_photo/:id")
  .patch(protect, upload.single("profile_photo"), updateProfilePhoto);

router
  .route("/:id")
  .get(getUserById)
  .patch(protect, (req, res, next) => {
    const { user_type } = req.user;

    if (user_type === "freelancer") {
      return updateFreelancer(req, res, next);
    } else if (user_type === "client") {
      return updateClient(req, res, next);
    }
  })
  .delete(protect, (req, res, next) => {
    // Define the logic to delete either a Freelancer or Client based on user type
    const { user_type } = req.body;

    if (user_type === "freelancer") {
      return deleteFreelancer(req, res, next);
    } else if (user_type === "client") {
      return deleteClient(req, res, next);
    }
  });

module.exports = router;
