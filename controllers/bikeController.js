const Bike = require("../models/bike");
const Brand = require("../models/brand");
const Category = require("../models/category");
const BikeInstance = require("../models/bikeinstance");
const Specs = require("../models/specs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of bikes, bike instances, brands and category counts (in parallel)
  const [numBikes, numAvailableBikeInstances, numBrands, numCategory] =
    await Promise.all([
      Bike.countDocuments({}).exec(),
      BikeInstance.countDocuments({ status: "Available" }).exec(),
      Brand.countDocuments({}).exec(),
      Category.countDocuments({}).exec(),
    ]);

  res.render("index", {
    title: "Bike Inventory Home",
    bike_instance_available_count: numAvailableBikeInstances,
    brand_count: numBrands,
    category_count: numCategory,
  });
});

// Display list of all bikes.
exports.bike_list = asyncHandler(async (req, res, next) => {
  const allBikes = await Bike.find({}, "model price").sort({ model: 1 }).exec();

  res.render("bike_list", { title: "Bike List", bike_list: allBikes });
});

// Display detail page for a specific bike.
exports.bike_detail = asyncHandler(async (req, res, next) => {
  const [bike, bikeAvailableInstances] = await Promise.all([
    Bike.findById(req.params.id)
      .populate("brand")
      .populate("category")
      .populate("specs")
      .exec(),
    BikeInstance.find({ bike: req.params.id, status: "Available" }).exec(),
  ]);

  if (bike === null) {
    // No results.
    const err = new Error("Bike not found");
    err.status = 404;
    return next(err);
  }

  // Count occurrences of each size
  const sizeCounts = {};
  bikeAvailableInstances.forEach((instance) => {
    sizeCounts[instance.size] = (sizeCounts[instance.size] || 0) + 1;
  });

  res.render("bike_detail", {
    title: "Bike Details",
    bike: bike,
    size_counts: sizeCounts,
  });
});

// Display bike create form on GET.
exports.bike_create_get = asyncHandler(async (req, res, next) => {
  const [brands, categories] = await Promise.all([
    Brand.find().exec(),
    Category.find().exec(),
  ]);

  res.render("bike_form", {
    title: "Create Bike",
    brand_list: brands,
    category_list: categories,
  });
});

// POST method for creating a new bike
exports.bike_create_post = [
  // Validate and sanitize fields for Specs
  body("frameType").notEmpty().withMessage("Frame type is required"),
  body("frameSizes").notEmpty().withMessage("Frame sizes are required"),

  // Validate and sanitize fields for Bike
  body("model").notEmpty().escape().withMessage("Model is required"),
  body("brand").notEmpty().escape().withMessage("Brand is required"),
  body("category").notEmpty().escape().withMessage("Category is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .escape()
    .withMessage("Price must be a number"),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a new Specs document

    const specs = new Specs({
      frame: {
        type: req.body.frameType,
        sizes: req.body.frameSizes,
      },
      suspension: {
        fork: req.body.fork,
        suspensionLever: req.body.suspensionLever,
        maxCompatibleForkTravel: req.body.maxCompatibleForkTravel,
      },
      wheels: {
        wheelFront: req.body.wheelFront,
        wheelRear: req.body.wheelRear,
      },
      drivetrain: {
        shifter: req.body.shifter,
        rearDerailleur: req.body.rearDerailleur,
        crank: req.body.crank,
        bottomBracket: req.body.bottomBracket,
        cassette: req.body.cassette,
        chain: req.body.chain,
        maxChainringSize: req.body.maxChainringSize,
      },
      components: {
        saddle: req.body.saddle,
        seatpost: req.body.seatpost,
        handlebar: req.body.handlebar,
        grips: req.body.grips,
        stem: req.body.stem,
        headset: req.body.headset,
        brake: req.body.brake,
        brakeRotor: req.body.brakeRotor,
        rotorSize: req.body.rotorSize,
      },
      weight: {
        bikeWeight: req.body.bikeWeight,
        weightLimit: req.body.weightLimit,
      },
    });

    // Create a new Bike document
    const bike = new Bike({
      model: req.body.model,
      brand: req.body.brand,
      category: req.body.category,
      specs: specs,
      price: req.body.price,
      summary: req.body.summary,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      return res.render("bike_form", {
        title: "Create Bike",
        bike: req.body,
        brand_list: await Brand.find().exec(),
        category_list: await Category.find().exec(),
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Create a new Specs document

      // Save the Specs document
      await specs.save();

      // Save the Bike document
      await bike.save();

      // Redirect after successful creation
      return res.redirect("/catalog/bike/create");
    }
  }),
];

// Display bike delete form on GET.
exports.bike_delete_get = asyncHandler(async (req, res, next) => {
  // get bike and it's instances
  const [bike, allBikeInstances] = await Promise.all([
    Bike.findById(req.params.id).exec(),
    BikeInstance.find({ bike: req.params.id }).populate("bike").exec(),
  ]);

  if (bike === null) {
    // No results.
    res.redirect("/catalog/bikes");
  }

  res.render("bike_delete", {
    title: "Delete bike",
    bike: bike,
    bike_instances: allBikeInstances,
  });
});

// Handle bike delete on POST.
exports.bike_delete_post = asyncHandler(async (req, res, next) => {
  // Extract bike ID from request body
  const bikeId = req.body.bikeid;

  try {
    // Delete bike and its instances
    await Promise.all([
      Bike.findByIdAndDelete(bikeId).exec(),
      BikeInstance.deleteMany({ bike: bikeId }).exec(),
    ]);

    // Redirect to bike list page or any other appropriate page
    res.redirect("/catalog/bikes");
  } catch (err) {
    // Handle errors
    return next(err);
  }
});

// Display bike update form on GET.

exports.bike_update_get = asyncHandler(async (req, res, next) => {
  const bike = await Bike.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .populate("specs")
    .exec();

  const [brands, categories] = await Promise.all([
    Brand.find().exec(),
    Category.find().exec(),
  ]);

  res.render("bike_form", {
    title: `Update Bike: ${bike.model}`,
    bike: bike,
    brand_list: brands,
    category_list: categories,
  });
});

// Handle bike update on POST.
exports.bike_update_post = [
  // Validate and sanitize fields for Specs
  body("frameType").notEmpty().withMessage("Frame type is required"),
  body("frameSizes").notEmpty().withMessage("Frame sizes are required"),

  // Validate and sanitize fields for Bike
  body("model").notEmpty().escape().withMessage("Model is required"),
  body("brand").notEmpty().escape().withMessage("Brand is required"),
  body("category").notEmpty().escape().withMessage("Category is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .escape()
    .withMessage("Price must be a number"),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    //find specs id
    const oldBike = await Bike.findById(req.params.id).populate("specs");
    const specsId = oldBike.specs._id;

    // Create a new Specs document

    const specs = new Specs({
      frame: {
        type: req.body.frameType,
        sizes: req.body.frameSizes,
      },
      suspension: {
        fork: req.body.fork,
        suspensionLever: req.body.suspensionLever,
        maxCompatibleForkTravel: req.body.maxCompatibleForkTravel,
      },
      wheels: {
        wheelFront: req.body.wheelFront,
        wheelRear: req.body.wheelRear,
      },
      drivetrain: {
        shifter: req.body.shifter,
        rearDerailleur: req.body.rearDerailleur,
        crank: req.body.crank,
        bottomBracket: req.body.bottomBracket,
        cassette: req.body.cassette,
        chain: req.body.chain,
        maxChainringSize: req.body.maxChainringSize,
      },
      components: {
        saddle: req.body.saddle,
        seatpost: req.body.seatpost,
        handlebar: req.body.handlebar,
        grips: req.body.grips,
        stem: req.body.stem,
        headset: req.body.headset,
        brake: req.body.brake,
        brakeRotor: req.body.brakeRotor,
        rotorSize: req.body.rotorSize,
      },
      weight: {
        bikeWeight: req.body.bikeWeight,
        weightLimit: req.body.weightLimit,
      },
      _id: specsId,
    });

    // Create a new Bike document
    const bike = new Bike({
      model: req.body.model,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      summary: req.body.summary,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      return res.render("bike_form", {
        title: "Create Bike",
        bike: req.body,
        brand_list: await Brand.find().exec(),
        category_list: await Category.find().exec(),
        errors: errors.array(),
      });
    } else {
      // Data is valid.

      // Update the Specs document
      await Specs.findByIdAndUpdate(specsId, specs);

      // Save the Bike document
      const updatedBike = await Bike.findByIdAndUpdate(req.params.id, bike);

      // Redirect after successful creation
      return res.redirect(updatedBike.url);
    }
  }),
];
