const Category = require("../models/category.model");
const catchAsync = require("../utils/catchAsync");

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find()
    .select("path name")
    .populate({
      path: "sub_categories",
      populate: { path: "services" },
    });
  res.status(200).json({
    status: "success",
    length: categories.length,
    data: categories,
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(200).json({
    status: "success",
    data: category,
  });
});

const getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate({
    path: "sub_categories",
    select: "path name",
  });

  res.status(200).json({
    status: "success",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: category,
  });
});

const getCategoryByPath = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const category = await Category.findOne({ path: req.params.path }).populate({
    path: "sub_categories",
    select: "path name",
    populate: {
      path: "services",
      select: "path name",
    },
  });

  res.status(200).json({
    status: "success",
    data: category,
  });
});

module.exports = {
  getAllCategories,
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  getCategoryByPath,
};
