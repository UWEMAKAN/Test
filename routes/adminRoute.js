const express = require('express');
const mongoose = require('mongoose');
const debug = require("debug")("app:adminRoutes");

const Response = require('../models/responseModel');
const User = require('../models/userModel');
const Applicant = require('../models/applicantModel');
const Question = require('../models/questionModel');
const MathQuestion = require('../models/mathQuestionModel');
const EnglishQuestion = require('../models/englishQuestionModel');
const { generatePassword } = require('../utils/utils');

const adminRouter = express.Router();

function router() {

  adminRouter.use('/*', (req, res, next) => {
    if (req.user) {
      if (req.user.username === 'admin') {
        return next();
      } else {
        return res.redirect('/auth/logout');
      }
    } else {
      return res.redirect('/auth/login');
    }
  });

  adminRouter.route('/')
    .get((req, res) => {
      return res.redirect('/auth/login');
    });
  
  adminRouter.route('/dashboard')
    .get((req, res) => {
      return res.render('admin/dashboard');
    });
  
  adminRouter.route('/applicants')
    .get((req, res) => {
      User.find({_type: "Applicant"}).populate("responses").exec((err, applicants) => {
        if (err) {
          debug(err.stack);
          return res.redirect('/admin/dashboard');
        }
        return res.render('admin/applicants', { applicants });
      });
    })
    .post((req, res) => {
      const keys = Object.keys(req.body);
        keys.forEach((key) => {
          const id = mongoose.Types.ObjectId(key);
          User.findOneAndRemove({ _id: id }, (err, applicant) => {
            applicant.responses.forEach((resp) => {
              Response.findOneAndRemove({ _id: resp }, (err, response) => {
                if (err) {
                  debug("/admin/applicants/:id post route: Response.findOneAndRemove ", err.stack);
                  return res.redirect('/admin/applicants/');
                }
              });
            });
          });
        });
      return res.redirect('/admin/applicants');
    });
    
  
  adminRouter.route('/applicants/new')
    .get((req, res) => {
      const password = generatePassword();
      return res.render('admin/newApplicant', { password });
    })
    .post((req, res) => {
      const {
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        password,
      } = req.body;

      const applicant = new Applicant({
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        password,
        username: emailAddress        
      });

      Applicant.findById(applicant._id, (err, appl) => {
        if (err) {
          debug(" /admin/applicants post - ", err.stack);
          return res.redirect('/admin/applicants/new');
        }
        if (!appl) {
          applicant.save();
          return res.redirect('/admin/applicants');
        } else {
          return res.redirect('/admin/applicants/' + appl._id);
        }
      });      
    });
  
  adminRouter.route('/applicants/:id')
    .get((req, res) => {
      User.findById(req.params.id).populate("responses").exec((err, applicant) => {
        if (err) {
          debug("/admin/applicants/:id get route: Applicant.findById ", err.stack);
          return res.redirect('/admin/applicants');
        }
        return res.render('admin/applicant', { applicant });
      });
    })
    .post((req, res) => {        
      User.findById(req.params.id, (err, applicant) => {
        if (err) {
          debug("/admin/applicants/:id post route: Applicant.findById ", err.stack);
          return res.redirect('/admin/applicants/' + req.params.id);
        }
        const keys = Object.keys(req.body);
        keys.forEach((key) => {
          const id = mongoose.Types.ObjectId(key);
          const idx = applicant.responses.indexOf(id);
          applicant.responses.splice(idx, 1);
          
          Response.findOneAndRemove({ _id: id }, (err, response) => {
            if (err) {
              debug("/admin/applicants/:id post route: Response.findOneAndRemove ", err.stack);
              return res.redirect('/admin/applicants/' + req.params.id);
            }
          });
        });
        applicant.save();
        return res.redirect('/admin/applicants/' + req.params.id);
      });
    });
    
  adminRouter.route('/questions')
    .get((req, res) => {
      Question.find((err, questions) => {
        if (err) {
          debug(" /admin/questions - get ", err.stack);
          return res.redirect('/admin/applicants');
        }
        return res.render('admin/questions', { questions });
      });
    })
    .post((req, res) => {
      const keys = Object.keys(req.body);
      keys.forEach((key) => {
        const id = mongoose.Types.ObjectId(key);
        Question.findOneAndRemove({ _id: id }, (err, question) => {
          if (err) {
            debug(" /admin/questions - get ", err.stack);
            return res.redirect('/admin/questions');
          }
          return res.redirect('/admin/questions');
        });
      });
    });
    

  adminRouter.route('/questions/new')
    .get((req, res) => {
      return res.render('admin/newQuestion');
    })
    .post((req, res) => {
      const {
        question,
        answer,
        optionA,
        optionB,
        optionC,
        optionD,
        optionE,
        questionType
      } = req.body;

      const options = [optionA, optionB, optionC, optionD, optionE];
      let newQuestion;

      if (questionType === 'Math') {
        newQuestion = new MathQuestion({
          question,
          options,
          answer,
        });
      }
      else if (questionType === 'English') {
        newQuestion = new EnglishQuestion({
          question,
          options,
          answer,
        });
      }
      Question.findById(newQuestion._id, (err, que) => {
        if (err) {
          debug("/admin/questions - post\n", err.stack);
          return res.redirect('/admin/questions/new');
        }
        if (!que) {
          newQuestion.save();
          return res.redirect('/admin/questions');
        } else {
          return res.redirect('/admin/questions/' + que._id);
        }
      });   
    });

  adminRouter.route('/questions/:id')
    .get((req, res) => {
      const alpha = [ 'A.', 'B.', 'C.', 'D.', 'E.'];
      Question.findById(req.params.id, (err, question) => {
        if (err) {
          debug("/admin/questions/:id\n", err.stack);
          return res.redirect('/admin/questions');
        }
        if (!question) {
          return res.redirect('/admin/questions');
        }
        return res.render('admin/question', { alpha, question });
      });
    });

  return adminRouter;
}

module.exports = router;