const { default: mongoose, Schema } = require("mongoose");
const slugify = require("slugify");
const Category = require("./category.model");
const AppError = require("../utils/appError");
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    punchline: {
      type: String,
    },
    path: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    tags: { type: [String] },
    reviews: [
      {
        review: {
          type: String,
        },
        rating: {
          type: Number,
        },
        posted_by: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    top_sellers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

subCategorySchema.pre("save", function (next) {
  // Generate the 'path' property using slugify
  this.path = slugify(this.name.toLowerCase(), {
    replacement: "-",
    lower: true,
  });
  next();
});

subCategorySchema.pre(["findOneAndDelete"], async function (next) {
  try {
    const category = await Category.updateOne(
      { _id: this.category },
      { $pull: { sub_categories: this._id } },
      { new: true }
    );

    if (!category) {
      next(
        new AppError(
          "Invalid Category: This Category might have been moved or doesn't exist",
          404
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

subCategorySchema.post("save", async function (next) {
  try {
    const category = await Category.updateOne(
      { _id: this.category },
      { $push: { sub_categories: this._id } },
      { new: true }
    );

    if (!category) {
      next(
        new AppError(
          "Invalid Category: This Category might have been moved or doesn't exist",
          404
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
