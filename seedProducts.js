// seedProducts.js
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const slugify = require("slugify");
const products12 = require("./products12.js"); // your array

mongoose.connect("mongodb://localhost:27017/yourDbName")
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

async function seedProducts() {
    for (let p of products12) {
        let slug = slugify(p.title, { lower: true });
        await Product.findOneAndUpdate(
            { slug },
            { ...p, slug },
            { upsert: true, new: true }
        );
    }
    console.log("Products seeded!");
    mongoose.disconnect();
}

seedProducts();
