const catchAsync = require("../utils/catchAsync");
const Project = require("./../models/project.model");
const AppError = require("../utils/appError");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const upload = require("../middlewares/multerStorage");
const APIFeatures = require("../utils/apiFeatures");
const byteSize = require("byte-size");

const createProject = catchAsync(async (req, res, next) => {
  let cloudinaryRes = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const uploadResponse = await cloudinaryUpload(dataURI, {
        folder: "projects",
      });
      cloudinaryRes.push({ ...uploadResponse, filename: file.originalname });
    }
  }

  const attachments = cloudinaryRes.map(
    ({ secure_url, filename, public_id, bytes, format }) => ({
      secure_url,
      filename,
      format,
      size: `${byteSize(bytes)}`,
      public_id,
    })
  );

  const project = await Project.create({
    created_by: req.user._id,
    ...req.body,
    tags: req.body.tags.split(","),
    attachments: attachments,
  });

  res.status(201).json({
    status: "success",
    data: project,
  });
});

// Get all projects
const getAllProjects = catchAsync(async (req, res, next) => {
  let projects;
  if (req.query) {
    const features = new APIFeatures(Project.find(), req.query).filter();
    projects = await features.query;
  } else {
    projects = await Project.find(req.query);
  }

  res.status(200).json({
    status: "success",
    length: projects.length,
    data: projects,
  });
});

// Get a project by its ID
const getProjectById = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId).populate([
    {
      path: "reviews",
    },
    {
      path: "proposals",
      populate: {
        path: "freelancer_id",
        select: "firstName lastName profile_photo",
        model: "FreelancerSchema",
      },
    },
    {
      path: "assigned_to",
      select: "firstName lastName profile_photo",
      model: "FreelancerSchema",
    },
  ]);

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
      new: true,
      runValidators: true,
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

const sendDeliverables = catchAsync(async (req, res, next) => {
  let cloudinaryRes = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const uploadResponse = await cloudinaryUpload(dataURI, {
        folder: "deliverables",
      });
      cloudinaryRes.push({ ...uploadResponse, filename: file.originalname });
    }
  }

  const deliverables = cloudinaryRes.map(
    ({ secure_url, filename, public_id, bytes, format }) => ({
      secure_url,
      filename,
      format,
      size: `${byteSize(bytes)}`,
      public_id,
    })
  );

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      $push: { deliverables: { $each: deliverables } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedProject,
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

const getFreelancerProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({ assigned_to: req.params.id });

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
  getFreelancerProjects,
  sendDeliverables,
};
