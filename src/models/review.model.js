const { default: mongoose, Schema } = require("mongoose");
const { FreelancerSchema, ClientSchema } = require("./user.model");
const Gig = require("./gig.model");
const Project = require("./project.model");

// Base review schema
const reviewSchema = new Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.post("save", async function (next) {
  try {
    const toClient = await ClientSchema.updateOne(
      { _id: this.to },
      { $push: { reviews: this._id } },
      { new: true }
    );
    const toFreelancer = await FreelancerSchema.updateOne(
      { _id: this.to },
      { $push: { reviews: this._id } },
      { new: true }
    );

    const fromClient = await ClientSchema.updateOne(
      { _id: this.from },
      { $push: { reviews: this._id } },
      { new: true }
    );
    const fromFreelancer = await FreelancerSchema.updateOne(
      { _id: this.from },
      { $push: { reviews: this._id } },
      { new: true }
    );

    const gig = await Gig.updateOne(
      { _id: this.gig },
      { $push: { reviews: this._id } },
      { new: true }
    );

    const project = await Project.updateOne(
      { _id: this.project },
      { $push: { reviews: this._id } },
      { new: true }
    );

    if (!toClient || !toFreelancer) {
      next(new AppError("Review recipient doesn't exist.", 404));
    }
  } catch (error) {}
});

reviewSchema.pre("findOneAndDelete", async function (next) {
  try {
    const toClient = await ClientSchema.updateOne(
      { _id: this.to },
      { $pull: { reviews: this._id } },
      { new: true }
    );
    const toFreelancer = await FreelancerSchema.updateOne(
      { _id: this.to },
      { $pull: { reviews: this._id } },
      { new: true }
    );

    const fromClient = await ClientSchema.updateOne(
      { _id: this.from },
      { $pull: { reviews: this._id } },
      { new: true }
    );
    const fromFreelancer = await FreelancerSchema.updateOne(
      { _id: this.from },
      { $pull: { reviews: this._id } },
      { new: true }
    );

    const gig = await Gig.updateOne(
      { _id: this.gig },
      { $push: { reviews: this._id } },
      { new: true }
    );

    const project = await Project.updateOne(
      { _id: this.project },
      { $push: { reviews: this._id } },
      { new: true }
    );

    if (!toClient || !toFreelancer) {
      next(new AppError("Review recipient doesn't exist.", 404));
    }
  } catch (error) {}
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = {
  Review,
};
