// models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // store metadata if needed (IP, userAgent)
  ip: { type: String },
  userAgent: { type: String },
});

module.exports = mongoose.model("Message", MessageSchema);
