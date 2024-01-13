const catchAsync = require("../utils/catchAsync");
const Proposal = require("../models/proposal.model");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const byteSize = require("byte-size");

const createProposal = catchAsync(async (req, res) => {
  let cloudinaryRes = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      const uploadResponse = await cloudinaryUpload(dataURI, {
        folder: "proposals",
      });

      cloudinaryRes.push({ ...uploadResponse, filename: file.originalname });
    }
  }

  const attachments = cloudinaryRes.map(
    ({ secure_url, filename, public_id, bytes, format }) => ({
      secure_url,
      filename,
      format,
      size: `${byteSize(bytes)}`,
      public_id,
    })
  );

  const proposal = await Proposal.create({
    ...req.body,
    attachments: attachments,
  });

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
