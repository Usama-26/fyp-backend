const { default: mongoose, Schema } = require("mongoose");

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: "Provided image is not a url.",
      },
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    reviews: [
      {
        review: {
          type: String,
        },
        rating: {
          type: Number,
        },
        posted_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    top_sellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

subCategorySchema.virtuals({
  slug: {
    get: function () {
      return this.name.toLowerCase.replace(/\s+/g, "-");
    },
  },
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
