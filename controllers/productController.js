
const mongoose = require('mongoose');
const Product = require("../models/product.model.js");
const SubCategory = require("../models/subCat.model.js");
const Categories = require("../models/categories.model.js");
const Fabric = require("../models/Fabric.model.js");
const Color = require("../models/Color.model.js");
const slugify = require("slugify");
const { cloudinary } = require("../config/cloudinary.js");
// helper to parse CSV or bracketed strings into clean array of names
const splitCSV = (value) => {
    const raw = String(value ?? "").trim();
    const noBrackets = raw.replace(/^\[\s*|\s*\]$/g, "").replace(/^\[|\]$/g, "");
    return noBrackets
        .split(',')
        .map(s => s.replace(/^\s*['"]?|['"]?\s*$/g, '').trim())
        .filter(Boolean);
};

// Helper to extract public_id from URL
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        return lastPart.split('.')[0];
    } catch (e) {
        console.error("Error extracting public_id from url:", url);
        return null;
    }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            title,
            price,
            description,
            categoryName,
            subCategoryName,
            fabricNames,
            colorNames,
            colorImages, // optional [{ colorName, imageUrl }]
            filterSizes,
            imgSrc,
            imgHover,
            ...otherFields
        } = req.body;

        if (!imgSrc || !imgHover) {
            return res.status(400).json({ message: "Please provide both main and hover image URLs" });
        }

        const existingProduct = await Product.findOne({ title });
        if (existingProduct) {
            return res.status(400).json({ success: false, message: "Product with this title already exists" });
        }

        let category = null;
        if (categoryName) {
            category = await Categories.findOne({ name: categoryName });
            if (!category) {
                category = await Categories.create({ name: categoryName, slug: slugify(categoryName, { lower: true, strict: true }) });
            }
        } else {
            return res.status(400).json({ success: false, message: "Category is required" });
        }

        // 2️⃣ Handle subCategory
        let subCategory = null;
        if (subCategoryName) {
            if (!category) {
                return res.status(400).json({ success: false, message: "Cannot create subCategory without a valid category" });
            }
            subCategory = await SubCategory.findOne({ name: subCategoryName, category: category._id });
            if (!subCategory) {
                subCategory = await SubCategory.create({ name: subCategoryName, category: category._id, slug: slugify(subCategoryName, { lower: true, strict: true }) });
            }
        }
        // 3️⃣ Handle fabrics
        const fabricsArray = splitCSV(fabricNames);
        const fabrics = await Promise.all(
            fabricsArray.map(async name => {
                let fabric = await Fabric.findOne({ name });
                if (!fabric) fabric = await Fabric.create({ name });
                return fabric._id;
            })
        );

        // 4️⃣ Handle colors
        const colorsArray = splitCSV(colorNames);
        const colors = await Promise.all(
            colorsArray.map(async name => {
                let color = await Color.findOne({ name });
                if (!color) color = await Color.create({ name, hexValue: '#000000' });
                return color._id;
            })
        );

        // 5️⃣ Handle colorImages if provided
        let colorImagesArray = [];
        if (colorImages) {
            // Expecting colorImages to be an array of objects: [{ color: colorId, imageUrl: string }]
            // If it's sent as a JSON string, parse it.
            let parsedColorImages = colorImages;
            if (typeof colorImages === 'string') {
                try {
                    parsedColorImages = JSON.parse(colorImages);
                } catch (e) {
                    console.error("Error parsing colorImages", e);
                    parsedColorImages = [];
                }
            }

            if (Array.isArray(parsedColorImages)) {
                colorImagesArray = await Promise.all(parsedColorImages.map(async ci => {
                    // If color ID is provided directly
                    if (ci.color) {
                        // Verify color exists
                        const color = await Color.findById(ci.color);
                        if (!color) return null;
                        return {
                            color: color._id,
                            imageUrl: ci.imageUrl,
                            public_id: getPublicIdFromUrl(ci.imageUrl)
                        };
                    }
                    // Fallback for legacy support (if any) or name-based lookup
                    if (ci.colorName) {
                        const color = await Color.findOne({ name: ci.colorName });
                        if (!color) return null;
                        return {
                            color: color._id,
                            imageUrl: ci.imageUrl,
                            public_id: getPublicIdFromUrl(ci.imageUrl)
                        };
                    }
                    return null;
                }));
                colorImagesArray = colorImagesArray.filter(c => c !== null);
            }
        }

        // Format main images
        const formattedImgSrc = typeof imgSrc === 'string'
            ? { url: imgSrc, public_id: getPublicIdFromUrl(imgSrc) }
            : imgSrc;

        const formattedImgHover = typeof imgHover === 'string'
            ? { url: imgHover, public_id: getPublicIdFromUrl(imgHover) }
            : imgHover;

        // 6️⃣ Create product
        const product = new Product({
            title,
            price,
            description,
            category: category._id,
            subCategory: subCategory?._id,
            fabrics,
            colors,
            filterSizes: splitCSV(filterSizes),
            imgSrc: formattedImgSrc,
            imgHover: formattedImgHover,
            colorImages: colorImagesArray
        });

        await product.save();

        const populatedProduct = await Product.findById(product._id)
            .populate('category', 'name slug')
            .populate('subCategory', 'name slug')
            .populate('fabrics', 'name')
            .populate('colors', 'name hexValue');

        res.status(201).json({ success: true, product: populatedProduct });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Error creating product", error: error.message });
    }
};

// GET ALL PRODUCTS
const getAllProduct = async (req, res) => {
    try {
        const { categorySlug, subCategorySlug } = req.query;
        const filter = {};

        if (categorySlug) {
            // Try to find by slug first
            let cat = await Categories.findOne({ slug: categorySlug });
            // Fallback: try by name (case-insensitive)
            if (!cat) {
                cat = await Categories.findOne({ name: { $regex: new RegExp(`^${categorySlug}$`, 'i') } });
            }
            if (cat) filter.category = cat._id;
        }
        if (subCategorySlug) {
            // Try to find by slug first
            let sub = await SubCategory.findOne({ slug: subCategorySlug });
            // Fallback: try by name (case-insensitive)
            if (!sub) {
                sub = await SubCategory.findOne({ name: { $regex: new RegExp(`^${subCategorySlug}$`, 'i') } });
            }
            if (sub) filter.subCategory = sub._id;
        }

        const products = await Product.find(filter)
            .populate("category", "name slug")
            .populate("subCategory", "name slug")
            .populate("fabrics", "name")
            .populate("colors", "name hexValue");

        res.status(200).json({ success: true, products });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET PRODUCT BY SLUG
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug })
            .populate("category", "name slug")
            .populate("subCategory", "name slug")
            .populate("fabrics", "name")
            .populate("colors", "name hexValue");

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ success: true, product });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { slug } = req.params;
        console.log("deleteProduct called for slug:", slug);

        const product = await Product.findOne({ slug });
        if (!product) {
            console.log("Product not found in DB, returning success (idempotent).");
            // Idempotency: If product is already gone, consider it a success
            return res.status(200).json({ success: true, message: "Product already deleted" });
        }

        // Helper to extract public_id from URL or object
        const getPublicId = (image) => {
            if (!image) return null;
            if (image.public_id) return image.public_id;

            let url;
            if (typeof image === 'string' || image instanceof String) {
                url = image.toString();
            } else {
                url = image.url || image.imageUrl;
            }

            // Fallback: if it's an object but stringifies to a URL (e.g. Mongoose weirdness)
            if (!url && image.toString().startsWith('http')) {
                url = image.toString();
            }

            return getPublicIdFromUrl(url);
        };

        // Collect all public_ids to delete
        const publicIds = [];
        const imgSrcId = getPublicId(product.imgSrc);
        if (imgSrcId) publicIds.push(imgSrcId);

        const imgHoverId = getPublicId(product.imgHover);
        if (imgHoverId) publicIds.push(imgHoverId);

        if (product.colorImages?.length > 0) {
            product.colorImages.forEach(img => {
                const id = getPublicId(img);
                if (id) publicIds.push(id);
            });
        }

        // Delete all images in parallel
        if (publicIds.length > 0) {
            const results = await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));
            console.log("Cloudinary deletion results:", JSON.stringify(results, null, 2));
        } else {
            console.log("No publicIds found to delete.");
        }

        await Product.deleteOne({ _id: product._id });

        res.status(200).json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { slug } = req.params;

        let product = await Product.findOne({ slug });
        if (!product) return res.status(404).json({ message: "Product not found" });

        const {
            title,
            price,
            description,
            category,
            subCategory,
            fabrics,
            colors,
            filterSizes,
            imgSrc,
            imgHover,
            colorImages
        } = req.body;

        // Simple fields
        if (title) product.title = title;
        if (price) product.price = price;
        if (description) product.description = description;
        if (category) product.category = category;
        if (subCategory) product.subCategory = subCategory;
        if (fabrics) product.fabrics = fabrics;
        if (colors) product.colors = colors;
        if (filterSizes) product.filterSizes = filterSizes;

        // Update imgSrc
        if (imgSrc && imgSrc.url && imgSrc.public_id) {
            await cloudinary.uploader.destroy(product.imgSrc.public_id);
            product.imgSrc = imgSrc;
        }

        // Update imgHover
        if (imgHover && imgHover.url && imgHover.public_id) {
            await cloudinary.uploader.destroy(product.imgHover.public_id);
            product.imgHover = imgHover;
        }

        // Update colorImages
        if (colorImages && Array.isArray(colorImages)) {

            // delete old colorImages files
            for (const img of product.colorImages) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }

            // save new images
            Product.colorImages = colorImages;
        }

        await product.save();

        res.json({ success: true, product });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createProduct, getAllProduct, getProductBySlug, deleteProduct, updateProduct };
module.exports = { createProduct, getAllProduct, getProductBySlug, deleteProduct, updateProduct };
