require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const pool = require('./db'); // ✅ PostgreSQL connection
const authRoutes = require('./routes/auth');

require('./config/google');
require('./config/github');
require('./config/facebook');
require('./config/local');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Passport session setup with PostgreSQL
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', require('./routes/tasks'));

module.exports = app;
