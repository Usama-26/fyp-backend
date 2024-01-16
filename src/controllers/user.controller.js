const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const { FreelancerSchema, ClientSchema } = require("../models/user.model");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const APIFeatures = require("../utils/apiFeatures");
const Freelancer = require("../models/user.model").FreelancerSchema;
const Client = require("../models/user.model").ClientSchema;

// Get All Users
const getAllUsers = catchAsync(async (req, res, next) => {
  const freelancerUsers = await Freelancer.find();
  const clientUsers = await Client.find();

  res.status(200).json({
    status: "success",
    length: freelancerUsers.length + clientUsers.length,
    data: {
      freelancerUser: freelancerUsers,
      clientUsers: clientUsers,
    },
  });
});

// Get All Freelancers
const getAllFreelancers = catchAsync(async (req, res, next) => {
  let freelancers = null;

  if (req.query) {
    const features = new APIFeatures(Freelancer.find(), req.query).filter();
    freelancers = await features.query;
  } else {
    freelancers = await Freelancer.find(req.query);
  }

  res.status(200).json({
    status: "success",
    length: freelancers.length,
    data: freelancers,
  });
});

// Get All Clients
const getAllClients = catchAsync(async (req, res, next) => {
  const clientUsers = await Client.find();

  res.status(200).json({
    status: "success",
    length: clientUsers.length,
    data: clientUsers,
  });
});

// Get users by ID (for both freelancers and clients)
const getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  let user;

  // Check if the user exists in the Freelancer or Client collection
  const freelancerUser = await Freelancer.findById(userId);
  const clientUser = await Client.findById(userId);

  if (freelancerUser) {
    user = freelancerUser;
  } else if (clientUser) {
    user = clientUser;
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// Create a new Freelancer
const createFreelancer = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const freelancer = await Freelancer.findOne({ email: email });

  if (freelancer) {
    return next(new AppError("Email already exists as a freelancer", 400));
  }

  const newFreelancer = await Freelancer.create(req.body);

  res.status(201).json({
    status: "success",
    data: { newFreelancer },
  });
});

// Create a new Client
const createClient = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const client = await Client.findOne({ email: email });

  if (client) {
    return next(new AppError("Email already exists as a client", 400));
  }

  const newClient = await Client.create(req.body);

  res.status(201).json({
    status: "success",
    data: { newClient },
  });
});

// Update a Freelancer
const updateFreelancer = catchAsync(async (req, res, next) => {
  const freelancerId = req.params.id;
  const updatedFreelancer = await Freelancer.findByIdAndUpdate(
    freelancerId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedFreelancer,
  });
});

// Update a Client
const updateClient = catchAsync(async (req, res, next) => {
  const clientId = req.params.id;
  const updatedClient = await Client.findByIdAndUpdate(clientId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedClient,
  });
});

// Delete a Freelancer
const deleteFreelancer = catchAsync(async (req, res, next) => {
  const freelancerId = req.params.id;
  await Freelancer.findByIdAndDelete(freelancerId);

  res.status(204).send();
});

// Delete a Client
const deleteClient = catchAsync(async (req, res, next) => {
  const clientId = req.params.id;
  await Client.findByIdAndDelete(clientId);

  res.status(204).send();
});

const getUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const freelancerUser = await FreelancerSchema.findOne({ email: email });
  const clientUser = await ClientSchema.findOne({ email: email });

  if (freelancerUser) {
    res.status(200).json({
      status: "success",
      data: freelancerUser,
    });
  } else if (clientUser) {
    res.status(200).json({
      status: "success",
      data: clientUser,
    });
  } else {
    return next(new AppError("User not found", 404));
  }
});

const updateProfilePhoto = catchAsync(async (req, res, next) => {
  const { user } = req;
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  const cloudinaryRes = await cloudinaryUpload(dataURI);

  let updatedClient;
  let updatedFreelancer;

  if (cloudinaryRes) {
    const data = { profile_photo: cloudinaryRes.secure_url };
    if (user.user_type === "client") {
      updatedClient = await Client.findByIdAndUpdate(user._id, data, {
        new: true,
        runValidators: true,
      });
    }

    if (user.user_type === "freelancer") {
      updatedFreelancer = await Freelancer.findByIdAndUpdate(user._id, data, {
        new: true,
        runValidators: true,
      });
    }
  }

  res
    .status(200)
    .json({ status: "success", data: updatedClient || updatedFreelancer });
});

module.exports = {
  getAllUsers,
  getAllFreelancers,
  getAllClients,
  getUserByEmail,
  createFreelancer,
  createClient,
  updateFreelancer,
  updateClient,
  deleteFreelancer,
  deleteClient,
  getUserById,

  updateProfilePhoto,
};
