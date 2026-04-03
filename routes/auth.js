const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Landing
router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('landing');
});

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('auth/login', { error: null });
});

// Register page
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('auth/register', { error: null });
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, username, password, pin } = req.body;

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.render('auth/register', { error: 'Username already taken.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const hashedPin = pin ? await bcrypt.hash(pin, 10) : null;

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      password: hashed,
      pin: hashedPin
    });

    req.session.user = {
      id: user._id,
      name: user.name,
      username: user.username
    };

    res.redirect('/dashboard');

  } catch (err) {
    res.render('auth/register', { error: 'Something went wrong.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.render('auth/login', { error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('auth/login', { error: 'Wrong password' });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      username: user.username
    };

    res.redirect('/dashboard');

  } catch (err) {
    res.render('auth/login', { error: 'Something went wrong' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;