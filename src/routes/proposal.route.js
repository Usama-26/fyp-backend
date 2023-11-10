const express = require('express');
const router = express.Router();
const {
  createProposal,
  getAllProposalsForProject,
  getProposalById
} = require('./../controllers/proposal.controller');
const { protect } = require("../controllers/auth.controller");

// Create a new proposal
router.route('/').post(protect, createProposal);

// Get all proposals for a specific project
router.get('/project/:projectId', getAllProposalsForProject);

// Get a proposal by its ID
router.get('/:id', getProposalById);

module.exports = router;
