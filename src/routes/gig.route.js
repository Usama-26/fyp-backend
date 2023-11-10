const express = require("express");
const router = express.Router();

const {
  getGigById,
  getAllGigs,
  deleteGig,
  updateGig,
  createGig
} = require("./../controllers/gig.controller");
const { protect } = require("../controllers/auth.controller");

router.route('/').get(getAllGigs).post(protect, createGig);

router.route('/:id').get(getGigById).delete(protect, deleteGig).patch(protect, updateGig)

module.exports = router;
