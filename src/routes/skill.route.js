const express = require('express');
const router = express.Router();

const {
  createSkill,
  getAllSkills,
  getSkillById,
  deleteSkill,
  updateSkill
} = require('../controllers/skill.controller');
const { protect } = require("../controllers/auth.controller");

router.post('/skills', protect, createSkill);

router.get('/skills', getAllSkills);

router.get('/skills/:id', getSkillById);

router.put('/skills/:id', protect, updateSkill);

router.delete('/skills/:id', protect, deleteSkill);

module.exports = router;
