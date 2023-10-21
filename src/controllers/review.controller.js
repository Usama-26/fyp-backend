const catchAsync = require('../utils/catchAsync');

const Review = require('./../models/review.model');

// Create a new review
const createReview = catchAsync(async (req, res) => {
  const reviewData = req.body;
  const review = await Review.create(reviewData);

  res.status(201).json({
    status: 'success',
    data: review,
  });
});

// Get all reviews
const getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    length: reviews.length,
    data: { reviews },
  });
});

// Get a review by its ID
const getReviewById = catchAsync(async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
};
