const express = require("express");
const { createSubcategory, getSubcategories, getSubcategoryById } = require("../controllers/subcategoryController");


const router = express.Router();
router.post("/",createSubcategory);
router.get("/", getSubcategories);
router.get("/:id", getSubcategoryById);
module.exports = router; 