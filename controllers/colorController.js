const Color = require("../models/Color.model.js");

 const createColor = async (req, res) => {
  try {
    const color = new Color(req.body);
    await color.save();
    res.status(201).json(color);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 const updateColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(color);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 const deleteColor = async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id);
    res.json({ message: "Color deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {createColor, getAllColors, updateColor, deleteColor};