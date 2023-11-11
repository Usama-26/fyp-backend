const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: true,
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
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  scope: {
    type: String,
    required: true,
  },
  skills_level: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  pricing_type: {
    type: String,
    enum: ["hourly", "fixed"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
  },
}, { timestamps: true,});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
