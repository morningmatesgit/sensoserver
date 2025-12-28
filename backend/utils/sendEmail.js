const nodemailer = require("nodemailer");

/**
 * Sends an email using Gmail SMTP
 * @param {Object} options - Email configuration
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.html - HTML email body
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create transport
    // Using smtp.gmail.com with explicit port and security settings as requested
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // TLS
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Message structure
    const mailOptions = {
      from: `"Senso Plant Care" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
