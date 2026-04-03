const express = require('express');
const router = express.Router();

// Dummy data (for now)
const clinicsData = {
  bhopal: [
    {
      name: 'Dr. Sharma',
      specialty: 'Gynecologist',
      hospital: 'City Hospital',
      address: 'MP Nagar, Bhopal',
      phone: '9999999999',
      area: 'MP Nagar'
    }
  ],
  indore: [
    {
      name: 'Dr. Patel',
      specialty: 'Gynecologist',
      hospital: 'Apollo Clinic',
      address: 'Vijay Nagar, Indore',
      phone: '8888888888',
      area: 'Vijay Nagar'
    }
  ]
};

// Page
router.get('/', (req, res) => {
  const cityQuery = req.query.city?.toLowerCase() || '';
  const clinics = clinicsData[cityQuery] || [];

  res.render('doctor', {
    clinics,
    cityQuery,
    lat: null,
    lng: null
  });
});

module.exports = router;