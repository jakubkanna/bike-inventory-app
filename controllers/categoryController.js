const Category = require("../models/category");
const Bike = require("../models/bike");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Category.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated bikes (in parallel)
  const [category, bikesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bike.find({ category: req.params.id }, "model summary").exec(),
  ]);
  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_bikes: bikesInCategory,
  });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize fields.
  body("name", "Name must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified."),
  body("description", "Description must be specified.").trim().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      origin: req.body.origin,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save category.
      await category.save();
      // Redirect to new category record.
      res.redirect(category.url);
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, bikesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bike.find({ category: req.params.id }, "model summary").exec(),
  ]);
  if (category === null) {
    res.redirect("/catalog/categories");
  }
  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_bikes: bikesInCategory,
  });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
});
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their bikes (in parallel)
  const [category, allBikesByCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bike.find({ category: req.params.id }, "title summary").exec(),
  ]);

  if (allBikesByCategory.length > 0) {
    // Category has bikes. Render in same way as for GET route.
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_bikes: allBikesByCategory,
    });
    return;
  } else {
    // Category has no bikes. Delete object and redirect to the list of categorys.
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/catalog/categories");
  }
});
// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update POST");
});
