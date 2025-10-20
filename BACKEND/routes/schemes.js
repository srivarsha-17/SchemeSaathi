const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Add a new scheme
router.post('/add', async (req, res) => {
  try {
    const { title, description, category, youtubeLink, portalLink, image } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    const newScheme = await Scheme.create({ title, description, category, youtubeLink, portalLink, image });
    res.status(201).json({ message: 'Scheme added', scheme: newScheme });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Test route by category
router.get('/test/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const schemes = await Scheme.find({ category: category.toLowerCase() });
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get schemes related to logged-in user
router.get('/related', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    const decoded = jwt.verify(token, 'secretKey');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const lang = req.query.lang || 'en';
    const schemes = await Scheme.find({ category: user.category.toLowerCase() });

    const schemesLang = schemes.map(scheme => ({
      title:
        typeof scheme.title === "string"
          ? scheme.title
          : scheme.title[lang] || scheme.title['en'] || "Untitled Scheme",
      description:
        typeof scheme.description === "string"
          ? scheme.description
          : scheme.description[lang] || scheme.description['en'] || "No description available",
      category: scheme.category,
      youtubeLink: scheme.youtubeLink,
      portalLink: scheme.portalLink,
      image: scheme.image || ''
    }));

    res.status(200).json(schemesLang);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all schemes by category
router.get('/:category', async (req, res) => {
  const { category } = req.params;
  const lang = req.query.lang || 'en';

  try {
    const schemes = await Scheme.find({ category: category.toLowerCase() });

    const schemesLang = schemes.map(scheme => ({
      title:
        typeof scheme.title === "string"
          ? scheme.title
          : scheme.title[lang] || scheme.title['en'] || "Untitled Scheme",
      description:
        typeof scheme.description === "string"
          ? scheme.description
          : scheme.description[lang] || scheme.description['en'] || "No description available",
      category: scheme.category,
      youtubeLink: scheme.youtubeLink,
      portalLink: scheme.portalLink,
      image: scheme.image || '' // ✅ image included
    }));

    res.status(200).json(schemesLang);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
