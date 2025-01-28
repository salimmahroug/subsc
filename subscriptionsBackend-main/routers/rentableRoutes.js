const express = require("express");
const router = express.Router();
const Rentable = require("../models/rentable");

// Route pour obtenir la rentable actuelle
router.get("/rentable", async (req, res) => {
  try {
    const rentable = await Rentable.findOne();
    if (!rentable) {
      return res.status(404).json({ message: "Rentable non trouvée" });
    }
    res.json(rentable);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour mettre à jour ou créer une rentable
router.post("/rentable", async (req, res) => {
  const { value } = req.body;

  // Validation de l'entrée
  if (typeof value !== "number" || value <= 0) {
    return res.status(400).json({ message: "La valeur doit être un nombre positif" });
  }

  try {
    // Calculer les parts pour montasar et salim
    const halfValue = value / 2;

    // Chercher un document existant
    let rentable = await Rentable.findOne();
    if (!rentable) {
      // Créer un nouveau document si aucun n'existe
      rentable = new Rentable({
        montasar: halfValue,
        salim: halfValue,
        value,
      });
    } else {
      // Mettre à jour le document existant
      rentable.montasar += halfValue;
      rentable.salim += halfValue;
      rentable.value += value;
    }

    // Sauvegarder les modifications
    await rentable.save();
    res.json({ message: "Rentable mise à jour avec succès", rentable });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Route pour mettre à jour les parts de Salim et Montasar
router.post("/rentable/update", async (req, res) => {
    const { salim, montasar } = req.body;
  
    try {
      const rentable = await Rentable.findOne();
      if (!rentable) {
        return res.status(404).json({ message: "Rentable non trouvée" });
      }
  
      rentable.salim -= salim;
      rentable.montasar -= montasar;
      await rentable.save();
  
      res.json({ message: "Rentable mise à jour avec succès", rentable });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
module.exports = router;
