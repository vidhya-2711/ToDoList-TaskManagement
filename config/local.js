const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('../db'); // ✅ PostgreSQL connection

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // ✅ Important: use email instead of username
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // ✅ Check if user exists in PostgreSQL
        const result = await pool.query(
          'SELECT * FROM users WHERE email = $1 AND provider = $2',
          [email, 'local']
        );

        const user = result.rows[0];
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        // ✅ Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user); // ✅ Login successful
      } catch (err) {
        return done(err);
      }
    }
  )
);
