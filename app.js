require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();


// =======================
// 🔌 DATABASE CONNECTION
// =======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ Mongo error:', err));


// =======================
// ⚙️ MIDDLEWARE
// =======================

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session (hackathon-friendly)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Make user available in ALL EJS
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// =======================
// 🚏 ROUTES
// =======================

// Auth (landing, login, register)
app.use('/', require('./routes/auth'));

// ❗ SAFE onboarding (only if exists)
try {
  app.use('/onboarding', require('./routes/onboarding'));
} catch (err) {
  console.log('⚠️ Onboarding route not found (skipped)');
}

// Main app routes
app.use('/dashboard', require('./routes/dashboard'));
app.use('/insights', require('./routes/insights'));
app.use('/doctor', require('./routes/doctor'));
app.use('/profile', require('./routes/profile'));


// =======================
// ❌ ERROR HANDLER
// =======================

// 404 page
app.use((req, res) => {
  res.status(404).send('404 - Page not found');
});


// =======================
// 🚀 SERVER START
// =======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Herlytics running on http://localhost:${PORT}`);
});