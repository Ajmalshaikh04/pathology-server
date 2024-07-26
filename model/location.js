const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String, required: true },
});

module.exports = mongoose.model("Location", locationSchema);
