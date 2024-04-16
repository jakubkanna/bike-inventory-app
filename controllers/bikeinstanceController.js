const BikeInstance = require("../models/bikeinstance");
const asyncHandler = require("express-async-handler");

// Display list of all BikeInstances.
exports.bikeinstance_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance list");
});

// Display detail page for a specific BikeInstance.
exports.bikeinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BikeInstance detail: ${req.params.id}`);
});

// Display BikeInstance create form on GET.
exports.bikeinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance create GET");
});

// Handle BikeInstance create on POST.
exports.bikeinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance create POST");
});

// Display BikeInstance delete form on GET.
exports.bikeinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance delete GET");
});

// Handle BikeInstance delete on POST.
exports.bikeinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance delete POST");
});

// Display BikeInstance update form on GET.
exports.bikeinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance update GET");
});

// Handle bikeinstance update on POST.
exports.bikeinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance update POST");
});
