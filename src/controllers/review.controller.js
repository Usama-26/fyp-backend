const Review = require('./../models/review.model'); // Import your Review model here

// Create a new review
async function createReview(req, res) {
  try {
    const reviewData = req.body;
    const review = await Review.create(reviewData);

    res.status(201).json({
      status: 'success',
      data: review,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Get all reviews
async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find();

    res.status(200).json({
      status: 'success',
      length: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Get a review by its ID
async function getReviewById(req, res) {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
};
