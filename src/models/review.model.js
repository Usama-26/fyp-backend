const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  sellerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (replace with the actual name of your user model)
    required: true,
  },
  buyerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Reference to the Project model (if applicable)
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: String,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
