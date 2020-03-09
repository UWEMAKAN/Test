const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel');

function configPassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    (username, password, done) => {
      User.findOne({ username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { msg: 'Incorrect username.' });
        }
        if (user.password !== password) {
          return done(null, false, { msg: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
}

module.exports = configPassport;