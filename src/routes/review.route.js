const express = require('express');
const router = express.Router();
const reviewController = require('./../controllers/review.controller');

// Create a new review
router.post('/reviews', reviewController.createReview);

// Get all reviews
router.get('/reviews', reviewController.getAllReviews);

// Get a review by its ID
router.get('/reviews/:id', reviewController.getReviewById);

module.exports = router;
