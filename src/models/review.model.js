const { default: mongoose, Schema } = require("mongoose");

// Base review schema
const reviewSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Create a project review schema as a discriminator of the base review schema
const projectReviewSchema = reviewSchema.clone();
projectReviewSchema.add({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
});

// Create a gig review schema as a discriminator of the base review schema
const gigReviewSchema = reviewSchema.clone();
gigReviewSchema.add({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);
const ProjectReview = Review.discriminator('ProjectReview', projectReviewSchema);
const GigReview = Review.discriminator('GigReview', gigReviewSchema);

module.exports = {
  Review,
  ProjectReview,
  GigReview,
};
