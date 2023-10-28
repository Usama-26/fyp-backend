const { default: mongoose, Schema } = require("mongoose");
const validator = require("validator");
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name not provided."],
      unique: [true, "Category with this name already exits."],
      trim: true,
    },
    punchline: {
      type: String,
      required: [true, "Punchline not provided"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: "Provided image is not a url.",
      },
    },
    featured_services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    popular_services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    sub_categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
  },
  { timestamps: true }
);

categorySchema.virtual("slug").get(function () {
  return this.name.toLowerCase.replace(/\s+/g, "-");
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
