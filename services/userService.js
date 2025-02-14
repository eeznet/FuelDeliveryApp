// services/userService.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');

const registerUser = async (userData) => {
  const { email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ ...userData, password: hashedPassword });

  try {
    await newUser.save();
    logger.info(`User registered: ${email}`);
  } catch (error) {
    logger.error('Error registering user:', { error: error.message });
    throw new Error('User registration failed');
  }
};

module.exports = { registerUser };
