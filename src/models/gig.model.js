const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    created_by: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Basic Information
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

    pricingModel: {
      type: String,
      enum: ["fixed price"],
      required: true,
    },
    pricingDetails: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    revisions: {
      type: Number,
      required: true,
    },
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

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
