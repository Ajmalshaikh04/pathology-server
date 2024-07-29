const mongoose = require("mongoose");

const franchiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      // required: true,
    },
    role: { type: String, default: "franchise" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);

const Franchise = mongoose.model("Franchise", franchiseSchema);

module.exports = Franchise;
