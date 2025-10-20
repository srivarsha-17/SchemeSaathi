const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    te: { type: String } // optional Telugu translation
  },
  description: {
    en: { type: String, required: true },
    te: { type: String }
  },
  category: { type: String, required: true },
  youtubeLink: { type: String },
  portalLink: { type: String },
  image: { type: String } // ✅ Added image field
}, { timestamps: true });

module.exports = mongoose.model('Scheme', SchemeSchema);

