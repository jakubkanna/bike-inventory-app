// brand.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
  origin: { type: String },
});

module.exports = mongoose.model("Brand", BrandSchema);
