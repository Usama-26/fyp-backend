const mongoose = require("mongoose");
const { FreelancerSchema } = require("./user.model");
const AppError = require("../utils/appError");

const gigSchema = new mongoose.Schema(
  {
    created_by: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    sub_category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Service",
    },
    tags: [{ type: String, required: true }],
    gallery: {
      type: [
        {
          public_id: { type: String },
          filename: { type: String },
          secure_url: { type: String },
          size: { type: String },
          format: { type: String },
        },
      ],
    },
    delivery_days: [{ type: Number }],
    avg_reviews: { type: Number },
    revisions: { type: Number },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    price: { type: Number },
    fast_delivery: {
      delivery_days: { type: Number },
      extra_price: { type: Number },
    },
    status: { type: String, enum: ["active", "paused"], default: "active" },
    is_completed: { type: String },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

gigSchema.pre("save", async function (next) {
  try {
    const freelancer = await FreelancerSchema.findByIdAndUpdate(
      { _id: this.created_by },
      { $push: { gigs: this._id } },
      { new: true }
    );
    if (!freelancer) {
      return next(new AppError("Freelancer Not Found"), 404);
    }
  } catch (error) {
    next(error);
  }
});

gigSchema.pre("findOneAndDelete", async function (next) {
  try {
    const freelancer = await FreelancerSchema.findByIdAndUpdate(
      { _id: this.created_by },
      { $pull: { gigs: this._id } },
      { new: true }
    );
    if (!freelancer) {
      return next(new AppError("Freelancer Not Found"), 404);
    }
  } catch (error) {
    next(error);
  }
});

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
