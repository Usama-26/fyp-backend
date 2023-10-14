const Project = require('./../models/project.model'); // Import your Project model here

// Create a new project
async function createProject(req, res) {
  try {
    const projectData = req.body;
    const project = await Project.create(projectData);

    res.status(201).json({
      status: 'success',
      data: project,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Get all projects
async function getAllProjects(req, res) {
  try {
    const projects = await Project.find();

    res.status(200).json({
      status: 'success',
      length: projects.length,
      data: { projects },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Get a project by its ID
async function getProjectById(req, res) {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Update a project by its ID
async function updateProject(req, res) {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Delete a project by its ID
async function deleteProject(req, res) {
  try {
    const projectId = req.params.id;

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found',
      });
    }

    res.status(204).json(); // 204 No Content (success without data)
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
