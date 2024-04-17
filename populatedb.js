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

async function bikeInstanceCreate(bike, size = "M", status) {
  const bikeInstance = new BikeInstance({ bike, size, status });
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
    categoryCreate("Hybrid Bikes", "Combination of road and mountain bikes"),
    categoryCreate("Road Bikes", "Bikes designed for use on paved roads"),
  ]);
}

async function createSpecs() {
  console.log("Adding specs");
  await Promise.all([
    //Trek Top Fuel 9.9
    specsCreate({
      frame: {
        type: "OCLV Mountain Carbon",
        sizes: ["XS", "M", "L", "XL", "XXL"],
      },
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
    // Add specs for Trek Marlin 6 Gen 3
    specsCreate({
      frame: {
        type: "Alpha Silver Aluminum",
        sizes: ["XS", "M", "L", "XL", "XXL"],
      },
      suspension: {
        fork: "RockShox Judy, coil spring, preload, TurnKey lockout, 42mm offset for 27.5'' wheel, 100mm QR",
        maxCompatibleForkTravel: "120mm (531mm axle-to-crown)",
      },
      wheels: {
        wheelFront:
          "Bontrager Kovee Comp 23, Tubeless Ready, 6-bolt, Boost110, 15mm thru axle, 29''",
        wheelRear:
          "Bontrager Kovee Comp 23, Tubeless Ready, Shimano Microspline freehub, Rapid Drive 108, Boost148, 29''",
      },
      drivetrain: {
        shifter: "Shimano U6000, 10 speed",
        rearDerailleur: "Shimano CUES U6000 GS",
        crank:
          "FSA Alpha Drive, 30T, 160mm/170mm/175mm length (depending on size)",
        bottomBracket: "FSA, 73mm, threaded cartridge, 122.5mm spindle",
        cassette: "Shimano Eagle XG-1275, 10-52, 12 speed",
        chain: "Shimano GX Eagle, 12 speed",
        pedal: "VP-536 nylon platform",
        maxChainringSize: "1x: 34T",
      },
      components: {
        saddle: "Bontrager Verse Short, stainless steel rails",
        seatpost:
          "Bontrager alloy, 31.6mm, 12mm offset, 300mm/330mm/400mm length (depending on size)",
        handlebar:
          "Bontrager alloy, 31.8mm, 5mm rise/15mm rise, 690mm/720mm/750mm width (depending on size)",
        grips: "ESI Chunky",
        stem: "Bontrager Comp, 31.8mm, 7 degree/Blendr compatible, 35mm/50mm/60mm/70mm length (depending on size)",
        headset: "Semi-integrated, 1-1/8''",
        brake: "SRAM Level TLM hydraulic disc",
        brakeRotor:
          "SRAM CenterLine, 6-bolt, round-edge, 160mm/180mm (depending on size)",
        rotorSize:
          "Max brake rotor sizes - Frame: 160mm (XXS: 160mm), Fork: see fork manufacturer",
      },
      weight: {
        bikeWeight: "M - 14.50 kg / 31.97 lbs (with tubes)",
        weightLimit: "300 pounds (136 kg)",
      },
    }),
    // Add specs for Trek Supercaliber 9.8 GX AXS Gen 1
    specsCreate({
      frame: {
        type: "OCLV Mountain Carbon",
        sizes: ["S", "M", "M / L", "L", "XL"],
      },
      suspension: {
        fork: "RockShox SID SL, DebonAir spring, Rush RL damper, 44mm offset, Boost110, 15mm Maxle Stealth, 100mm travel",
        shock:
          "Trek IsoStrut, Fox Performance shock, air spring, DPS 2-position remote damper, 235mm x 32.5mm",
        suspensionLever: "Fox 2-position dual lockout lever",
        maxCompatibleForkTravel: "120mm (531mm axle-to-crown)",
      },
      wheels: {
        wheelFront:
          "Bontrager Kovee Pro 30 carbon, Tubeless Ready, 6-bolt, Boost110, 15mm thru axle, 29''",
        wheelRear:
          "Bontrager Kovee Pro 30, OCLV Mountain Carbon, Tubeless Ready, Rapid Drive 108, XD Driver, 6-bolt, Boost148, 12mm thru axle, 29''",
      },
      eSystem: {
        battery: "SRAM eTap battery pack (with charger)",
      },
      drivetrain: {
        shifter: "SRAM GX Eagle AXS, 12 speed",
        rearDerailleur: "SRAM GX Eagle AXS",
        crank:
          "SRAM GX Eagle Carbon, DUB, 32T alloy ring, 52mm chainline, 170mm/175mm length (depending on size)",
        bottomBracket: "SRAM DUB, 92mm, PressFit",
        cassette: "SRAM Eagle XG-1275, 10-52, 12 speed",
        chain: "SRAM GX Eagle, 12 speed",
        maxChainringSize: "1x: 36T",
      },
      components: {
        saddle: "Bontrager Verse Elite, austenite rails, 145mm width",
        seatpost:
          "Bontrager Pro, OCLV Carbon, 31.6mm, 0mm offset, 330mm/400mm length (depending on size)",
        handlebarStem:
          "Bontrager RSL Integrated handlebar/stem, OCLV Carbon, 0mm handlebar rise, 750mm width, -13 degree stem rise, 70mm/80mm/90mm length (depending on size)",
        grips: "ESI Chunky",
        headset:
          "Knock Block Integrated, 62-degree radius, cartridge bearing, 1-1/8'' top, 1.5'' bottom",
        brake: "SRAM Level TLM hydraulic disc",
        brakeRotor:
          "SRAM CenterLine, 6-bolt, round-edge, 160mm (S, M, M/L, L, XL), 180mm (S, M, M/L, L, XL)",
        rotorSize:
          "Max brake rotor sizes - Frame: 160mm, Fork: see fork manufacturer",
      },
      weight: {
        weight: "M - 10.65 kg / 23.48 lbs",
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

  const trekBrand = brands.find((brand) => brand.name === "Trek");
  const mtbCategory = categories.find(
    (category) => category.name === "Mountain Bikes"
  );
  const topFuelSpecs = specs.find(
    (spec) => spec.frame.type === "OCLV Mountain Carbon"
  );
  const marlinSpecs = specs.find(
    (spec) => spec.frame.type === "Alpha Silver Aluminum"
  );
  const supercaliberSpecs = specs.find(
    (spec) => spec.frame.type === "OCLV Mountain Carbon"
  );

  await Promise.all([
    bikeCreate(
      "Trek Top Fuel 9.9",
      trekBrand,
      topFuelSpecs,
      mtbCategory,
      6999,
      "Full suspension carbon mountain bike"
    ),
    bikeCreate(
      "Trek Marlin 6 Gen 3",
      trekBrand,
      marlinSpecs,
      mtbCategory,
      750,
      "Mountain bike"
    ),
    bikeCreate(
      "Trek Supercaliber 9.8 GX AXS Gen 1",
      trekBrand,
      supercaliberSpecs,
      mtbCategory,
      6349.99,
      "Mountain bike"
    ),
  ]);
}

async function createBikeInstances() {
  console.log("Adding bike instances");
  const bikes = await Bike.find();
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const statuses = ["Available"];

  await Promise.all(
    bikes.map(async (bike) => {
      await Promise.all(
        sizes.map(async (size) => {
          await Promise.all(
            statuses.map(async (status) => {
              await bikeInstanceCreate(bike, size, status);
            })
          );
        })
      );
    })
  );
}
