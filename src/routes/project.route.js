const express = require('express');
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  updateProject
} = require('./../controllers/project.controller');


router.route('/').post(createProject).get(getAllProjects);

router.route('/:id').get(getProjectById).delete(deleteProject).patch(updateProject);

module.exports = router;
