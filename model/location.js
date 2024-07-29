const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String },
});

module.exports = mongoose.model("Location", locationSchema);
