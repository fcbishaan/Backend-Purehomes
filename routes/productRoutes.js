const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProductBySlug,
  getAllProduct,
  deleteProduct
} = require("../controllers/productController.js");

// Create a new product (expects JSON body with image URLs)
router.post("/", createProduct);

// Get all products (with optional query params: categorySlug, subCategorySlug)
router.get("/", getAllProduct);

// Get single product by slug
router.get("/:slug", getProductBySlug);

// Delete product by slug
router.delete("/:slug", deleteProduct);

//router.put("/product/star/:productId",productStar);
module.exports = router;
