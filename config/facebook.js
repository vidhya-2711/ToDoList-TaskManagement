const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ providerId: profile.id });
      if (existingUser) return done(null, existingUser);

      const newUser = await User.create({
        provider: 'facebook',
        providerId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value || '',
        profilePic: profile.photos?.[0]?.value || '',
      });

      done(null, newUser);
    } catch (err) {
      console.error('🔥 Facebook Auth Error:', err); // log the actual error
      done(err, null);
    }
  }
));
