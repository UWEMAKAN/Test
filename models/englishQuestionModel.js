const { englishQuestionSchema } = require('../schemas/questionSchema');
const Question = require('../models/questionModel');

module.exports = Question.discriminator('EnglishQuestion', englishQuestionSchema);