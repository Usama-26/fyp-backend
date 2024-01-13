const express = require("express");
const router = express.Router();
const {
  createProposal,
  getProposalById,
} = require("./../controllers/proposal.controller");
const { protect } = require("../controllers/auth.controller");
const upload = require("../middlewares/multerStorage");

// Create a new proposal
router.route("/").post(protect, upload.array("attachments"), createProposal);

// Get a proposal by its ID
router.get("/:id", getProposalById);

module.exports = router;
