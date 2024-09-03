const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      // immutable: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    // otp: {
    //   type: String,
    //   required: true,
    // },
    otp: {
      type: String,
      // Use a custom validator to conditionally require OTP based on the role
      validate: {
        validator: function (value) {
          // OTP is required only if the role is not 'councilor'
          if (this.role !== "councilor") {
            return value != null && value.trim() !== "";
          }
          return true; // OTP is not required for councilors
        },
        message: "OTP is required for this role.",
      },
    },
    role: {
      type: String,
      enum: ["user", "franchise", "agent", "councilor", "superAdmin"],
      default: "user",
    },
    assignedCounselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    adminDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    profileImage: {
      type: String,
    },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);

// Pre-save middleware to handle mutable name field
User.pre("save", function (next) {
  if (this.isModified("name")) {
    this.schema.path("name").options.immutable = false; // Temporarily allow mutation
  }
  next();
});

User.post("save", function (doc, next) {
  if (doc.isModified("name")) {
    this.schema.path("name").options.immutable = true; // Restore immutability
  }
  next();
});

module.exports = mongoose.model("User", User);
