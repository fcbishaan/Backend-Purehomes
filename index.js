require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./config/db.config.js");

// Routes
const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/productRoutes.js");
const categoryRoutes = require("./routes/categoryRoute.js");
const subCategoryRoutes = require("./routes/subCategoryRoute.js");
const fabricRoutes = require("./routes/fabricRoutes.js");
const colorRoutes = require("./routes/colorRoutes.js");
const cloudinaryRoutes = require("./routes/cloudinary.js");
const cartRoutes = require("./routes/cartRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

// Connect DB
connectDb();

// Init app
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "https://myprop-flax.vercel.app",
  
];

// ✅ CORS CONFIG
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions)); 

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// // 🔥 IMPORTANT: handle preflight
//app.options("*", cors(corsOptions));

// Routes
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/subCategory", subCategoryRoutes);
app.use("/fabric", fabricRoutes);
app.use("/color", colorRoutes);
app.use("/cloudinary", cloudinaryRoutes);
app.use("/cart", cartRoutes);
app.use("/admin", adminRoutes);

// Health check (recommended)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
