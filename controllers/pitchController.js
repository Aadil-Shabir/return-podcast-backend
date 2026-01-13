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
      logoOrDeck, // ✅ Added
      logoOrDeckMimeType, // ✅ Added
      byAdmin,
      winnerOfTheWeek,
    } = req.body;

    // Basic validation
    if (!fullName || !email) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (consent !== true) {
      return res.status(400).json({ error: "Consent is required." });
    }

    // 🔐 WINNER OF THE WEEK LOGIC (CREATE)
    if (winnerOfTheWeek === true) {
      await Pitch.updateMany(
        { winnerOfTheWeek: true },
        { $set: { winnerOfTheWeek: false } }
      );
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
      africanCountry: africanCountry ? String(africanCountry).trim() : "",
      consent: true,

      // ✅ Fixed: Added these fields to storage
      logoOrDeck: logoOrDeck ? String(logoOrDeck).trim() : "",
      logoOrDeckMimeType: logoOrDeckMimeType
        ? String(logoOrDeckMimeType).trim()
        : "",

      // ✅ admin fields
      byAdmin: byAdmin === true,
      winnerOfTheWeek: winnerOfTheWeek === true,
    });

    // ----- ✅ EMAIL NOTIFICATION LOGIC -----
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const fromEmail = process.env.FROM_EMAIL || process.env.ADMIN_EMAIL;

      if (adminEmail && !byAdmin) {
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
          <p><strong>Winner:</strong> ${winnerOfTheWeek}</p>
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
    }

    res.status(201).json(newPitch);
  } catch (err) {
    next(err);
  }
};

const updatePitch = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Pitch ID is required." });
    }

    const pitch = await Pitch.findById(id);
    if (!pitch) {
      return res.status(404).json({ error: "Pitch not found." });
    }

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
      africanCountry,
      logoOrDeck, // ✅ Added
      logoOrDeckMimeType, // ✅ Added
      byAdmin,
      winnerOfTheWeek,
    } = req.body;

    // 🔐 WINNER OF THE WEEK LOGIC
    if (winnerOfTheWeek === true) {
      await Pitch.updateMany(
        { _id: { $ne: id }, winnerOfTheWeek: true },
        { $set: { winnerOfTheWeek: false } }
      );
    }

    // Step 2: Update current pitch
    const updatedPitch = await Pitch.findByIdAndUpdate(
      id,
      {
        ...(fullName !== undefined && { fullName: String(fullName).trim() }),
        ...(companyName !== undefined && {
          companyName: String(companyName).trim(),
        }),
        ...(email !== undefined && {
          email: String(email).trim().toLowerCase(),
        }),
        ...(phone !== undefined && { phone: String(phone).trim() }),
        ...(pitchCategory !== undefined && {
          pitchCategory: String(pitchCategory).trim(),
        }),
        ...(oneSentenceSummary !== undefined && {
          oneSentenceSummary: String(oneSentenceSummary).trim(),
        }),
        ...(pitchVideo !== undefined && {
          pitchVideo: String(pitchVideo).trim(),
        }),
        ...(stage !== undefined && { stage: String(stage).trim() }),
        ...(fundingGoal !== undefined && {
          fundingGoal: String(fundingGoal).trim(),
        }),
        ...(whyYou !== undefined && { whyYou: String(whyYou).trim() }),
        ...(africanCountry !== undefined && {
          africanCountry: String(africanCountry).trim(),
        }),
        // ✅ Fixed: Added missing fields to the update object
        ...(logoOrDeck !== undefined && {
          logoOrDeck: String(logoOrDeck).trim(),
        }),
        ...(logoOrDeckMimeType !== undefined && {
          logoOrDeckMimeType: String(logoOrDeckMimeType).trim(),
        }),
        ...(byAdmin !== undefined && { byAdmin }),
        ...(winnerOfTheWeek !== undefined && { winnerOfTheWeek }),
      },
      { new: true }
    );

    res.status(200).json(updatedPitch);
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
    if (!id) return res.status(400).json({ error: "Pitch ID is required." });

    const pitch = await Pitch.findById(id);
    if (!pitch) return res.status(404).json({ error: "Pitch not found." });

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
  updatePitch,
};
