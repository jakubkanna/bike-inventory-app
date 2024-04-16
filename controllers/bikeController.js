const Bike = require("../models/bike");
const Brand = require("../models/brand");
const Category = require("../models/category");
const BikeInstance = require("../models/bikeinstance");
const Specs = require("../models/specs");

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
    bike: bike,
    size_counts: sizeCounts,
  });
});

// Display bike create form on GET.
exports.bike_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bike create GET");
});

// Handle bike create on POST.
exports.bike_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bike create POST");
});

// Display bike delete form on GET.
exports.bike_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bike delete GET");
});

// Handle bike delete on POST.
exports.bike_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bike delete POST");
});

// Display bike update form on GET.
exports.bike_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bike update GET");
});

// Handle bike update on POST.
exports.bike_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bike update POST");
});
