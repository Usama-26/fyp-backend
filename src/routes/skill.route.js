const express = require("express");
const router = express.Router();

const {
  createSkill,
  getAllSkills,
  getSkillById,
  deleteSkill,
  updateSkill,
} = require("../controllers/skill.controller");

const { protect } = require("../controllers/auth.controller");

router.post("/", createSkill);

router.get("/", getAllSkills);

router.get("/:id", getSkillById);

router.patch("/:id", protect, updateSkill);

router.delete("/:id", protect, deleteSkill);

module.exports = router;
