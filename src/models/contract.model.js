const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Reference to the Project model
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the client
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the freelancer
    required: true,
  },
  agreedAmount: {
    type: Number,
    required: true,
  },
  // Additional fields for contract status, start date, end date, etc.
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
