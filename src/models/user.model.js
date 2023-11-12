const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is not provided."],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is not provided."],
    },
    // username: {
    //   type: String,
    //   unique: true,
    //   required: [true, "A username is required to create a user."],
    //   minLength: [8, "A username should be minimum of 8 characters"],
    //   maxLength: [24, "A username should be maximum of 24 characters"],
    //   validate: {
    //     validator: function (val) {
    //       return /^[a-z0-9_]{8,24}$/.test(val);
    //     },
    //     message:
    //       "A username should contain only lowercase letters, numbers and underscores.",
    //   },
    // },
    email: {
      type: String,
      unique: true,
      required: [true, "Provide an email address to create a user profile."],
      validate: {
        validator: validator.isEmail,
        message: "Entered email is invalid.",
      },
    },
    email_verified: { type: Boolean, default: false },
    profile_photo: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: "Invalid Profile Photo URL.",
      },
    },
    password: {
      type: String,
      minLength: [8, "The password should be at least 8 characters long"],
      maxLength: [24, "The password should be utmost 24 characters long"],
    },
    with_google: {
      type: Boolean,
      default: false,
    },
    user_type: {
      type: String,
      enum: ["freelancer", "client"],
      required: true,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    online_status: {
      type: String,
      enum: ["online", "offline", "leave"],
      default: "online",
    },
    is_profile_completed: {
      type: Boolean,
    },
    payment_method: {
      wallet_address: {
        type: String,
        trim: true,
      },
      wallet_name: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const userFreelancerSchema = userSchema.clone();
userFreelancerSchema.add({
  gigs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gigs",
    },
  ],
  max_gigs: {
    type: Number,
    default: 5,
  },
  level: {
    type: String,
    enum: ["beginner", "one", "two", "expert"],
  },
  proposals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
    },
  ],
  skills: {
    type: [String],
  },
});

const userClientSchema = userSchema.clone();
userClientSchema.add({
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
    },
  ],
  max_project_queue: {
    type: Number,
    default: 5,
  },
  payment_verified: {
    type: Boolean,
  },
});

userSchema.pre(["save"], async function (next) {
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?!.*\s).+$/;
  if (this.isModified("password")) {
    if (!passwordPattern.test(this.password)) {
      return next(
        new Error(
          "Password must contain at least 1 character and 1 number without whitespaces."
        )
      );
    }

    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
  next();
});

userSchema.methods.comparePassword = async function (unHashedPassword) {
  return bcrypt.compare(unHashedPassword, this.password);
};

const User = mongoose.model("User", userSchema);
const FreelancerSchema = User.discriminator(
  "FreelancerSchema",
  userFreelancerSchema
);
const ClientSchema = User.discriminator("ClientSchema", userClientSchema);

module.exports = {
  User,
  FreelancerSchema,
  ClientSchema,
};
