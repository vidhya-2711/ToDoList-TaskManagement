// server.js

require('dotenv').config(); // ✅ Load env variables
const express = require('express');
const { Pool } = require('pg');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Load OAuth strategies
require('./config/google');
require('./config/github');
require('./config/facebook');
require('./config/local');

// PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // ✅ Match your .env variable
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ✅ Express app setup
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// 🔐 Session management
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

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// 🔌 Connect to DB & Start server
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL connected');
    client.release();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.stack);
    process.exit(1);
  });
