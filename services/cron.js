const cron = require('node-cron');
const Invoice = require('../models/invoice');
const nodemailer = require('nodemailer');
const logger = require('../config/logger'); // For logging
require('dotenv').config();

// Maximum retry attempts for sending email
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds delay between retries

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  logger.info('Running the invoicing task at midnight...');

  try {
    // Generate and send invoices for the day
    await generateInvoices();
    logger.info('Invoices generated and sent successfully!');
  } catch (error) {
    logger.error('Error generating invoices:', { error: error.message });
    await alertOwner(`Error generating invoices: ${error.message}`);
  }

  // Perform other periodic tasks, like stock checks or status updates
  logger.info('Performing stock checks...');
  // Example stock check logic (add your own logic here if necessary)
  // checkStockLevels();
});

// Function to generate and send invoices
const generateInvoices = async () => {
  try {
    // Get all pending invoices
    const pendingInvoices = await Invoice.find({ status: 'pending' });

    if (!pendingInvoices.length) {
      logger.info('No pending invoices to process.');
      return;
    }

    // Loop through each pending invoice and process it
    for (let invoice of pendingInvoices) {
      try {
        // Send invoice via email
        await sendInvoiceEmail(invoice);

        // Mark invoice as sent
        invoice.status = 'sent';
        await invoice.save();
        logger.info(`Invoice #${invoice._id} sent successfully.`);
      } catch (error) {
        logger.error(`Error processing invoice #${invoice._id}:`, { error: error.message });
        await alertOwner(`Error processing invoice #${invoice._id}: ${error.message}`);
      }
    }
  } catch (error) {
    logger.error('Error generating invoices:', { error: error.message });
    await alertOwner(`Error generating invoices: ${error.message}`);
    throw error;
  }
};

// Email sending function with retry logic
const sendInvoiceEmail = async (invoice) => {
  const transporter = nodemailer.createTransport(getEmailTransporterConfig());

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: invoice.clientEmail,
    subject: `Invoice #${invoice._id}`,
    text: `Dear Customer, your invoice for delivery is ready. Amount: ${invoice.totalAmount}`,
  };

  try {
    await sendEmailWithRetry(transporter, mailOptions);
    logger.info(`Invoice email for #${invoice._id} sent to ${invoice.clientEmail}`);
  } catch (error) {
    logger.error(`Failed to send invoice email for #${invoice._id}: ${error.message}`);
    throw error;
  }
};

// Helper function to get email transporter config
const getEmailTransporterConfig = () => ({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Retry logic for sending email
const sendEmailWithRetry = async (transporter, mailOptions) => {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      await transporter.sendMail(mailOptions);
      return; // Exit if email is sent successfully
    } catch (error) {
      attempts++;
      logger.error(`Email sending attempt ${attempts} failed: ${error.message}`);
      if (attempts >= MAX_RETRIES) {
        throw new Error(`Failed to send email after ${MAX_RETRIES} attempts`);
      }
      logger.info(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS)); // Delay before retry
    }
  }
};

// Function to alert the owner in case of critical errors
const alertOwner = async (errorMessage) => {
  const transporter = nodemailer.createTransport(getEmailTransporterConfig());

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.OWNER_EMAIL, // The owner's email
    subject: 'Alert: Critical Task Failure',
    text: `Dear Owner,\n\nA critical error occurred during the scheduled task: ${errorMessage}\n\nPlease address this issue as soon as possible.\n\nBest regards,\nFuel Delivery System`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Owner alerted about critical failure: ${errorMessage}`);
  } catch (error) {
    logger.error('Failed to send alert to owner:', { error: error.message });
  }
};

// You can add additional functions like stock checks here
// const checkStockLevels = () => { ... };

module.exports = { generateInvoices };
