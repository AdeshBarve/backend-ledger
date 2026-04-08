const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const sendRegisterMail=async (sendToMail,name) => {
  const info = await transporter.sendMail({
    from: `"Adesh Barve" <${process.env.NODEMAILER_USER}>`,
    to: `${sendToMail}`,
    subject: `${name}, You have successfully register to backend-ledger`,
    text: `${name}, You have successfully register to backend-ledger`, // Plain-text version of the message
    html: "<b>Registration successfull</b>", 
  });

  console.log("Message sent:", info.messageId);
};

module.exports={sendRegisterMail};