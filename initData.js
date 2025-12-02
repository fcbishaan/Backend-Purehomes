// initData.js
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const Category = require("./models/categories.model");
const Color = require("./models/Color.model");
const SubCategory = require("./models/subCat.model");
const Fabric = require("./models/Fabric.model");
const { connectDb } = require("./config/db.config");

const categories = [
  { name: "Sofas" },
  { name: "Chair" },
  { name: "Tables" },
  { name: "Cabinets" },
  { name: "TvUnits" },
  { name: "Ottomans" },
  { name: "Bookshelves" },
  { name: "BarUnit" },
];

const subCategories = [
  { name: "2 Seater Sofa", category: "Sofas" },
  { name: "3 Seater Sofa", category: "Sofas" },
  { name: "L Shape Sofa", category: "Sofas" },
  { name: "Sofa Cum Bed", category: "Sofas" },

  { name: "Accent Chair", category: "Chair" },
  { name: "Lounge Chair", category: "Chair" },

  { name: "Coffee Table", category: "Tables" },
  { name: "Console Table", category: "Tables" }
];

const colors = [
  { name: "White", hexValue: "#FFFFFF" },
  { name: "Black", hexValue: "#000000" },
  { name: "Beige", hexValue: "#F5F5DC" },
  { name: "Gray", hexValue: "#808080" },
  { name: "Navy Blue", hexValue: "#000080" },
  { name: "Brown", hexValue: "#A52A2A" },
  { name: "Dark Brown", hexValue: "#5C4033" },
  { name: "Light Gray", hexValue: "#D3D3D3" },
  { name: "Charcoal", hexValue: "#36454F" },
  { name: "Cream", hexValue: "#FFFDD0" }
];

const fabricData = [
  { name: "Cotton" },
  { name: "Silk" },
  { name: "Wool" },
  { name: "Linen" },
  { name: "Denim" },
  { name: "Velvet" },
  { name: "Leather" },
  { name: "Mesh" },
  { name: "Woven" },
  { name: "Knit" }
];

const Size = [

]
const initData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDb();

    console.log("Clearing old data...");
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    await Color.deleteMany({});
    await Fabric.deleteMany({});

    console.log("Inserting Fabrics...");
    await Fabric.insertMany(fabricData);
    console.log("Inserting Colors...");
    await Color.insertMany(colors);

    console.log("Inserting Categories...");
    const createdCategories = await Category.insertMany(
      categories.map((cat) => ({
        ...cat,
        slug: cat.name.toLowerCase().replace(/\s+/g, "-")
      }))
    );

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log("Inserting SubCategories...");
    await SubCategory.insertMany(
      subCategories.map((sub) => ({
        name: sub.name,
        slug: sub.name.toLowerCase().replace(/\s+/g, "-"),
        category: categoryMap[sub.category]
      }))
    );

    console.log("🎉 Seeding Completed Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error Seeding:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  initData();
}
