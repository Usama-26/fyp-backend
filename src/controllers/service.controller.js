const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Service = require("./../models/service.model");
const SubCategory = require("../models/subCategory.model");

const getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find();

  res.status(200).json({
    status: "success",
    length: services.length,
    data: services,
  });
});

const createService = catchAsync(async (req, res, next) => {
  const service = await Service.create(req.body);

  res.status(200).json({
    status: "success",
    data: service,
  });
});

const getService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: service,
  });
});

const deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
  });
});

const updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id);

  res.status(200).json({
    status: "success",
    data: service,
  });
});

const getServiceByPath = catchAsync(async (req, res, next) => {
  const service = await Service.findOne({ path: req.params.path });

  res.status(200).json({
    status: "success",
    data: service,
  });
});

const getBySubCategory = catchAsync(async (req, res, next) => {
  const services = await Service.find({
    sub_category: req.params.subcategoryId,
  }).select("name");

  if (!services) {
    return next(new AppError("No Services Found", 400));
  }

  res.status(200).json({
    status: "success",
    data: services,
  });
});

module.exports = {
  getAllServices,
  createService,
  getService,
  deleteService,
  updateService,
  getServiceByPath,
  getBySubCategory
};
