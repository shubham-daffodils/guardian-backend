const nodemailer = require("nodemailer");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.sendEmail = async (options) => {
  // Gmail SMTP credentials
  const SMTP_USER = process.env.SMTP_EMAIL; // Your Gmail address
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD; // Your Gmail app password or OAuth token

  // Create a transporter object using Gmail SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: 587, // Use port 587 for TLS
    secure: false, // Set to false for TLS (port 587)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${SMTP_USER}>`, // Sender address
    to: options.email, // Recipient address
    subject: options.subject, // Subject line
    text: options.message, // Plain text body
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};
