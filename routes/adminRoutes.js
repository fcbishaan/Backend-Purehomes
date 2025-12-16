const express = require("express");
const { registerAdmin, loginAdmin, getAdmin, updateAdminProfile, logoutAdmin } = require("../controllers/adminController");
const router = express.Router();
const { adminAuth } = require("../middleware/adminAuth");

//const { adminAuth } = require("../middleware/adminAuth");
router.post('/register', adminAuth, registerAdmin);
router.post("/login", adminAuth, loginAdmin);
router.get("/me", adminAuth, getAdmin);
router.put("/me/editProfile", updateAdminProfile);
router.post("/logout", adminAuth, logoutAdmin);
module.exports = router;  