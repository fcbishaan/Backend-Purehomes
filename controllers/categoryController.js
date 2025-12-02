const Category = require("../models/categories.model.js");
const Color = require("../models/Color.model.js");
const SubCat = require("../models/subCat.model.js");
const mongoose = require("mongoose");
 const createCategory = async (req,res) => {
    try {
        const{name,slug,description,image,isFeatured} = req.body;
        const cat = await Category.create({name,slug,description,image,isFeatured});
        res.status(201).json(cat);
    } catch (error) {
        res.status(400).json({message:error.message});
 };
}
  const getCategories = async(req,res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({
          success:true,
          count:categories.length,
          data:categories
        });
    } catch (error) {
        res.status(500).json({success:false,mesage:'Error fetching categories',error:error.message});
    }
 };

 const getColors = async(req,res) => {
  try {
    const colors = await Color.find().sort({ name: 1 });
    res.status(200).json({
      success:true,
      count:colors.length,
      data:colors
    });
  } catch (error) {
    res.status(500).json({success:false,mesage:'Error fetching colors',error:error.message});
  }
 }


  
  module.exports = {
    createCategory,
    getCategories,
    getColors
  };