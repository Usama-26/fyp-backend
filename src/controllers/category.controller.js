const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync"); // Replace with the actual path

const Category = require("./../models/category.model"); // Import your Category model here

// Create a new category
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get all categories
const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find();

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
