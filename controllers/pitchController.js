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
      consent,
      africanCountry,
      logoOrDeck,
      logoOrDeckMimeType,
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

    let finalLogoOrDeck = "";
    let finalLogoOrDeckMimeType = "";
    let logoOrDeckSize = 0;

    if (logoOrDeck && logoOrDeckMimeType) {
      // Calculate size from base64 string
      logoOrDeckSize = Math.ceil((logoOrDeck.length * 3) / 4);

      // Validate size (12 MB = 12 * 1024 * 1024 bytes)
      if (logoOrDeckSize > 12 * 1024 * 1024) {
        return res.status(400).json({
          error: "File too large. Maximum allowed is 12MB.",
        });
      }

      finalLogoOrDeck = logoOrDeck;
      finalLogoOrDeckMimeType = logoOrDeckMimeType;
    }
    // Handle file upload via multer (if you add it later)
    else if (req.file) {
      const fileSizeInBytes = req.file.size;

      if (fileSizeInBytes > 12 * 1024 * 1024) {
        return res.status(400).json({
          error: "File too large. Maximum allowed is 12MB.",
        });
      }

      finalLogoOrDeck = req.file.buffer.toString("base64");
      finalLogoOrDeckMimeType = req.file.mimetype;
      logoOrDeckSize = fileSizeInBytes;
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
      logoOrDeck: finalLogoOrDeck,
      logoOrDeckMimeType: finalLogoOrDeckMimeType,
      logoOrDeckSize,
      africanCountry: africanCountry ? String(africanCountry).trim() : "",
      consent: true,
    });

    // ----- ✅ EMAIL NOTIFICATION LOGIC -----
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const fromEmail = process.env.FROM_EMAIL || process.env.ADMIN_EMAIL;

      if (adminEmail) {
        const subject = `New Pitch Submission from ${fullName}`;
        const html = `
          <h2>New Pitch Received</h2>
          <p><strong>Full Name:</strong> ${fullName}</p>
          <p><strong>Company Name:</strong> ${companyName || "-"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "-"}</p>
          <p><strong>Category:</strong> ${pitchCategory}</p>
          <p><strong>Country:</strong> ${africanCountry}</p>
          <p><strong>Stage:</strong> ${stage}</p>
          <p><strong>Funding Goal:</strong> ${fundingGoal || "-"}</p>
          <p><strong>One Sentence Summary:</strong><br>${oneSentenceSummary}</p>
          <p><strong>Why You:</strong><br>${whyYou}</p>
          <p><strong>Pitch Video:</strong><br><a href="${pitchVideo}" target="_blank">${pitchVideo}</a></p>
          ${
            logoOrDeck
              ? `<p><strong>Logo / Deck:</strong><br><a href="${finalLogoOrDeck}" target="_blank">${finalLogoOrDeck}</a></p>`
              : ""
          }
          <hr>
          <p>IP: ${req.ip}</p>
        `;

        await sendMail({
          from: `"${fullName} (via Contact Form)" <${fromEmail}>`,
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

const deletePitch = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID presence
    if (!id) {
      return res.status(400).json({ error: "Pitch ID is required." });
    }

    // Find pitch
    const pitch = await Pitch.findById(id);
    if (!pitch) {
      return res.status(404).json({ error: "Pitch not found." });
    }
    // Delete pitch
    await Pitch.findByIdAndDelete(id);

    res.status(200).json({
      message: "Pitch deleted successfully.",
      deletedPitchId: id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPitch,
  getAllPitches,
  getPitchById,
  deletePitch,
};
