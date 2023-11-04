// TODO
// implement Get All Categories
// implement Update, Delete, Get by Path, and limiting fields



const Service = require('./../models/service.model'); // Import your Service model here
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Get All Categories
const getAllCategories = catchAsync(async (req, res) => {
  const services = await Service.find();
  res.status(200).json({
    status: 'success',
    length: services.length,
    data: { services },
  });
});

// Update a Service
const updateService = catchAsync(async (req, res, next) => {
  const serviceId = req.params.id;
  const service = await Service.findByIdAndUpdate(serviceId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: service,
  });
});

// Delete a Service
const deleteService = catchAsync(async (req, res, next) => {
  const serviceId = req.params.id;
  const service = await Service.findByIdAndDelete(serviceId);

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Get a Service by Path
const getServiceByPath = catchAsync(async (req, res, next) => {
  const servicePath = req.params.path;
  const service = await Service.findOne({ path: servicePath });

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: service,
  });
});

// Limiting Fields (Projection)
const getLimitedServices = catchAsync(async (req, res) => {
  const { fields } = req.query;
  const fieldArray = fields.split(',');

  const services = await Service.find().select(fieldArray.join(' '));

  res.status(200).json({
    status: 'success',
    length: services.length,
    data: { services },
  });
});

module.exports = {
  getAllCategories,
  updateService,
  deleteService,
  getServiceByPath,
  getLimitedServices,
};
