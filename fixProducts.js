const mongoose = require("mongoose");
const Product = require("./models/product.model");
const Category = require("./models/categories.model");
const SubCategory = require("./models/subCat.model");
const { connectDb } = require("./config/db.config");
require("dotenv").config();

const fixProducts = async () => {
    try {
        console.log("Connecting to DB...");
        await connectDb();

        console.log("Fetching categories...");
        const categories = await Category.find();
        const subCategories = await SubCategory.find();

        const catMap = {};
        categories.forEach(c => catMap[c.name.toLowerCase()] = c._id);

        const subCatMap = {};
        subCategories.forEach(s => subCatMap[s.name.toLowerCase()] = s._id);

        console.log("Fetching products...");
        const products = await Product.find();
        console.log(`Found ${products.length} products.`);

        for (const p of products) {
            const title = p.title.toLowerCase();
            let newCatId = null;
            let newSubCatId = null;

            // Simple keyword matching
            if (title.includes("sofa")) {
                newCatId = catMap["sofas"];
                // Try to find subcategory
                if (title.includes("2 seater")) newSubCatId = subCatMap["2 seater sofa"];
                else if (title.includes("3 seater")) newSubCatId = subCatMap["3-seater-sofa"];
                else if (title.includes("l shape")) newSubCatId = subCatMap["l-shape-sofa"];
                else if (title.includes("bed")) newSubCatId = subCatMap["sofa cum bed"];
                else newSubCatId = subCategories.find(s => s.category.toString() === newCatId.toString())?._id;
            }
            else if (title.includes("chair")) {
                newCatId = catMap["chair"];
                if (title.includes("accent")) newSubCatId = subCatMap["accent chair"];
                else if (title.includes("lounge")) newSubCatId = subCatMap["lounge chair"];
                else newSubCatId = subCategories.find(s => s.category.toString() === newCatId.toString())?._id;
            }
            else if (title.includes("table")) {
                newCatId = catMap["tables"];
                if (title.includes("coffee")) newSubCatId = subCatMap["coffee table"];
                else if (title.includes("console")) newSubCatId = subCatMap["console table"];
                else newSubCatId = subCategories.find(s => s.category.toString() === newCatId.toString())?._id;
            }
            else if (title.includes("cabinet")) newCatId = catMap["cabinets"];
            else if (title.includes("tv")) newCatId = catMap["tvunits"]; // Note: initData used "TvUnits" -> lowercase "tvunits"
            else if (title.includes("ottoman")) newCatId = catMap["ottomans"];
            else if (title.includes("bookshelf")) newCatId = catMap["bookshelves"];
            else if (title.includes("bar")) newCatId = catMap["barunit"];

            // Fallback if no match
            if (!newCatId) {
                console.log(`No category match for: ${p.title}. Assigning to Sofas.`);
                newCatId = catMap["sofas"];
            }

            // Fallback subcategory if needed (just pick first one in category)
            if (newCatId && !newSubCatId) {
                const sub = subCategories.find(s => s.category.toString() === newCatId.toString());
                if (sub) newSubCatId = sub._id;
            }

            if (newCatId && newSubCatId) {
                p.category = newCatId;
                p.subCategory = newSubCatId;
                await p.save();
                console.log(`Updated ${p.title} -> Cat: ${newCatId}, Sub: ${newSubCatId}`);
            } else {
                console.log(`Skipping ${p.title} (missing cat/subcat)`);
            }
        }

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixProducts();
