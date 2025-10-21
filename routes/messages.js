// routes/messages.js
const express = require("express");
const { Router } = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
} = require("../controllers/messageController");

router.post("/", createMessage);

// GET /api/messages - list for admin
router.get("/", getMessages);

// GET /api/messages/:id
router.get("/:id", getMessageById);

module.exports = router;
