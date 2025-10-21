// routes/episodes.js
const express = require("express");
const router = express.Router();
const {
  createEpisode,
  getEpisodes,
  getEpisode,
  updateEpisode,
  deleteEpisode,
} = require("../controllers/episodeController");

// Public endpoints (you can later protect create/edit/delete with auth)
router.post("/", createEpisode);
router.get("/", getEpisodes);
router.get("/:id", getEpisode);
router.put("/:id", updateEpisode);
router.delete("/:id", deleteEpisode);

module.exports = router;
