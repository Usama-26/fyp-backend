const express = require('express');
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('./../controllers/project.controller');

router.route('/').post(createProject).get(getAllProjects);

router.route('/:id').get(getProjectById).delete(deleteProject).patch(updateProject);

module.exports = router;
