const mongoose = require('mongoose');
const { extendSchema } = require('../utils/utils');

const schemas = () => {
  const questionSchema = new mongoose.Schema({
    question: { type: String, defualt: '' },
    options: { type: Array, default: [] },
    answer: { type: String, default: '' }
  }, { collection : 'questions', discriminatorKey : '_type' });

  questionSchema.methods.score = function(response) {
    return this.answer === response ? 1 : 0;
  };

  const mathQuestionSchema = extendSchema(questionSchema, {
  }, { collection : 'questions', discriminatorKey : '_type' });

  const englishQuestionSchema = extendSchema(questionSchema, {
  }, { collection : 'questions', discriminatorKey : '_type' });

  return {
    questionSchema,
    mathQuestionSchema,
    englishQuestionSchema
  }
}

module.exports = schemas();