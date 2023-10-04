const Category = require('./../models/category.model'); // Import your Category model here

// Create a new category
async function createCategory(req, res) {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      status: 'success',
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Get all categories
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();

    res.status(200).json({
      status: 'success',
      length: categories.length,
      data: { categories },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// Get a category by its path
async function getCategoryByPath(req, res) {
  try {
    const categoryPath = req.params.path;
    const category = await Category.findOne({ path: categoryPath });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryByPath,
};
