const BikeInstance = require("../models/bikeinstance");
const Bike = require("../models/bike");
const { body, validationResult } = require("express-validator");

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
    title: "Bike Instance",
    bikeinstance: bikeInstance,
  });
});

// Display BikeInstance create form on GET.
exports.bikeinstance_create_get = asyncHandler(async (req, res, next) => {
  const bikes = await Bike.find().exec();
  res.render("bikeinstance_form", {
    title: "Create Bike Instance",
    bike_list: bikes,
  });
});

// Handle BikeInstance create on POST.
exports.bikeinstance_create_post = [
  body("bike")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Bike must be specified."),
  body("size")
    .trim()
    .isLength({ min: 1 })
    .isIn([
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
    ])
    .escape()
    .withMessage("Size must be specified."),
  body("status")
    .trim()
    .isLength({ min: 1 })
    .isIn(["Available", "Unavailable", "Ask for availability"])
    .escape()
    .withMessage("Status must be specified."),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const bikeinstance = new BikeInstance({
      bike: req.body.bike,
      size: req.body.size,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      const bikes = await Bike.find().exec();
      // There are errors. Render form again with sanitized values/errors messages.
      return res.render("bikeinstance_form", {
        title: "Create Bike Instance",
        bike_list: bikes,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid. Create a new Specs document

      // Save the Specs document
      await bikeinstance.save();

      // Redirect after successful creation
      return res.redirect(bikeinstance.url);
    }
  }),
];

// Display BikeInstance delete form on GET.

exports.bikeinstance_delete_get = asyncHandler(async (req, res, next) => {
  // get bike and it's instances
  const bikeInstance = await BikeInstance.findById(req.params.id)
    .populate("bike")
    .exec();

  if (bikeInstance === null) {
    // No results.
    res.redirect("/catalog/bikeinstances");
  }

  res.render("bikeinstance_delete", {
    title: "Delete Bike Instance",
    bike_instance: bikeInstance,
  });
});

// Handle BikeInstance delete on POST.
exports.bikeinstance_delete_post = asyncHandler(async (req, res, next) => {
  await BikeInstance.findByIdAndDelete(req.body.bikeinstanceid);
  res.redirect(`/catalog/bikeinstances`);
});

// Display BikeInstance update form on GET.
exports.bikeinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance update GET");
});

// Handle bikeinstance update on POST.
exports.bikeinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BikeInstance update POST");
});
