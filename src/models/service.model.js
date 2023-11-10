const { default: mongoose, Schema } = require("mongoose");
const Category = require("./category.model");
const SubCategory = require("./subCategory.model");
const slugify = require("slugify");

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name not provided."],
      unique: [true, "Category with this name already exits."],
      trim: true,
    },
    path: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sub_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

serviceSchema.pre("save", function (next) {
  // Generate the 'path' property using slugify
  this.path = slugify(this.name.toLowerCase(), {
    replacement: "-",
    lower: true,
  });
  next();
});

serviceSchema.pre("findOneAndDelete", async function (next) {
  try {
    const category = await SubCategory.updateOne(
      { _id: this.sub_category },
      { $pull: { services: this._id } },
      { new: true }
    );

    if (!category) {
      next(
        new AppError(
          "Invalid Category: This Sub Category might have been moved or doesn't exist",
          404
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

serviceSchema.post("save", async function (next) {
  try {
    const subCategory = await SubCategory.updateOne(
      { _id: this.sub_category },
      { $push: { services: this._id } },
      { new: true }
    );

    if (!subCategory) {
      next(
        new AppError(
          "Invalid Category: This Sub Category might have been moved or doesn't exist",
          404
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;