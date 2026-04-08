const nodemailer = require("nodemailer");

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Send an email using async/await
const sendRegisterMail = async (sendToMail, name) => {
  const info = await transporter.sendMail({
    from: `"Backend Ledger" <${process.env.NODEMAILER_USER}>`,
    to: `${sendToMail}`,
    subject: `${name}, You have successfully register to backend-ledger`,
    text: `${name}, You have successfully register to backend-ledger`, // Plain-text version of the message
    html: "<b>Welcome</b>", // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

const sendTransactionMail = async (userEmail, name, account, toAccount) => {
  const info = await transporter.sendMail({
    from: `"Backend Ledger" <${process.env.NODEMAILER_USER}>`,
    to: `${userEmail}`,
    subject: `${name}, You have successfully register to backend-ledger`,
    text: `${name}, You have successfully register to backend-ledger`, // Plain-text version of the message
    html: "<b>Welcome</b>", // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

const sendTransactionFailureMail = async (userEmail, name, account, toAccount) => {
  const info = await transporter.sendMail({
    from: `"Adesh Barve" <${process.env.NODEMAILER_USER}>`,
    to: `${userEmail}`,
    subject: `${name}, Transaction failed at backend-ledger`,
    text: `${name}, Transaction failed at backend-ledger`, // Plain-text version of the message
  });

  console.log("Message sent:", info.messageId);
};

module.exports = { sendRegisterMail,sendTransactionMail, sendTransactionFailureMail };
