#! /usr/bin/env node

console.log(
  'This script populates some test bikes, brands, categories, and bike instances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

const userArgs = process.argv.slice(2);

const Bike = require("./models/bike");
const Brand = require("./models/brand");
const Category = require("./models/category");
const BikeInstance = require("./models/bikeinstance");
const Specs = require("./models/specs");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createBrands();
  await createCategories();
  await createSpecs();
  await createBikes();
  await createBikeInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function brandCreate(name, origin) {
  const brand = new Brand({ name, origin });
  await brand.save();
  console.log(`Added brand: ${name}`);
  return brand;
}

async function categoryCreate(name, description) {
  const category = new Category({ name, description });
  await category.save();
  console.log(`Added category: ${name}`);
  return category;
}

async function specsCreate(specsData) {
  const specs = new Specs(specsData);
  await specs.save();
  console.log(`Added specs for bike: ${specsData.frame.type}`);
  return specs;
}

async function bikeCreate(model, brand, specs, category, price, summary) {
  const bike = new Bike({
    model,
    brand,
    specs,
    category,
    price,
    summary,
  });
  await bike.save();
  console.log(`Added bike: ${model}`);
  return bike;
}

async function bikeInstanceCreate(bike, status) {
  const bikeInstance = new BikeInstance({ bike, status });
  await bikeInstance.save();
  console.log(`Added bike instance for: ${bike.model}`);
  return bikeInstance;
}

async function createBrands() {
  console.log("Adding brands");
  await Promise.all([
    brandCreate("Trek", "United States"),
    brandCreate("Bontrager", "United States"),
    brandCreate("Shimano", "Japan"),
    brandCreate("RockShox", "United States"),
  ]);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Mountain Bikes", "Bikes suitable for off-road cycling"),
    categoryCreate("Road Bikes", "Bikes designed for use on paved roads"),
    categoryCreate("Hybrid Bikes", "Combination of road and mountain bikes"),
  ]);
}

async function createSpecs() {
  console.log("Adding specs");
  await Promise.all([
    specsCreate({
      frame: { type: "OCLV Mountain Carbon", size: "M" },
      suspension: {
        fork: "RockShox Recon Gold RL",
        suspensionLever: "RockShox OneLoc Sprint",
        maxCompatibleForkTravel: "120mm (533mm axle-to-crown)",
      },
      wheels: {
        wheelFront:
          "Bontrager Kovee Comp 23, Tubeless Ready, 6-bolt, Boost110, 15mm thru axle, 29''",
        wheelRear:
          "Bontrager Kovee Comp 23, Tubeless Ready, Shimano Microspline freehub, Rapid Drive 108, Boost148, 29''",
      },
      drivetrain: {
        shifter: "Shimano SLX M7100, 12 speed",
        rearDerailleur: "Shimano XT M8100, long cage",
        crank:
          "Shimano MT611, 30T steel ring, alloy spider, 52mm chainline, 175mm length",
        bottomBracket: "Shimano MT500, 92mm, PressFit",
        cassette: "Shimano SLX M7100, 10-51T, 12 speed",
        chain: "Shimano Deore M6100, 12 speed",
        maxChainringSize: "1x: 36T, min 30T",
      },
      components: {
        saddle: "Bontrager Arvada, hollow chromoly rails, 138mm width",
        seatpost:
          "Bontrager Comp, 6061 alloy, 31.6mm, 8mm offset, 400mm length",
        handlebar:
          "Bontrager Rhythm Comp, alloy, 31.8mm, 15mm rise, 750mm width",
        grips: "Bontrager XR Trail Elite, alloy lock-on",
        stem: "Bontrager Elite, 35mm, 0 degree, 90mm length",
        headset:
          "Knock Block Integrated, 62-degree radius, cartridge bearing, 1-1/8'' top, 1.5'' bottom",
        brake: "Shimano hydraulic disc, MT4100 lever, MT410 caliper",
        brakeRotor: "Shimano RT56, 6-bolt, 180mm",
        rotorSize:
          "Max brake rotor sizes - Frame: 180mm, Fork: see fork manufacturer",
      },
      weight: {
        bikeWeight: "M - 11.43 kg / 25.21 lbs",
        weightLimit: "300 pounds (136 kg)",
      },
    }),
  ]);
}

async function createBikes() {
  console.log("Adding bikes");
  const brands = await Brand.find();
  const categories = await Category.find();
  const specs = await Specs.find();
  await Promise.all([
    bikeCreate(
      "Trek Top Fuel 9.9",
      brands[0],
      specs[0],
      categories[0],
      6999,
      "Full suspension carbon mountain bike"
    ),
  ]);
}

async function createBikeInstances() {
  console.log("Adding bike instances");
  const bikes = await Bike.find();
  await Promise.all([
    bikeInstanceCreate(bikes[0], "Available"),
    bikeInstanceCreate(bikes[0], "Unavailable"),
    bikeInstanceCreate(bikes[0], "Ask for availability"),
  ]);
}
