const express = require("express");
const router = express.Router();

// Require controller modules.
const bike_controller = require("../controllers/bikeController");
const brand_controller = require("../controllers/brandController");
const category_controller = require("../controllers/categoryController");
const bike_instance_controller = require("../controllers/bikeinstanceController");

/// BIKE ROUTES ///

// GET catalog home page.
router.get("/", bike_controller.index);

// GET request for creating a bike. NOTE This must come before routes that display Book (uses id).
router.get("/bike/create", bike_controller.bike_create_get);

// POST request for creating Book.
router.post("/bike/create", bike_controller.bike_create_post);

// GET request to delete Book.
router.get("/bike/:id/delete", bike_controller.bike_delete_get);

// POST request to delete Book.
router.post("/bike/:id/delete", bike_controller.bike_delete_post);

// GET request to update Book.
router.get("/bike/:id/update", bike_controller.bike_update_get);

// POST request to update Book.
router.post("/bike/:id/update", bike_controller.bike_update_post);

// GET request for one Book.
router.get("/bike/:id", bike_controller.bike_detail);

// GET request for list of all Book items.
router.get("/bikes", bike_controller.bike_list);

/// BRAND ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display brand).
router.get("/brand/create", brand_controller.brand_create_get);

// POST request for creating Author.
router.post("/brand/create", brand_controller.brand_create_post);

// GET request to delete Author.
router.get("/brand/:id/delete", brand_controller.brand_delete_get);

// POST request to delete Author.
router.post("/brand/:id/delete", brand_controller.brand_delete_post);

// GET request to update Author.
router.get("/brand/:id/update", brand_controller.brand_update_get);

// POST request to update Author.
router.post("/brand/:id/update", brand_controller.brand_update_post);

// GET request for one Author.
router.get("/brand/:id", brand_controller.brand_detail);

// GET request for list of all Authors.
router.get("/brands", brand_controller.brand_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Category.
router.get("/categories", category_controller.category_list);

/// BIKEINSTANCE ROUTES ///

// GET request for creating a BikeInstance. NOTE This must come before route that displays BikeInstance (uses id).
router.get(
  "/bikeinstance/create",
  bike_instance_controller.bikeinstance_create_get
);

// POST request for creating BikeInstance.
router.post(
  "/bikeinstance/create",
  bike_instance_controller.bikeinstance_create_post
);

// GET request to delete BikeInstance.
router.get(
  "/bikeinstance/:id/delete",
  bike_instance_controller.bikeinstance_delete_get
);

// POST request to delete BikeInstance.
router.post(
  "/bikeinstance/:id/delete",
  bike_instance_controller.bikeinstance_delete_post
);

// GET request to update BikeInstance.
router.get(
  "/bikeinstance/:id/update",
  bike_instance_controller.bikeinstance_update_get
);

// POST request to update BikeInstance.
router.post(
  "/bikeinstance/:id/update",
  bike_instance_controller.bikeinstance_update_post
);

// GET request for one BikeInstance.
router.get("/bikeinstance/:id", bike_instance_controller.bikeinstance_detail);

// GET request for list of all BikeInstance.
router.get("/bikeinstances", bike_instance_controller.bikeinstance_list);

module.exports = router;
