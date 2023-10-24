const catchAsync = require('../utils/catchAsync');
const Proposal = require('../models/proposal.model');

// Create a new proposal
const createProposal = catchAsync(async (req, res) => {
  const proposalData = req.body;
  const proposal = await Proposal.create(proposalData);

  res.status(201).json({
    status: 'success',
    data: proposal,
  });
});

// Get all proposals for a specific project
const getAllProposalsForProject = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const proposals = await Proposal.find({ projectId });

  res.status(200).json({
    status: 'success',
    length: proposals.length,
    data: { proposals },
  });
});

// Get a proposal by its ID
const getProposalById = catchAsync(async (req, res) => {
  const proposalId = req.params.id;
  const proposal = await Proposal.findById(proposalId);

  if (!proposal) {
    return res.status(404).json({
      status: 'fail',
      message: 'Proposal not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: proposal,
  });
});

module.exports = {
  createProposal,
  getAllProposalsForProject,
  getProposalById,
};
