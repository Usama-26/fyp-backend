const { default: mongoose, Schema } = require("mongoose");

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name not provided."],
      unique: [true, "Category with this name already exits."],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    SubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// serviceSchema.virtuals({
//   slug: {
//     get: function () {
//       return this.name.toLowerCase.replace(/\s+/g, "-");
//     },
//   },
// });

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;