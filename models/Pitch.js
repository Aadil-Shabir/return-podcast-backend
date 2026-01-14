// models/Pitch.js
const mongoose = require("mongoose");

const PitchSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    pitchCategory: { type: String, trim: true },
    oneSentenceSummary: { type: String, trim: true },
    pitchVideo: { type: String, trim: true }, // URL
    stage: { type: String, trim: true },
    fundingGoal: { type: String, default: "", trim: true }, // stored as string per request
    whyYou: { type: String, trim: true },
    winnerOfTheWeek: { type: Boolean, default: false },
    byAdmin: { type: Boolean, default: false },
    consent: { type: Boolean, required: true },
    africanCountry: { type: String, default: "" },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// optional: set a simple text index for quick searches
PitchSchema.index({ fullName: "text", companyName: "text", whyYou: "text" });

module.exports = mongoose.model("Pitch", PitchSchema);
