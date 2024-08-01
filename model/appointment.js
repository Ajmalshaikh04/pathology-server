const mongoose = require("mongoose");
const crypto = require("node:crypto");

const generateTicket = () => crypto.randomBytes(3).toString("hex");

const testSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Closed"],
    default: "Pending",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedAt: {
    type: Date,
  },
});

const labSchema = new mongoose.Schema({
  lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
  tests: [testSchema],
});

const commissionSchema = new mongoose.Schema({
  superAdminToFranchise: { type: Number, min: 0, max: 100, default: 20 },
  superAdminToAgent: { type: Number, min: 0, max: 100, default: 20 },
});

const appointmentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    problem: { type: String, required: true },
    problemDescription: { type: String },
    referral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
    labs: labSchema,
    status: {
      type: String,
      enum: ["Pending", "Approve", "Reject"],
      default: "Pending",
    },
    appointmentDate: { type: Date },
    ticket: { type: String, default: generateTicket },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
    },
    createdByModel: {
      type: String,
      enum: ["User", "Agent", "Franchise", "SuperAdmin"],
    },
    commission: {
      type: commissionSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
