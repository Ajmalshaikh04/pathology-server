const mongoose = require("mongoose");
const DiagnosticLabSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
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
  testsOffered: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiagnosticTest",
    },
  ],
});

const DiagnosticLab = mongoose.model("DiagnosticLab", DiagnosticLabSchema);

module.exports = DiagnosticLab;
