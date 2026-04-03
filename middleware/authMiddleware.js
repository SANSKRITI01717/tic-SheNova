// Protect routes (only logged in users)
exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Prevent logged-in users from accessing login/register again
exports.redirectIfLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
};