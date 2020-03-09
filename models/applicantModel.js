const { applicantSchema } = require('../schemas/userSchema');
const User = require('../models/userModel');

module.exports = User.discriminator('Applicant', applicantSchema);
