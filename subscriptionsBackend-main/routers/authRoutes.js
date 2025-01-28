// authRoutes.js

// Import necessary modules
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/auth"); // Assuming this is your User model
const bcrypt = require("bcryptjs");
const router = express.Router();

const SECRET_KEY = "my_secret-key"; // Replace with your actual secret key

// Register route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login route (unchanged from your original implementation)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "30d",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
