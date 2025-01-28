const express = require("express");
const router = express.Router();
const Categorie = require("../models/categorie"); // Updated to follow PascalCase for model name

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get category by ID
router.get("/categories/:id", async (req, res) => {
  try {
    const category = await Categorie.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new category
router.post("/categories", async (req, res) => {
  const { label } = req.body;

  if (!label) {
    return res
      .status(400)
      .json({ message: "Les champs value et label sont requis." });
  }

  const newCategorie = new Categorie({
    label,
  });

  try {
    const savedItem = await newCategorie.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
