const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  type: { type: String, require: true },
  age: { type: Number, require: true },
  gender: { type: String, require: true },
  problem: { type: String, require: true },
  problemdistription: { type: String },
});

const AppointMentModel = mongoose.model("appointment", appointmentSchema);
module.exports = AppointMentModel;
