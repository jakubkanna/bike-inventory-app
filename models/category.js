// category.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// Virtual for categories URL
CategorySchema.virtual("url").get(function () {
  return `/catalog/categories/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
