const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync"); // Replace with the actual path
const Category = require("./../models/category.model"); // Import your Category model here

const createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  if (!category) {
    return next(new AppError("Category Not Created", 400));
  }

  res.status(201).json({
    status: "success",
    data: category,
  });
});

//  TODO
// Create a method that sends all categories, along with sub-categories and services virtually populated
const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().populate({
    path: 'sub_categories',
    populate: {
      path: 'services',
    },
  });

  res.status(200).json({
    status: "success",
    length: categories.length,
    data: { categories },
  });
});

const getFilteredCategories = catchAsync(async (req, res) => {
  const selectProp =
    req.query.allProps.toLowerCase() === "true" ? "" : "name path";

  const categories = await Category.find().select(selectProp);

  res.status(200).json({
    status: "success",
    length: categories.length,
    data: { categories },
  });
});

// Get a category by its path
const getCategoryByPath = catchAsync(async (req, res, next) => {
  const categoryPath = req.params.path;
  const category = await Category.findOne({ path: categoryPath });

  if (!category) {
    return next(new AppError("No tour found with this id", 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryByPath,
  getFilteredCategories,
};