const BikeInstance = require("../models/bikeinstance");
const asyncHandler = require("express-async-handler");

// Display list of all BikeInstances.
exports.bikeinstance_list = asyncHandler(async (req, res, next) => {
  const sortedBikeInstances = await BikeInstance.aggregate([
    {
      $lookup: {
        from: "bikes",
        localField: "bike",
        foreignField: "_id",
        as: "bike_details",
      },
    },
    {
      $unwind: "$bike_details",
    },
    {
      $sort: {
        "bike_details.model": 1,
        sizeOrder: 1,
      },
    },
    {
      $project: {
        _id: 0,
        bike: "$bike_details.model",
        size: 1,
        status: 1,
        url: { $concat: ["/catalog/bikeinstance/", { $toString: "$_id" }] },
      },
    },
  ]);

  res.render("bikeinstance_list", {
    title: "Bike Instance List",
    bikeinstance_list: sortedBikeInstances,
  });
});

// Display detail page for a specific BikeInstance.
exports.bikeinstance_detail = asyncHandler(async (req, res, next) => {
  const bikeInstance = await BikeInstance.findById(req.params.id)
    .populate("bike")
    .exec();

  if (bikeInstance === null) {
    // No results.
    const err = new Error("Bike copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("bikeinstance_detail", {
    title: "Bike:",
    bikeinstance: bikeInstance,
  });
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
