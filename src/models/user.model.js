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
    bio: {
      type: String,
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
    industry: {
      type: String,
    },
    languages: [
      {
        name: { type: String },
        proficiency: { type: String },
      },
    ],
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
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    wallet_address: { type: String },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

const userFreelancerSchema = userSchema.clone();
userFreelancerSchema.add({
  gigs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gigs",
    },
  ],
  profile_title: { type: String },
  main_service: { type: String },
  max_gigs: {
    type: Number,
    default: 5,
  },
  level: {
    type: String,
    enum: ["beginner", "one", "two", "expert"],
  },
  hourly_rate: {
    type: Number,
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
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
    },
  ],
});

const userClientSchema = userSchema.clone();
userClientSchema.add({
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
    },
  ],
  client_scope: {
    type: String,
    enum: ["individual", "company"],
    default: "individual",
  },
  company_name: {
    type: String,
  },
  company_website_link: {
    type: String,
  },
  preferred_skills: {
    type: [String],
  },
  max_project_queue: {
    type: Number,
    default: 5,
  },
});

// virtual property for profile completion percentage
userSchema.virtual("profile_completion").get(function () {
  // Define the required fields for each user type
  const requiredFields = {
    freelancer: [
      "firstName",
      "lastName",
      "email",
      "profile_photo",
      "email_verified",
      "address",
      "industry",
      "main_service",
      "profile_title",
      "bio",
      "skills",
      "hourly_rate",
    ],
    client: [
      "firstName",
      "lastName",
      "email",
      "profile_photo",
      "email_verified",
      "bio",
      "address",
      "industry",
      "preferred_skills",
      "client_scope",
    ],
  };

  // Determine the user type based on the presence of certain fields
  const userType = this.skills
    ? "freelancer"
    : this.client_scope
    ? "client"
    : "undefined";

  // If the user type is undefined, return 0% completion
  if (userType === "undefined") {
    return 0;
  }

  // Calculate completion based on the required fields for the user type
  const totalWeight = requiredFields[userType].length * 20; // Assuming each field has a weight of 20
  const filledWeight = requiredFields[userType].reduce((total, field) => {
    if (this[field]) {
      return total + 20; // Adjust weight as needed
    }
    return total;
  }, 0);

  // Calculate the percentage
  const percentage = (filledWeight / totalWeight) * 100;

  return Math.round(percentage);
});

// Make the virtual property appear in the JSON representation of the model
userSchema.set("toJSON", { virtuals: true });

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
