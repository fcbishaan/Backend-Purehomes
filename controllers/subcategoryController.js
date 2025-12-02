// controllers/subcategoryController.js
const subCategory = require("../models/subCat.model.js");
const Category = require("../models/categories.model.js");
const mongoose = require("mongoose");
 const createSubcategory = async (req, res) => {
  try {
    const { name, slug, category: categoryId, description } = req.body;

    // validate category exists
    const cat = await Category.findById(categoryId);
    if (!cat) return res.status(400).json({ message: "Parent category not found" });

    const sub = await subCategory.create({ name, slug, category: categoryId, description });
    res.status(201).json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

 const getSubcategories = async (req, res) => {
  try {
    const {category} = req.query;
    let query = {};
    // If category ID is provided, filter subcategories by that category
    if (category) {
      // Validate if the category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      query.category = category;
    }

    const subcategories = await subCategory.find(query)
      .populate({
        path: 'category',
        select: 'name slug _id'
      })
      .sort({ name: 1 }); 

    res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories
    });

  } catch (error) {
    console.error('Error in getSubcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategories: ' + error.message
    });
  }
};

const getSubcategoryById = async (req, res) => {
 try {
  const subcategory = await subCategory.findById(req.params.id);
  res.status(200).json(subcategory);
 } catch (error) {
  console.error('Error in getSubcategoryById:', error);
  res.status(500).json({
    success: false,
    message: 'Error fetching subcategory: ' + error.message
  });
 }
}

module.exports = {createSubcategory, getSubcategories, getSubcategoryById};