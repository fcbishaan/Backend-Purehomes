require("dotenv").config();
const express = require("express");
const { connectDb } = require("./config/db.config.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/productRoutes.js");
const cloudinary = require("./config/cloudinary.js");
const categories = require("./models/categories.model.js");
const categoryRoutes = require("./routes/categoryRoute.js");
const subCategoryRoutes = require("./routes/subCategoryRoute.js");
const fabricRoutes = require("./routes/fabricRoutes.js");
const colorRoutes = require("./routes/colorRoutes.js");
const cloudinaryRoutes = require("./routes/cloudinary.js");
const cartRoutes = require("./routes/cartRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
//connecting database
connectDb();
// defing app
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOptions));
app.use(cookieParser());

//routes
app.use("/auth", authRoutes);
//app.use("/product", productRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/subCategory", subCategoryRoutes);
app.use("/fabric", fabricRoutes);
app.use("/color", colorRoutes);
app.use("/cloudinary", cloudinaryRoutes);
app.use("/cart", cartRoutes);
app.use("/admin", adminRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

