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

    // Pricing
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

    attachments: [String], // Store file paths or references here

    // Availability
    availability: {
      online: {
        type: Boolean,
        default: false,
      },
      onLocation: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
