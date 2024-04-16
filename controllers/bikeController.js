const Bike = require("../models/bike");
const Brand = require("../models/brand");
const Category = require("../models/category");
const BikeInstance = require("../models/bikeinstance");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of bikes, bike instances, brands and category counts (in parallel)
  const [
    numBikes,
    numBikeInstances,
    numAvailableBikeInstances,
    numBrands,
    numCategories,
    category_list, // Fetch categories
  ] = await Promise.all([
    Bike.countDocuments({}).exec(),
    BikeInstance.countDocuments({}).exec(),
    BikeInstance.countDocuments({ status: "Available" }).exec(),
    Brand.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  res.render("index", {
    title: "Bike Inventory Home",
    bike_count: numBikes,
    bike_instance_available_count: numAvailableBikeInstances,
    brand_count: numBrands,
    category_count: numCategories,
    category_list: category_list,
  });
});

// Display list of all Bikes.
exports.bike_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bikes list");
});

// Display detail page for a specific bike.
exports.bike_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Bike detail: ${req.params.id}`);
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
