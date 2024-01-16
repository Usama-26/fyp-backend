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

reviewSchema.post("save", async function () {
  try {
    // Calculate the average rating for the user receiving the review (to)
    const client = await ClientSchema.findById(this.to);
    const freelancer = await FreelancerSchema.findById(this.to);
    const toUser = client || freelancer;

    if (toUser) {
      const reviews = await Review.find({ to: this.to });
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      toUser.avg_rating = totalRating / reviews.length || 0;
      await toUser.save();
    }

    // If the review is for a gig, you may want to update the average rating for the gig as well
    // Add similar logic for other related models if needed
  } catch (error) {
    console.error("Error updating avg_rating:", error);
  }
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
