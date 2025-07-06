const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db'); // ✅ Use pg pool
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // ✅ Check if user already exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE provider_id = $1 AND provider = $2',
      [profile.id, 'google']
    );

    if (existing.rows.length > 0) {
      return done(null, existing.rows[0]);
    }

    // ✅ Insert new Google user
    const result = await pool.query(
      `INSERT INTO users (provider, provider_id, name, email, profile_pic)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        'google',
        profile.id,
        profile.displayName,
        profile.emails[0].value,
        profile.photos[0].value,
      ]
    );

    return done(null, result.rows[0]);
  } catch (err) {
    console.error('Google OAuth error:', err);
    return done(err, null);
  }
}));
