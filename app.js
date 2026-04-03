require('dotenv').config();

console.log("MONGO_URL:", process.env.MONGO_URL);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default || connectMongo;
const path = require('path');

const app = express();

// ✅ Connect to MongoDB (FIXED)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session (correct config)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// Global locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/onboarding', require('./routes/onboarding'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/insights', require('./routes/insights'));
app.use('/doctor', require('./routes/doctor'));
app.use('/api', require('./routes/api'));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌿 Herlytics running → http://localhost:${PORT}`));