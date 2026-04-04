require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Make user available globally
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/onboarding', require('./routes/onboarding'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/insights', require('./routes/insights'));
app.use('/doctor', require('./routes/doctor'));
app.use('/profile', require('./routes/profile'));

// Start server AFTER dataset load
const { loadCycleData, getDataset } = require('./data/loadCycleData');
const PORT = process.env.PORT || 3000;

loadCycleData()
  .then(() => {
    console.log("Sample dataset row:", getDataset()[0]);
    app.listen(PORT, () => {
      console.log(`Herlytics running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to load cycle dataset:', err);
    process.exit(1);
  });