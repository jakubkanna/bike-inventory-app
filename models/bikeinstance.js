const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BikeInstanceSchema = new Schema({
  bike: { type: Schema.Types.ObjectId, ref: "Bike", required: true }, // reference to the associated book
  status: {
    type: String,
    required: true,
    enum: ["Available", "Unavailable", "On request"],
    default: "Available",
  },
});

module.exports = mongoose.model("BookInstance", BikeInstanceSchema);
