const express = require('express');
const passport = require('passport');
const debug = require('debug')('app:authRoute');

const Admin = require('../models/adminModel');
const Applicant = require('../models/applicantModel');
const User = require('../models/userModel');
const { generatePassword } = require('../utils/utils');

const authRouter = express.Router();

function router() {

  authRouter.route('/')
    .get((req, res) => {
      return res.redirect('/auth/login');
    })

  authRouter.route('/login')
  .get((req, res) => {
    User.find({ _type: 'Admin' }, (err, admins) => {
      if(err) {
        debug("authRoute: route: /auth/login - get", err.stack);
        return res.redirect('/');
      }
      if (admins.length === 0) {
        const admin = new Admin({
          username: 'admin',
          password: 'Hr2020@#',
          emailAddress: 'uwem.nkereuwem@zanibal.com'
        });
        admin.save();
      }
    });
    return res.render('auth/login');   
  })
  .post(passport.authenticate('local', { failureRedirect: '/auth/login' }),
    (req, res) => {
      if (req.user instanceof Admin) {
        return res.redirect('/admin/applicants');
      } else if (req.user instanceof Applicant) {
        return res.redirect('/applicant/quiz');
      } else {
        return res.redirect('/auth/login');
      }      
    });

authRouter.route('/logout')
  .get((req, res) => {
    if (req.user instanceof Applicant) {
      req.user.password = generatePassword();
      req.user.save();
    }
    req.logout();
    return res.redirect('/auth/login');
  });

  return authRouter;
}

module.exports = router;
