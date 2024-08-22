const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const agentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  role: { type: String, default: "agent" },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Franchise",
    required: true,
  },
  commissionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 20, // Default commission for the agent
  },
  lastLogin: { type: Date },
  lastLogout: { type: Date },
});

module.exports = mongoose.model("Agent", agentSchema);
