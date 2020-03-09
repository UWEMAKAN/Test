const { adminSchema } = require('../schemas/userSchema');
const User = require('../models/userModel');

module.exports = User.discriminator('Admin', adminSchema);
