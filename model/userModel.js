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
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
