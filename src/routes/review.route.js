const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById
} = require('./../controllers/review.controller');

// Create a new review
router.route('/').post(createReview).get(getAllReviews);

// Get a review by its ID
router.get('/:id', getReviewById);

module.exports = router;
