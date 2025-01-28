const express = require("express");
const router = express.Router();
const Admission = require("../models/admissionModel");

// Route pour obtenir l'admission actuelle
router.get("/admission", async (req, res) => {
  try {
    const admission = await Admission.findOne();
    if (!admission) {
      return res.status(404).json({ message: "Admission non trouvée" });
    }
    res.json(admission);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour ajouter un nombre à l'admission existante
router.post("/admission", async (req, res) => {
  const { value } = req.body;
  if (!value || typeof value !== "number") {
    return res.status(400).json({ message: "La valeur doit être un nombre" });
  }

  try {
    let admission = await Admission.findOne();
    if (!admission) {
      // Si aucune admission n'existe, on en crée une nouvelle avec la valeur
      admission = new Admission({ value });
    } else {
      // Ajouter la valeur à l'admission existante
      admission.value += value;
    }
    await admission.save();
    res.json({ message: "Admission mise à jour", admission });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
