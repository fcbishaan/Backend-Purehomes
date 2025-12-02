const express = require("express");
const {createColor, getAllColors, updateColor, deleteColor} = require("../controllers/colorController.js");

const router = express.Router();

router.get('/colors',getAllColors);
router.post("/", createColor);
router.get("/", getAllColors);
router.put("/:id", updateColor);
router.delete("/:id", deleteColor);

module.exports = router;