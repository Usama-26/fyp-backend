const catchAsync = require('../utils/catchAsync');
const Project = require('./../models/project.model');

// Create a new project
const createProject = catchAsync(async (req, res) => {
  const projectData = req.body;
  const project = await Project.create(projectData);

  res.status(201).json({
    status: 'success',
    data: project,
  });
});

// Get all projects
const getAllProjects = catchAsync(async (req, res) => {
  const projects = await Project.find();

  res.status(200).json({
    status: 'success',
    length: projects.length,
    data: { projects },
  });
});

// Get a project by its ID
const getProjectById = catchAsync(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({
      status: 'fail',
      message: 'Project not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

// Update a project by its ID
const updateProject = catchAsync(async (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;

  const updatedProject = await Project.findByIdAndUpdate(projectId, updatedData, {
    new: true, // Return the updated project
    runValidators: true, // Run validators on updated fields
  });

  if (!updatedProject) {
    return res.status(404).json({
      status: 'fail',
      message: 'Project not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: updatedProject,
  });
});

// Delete a project by its ID
const deleteProject = catchAsync(async (req, res) => {
  const projectId = req.params.id;

  const deletedProject = await Project.findByIdAndDelete(projectId);

  if (!deletedProject) {
    return res.status(404).json({
      status: 'fail',
      message: 'Project not found',
    });
  }

  res.status(204).json(); // 204 No Content (success without data)
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
