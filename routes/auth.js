const bcrypt = require('bcryptjs');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const pool = require('../db'); // PostgreSQL pool

// ----------------- REGISTER (PostgreSQL) -----------------
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Register request body:', req.body);

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (username, email, password, provider)
       VALUES ($1, $2, $3, $4) RETURNING id, username, email`,
      [username, email, hashedPassword, 'local']
    );

    res.status(201).json({ message: 'User registered', user: newUser.rows[0] });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login-fail', // optional JSON fallback
    session: true
  }),
  (req, res) => {
    // ✅ Redirect or respond after successful local login
    res.json({ message: 'Login successful', user: req.user });
  }
);

router.get('/login-fail', (req, res) => {
  res.status(401).json({ message: 'Invalid username or password' });
});


// ----------------- Google -----------------
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: true
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);

// ----------------- GitHub -----------------
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/',
    session: true
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);

// ----------------- Facebook -----------------
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: true
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);

// ----------------- Logout -----------------
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.redirect('http://localhost:3000');
  });
});

// ----------------- Get Current User -----------------
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

module.exports = router;