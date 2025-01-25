const nodemailer = require('nodemailer');

// Function to send an email (e.g., Invoice Email)
const sendInvoiceEmail = async (toEmail, subject, text, html) => {
    try {
        // Check if email credentials are available in environment variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            throw new Error('Email credentials not found in environment variables!');
        }

        // Fetch email service and credentials from environment variables
        const emailService = process.env.EMAIL_SERVICE || 'gmail'; // Default to Gmail if not specified
        const emailUser = process.env.EMAIL_USER;
        const emailPassword = process.env.EMAIL_PASSWORD;

        // Create reusable transporter object with SMTP transport
        const transporter = nodemailer.createTransport({
            service: emailService, // Example: 'gmail', 'yahoo', etc.
            auth: {
                user: emailUser, // Your email address
                pass: emailPassword, // Your email password or app password
            },
            tls: {
                rejectUnauthorized: false, // Allow insecure TLS connections (use only for development)
            },
        });

        // Send the email
        await transporter.sendMail({
            from: `"Fuel Delivery App" <${emailUser}>`, // Sender address with a friendly name
            to: toEmail, // Recipient's email address
            subject: subject, // Email subject
            text: text, // Plain text content
            html: html, // HTML content (e.g., styled invoice)
        });

        console.log(`Email sent successfully to ${toEmail}`);
    } catch (err) {
        console.error(`Error sending email to ${toEmail}:`, err.message);
        throw new Error('Failed to send email. Please check your configuration or recipient details.');
    }
};

module.exports = { sendInvoiceEmail };
