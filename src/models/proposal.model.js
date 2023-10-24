const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Reference to the Project model
    required: true,
  },
  freelancerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the freelancer
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
  // Additional fields for proposal status, submission date, etc.
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
