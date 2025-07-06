const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const pool = require('../db'); // ✅ Use PostgreSQL pool

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // ✅ Check if user already exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE provider_id = $1 AND provider = $2',
      [profile.id, 'github']
    );

    if (existing.rows.length > 0) {
      return done(null, existing.rows[0]);
    }

    // ✅ Create new GitHub user
    const result = await pool.query(
      `INSERT INTO users (provider, provider_id, name, email, profile_pic)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        'github',
        profile.id,
        profile.displayName || profile.username,
        profile.emails?.[0]?.value || '',
        profile.photos?.[0]?.value || ''
      ]
    );

    done(null, result.rows[0]);
  } catch (err) {
    console.error('GitHub strategy error:', err);
    done(err, null);
  }
}));
