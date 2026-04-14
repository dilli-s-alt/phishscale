import { resetDemoStore } from "../data/demoStore.js";
import { pool } from "../config/db.js";

export const resetSystem = async (req, res) => {
  try {
    try {
      // Try to wipe Postgres if connected
      await pool.query("TRUNCATE TABLE events, campaign_targets, targets, campaigns, templates RESTART IDENTITY CASCADE");
      console.log("Postgres system reset successful");
    } catch (dbError) {
      console.warn("Postgres reset failed, using demo store reset:", dbError.message);
    }
    
    resetDemoStore();
    res.json({ message: "System reset successful. All data cleared." });
  } catch (error) {
    console.error("System reset failed:", error);
    res.status(500).json({ error: "Failed to reset system" });
  }
};
