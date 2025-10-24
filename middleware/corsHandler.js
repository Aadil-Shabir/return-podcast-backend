// corsConfig.js (optional: create a separate file for this)
const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://returnus.com",
    ,
    "http://returnus.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

module.exports = cors(corsOptions);
