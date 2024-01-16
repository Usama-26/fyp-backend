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
    status: {
      type: String,
      required: true,
      enum: ["assigned", "listed", "completed"],
      default: "listed",
    },
    tags: {
      type: [String],
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
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
    attachments: {
      type: [
        {
          public_id: { type: String },
          filename: { type: String },
          secure_url: { type: String },
        },
      ],
    },
    deliverables: {
      type: [
        {
          public_id: { type: String },
          filename: { type: String },
          secure_url: { type: String },
        },
      ],
    },
    proposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proposal",
      },
    ],
    transactions: {
      escrow_transaction_id: { type: String },
      released_transaction_id: { type: String },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

projectSchema.pre("findOneAndDelete", async function (next) {
  try {
    const client = await ClientSchema.updateOne(
      { _id: this.created_by },
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
      { _id: this.created_by },
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
