//bikeinstance.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BikeInstanceSchema = new Schema({
  bike: { type: Schema.Types.ObjectId, ref: "Bike", required: true }, // reference to the associated book
  status: {
    type: String,
    enum: ["Available", "Unavailable", "Ask for availability"],
    default: "Available",
    required: true,
  },
});

module.exports = mongoose.model("BikeInstance", BikeInstanceSchema);
