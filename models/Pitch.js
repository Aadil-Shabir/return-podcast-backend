// models/Pitch.js
const mongoose = require("mongoose");

const PitchSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    pitchCategory: { type: String, required: true, trim: true },
    oneSentenceSummary: { type: String, required: true, trim: true },
    pitchVideo: { type: String, required: true, trim: true }, // URL
    stage: { type: String, required: true, trim: true },
    fundingGoal: { type: String, default: "", trim: true }, // stored as string per request
    whyYou: { type: String, required: true, trim: true },
    logoOrDeck: { type: String, default: "", trim: true }, // URL to logo or deck
    logoOrDeckMimeType: {
      type: String,
      default: "",
      enum: [
        "",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ],
    },
    logoOrDeckSize: {
      type: Number, // in bytes
      default: 0,
    },
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
