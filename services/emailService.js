const nodemailer = require('nodemailer');
const logger = require('../config/logger'); // Assuming you have a logger for better tracking

// Function to create a reusable transporter object with SMTP transport
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail'; // Default to Gmail if not specified
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  // Validate email credentials
  if (!emailUser || !emailPassword) {
    const errorMsg = 'Email credentials not found in environment variables!';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Create transporter object with email service and credentials
  return nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser, // Your email address
      pass: emailPassword, // Your email password or app password
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV !== 'production', // Reject unauthorized connections only in production
    },
  });
};

// Function to send an email (e.g., Invoice Email)
const sendEmail = async (toEmail, subject, text, html) => {
  try {
    const transporter = createTransporter(); // Reuse the transporter creation logic

    const mailOptions = {
      from: `"Fuel Delivery App" <${process.env.EMAIL_USER}>`, // Sender address with a friendly name
      to: toEmail, // Recipient's email address
      subject: subject, // Email subject
      text: text, // Plain text content
      html: html, // HTML content (e.g., styled invoice)
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info(`Email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
    return info; // Return the email info for further use (e.g., logging or response)
  } catch (err) {
    const errorMsg = `Error sending email to ${toEmail}: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
};

// Function to send an invoice email (specialized version of sendEmail)
const sendInvoiceEmail = async (toEmail, invoice) => {
  const subject = `Invoice #${invoice._id}`;
  const text = `Dear Customer, your invoice for delivery is ready. Amount: ${invoice.totalAmount}`;
  const html = `<p>Dear Customer,</p><p>Your invoice for delivery is ready. Amount: <strong>${invoice.totalAmount}</strong></p>`;

  return sendEmail(toEmail, subject, text, html);
};

module.exports = { sendInvoiceEmail, sendEmail }; // Export both sendInvoiceEmail and generic sendEmail
