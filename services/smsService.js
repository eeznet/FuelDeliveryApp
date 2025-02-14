// services/smsService.js
const twilio = require('twilio');
const logger = require('../config/logger');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSms = async (to, body) => {
  try {
    await client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body,
    });
    logger.info(`SMS sent to ${to}`);
  } catch (error) {
    logger.error('Error sending SMS:', { error: error.message });
  }
};

module.exports = { sendSms };
