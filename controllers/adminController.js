const Admin = require("../models/Admin.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// REGISTER ADMIN
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }

        const admin = await Admin.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// LOGIN ADMIN
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select("-password");
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, admin });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const updateAdminProfile = async (req, res) => {
    try {
        const { email, password } = req.body;
        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, { email, password }, { new: true }).select("-password");
        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, admin: updatedAdmin });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const logoutAdmin = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Admin logged out successfully" });
}
module.exports = { registerAdmin, loginAdmin, getAdmin, updateAdminProfile, logoutAdmin };
