// bike.js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BikeSchema = new Schema({
  model: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  specs: {
    type: Schema.Types.ObjectId,
    ref: "Specs",
    required: true,
  },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  summary: { type: String },
});

module.exports = mongoose.model("Bike", BikeSchema);
