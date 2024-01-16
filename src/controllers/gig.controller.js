const byteSize = require("byte-size");
const Gig = require("../models/gig.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

// Create a new Gig
const createGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.create({
    created_by: req.user._id,
    ...req.body,
  });

  res.status(201).json({
    status: "success",
    data: gig,
  });
});

// Update a Gig by ID
const updateGigOverview = catchAsync(async (req, res, next) => {
  const gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!gig) {
    return next(new AppError("No gig found", 404));
  }

  res.status(200).json({
    status: "success",
    data: gig,
  });
});

const updateGigPricing = catchAsync(async (req, res, next) => {
  const priceData = req.body;
  const updatedGig = await Gig.findByIdAndUpdate(req.params.id, priceData, {
    new: true,
    runValidators: true,
  });

  if (!updatedGig) {
    return next(
      new AppError(
        "Something went wrong while updating your gig. Please try again later."
      ),
      500
    );
  }
  res.status(200).json({
    status: "success",
    data: updatedGig,
  });
});

const updateGigGallery = catchAsync(async (req, res, next) => {
  let cloudinaryRes = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const uploadResponse = await cloudinaryUpload(dataURI, {
        folder: "gallery",
      });
      cloudinaryRes.push({ ...uploadResponse, filename: file.originalname });
    }
  }

  const gallery = cloudinaryRes.map(
    ({ secure_url, filename, public_id, bytes, format, width, height }) => ({
      secure_url,
      filename,
      format,
      width,
      height,
      size: `${byteSize(bytes)}`,
      public_id,
    })
  );

  const updatedGig = await Gig.findByIdAndUpdate(
    req.params.id,
    { gallery: gallery },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedGig) {
    return next(
      new AppError(
        "Something went wrong while updating your gig. Please try again later."
      ),
      500
    );
  }
  res.status(200).json({
    status: "success",
    data: updatedGig,
  });
});

// Get all Gigs
const getAllGigs = catchAsync(async (req, res, next) => {
  const gigs = await Gig.find();

  if (!gigs || gigs.length === 0) {
    return next(new AppError("No Gig Found", 404));
  }

  res.status(200).json({
    status: "success",
    length: gigs.length,
    data: gigs,
  });
});

const getGigsBySubCategory = catchAsync(async (req, res, next) => {
  const gigs = await Gig.find({ sub_category: req.params.id })
    .select(
      "title description price gallery avg_rating created_by delivery_days reviews"
    )
    .populate({
      path: "created_by",
      select: "firstName lastName profile_photo level",
    });

  if (!gigs || gigs.length === 0) {
    return next(new AppError("No Gig Found", 404));
  }

  res.status(200).json({
    status: "success",
    length: gigs.length,
    data: gigs,
  });
});

const getGigsByService = catchAsync(async (req, res, next) => {
  const gigs = await Gig.find({ service: req.params.id })
    .select(
      "title description price gallery avg_rating created_by delivery_days reviews"
    )
    .populate({
      path: "created_by",
      select: "firstName lastName profile_photo level",
    });

  if (!gigs || gigs.length === 0) {
    return next(new AppError("No Gig Found", 404));
  }

  res.status(200).json({
    status: "success",
    length: gigs.length,
    data: gigs,
  });
});

const getFreelancerGigs = catchAsync(async (req, res, next) => {
  const gigs = await Gig.find({ created_by: req.user._id }).populate({
    path: "created_by",
    select: "firstName lastName profile_photo level",
  });

  res.status(200).json({
    status: "success",
    length: gigs.length,
    data: gigs,
  });
});

// Get a Gig by ID
const getGigById = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id).populate({
    path: "created_by",
    select:
      "firstName lastName profile_title bio country gallery avg_rating reviews profile_photo wallet_address level",
  });

  if (!gig) {
    return next(new AppError("No gig found", 404));
  }

  res.status(200).json({
    status: "success",
    data: gig,
  });
});

// Delete a Gig by ID
const deleteGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findByIdAndDelete(req.params.id);

  if (!gig) {
    return next(new AppError("Gig not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getGigById,
  getAllGigs,
  deleteGig,
  getFreelancerGigs,
  updateGigOverview,
  updateGigPricing,
  getGigsByService,
  getGigsBySubCategory,
  updateGigGallery,
  createGig,
};
