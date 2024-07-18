// const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema(
//   {
//     type: { type: String, required: true },
//     age: { type: Number, required: true },
//     gender: { type: String, required: true },
//     problem: { type: String, required: true },
//     problemDescription: { type: String },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     labs: [
//       {
//         lab: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Lab",
//           required: true,
//         },
//         tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
//       },
//     ],
//     status: {
//       type: String,
//       enum: ["Pending", "In Progress", "Completed", "Closed"],
//       default: "Pending",
//     },
//     appointmentDate: { type: Date, required: true },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "createdByModel",
//     },
//     createdByModel: {
//       type: String,
//       enum: ["User", "Agent", "Franchise", "SuperAdmin"],
//     },
//   },
//   { timestamps: true }
// );

// const Appointment = mongoose.model("Appointment", appointmentSchema);
// module.exports = Appointment;

//======================================
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
});

const labSchema = new mongoose.Schema({
  lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
  tests: [testSchema],
});

const appointmentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    problem: { type: String, required: true },
    problemDescription: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    labs: [labSchema],
    status: {
      type: String,
      enum: ["Pending", "Approve", "Reject"],
      default: "Pending",
    },
    appointmentDate: { type: Date, required: true },
    ticket: { type: String, default: generateTicket },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
    },
    createdByModel: {
      type: String,
      enum: ["User", "Agent", "Franchise", "SuperAdmin"],
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
