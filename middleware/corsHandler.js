// corsConfig.js (optional: create a separate file for this)
const cors = require("cors");

const corsOptions = {
  origin: ["*"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

module.exports = cors(corsOptions);
