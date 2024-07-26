const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      immutable: true,
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
    otp: {
      type: String,
      required: true,
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
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
