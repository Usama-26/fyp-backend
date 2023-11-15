const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const Schema = mongoose.Schema;

const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name not provided."],
      unique: [true, "Skill with this name already exists."],
      trim: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    popularity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);

skillSchema.pre("save", function (next) {
  this.slug = slugify(this.name.toLowerCase(), {
    replacement: "-",
    lower: true,
  });
  next();
});

module.exports = Skill;
