const mongoose = require('mongoose');

const { Schema } = mongoose;

const responseModel = new Schema(
  {
    response: { type: Schema.Types.Mixed, default: [] },
    time: { type: Date, default: Date.now() },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 30 },
    status: { type: String, default: 'No Attempt' }
  }
);

module.exports = mongoose.model('Response', responseModel);
