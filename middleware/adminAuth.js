const jwt = require("jsonwebtoken");
//const Admin = require("../models/admin.js");

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ success: false, message: "Admin not found" });
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = { adminAuth };