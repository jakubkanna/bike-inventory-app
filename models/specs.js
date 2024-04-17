//specs.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SpecsSchema = new Schema({
  frame: {
    type: {
      type: String,
      required: true,
    },
    sizes: {
      type: [
        "XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "S/M",
        "M/L",
        "L/XL",
        "XL/XXL",
      ],
      required: true,
    },
  },
  suspension: {
    fork: {
      type: String,
    },
    suspensionLever: {
      type: String,
    },
    maxCompatibleForkTravel: {
      type: String,
    },
  },
  wheels: {
    wheelFront: {
      type: String,
    },
    wheelRear: {
      type: String,
    },
  },
  drivetrain: {
    shifter: {
      type: String,
    },
    rearDerailleur: {
      type: String,
    },
    crank: {
      type: String,
    },
    bottomBracket: {
      type: String,
    },
    cassette: {
      type: String,
    },
    chain: {
      type: String,
    },
    maxChainringSize: {
      type: String,
    },
  },
  components: {
    saddle: {
      type: String,
    },
    seatpost: {
      type: String,
    },
    handlebar: {
      type: String,
    },
    grips: {
      type: String,
    },
    stem: {
      type: String,
    },
    headset: {
      type: String,
    },
    brake: {
      type: String,
    },
    brakeRotor: {
      type: String,
    },
    rotorSize: {
      type: String,
    },
  },
  weight: {
    bikeWeight: {
      type: String,
    },
    weightLimit: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Specs", SpecsSchema);
