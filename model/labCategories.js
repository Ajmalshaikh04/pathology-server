const mongoose = require("mongoose");

const LabCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const LabCategories = mongoose.model("LabCategories", LabCategoriesSchema);

module.exports = LabCategories;
