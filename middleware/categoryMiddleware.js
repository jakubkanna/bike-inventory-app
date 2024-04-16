// middleware/categoryMiddleware.js

const Category = require("../models/category");

const categoryMiddleware = async (req, res, next) => {
  try {
    const categories = await Category.find({}).exec();
    res.locals.category_list = categories;
    next(); // Call next() to pass control to the next middleware/route handler
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
};

module.exports = categoryMiddleware;
