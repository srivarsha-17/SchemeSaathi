const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/images', express.static('images'));


// Import routes
const authRoutes = require('./routes/auth');
const schemeRoutes = require('./routes/schemes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(5000, () => console.log('Server running on port 5000'));
