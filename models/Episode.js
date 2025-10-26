// models/Episode.js
const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  youtubeLink: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  spotifyLink: { type: String, default: "" },
  description: { type: String, default: "" },
  tag: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  mainEpisode: { type: Boolean, default: false },
});

EpisodeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Episode", EpisodeSchema);
