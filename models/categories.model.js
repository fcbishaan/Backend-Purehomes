const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Name must be at least 3 characters long"],
    maxLength: [100, "Name must be at most 100 characters long"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index:true,
  },
  description: {
    type: String,
  },
  image: {
    type: String, 
  },
 
  isFeatured: {
    type: Boolean,
    default: false,
  },
},{
  timestamps:true,
});
const categories = mongoose.model("Category", categorySchema);
module.exports = categories;