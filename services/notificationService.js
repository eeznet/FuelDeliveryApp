// services/notificationService.js
const { sendInvoiceEmail } = require('./emailService');
const { sendSms } = require('./smsService');
const logger = require('../config/logger');

const sendNotification = async (user, message) => {
  try {
    await sendInvoiceEmail(user.email, message);
    await sendSms(user.phoneNumber, message);
    logger.info(`Notification sent to ${user.email} and ${user.phoneNumber}`);
  } catch (error) {
    logger.error('Error sending notification:', { error: error.message });
  }
};

module.exports = { sendNotification };
