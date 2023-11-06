const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('./../controllers/review.controller');

// Create a new review
router.route('/').post(createReview).get(getAllReviews);

router.route('/:id').delete(deleteReview).patch(updateReview).get(getReviewById)

module.exports = router;
