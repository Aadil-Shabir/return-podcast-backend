// routes/pitchRoutes.js
const express = require("express");
const router = express.Router();

const {
  createPitch,
  getAllPitches,
  getPitchById,
  deletePitch,
} = require("../controllers/pitchController");

// POST   /api/pitch      -> create new pitch
router.post("/", createPitch);

// GET    /api/pitch      -> get all pitches
router.get("/", getAllPitches);

// GET    /api/pitch/:id  -> get single pitch
router.get("/:id", getPitchById);
router.delete("/:id", deletePitch);

module.exports = router;
