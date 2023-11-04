//TODO
// Get All SubCategories
// Delete SubCategory
// Find One SubCategory By Id
// Find One SubCategory By path
// Virtually populate all the services

const SubCategory = require('./../models/subCategory.model');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Get All SubCategories
const getAllSubCategories = catchAsync(async (req, res) => {
  const subCategories = await SubCategory.find();
  res.status(200).json({
    status: 'success',
    length: subCategories.length,
    data: { subCategories },
  });
});

// Delete SubCategory
const deleteSubCategory = catchAsync(async (req, res, next) => {
  const subCategoryId = req.params.id;
  const subCategory = await SubCategory.findByIdAndDelete(subCategoryId);

  if (!subCategory) {
    return next(new AppError('SubCategory not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Find One SubCategory By Id
const getSubCategoryById = catchAsync(async (req, res, next) => {
  const subCategoryId = req.params.id;
  const subCategory = await SubCategory.findById(subCategoryId);

  if (!subCategory) {
    return next(new AppError('SubCategory not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: subCategory,
  });
});

// Find One SubCategory By path
const getSubCategoryByPath = catchAsync(async (req, res, next) => {
  const subCategoryPath = req.params.path;
  const subCategory = await SubCategory.findOne({ path: subCategoryPath });

  if (!subCategory) {
    return next(new AppError('SubCategory not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: subCategory,
  });
});

// Virtually populate all the services
const populateServices = catchAsync(async (req, res) => {
  const subCategories = await SubCategory.find().populate('services');

  res.status(200).json({
    status: 'success',
    length: subCategories.length,
    data: { subCategories },
  });
});

module.exports = {
  getAllSubCategories,
  deleteSubCategory,
  getSubCategoryById,
  getSubCategoryByPath,
  populateServices,
};
