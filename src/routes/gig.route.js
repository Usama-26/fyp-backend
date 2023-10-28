import express from "express";
const {
  createGig,
  deleteGig,
  getGig,
  getGigs,
} = require("./../controllers/gig.controller");
const router = express.Router();

router.post("/", createGig);
router.delete("/:id", deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);

export default router;
