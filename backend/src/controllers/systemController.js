import { resetDemoStore, getDemoTemplates, getDemoTargets, getDemoOrganization } from "../data/demoStore.js";
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const resetSystem = async (req, res) => {
  try {
    console.log("Starting Factory Reset...");

    // 1. Reset JSON Store (Benchmark State)
    resetDemoStore();

    // 2. Clear & Seed Postgres if connected
    try {
      // Wipe everything
      await pool.query("TRUNCATE TABLE events, campaign_targets, targets, campaigns, templates, users RESTART IDENTITY CASCADE");
      
      const org = getDemoOrganization();
      const templates = getDemoTemplates();
      const targets = getDemoTargets();

      // Seed Organization (ensure ID 1)
      await pool.query("INSERT INTO organizations (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name", [org.id, org.name]);

      // Seed Default Admin
      const demoEmail = process.env.DEMO_EMAIL || "test@test.com";
      const demoPass = process.env.DEMO_PASSWORD || "123456";
      const hash = await bcrypt.hash(demoPass, 10);
      await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [demoEmail, hash]);

      // Seed Templates
      for (const t of templates) {
        await pool.query(
          "INSERT INTO templates (id, name, category, subject, html) VALUES ($1, $2, $3, $4, $5)",
          [t.id, t.name, t.category, t.subject, t.html]
        );
      }

      // Seed Targets (Bulk)
      for (const t of targets) {
        await pool.query(
          "INSERT INTO targets (id, first_name, last_name, email, department, organization_id) VALUES ($1, $2, $3, $4, $5, $6)",
          [t.id, t.first_name, t.last_name, t.email, t.department, t.organization_id]
        );
      }

      console.log("Postgres system reset and re-seed successful");
    } catch (dbError) {
      console.warn("Postgres reset/seed aborted (likely not configured or schema mismatch):", dbError.message);
    }
    
    res.json({ message: "System Factory Reset Complete. 50 targets and 6 templates restored." });
  } catch (error) {
    console.error("System reset failed:", error);
    res.status(500).json({ error: "Failed to reset system" });
  }
};
