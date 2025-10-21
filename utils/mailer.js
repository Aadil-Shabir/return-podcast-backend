// utils/mailer.js
const nodemailer = require("nodemailer");

let transporter;

const initMailer = (config) => {
  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT || 587),
    secure: Number(config.SMTP_PORT) === 465, // true for 465
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  return transporter
    .verify()
    .then(() => console.log("Mailer ready"))
    .catch((err) => {
      console.error("Mailer verify failed", err);
      // still return transporter; sending will fail if misconfigured
      return transporter;
    });
};

const sendMail = async ({ from, to, subject, html, text }) => {
  if (!transporter) throw new Error("Mailer not initialized");
  const info = await transporter.sendMail({ from, to, subject, html, text });
  return info;
};

module.exports = { initMailer, sendMail };
