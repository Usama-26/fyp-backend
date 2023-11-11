const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // Basic Information
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    enum: ['one-time', 'ongoing'],
    required: true,
  },
  tags: [String],

  // Pricing
  pricingModel: {
    type: String,
    enum: ['fixed price', 'hourly rate', 'other'],
    required: true,
  },
  pricingDetails: {
    type: String,
    required: true,
  },
  deliveryTime: {
    type: String,
    required: true,
  },
  revisions: {
    type: Number,
    required: true,
  },

  // Requirements
  clientRequirements: {
    type: String,
  },
  attachments: [String], // Store file paths or references here

  // Description
  serviceDescription: {
    type: String,
    required: true,
  },
  FAQs: [
    {
      question: String,
      answer: String,
    },
  ],

  // Gallery or Portfolio
  portfolioSamples: [String], // Store references to portfolio samples here
  visuals: [String], // Store image or video references here
  clientReviews: [
    {
      rating: Number,
      comment: String,
    },
  ],

  // Availability
  availability: {
    online: {
      type: Boolean,
      default: false,
    },
    onLocation: {
      type: Boolean,
      default: false,
    },
  },

  // Expertise
  skills: [String],

  // Additional Information
  language: {
    type: String,
  },
  location: {
    type: String,
  },
  qualifications: {
    type: String,
  },
  education: {
    type: String,
  },

  // Certifications
  certifications: [String],

  // Employment History
  workExperience: [
    {
      title: String,
      company: String,
      startDate: Date,
      endDate: Date,
    },
  ],

  // Custom Extras (if your platform supports custom offers)
  customExtras: [
    {
      title: String,
      price: String,
    },
  ],

  // Review
  platformGuidelines: String,
  requiresReview: Boolean,
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Gig = mongoose.model('Gig', gigSchema);

module.exports = Gig;
