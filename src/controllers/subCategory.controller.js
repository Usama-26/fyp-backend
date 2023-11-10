const Category = require("../models/category.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const SubCategory = require("./../models/subCategory.model");

const getAllSubCategories = catchAsync(async (req, res, next) => {
  const subCategories = await SubCategory.find()
    .select("path name")
    .populate({ path: "services", select: "path name" });

  res.status(200).json({
    status: "success",
    length: subCategories.length,
    data: subCategories,
  });
});

const createSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.create(req.body);

  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});

const getSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id).populate({
    path: "services",
    select: "path name",
  });

  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});

const deleteSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
  });
});

const updateSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndUpdate(req.params.id);

  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});

const getSubCategoryByPath = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findOne({
    path: req.params.path,
  }).populate({ path: "services", select: "path name" });

  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});

const getByCategory = catchAsync(async (req, res, next) => {
  const subCategories = await SubCategory.find({
    category: req.params.categoryId,
  }).select("name");

  if (!subCategories) {
    return next(new AppError("No Services Found", 400));
  }

  res.status(200).json({
    status: "success",
    data: subCategories,
  });
});
module.exports = {
  getAllSubCategories,
  createSubCategory,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategoryByPath,
  getByCategory,
};
