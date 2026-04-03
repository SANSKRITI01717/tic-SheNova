const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Profile page
router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const user = await User.findById(req.session.user.id);

  res.render('profile', {
    user,
    success: null,
    error: null
  });
});

// Update basic info
router.post('/update', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const { name, age, city } = req.body;

    await User.findByIdAndUpdate(req.session.user.id, {
      name,
      age,
      city
    });

    res.redirect('/profile');

  } catch (err) {
    res.send('Error updating profile');
  }
});

// Update health info
router.post('/health', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    await User.findByIdAndUpdate(req.session.user.id, req.body);
    res.redirect('/profile');
  } catch (err) {
    res.send('Error saving health data');
  }
});

module.exports = router;