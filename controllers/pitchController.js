// controllers/pitchController.js
const Pitch = require("../models/Pitch");
const { sendMail } = require("../utils/mailer");

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

    // Create pitch
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

    // ----- ✅ EMAIL NOTIFICATION LOGIC -----
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const fromEmail = process.env.FROM_EMAIL || `no-reply@${req.hostname}`;

      if (adminEmail) {
        const subject = `New Pitch Submission from ${fullName}`;
        const html = `
          <h2>New Pitch Received</h2>
          <p><strong>Full Name:</strong> ${fullName}</p>
          <p><strong>Company Name:</strong> ${companyName || "-"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "-"}</p>
          <p><strong>Category:</strong> ${pitchCategory}</p>
          <p><strong>Stage:</strong> ${stage}</p>
          <p><strong>Funding Goal:</strong> ${fundingGoal || "-"}</p>
          <p><strong>One Sentence Summary:</strong><br>${oneSentenceSummary}</p>
          <p><strong>Why You:</strong><br>${whyYou}</p>
          <p><strong>Pitch Video:</strong><br><a href="${pitchVideo}" target="_blank">${pitchVideo}</a></p>
          ${
            logoOrDeck
              ? `<p><strong>Logo / Deck:</strong><br><a href="${logoOrDeck}" target="_blank">${logoOrDeck}</a></p>`
              : ""
          }
          <hr>
          <p>IP: ${req.ip}</p>
        `;

        await sendMail({
          from: `"${fullName}" <${fromEmail}>`,
          replyTo: email,
          to: adminEmail,
          subject,
          html,
          text: `${fullName} submitted a pitch. Category: ${pitchCategory} Stage: ${stage}`,
        });
      }
    } catch (mailErr) {
      console.error("Pitch email send error", mailErr);
      // do not block response on mail fail
    }
    // ------------------------------------------------------

    res.status(201).json(newPitch);
  } catch (err) {
    next(err);
  }
};

const getAllPitches = async (req, res, next) => {
  try {
    const pitches = await Pitch.find().sort({ createdAt: -1 });
    res.json(pitches);
  } catch (err) {
    next(err);
  }
};

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
