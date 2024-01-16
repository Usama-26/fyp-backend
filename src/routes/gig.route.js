const express = require("express");
const router = express.Router();

const {
  getGigById,
  getAllGigs,
  createGig,
  updateGigGallery,
  updateGigPricing,
  updateGigOverview,
  getFreelancerGigs,
  getGigsBySubCategory,
  getGigsByService,
} = require("./../controllers/gig.controller");
const { protect } = require("../controllers/auth.controller");
const upload = require("../middlewares/multerStorage");

router.route("/").get(getAllGigs).post(protect, createGig);

router.patch("/update_overview/:id", protect, updateGigOverview);
router.patch(
  "/update_gallery/:id",
  protect,
  upload.array("gallery"),
  updateGigGallery
);

router.patch("/update_pricing/:id", protect, updateGigPricing);

router.get("/:id", getGigById);
router.get("/fetch_by_subcategory/:id", getGigsBySubCategory);
router.get("/fetch_by_service/:id", getGigsByService);
router.get("/fetch_freelancer_gigs/:id", protect, getFreelancerGigs);

module.exports = router;
