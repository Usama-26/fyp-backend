const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('./../controllers/review.controller');
const { protect } = require("../controllers/auth.controller");

// Create a new review
router.route('/').post(protect, createReview).get(getAllReviews);

router.route('/:id').delete(protect, deleteReview).patch(protect, updateReview).get(getReviewById)

module.exports = router;
