const mongoose = require("mongoose");
const { ClientSchema } = require("./user.model");

const projectSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      required: true,
      enum: ["awarded", "listed"],
      default: "listed",
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
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    freelancer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
    },
    proposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proposal",
      },
    ],
  },
  { timestamps: true }
);

projectSchema.pre("findOneAndDelete", async function (next) {
  try {
    const client = await ClientSchema.updateOne(
      { _id: this.userId },
      { $pull: { projects: this._id } },
      { new: true }
    );

    if (!client) {
      next(new AppError("Invalid User: User not updated.", 404));
    }
  } catch (error) {
    next(error);
  }
});

projectSchema.post("save", async function (doc, next) {
  try {
    const client = await ClientSchema.updateOne(
      { _id: this.userId },
      { $push: { projects: this._id } },
      { new: true }
    );

    if (!client) {
      next(new AppError("Can't find user: User not updated", 404));
    }
  } catch (error) {
    next(error);
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
