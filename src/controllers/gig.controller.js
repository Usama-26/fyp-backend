const Gig = require('../models/gig.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new Gig
const createGig = catchAsync(async (req, res, next) => {
  if (req.user.gigs.length <= req.user.max_gigs) {
    return next(new AppError('Gigs slots filled. Buy more gig slots.', 404));
  }

  const gig = await Gig.create(req.body);

  res.status(201).json({
    status: 'success',
    data: gig,
  });
});

// Update a Gig by ID
const updateGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!gig) {
    return next(new AppError('No gig found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: gig,
  });
});

// Get all Gigs
const getAllGigs = catchAsync(async (req, res, next) => {
  const gigs = await Gig.find();

  if (!gigs || gigs.length === 0) {
    return next(new AppError('No Gig Found', 404));
  }

  res.status(200).json({
    status: 'success',
    length: gigs.length,
    data: gigs,
  });
});

// Get a Gig by ID
const getGigById = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new AppError('No gig found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: gig,
  });
});

// Delete a Gig by ID
const deleteGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findByIdAndDelete(req.params.id);

  if (!gig) {
    return next(new AppError('Gig not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getGigById,
  getAllGigs,
  deleteGig,
  updateGig,
  createGig,
};
