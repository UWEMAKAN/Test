const express = require('express');
const debug = require("debug")("app:quizRoute");
const Question = require('../models/questionModel');
const MathQuestion = require('../models/mathQuestionModel');
const EnglishQuestion = require('../models/englishQuestionModel');
const { score, generatePassword } = require("../utils/utils");
const User = require('../models/userModel');
const Response = require('../models/responseModel');
const Applicant = require('../models/applicantModel');

const applicantRouter = express.Router();

let result = 0;
let mathsQs = [];
let englishQs = [];

function router() {
  applicantRouter.use('/*', (req, res, next) => {
    if (req.user) {
      debug("User in the session\n", req.user);
      if (req.user instanceof Applicant) {
        debug("User is applicant in the session\n", req.user);
        return next();
      } else {
        return res.redirect('/auth/logout');
      }
    } else {
      return res.redirect('/auth/login');
    }
  });

  applicantRouter.route('/')
    .get((req, res) => {
      return res.redirect("/auth/login");
    });

  applicantRouter.route('/quiz')
    .get((req, res) => {
      Question.find({ _type: 'MathQuestion' }, (err, maths) => {
        if (err) {
          debug("/applicant/quiz - get ", err.stack);
          return res.redirect('/auth/logout');
        }
        Question.find({ _type: 'EnglishQuestion' }, (err, english) => {
          if (err) {
            debug("/applicant/quiz - get ", err.stack);
            return res.redirect('/auth/logout');
          }
          mathsQs = mathsQs.concat(maths);
          englishQs = englishQs.concat(english);
          return res.render("quiz", { maths, english });
        });
      });
    })    
    .post((req, res) => {
      const qs = mathsQs.concat(englishQs);
      const answers = {};
      qs.forEach(q => {
        answers[q._id] = q.answer;
      });
      result = score(req.body, answers);
      const response = new Response(req.body);
      response.score = result;
      const status = result >= 15 ? 'Passed' : 'Failed';
      response.status = status;           
      req.user.responses.push(response._id);
      response.save();
      req.user.save();
      return res.redirect("/applicant/result");
    });

  applicantRouter.route('/result')
    .get((req, res) => {
      const user = req.user;
      const id = user.responses[user.responses.length - 1];
      Response.findById(id, (err, response) => {
      if (err) {
        debug("/result - get ", err.stack);
        return res.redirect('/auth/logout');
      }
      const remark = response.status;
      req.user.password = generatePassword();
      req.user.save();
      req.logout();
      return res.render("result", { result, user, remark });
      });
    });
  return applicantRouter;
}

module.exports = router;