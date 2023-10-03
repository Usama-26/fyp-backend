const mongoose = require("mongoose");

// Define the service schema
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

// Define the sub-category schema
const subCategorySchema = new mongoose.Schema({
  sub_category: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  services: [serviceSchema],
});

// Define the category schema
const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  header_text: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  sub_categories: [subCategorySchema],
});
categorySchema.virtual("path", () => {});

// Create a model using the category schema
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
