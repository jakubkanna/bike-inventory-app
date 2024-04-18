const debug = require("debug")("brand");

const Brand = require("../models/brand");
const Bike = require("../models/bike");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

// Display list of all brands.
exports.brand_list = asyncHandler(async (req, res, next) => {
  const allBrands = await Brand.find({}, "name").sort({ model: 1 }).exec();
  res.render("brand_list", { title: "Brand List", brand_list: allBrands });
});

// Display detail page for a specific brand.
exports.brand_detail = asyncHandler(async (req, res, next) => {
  // Get details of brand and all their bikes (in parallel)
  const [brand, allBikesByBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Bike.find({ brand: req.params.id }, "model summary").exec(),
  ]);

  if (brand === null) {
    // No results.
    const err = new Error("Brand not found");
    err.status = 404;
    return next(err);
  }

  res.render("brand_detail", {
    title: "Brand Detail",
    brand: brand,
    brand_bikes: allBikesByBrand,
  });
});

// Display brand create form on GET.
exports.brand_create_get = asyncHandler(async (req, res, next) => {
  res.render("brand_form", { title: "Create Brand" });
});

// Handle Brand create on POST.
exports.brand_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),
  body("origin").trim().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Brand object with escaped and trimmed data
    const brand = new Brand({
      name: req.body.name,
      origin: req.body.origin,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save brand.
      await brand.save();
      // Redirect to new brand record.
      res.redirect(brand.url);
    }
  }),
];

// Display brand delete form on GET.
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  const [brand, bikesInBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Bike.find({ brand: req.params.id }, "model summary").exec(),
  ]);
  if (brand === null) {
    res.redirect("/catalog/brands");
  }
  res.render("brand_delete", {
    title: "Delete Brand",
    brand: brand,
    brand_bikes: bikesInBrand,
  });
});

// Handle brand delete on POST.
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their bikes (in parallel)
  const [brand, allBikesByBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Bike.find({ brand: req.params.id }, "title summary").exec(),
  ]);

  if (allBikesByBrand.length > 0) {
    // Brand has bikes. Render in same way as for GET route.
    res.render("brand_delete", {
      title: "Delete Brand",
      brand: brand,
      brand_bikes: allBikesByBrand,
    });
    return;
  } else {
    // Brand has no bikes. Delete object and redirect to the list of brands.
    await Brand.findByIdAndDelete(req.body.brandid);
    res.redirect("/catalog/brands");
  }
});

// Display brand update form on GET.

exports.brand_update_get = asyncHandler(async (req, res, next) => {
  // res.send("NOT IMPLEMENTED: Brand update GET")
  const brand = await Brand.findById(req.params.id).exec();
  if (brand === null) {
    debug(`id not found on update: ${req.params.id}`).exec();
    const err = new Error("Brand not found.");
    err.status(404);
    return next(err);
  }
  res.render("brand_form", {
    title: "Update Brand",
    brand: brand,
  });
});

// Handle brand update on POST.
exports.brand_update_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),
  body("origin").trim().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Brand object with escaped and trimmed data
    const brand = new Brand({
      name: req.body.name,
      origin: req.body.origin,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("brand_form", {
        title: "Update Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      const updatedBrand = await Brand.findByIdAndUpdate(
        req.params.id,
        brand,
        {}
      );

      // Redirect to new brand record.
      res.redirect(updatedBrand.url);
    }
  }),
];
