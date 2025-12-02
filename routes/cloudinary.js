const express = require("express");
const router = express.Router();

const { upload, remove } = require("../config/cloudinary.js");
router.post("/uploadimages", upload);
router.post("/removeimages", remove);

module.exports = router;
