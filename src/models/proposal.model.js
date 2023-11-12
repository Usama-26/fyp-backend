const mongoose = require("mongoose");
const Project = require("./project.model");
const { FreelancerSchema } = require("./user.model");
const AppError = require("../utils/appError");
const { Schema } = mongoose;

const proposalSchema = new Schema(
  {
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    freelancer_id: {
      type: Schema.Types.ObjectId,
      ref: "Freelancer",
      required: true,
    },
    bid_amount: { type: Number, required: true },
    delivery_date: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    cover_letter: { type: String, required: true },
  },
  { timestamps: true }
);

proposalSchema.pre("findOneAndDelete", async function (next) {
  try {
    const project = await Project.updateOne(
      { _id: this.project_id },
      { $pull: { proposals: this._id } },
      { new: true }
    );
    const freelancer = await FreelancerSchema.updateOne(
      { _id: this.freelancer_id },
      { $pull: { proposals: this._id } },
      { new: true }
    );

    if (!project || !freelancer) {
      return next(new AppError("Can't update project or user", 404));
    }
  } catch (error) {
    next(error);
  }
});

proposalSchema.post("save", async function (doc, next) {
  try {
    const project = await Project.updateOne(
      { _id: this.project_id },
      { $push: { proposals: this._id } },
      { new: true }
    );
    const freelancer = await FreelancerSchema.updateOne(
      { _id: this.freelancer_id },
      { $push: { proposals: this._id } },
      { new: true }
    );

    if (!freelancer || !project) {
      return next(new AppError("Can't update project or user", 404));
    }
  } catch (error) {
    next(error);
  }
});
const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;
