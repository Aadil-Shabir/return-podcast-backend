// controllers/episodeController.js
const Episode = require("../models/Episode");

const createEpisode = async (req, res, next) => {
  try {
    const {
      title,
      youtubeLink,
      author,
      spotifyLink,
      description,
      tag,
      mainEpisode,
    } = req.body;

    if (!title || !youtubeLink || !author) {
      return res
        .status(400)
        .json({ error: "title, youtubeLink and author are required" });
    }

    // ✅ If this episode is being marked as main, unset previous main
    if (mainEpisode === true) {
      await Episode.updateMany(
        { mainEpisode: true },
        { $set: { mainEpisode: false } }
      );
    }

    const ep = await Episode.create({
      title,
      youtubeLink,
      author,
      spotifyLink: spotifyLink || "",
      description: description || "",
      tag: tag || "",
      mainEpisode: mainEpisode || false,
    });

    res.status(201).json(ep);
  } catch (err) {
    next(err);
  }
};

const getEpisodes = async (req, res, next) => {
  try {
    const episodes = await Episode.find().sort({ createdAt: -1 });
    res.json(episodes);
  } catch (err) {
    next(err);
  }
};

const getEpisode = async (req, res, next) => {
  try {
    const ep = await Episode.findById(req.params.id);
    if (!ep) return res.status(404).json({ error: "Not found" });
    res.json(ep);
  } catch (err) {
    next(err);
  }
};

const updateEpisode = async (req, res, next) => {
  try {
    const { mainEpisode } = req.body;

    // ✅ If this update tries to set mainEpisode=true,
    // unset previous main first (except this episode itself)
    if (mainEpisode === true) {
      await Episode.updateMany(
        { _id: { $ne: req.params.id }, mainEpisode: true },
        { $set: { mainEpisode: false } }
      );
    }

    const ep = await Episode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!ep) return res.status(404).json({ error: "Not found" });

    res.json(ep);
  } catch (err) {
    next(err);
  }
};

const deleteEpisode = async (req, res, next) => {
  try {
    const ep = await Episode.findByIdAndDelete(req.params.id);
    if (!ep) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEpisode,
  getEpisodes,
  getEpisode,
  updateEpisode,
  deleteEpisode,
};
