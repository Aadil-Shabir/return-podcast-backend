// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: err.message || "Server error" });
};

module.exports = errorHandler;
