const mongoose = require("mongoose");
const DiagnosticLabSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    isLabLogIn: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "lab",
    },
    testsOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiagnosticTest",
      },
    ],
    handleView: { type: Boolean, default: false },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);

const DiagnosticLab = mongoose.model("DiagnosticLab", DiagnosticLabSchema);

module.exports = DiagnosticLab;
