const { mathQuestionSchema } = require('../schemas/questionSchema');
const Question = require('../models/questionModel');

module.exports = Question.discriminator('MathQuestion', mathQuestionSchema);