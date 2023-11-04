const express = require("express");
const router = express.Router();

const {
  getGigById,
  getAllGigs,
  deleteGig,
  updateGig,
  createGig
} = require("./../controllers/gig.controller");

router.post("/", createGig);
router.delete("/:id", deleteGig);
router.get("/single/:id", getGigById);
router.get("/", getAllGigs);
router.patch("/single/:id", updateGig);

module.exports = router;
