// controllers/pitchController.js
const Pitch = require("../models/Pitch");

/**
 * Create a new pitch
 * POST /api/pitch
 */
const createPitch = async (req, res, next) => {
  try {
    const {
      fullName,
      companyName,
      email,
      phone,
      pitchCategory,
      oneSentenceSummary,
      pitchVideo,
      stage,
      fundingGoal,
      whyYou,
      logoOrDeck,
      consent,
    } = req.body;

    // Basic validation
    if (
      !fullName ||
      !email ||
      !pitchCategory ||
      !oneSentenceSummary ||
      !pitchVideo ||
      !stage ||
      !whyYou
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (consent !== true) {
      return res.status(400).json({ error: "Consent is required." });
    }

    // Create
    const newPitch = await Pitch.create({
      fullName: String(fullName).trim(),
      companyName: companyName ? String(companyName).trim() : "",
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : "",
      pitchCategory: String(pitchCategory).trim(),
      oneSentenceSummary: String(oneSentenceSummary).trim(),
      pitchVideo: String(pitchVideo).trim(),
      stage: String(stage).trim(),
      fundingGoal: fundingGoal ? String(fundingGoal).trim() : "",
      whyYou: String(whyYou).trim(),
      logoOrDeck: logoOrDeck ? String(logoOrDeck).trim() : "",
      consent: true,
    });

    res.status(201).json(newPitch);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all pitches
 * GET /api/pitch
 */
const getAllPitches = async (req, res, next) => {
  try {
    const pitches = await Pitch.find().sort({ createdAt: -1 });
    res.json(pitches);
  } catch (err) {
    next(err);
  }
};

/**
 * Get one pitch by id
 * GET /api/pitch/:id
 */
const getPitchById = async (req, res, next) => {
  try {
    const pitch = await Pitch.findById(req.params.id);
    if (!pitch) return res.status(404).json({ error: "Pitch not found" });
    res.json(pitch);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPitch,
  getAllPitches,
  getPitchById,
};
