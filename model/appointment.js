const mongoose = require("mongoose");
const crypto = require("node:crypto");
const Agents = require("../model/agents");

const generateTicket = () => crypto.randomBytes(3).toString("hex");

const testSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "DiagnosticTest" },
  status: {
    type: String,
    enum: [
      "Pending",
      "In Progress",
      "Interact with Client",
      "Collected Sample",
      "Completed",
      "Closed",
    ],
    default: "Pending",
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "updatedByModel",
  },
  updatedByModel: {
    type: String,
    enum: ["User", "Franchise", "DiagnosticLab", "LabBoy"],
  },
  updatedAt: {
    type: Date,
  },
});

const labSchema = new mongoose.Schema({
  lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
  tests: [testSchema],
});

// const commissionSchema = new mongoose.Schema({
//   superAdminToFranchise: { type: Number, min: 0, max: 100, default: 20 },
//   superAdminToAgent: { type: Number, min: 0, max: 100, default: 20 },
// });

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
    labBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabBoy",
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
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
    commission: {
      superAdminToAgent: {
        type: Number,
        default: function () {
          return this.referral ? this.referral.commissionPercentage : 0;
        },
      },
      superAdminToFranchise: {
        type: Number,
        default: function () {
          return this.franchise ? this.franchise.commissionPercentage : 0;
        },
      },
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Middleware to set franchise based on the agent
appointmentSchema.pre("save", async function (next) {
  try {
    if (this.referral && !this.franchise) {
      const agent = await Agents.findById(this.referral).populate("franchise");
      if (agent && agent.franchise) {
        this.franchise = agent.franchise._id;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
