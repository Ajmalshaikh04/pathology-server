const mongoose = require("mongoose");

const DiagnosticTestSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  labCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LabCategories",
  },
});

const DiagnosticTest = mongoose.model("DiagnosticTest", DiagnosticTestSchema);

module.exports = DiagnosticTest;
