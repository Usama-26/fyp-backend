const catchAsync = require("../utils/catchAsync");
const Proposal = require("../models/proposal.model");

const createProposal = catchAsync(async (req, res) => {
  const proposal = await Proposal.create(req.body);

  res.status(201).json({
    status: "success",
    data: proposal,
  });
});

const getProposalById = catchAsync(async (req, res) => {
  const proposalId = req.params.id;
  const proposal = await Proposal.findById(proposalId).populate({
    path: "freelancer_id",
    select: "-password",
    model: "FreelancerSchema",
  });
  if (!proposal) {
    return res.status(404).json({
      status: "fail",
      message: "Proposal not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: proposal,
  });
});

module.exports = {
  createProposal,
  getProposalById,
};
