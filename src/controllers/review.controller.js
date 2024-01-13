const { Review } = require("../models/review.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: review,
  });
});

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    data: reviews,
  });
});

// Get a review by its ID
const getReviewById = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);

  res.status(200).json({
    status: "success",
    data: review,
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const updatedReview = await res.status(200).json({
    status: "success",
    data: updatedReview,
  });
});

// Delete a review by its ID
const deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  const deletedReview = await ProjectReview.findByIdAndDelete(reviewId);

  if (!deletedReview) {
    return next(new AppError("Review not found", 404));
  }

  res.status(204).json();
});

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
