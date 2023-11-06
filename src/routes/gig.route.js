const express = require("express");
const router = express.Router();

const {
  getGigById,
  getAllGigs,
  deleteGig,
  updateGig,
  createGig
} = require("./../controllers/gig.controller");

router.route('/').get(getAllGigs).post(createGig);

router.route('/:id').get(getGigById).delete(deleteGig).patch(updateGig)

module.exports = router;
