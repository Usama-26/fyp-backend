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
          width: { type: Number },
          height: { type: Number },
          format: { type: String },
        },
      ],
    },
    delivery_days: { type: Number, default: 1 },
    avg_rating: { type: Number, default: 0.0 },
    revisions: { type: Number, default: 1 },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    price: { type: Number, default: 10 },
    fast_delivery: {
      enabled: { type: Boolean, default: false },
      delivery_days: { type: Number, default: 1 },
      extra_price: { type: Number, default: 10 },
    },
    status: { type: String, enum: ["active", "paused"], default: "paused" },
    is_completed: { type: Boolean, default: false },
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
