const ProjectReview = require('../models/review.model').ProjectReview;
const GigReview = require('../models/review.model').GigReview;
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new review
const createReview = catchAsync(async (req, res, next) => {
  let review;

  // For Project Review
  if (req.body.projectId) {
    review = await ProjectReview.create(req.body);
  }
  // For Gig Review
  else if (req.body.gigId) {
    review = await GigReview.create(req.body);
  } else {
    return next(new AppError('Invalid review data', 400));
  }

  res.status(201).json({
    status: 'success',
    data: review,
  });
});

// Get all reviews
const getAllReviews = catchAsync(async (req, res, next) => {
  // Get all Project Reviews
  const projectReviews = await ProjectReview.find();
  // Get all Gig Reviews
  const gigReviews = await GigReview.find();

  res.status(200).json({
    status: 'success',
    projectReviews: projectReviews,
    gigReviews: gigReviews,
  });
});

// Get a review by its ID
const getReviewById = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  let review;

  // Find the review in both Project and Gig reviews
  review = await ProjectReview.findById(reviewId);
  if (!review) {
    review = await GigReview.findById(reviewId);
  }

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

// Update a review by its ID
const updateReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  const updatedData = req.body;
  let updatedReview;

  // Update the review in both Project and Gig reviews
  updatedReview = await ProjectReview.findByIdAndUpdate(reviewId, updatedData, {
    new: true, // Return the updated review
    runValidators: true, // Run validators on updated fields
  });

  if (!updatedReview) {
    updatedReview = await GigReview.findByIdAndUpdate(reviewId, updatedData, {
      new: true,
      runValidators: true,
    });
  }

  if (!updatedReview) {
    return next(new AppError('Review not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedReview,
  });
});

// Delete a review by its ID
const deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  let deletedReview;

  // Delete the review in both Project and Gig reviews
  deletedReview = await ProjectReview.findByIdAndDelete(reviewId);

  if (!deletedReview) {
    deletedReview = await GigReview.findByIdAndDelete(reviewId);
  }

  if (!deletedReview) {
    return next(new AppError('Review not found', 404));
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
