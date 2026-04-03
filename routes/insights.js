const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  res.render('insights', {
    risk: {
      score: 42,
      level: 'low',
      message: 'Everything looks normal',
      flags: [],
      ageContext: null
    },
    stats: null,
    user: {}
  });
});

module.exports = router;