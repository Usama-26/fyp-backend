const { Review } = require("../models/review.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createReview = catchAsync(async (req, res, next) => {
  const existing = await Review.find({
    from: req.body.from,
    to: req.body.to,
    project: req.body.project,
  });

  if (existing) {
    return next(
      new AppError("You have already posted a review on this project.", 400)
    );
  }
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
    length: reviews.length,
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
  const review = await Review.findByIdAndUpdate(reviewId, req.body);
  res.status(200).json({
    status: "success",
    data: review,
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
const deleteReviews = catchAsync(async (req, res, next) => {
  const deletedReview = await Review.deleteMany();

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
  deleteReviews,
};
