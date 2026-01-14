// middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 25, // limit each IP to 25 requests per minute (adjust as needed)
  message: { error: "Too many requests, slow down" },
});

module.exports = limiter;
