const express = require("express");

const {createFabric, getAllFabrics, updateFabric, deleteFabric} = require("../controllers/fabricController.js");

const router = express.Router();

router.post("/", createFabric);
router.get("/", getAllFabrics);
router.put("/:id", updateFabric);
router.delete("/:id", deleteFabric);

module.exports = router;