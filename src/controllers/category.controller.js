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

// Get a category by its path
const getCategoryByPath = catchAsync(async (req, res) => {
  const categoryPath = req.params.path;
  const category = await Category.findOne({ path: categoryPath });

  if (!category) {
    return res.status(404).json({
      status: "fail",
      message: "Category not found",
    });
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
};
