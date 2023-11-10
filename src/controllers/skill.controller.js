const Skill = require('../models/skill.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create a new skill
const createSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({
    status: 'success',
    data: skill,
  });
});

// Get all skills
const getAllSkills = catchAsync(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({
    status: 'success',
    length: skills.length,
    data: skills,
  });
});

// Get a skill by its ID
const getSkillById = catchAsync(async (req, res, next) => {
  const skillId = req.params.id;
  const skill = await Skill.findById(skillId);
  if (!skill) {
    return next(new AppError('Skill not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: skill,
  });
});

// Update a skill by its ID
const updateSkill = catchAsync(async (req, res, next) => {
  const skillId = req.params.id;
  const updatedData = req.body;
  const updatedSkill = await Skill.findByIdAndUpdate(skillId, updatedData, {
    new: true, // Return the updated skill
    runValidators: true, // Run validators on updated fields
  });
  if (!updatedSkill) {
    return next(new AppError('Skill not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: updatedSkill,
  });
});

// Delete a skill by its ID
const deleteSkill = catchAsync(async (req, res, next) => {
  const skillId = req.params.id;
  const deletedSkill = await Skill.findByIdAndDelete(skillId);
  if (!deletedSkill) {
    return next(new AppError('Skill not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
