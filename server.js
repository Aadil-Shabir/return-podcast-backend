// server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
// const cors = require("cors");
const productRoutes = require("./routes/products");

const connectDB = require("./config/db");
const messageRoutes = require("./routes/messages");
const episodeRoutes = require("./routes/episodes");
const pitchRoutes = require("./routes/pitch");
const userRoutes = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");
const { initMailer } = require("./utils/mailer");
const corsHandler = require("./middleware/corsHandler");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
// app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(corsHandler);

// Basic rate limiter applied globally (adjust if you want different rules)
app.use(rateLimiter);

// Routes
app.use("/api/messages", messageRoutes);

app.use("/api/episodes", episodeRoutes);
app.use("/api/pitch", pitchRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// healthcheck
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// error handler
app.use(errorHandler);

// Start
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await initMailer(process.env); // initialize transporter (will verify)
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup error", err);
    process.exit(1);
  }
})();
