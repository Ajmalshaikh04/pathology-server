// model/salesRange.js

const mongoose = require("mongoose");

const salesRangeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  franchiseCommissionPercentage: { type: Number, required: true },
  agentCommissionPercentage: { type: Number, required: true },
});

module.exports = mongoose.model("SalesRange", salesRangeSchema);
