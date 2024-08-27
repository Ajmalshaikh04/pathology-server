const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labBoySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    role: { type: String, default: "labBoy" },
    assignedLab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiagnosticLab",
      required: true,
    },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabBoy", labBoySchema);
