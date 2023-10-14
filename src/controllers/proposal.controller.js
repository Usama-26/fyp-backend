const Proposal = require('./../models/proposal.model');

// Create a new proposal
async function createProposal(req, res) {
  try {
    const proposalData = req.body;
    const proposal = await Proposal.create(proposalData);

    res.status(201).json({
      status: 'success',
      data: proposal,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Get all proposals for a specific project
async function getAllProposalsForProject(req, res) {
  try {
    const projectId = req.params.projectId;
    const proposals = await Proposal.find({ projectId });

    res.status(200).json({
      status: 'success',
      length: proposals.length,
      data: { proposals },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Get a proposal by its ID
async function getProposalById(req, res) {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

module.exports = {
  createProposal,
  getAllProposalsForProject,
  getProposalById,
};
