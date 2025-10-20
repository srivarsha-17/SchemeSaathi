const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Signup

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, category } = req.body;

    if (!name || !email || !password || !category) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({ name, email, password, category }); // plain text
    await newUser.save();

    res.json({ msg: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (password !== user.password) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({ msg: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
