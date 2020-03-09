const mongoose = require('mongoose');

function score(responses, answers) {
  let result = 0;
  const keys = Object.keys(responses);
  keys.forEach((key) => {
    if (responses[key].includes(answers[key])) {
      result++;
    }
  });
  return result;
}

function generatePassword() {
  let length = 8;
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!$%";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function extendSchema (Schema, definition, options) {
  return new mongoose.Schema(
    Object.assign({}, Schema.obj, definition),
    options
  );
}


module.exports = { score, generatePassword, extendSchema };