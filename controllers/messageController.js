// controllers/messageController.js
const Message = require("../models/Message");
const { sendMail } = require("../utils/mailer");

const createMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save message to DB
    const saved = await Message.create({
      name,
      email,
      message,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const fromEmail = process.env.FROM_EMAIL || `no-reply@${req.hostname}`;

      if (adminEmail) {
        const subject = `New contact message from ${name}`;
        const html = `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p>IP: ${req.ip}</p>
        `;

        await sendMail({
          from: fromEmail,
          to: adminEmail,
          subject,
          html,
          text: message,
        });
      }
    } catch (mailErr) {
      console.error("Mail send error", mailErr);
      // don't block user if email fails
    }

    return res.status(201).json({ message: "Message received", data: saved });
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Not found" });
    res.json(msg);
  } catch (err) {
    next(err);
  }
};

module.exports = { createMessage, getMessages, getMessageById };
