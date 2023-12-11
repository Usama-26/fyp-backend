const catchAsync = require("../utils/catchAsync");
const Project = require("./../models/project.model");
const AppError = require("../utils/appError");

// Create a new project
const createProject = catchAsync(async (req, res, next) => {
  const { files } = req;

  let cloudinaryResponses;

  if (files) {
    cloudinaryResponses = await Promise.all(
      files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        try {
          const cloudinaryRes = await cloudinaryUpload(dataURI);
          return cloudinaryRes.secure_url;
        } catch (error) {
          return error.message;
        }
      })
    );
  }

  const project = await Project.create({
    created_by: req.user._id,
    ...req.body,
    attachments: cloudinaryResponses.length > 0 ? cloudinaryResponses : "",
  });

  res.status(201).json({
    status: "success",
    data: project,
  });
});

// Get all projects
const getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find();

  res.status(200).json({
    status: "success",
    length: projects.length,
    data: projects,
  });
});

// Get a project by its ID
const getProjectById = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: project,
  });
});

// Update a project by its ID
const updateProject = catchAsync(async (req, res, next) => {
  const updatedData = req.body;

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    updatedData,
    {
      new: true, // Return the updated project
      runValidators: true, // Run validators on updated fields
    }
  );

  if (!updatedProject) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedProject,
  });
});

// Delete a project by its ID
const deleteProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;

  const deletedProject = await Project.findByIdAndDelete(projectId);

  if (!deletedProject) {
    return next(new AppError("Project not found", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

const getClientProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({ created_by: req.params.id });

  if (!projects) {
    return next(new AppError("No Projects Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: projects,
  });
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getClientProjects,
};
