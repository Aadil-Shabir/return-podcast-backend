const cron = require("node-cron");
const Pitch = require("../models/Pitch");

// Run every Friday at 12:00 AM EST
// This is exactly when Thursday turns to Friday in EST
const resetWinnerJob = cron.schedule(
  "0 0 * * 5", // minute 0, hour 0, day-of-week 5 (Friday)
  async () => {
    try {
      console.log("Running weekly winner reset...");
      const result = await Pitch.updateMany(
        { winnerOfTheWeek: true },
        { $set: { winnerOfTheWeek: false } }
      );
      console.log(`Reset winnerOfTheWeek for ${result.modifiedCount} pitches.`);
    } catch (error) {
      console.error("Error resetting winnerOfTheWeek:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/New_York", // This handles EST/EDT automatically (DST changes)
  }
);

// Optional: export if you want to control it elsewhere
module.exports = { resetWinnerJob };
