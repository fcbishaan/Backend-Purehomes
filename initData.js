require("dotenv").config();
const { connectDb } = require("./config/db.config");

const Category = require("./models/categories.model");
const SubCategory = require("./models/subCat.model");

// Import seed data from backend/Data (JSON files)
const categories = require("./Data/categoriesData.json");
const subCategories = require("./Data/subcategoriesData.json");

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDb();

    console.log("Clearing Collections...");
    await Category.deleteMany({});
    await SubCategory.deleteMany({});

    console.log("Inserting Categories...");
    const createdCategories = await Category.insertMany(
      categories.map(c => ({
        ...c,
        slug: c.name.toLowerCase().replace(/\s+/g, "-")
      }))
    );

    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    console.log("Inserting SubCategories...");
    await SubCategory.insertMany(
      subCategories.map(sub => ({
        name: sub.name,
        slug: sub.name.toLowerCase().replace(/\s+/g, "-"),
        category: categoryMap[sub.category],
      }))
    );

    console.log("🎉 Seeder Completed Successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seeder Error:", err);
    process.exit(1);
  }
};

seed();
