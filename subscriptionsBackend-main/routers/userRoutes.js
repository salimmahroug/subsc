const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Get all users
router.get("/user", async (req, res) => {
  const { page = 1, perPage = 8, search = "", category = "" } = req.query;
  const pageNumber = parseInt(page, 10);
  const perPageNumber = parseInt(perPage, 10);

  try {
    let query = {};

    if (search) {
      const searchTerms = search.split(" ").filter((term) => term.length > 0);
      if (searchTerms.length === 1) {
        query = {
          $or: [
            { nom: new RegExp(searchTerms[0], "i") },
            { prenom: new RegExp(searchTerms[0], "i") },
          ],
        };
      } else if (searchTerms.length === 2) {
        query = {
          $or: [
            {
              $and: [
                { nom: new RegExp(searchTerms[0], "i") },
                { prenom: new RegExp(searchTerms[1], "i") },
              ],
            },
            {
              $and: [
                { nom: new RegExp(searchTerms[1], "i") },
                { prenom: new RegExp(searchTerms[0], "i") },
              ],
            },
          ],
        };
      }
    }

    if (category) {
      query.category = category;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * perPageNumber)
      .limit(perPageNumber);

    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Post a new user
router.post("/user", async (req, res) => {
  const newUser = new User({
    nom: req.body.nom,
    prenom: req.body.prenom,
    telephone: req.body.telephone,
    dateOfBirth: req.body.dateOfBirth,
    nombre_de_servers: req.body.nombre_de_servers,
    montant: req.body.montant,
    category: req.body.category,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a User
router.put("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a User
// Delete a user
router.delete("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
