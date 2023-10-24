const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  slogan: String,
  description: {
    type: String,
    maxLength: [5000, "Description should be maximum of 5000 characters"]
  },
  sub_categories: [String],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;