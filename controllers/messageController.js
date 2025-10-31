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
      const fromEmail = process.env.FROM_EMAIL || process.env.ADMIN_EMAIL; // Your authenticated Gmail

      if (adminEmail && fromEmail) {
        const subject = `New contact message from ${name}`;
        const html = `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-left: 3px solid #0066cc;">
            ${message.replace(/\n/g, "<br>")}
          </p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            <strong>IP:</strong> ${req.ip}<br>
            <strong>User Agent:</strong> ${req.headers["user-agent"]}
          </p>
        `;

        await sendMail({
          // ✅ Use user's name as display name, but your Gmail as the actual sender
          from: `"${name} (via Contact Form)" <${fromEmail}>`,
          // ✅ Set reply-to so you can click "Reply" and it goes to the user
          replyTo: `"${name}" <${email}>`,
          to: adminEmail,
          subject,
          html,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nIP: ${req.ip}`,
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
