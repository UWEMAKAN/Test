const mongoose = require('mongoose');
const { questionSchema } = require('../schemas/questionSchema');

module.exports = mongoose.model('Question', questionSchema);