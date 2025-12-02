const Fabric = require("../models/Fabric.model.js");

// Create
 const createFabric = async (req, res) => {
  try {
    const fabric = new Fabric(req.body);
    await fabric.save();
    res.status(201).json(fabric);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
 const getAllFabrics = async (req, res) => {
  try {
    const fabrics = await Fabric.find();
    res.status(200).json(fabrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
 const updateFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(fabric);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
 const deleteFabric = async (req, res) => {
  try {
    await Fabric.findByIdAndDelete(req.params.id);
    res.json({ message: "Fabric deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports= {createFabric, getAllFabrics, updateFabric, deleteFabric};