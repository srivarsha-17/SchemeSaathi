const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('./models/Scheme'); // adjust path if needed

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

async function updateSchemes() {
  const schemes = await Scheme.find();
  for (let scheme of schemes) {
    const update = {};

    // Convert string fields to objects if not already
    ['title', 'description', 'department', 'benefits', 'eligibility'].forEach(field => {
      if (scheme[field] && typeof scheme[field] === 'string') {
        update[field] = { en: scheme[field], te: "" }; // keep English, Telugu empty for now
      }
    });

    if (Object.keys(update).length > 0) {
      await Scheme.findByIdAndUpdate(scheme._id, update);
      console.log(`Updated scheme: ${scheme.title}`);
    }
  }

  console.log('All schemes updated!');
  mongoose.disconnect();
}

updateSchemes().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
