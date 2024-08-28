const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthProblemSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthProblem", healthProblemSchema);
