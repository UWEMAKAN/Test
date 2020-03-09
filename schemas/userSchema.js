const mongoose = require('mongoose');
const { extendSchema } = require('../utils/utils');

const schemas = () => {
  const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  }, { collection : 'users', discriminatorKey : '_type' });

  const applicantSchema = extendSchema(userSchema, {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    emailAddress: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    responses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Response"
      }
    ]
  }, { collection : 'users', discriminatorKey : '_type' });

  const adminSchema = extendSchema(userSchema, {
    emailAddress: { type: String, default: '' },
  }, { collection : 'users', discriminatorKey : '_type' });

  return {
    userSchema,
    applicantSchema,
    adminSchema
  }
}

module.exports = schemas();
