const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  deleteReview,
} = require("./../controllers/review.controller");
const { protect } = require("../controllers/auth.controller");

router.route("/").post(protect, createReview).get(getAllReviews);

router.route("/:id").get(getReviewById).delete(deleteReview);

module.exports = router;
