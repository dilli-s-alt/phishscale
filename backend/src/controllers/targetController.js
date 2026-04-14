import { pool } from "../config/db.js";
import { pool } from "../config/db.js";
import {
  addDemoTarget,
  getDemoTargets,
  bulkAddDemoTargets,
  deleteDemoTarget
} from "../data/demoStore.js";
import { parseCSV } from "../utils/csvParser.js";

export const uploadTargets = async (req, res) => {
  try {
    const data = await parseCSV(req.file.path);

    try {
      for (const row of data) {
        await pool.query(
          "INSERT INTO targets(first_name,last_name,email,department) VALUES($1,$2,$3,$4)",
          [row.first_name, row.last_name, row.email, row.department || "General"]
        );
      }

      return res.send("Targets uploaded");
    } catch (dbError) {
      console.warn("Target upload falling back to demo store:", dbError.message);

      for (const row of data) {
        addDemoTarget({
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          department: row.department || "General"
        });
      }

      return res.send("Targets uploaded in demo mode");
    }
  } catch (error) {
    console.error("Target upload failed:", error.message);
    res.status(500).json({ error: "Failed to upload targets" });
  }
};

export const createTarget = async (req, res) => {
  try {
    const { first_name, last_name, email, department } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: "First name, last name, and email are required" });
    }

    try {
      const result = await pool.query(
        "INSERT INTO targets(first_name,last_name,email,department) VALUES($1,$2,$3,$4) RETURNING *",
        [first_name, last_name, email, department || "General"]
      );

      return res.json(result.rows[0]);
    } catch (dbError) {
      console.warn("Manual target create falling back to demo store:", dbError.message);
      const target = addDemoTarget({
        first_name,
        last_name,
        email,
        department: department || "General"
      });

      return res.json(target);
    }
  } catch (error) {
    console.error("Target create failed:", error);
    res.status(500).json({ error: "Failed to create target" });
  }
};

export const getTargets = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM targets");
    return res.json(result.rows);
  } catch (dbError) {
    console.warn("Target list falling back to demo store:", dbError.message);
    return res.json(getDemoTargets());
  }
};

export const bulkCreateTargets = async (req, res) => {
  try {
    const { targets } = req.body;
    if (!Array.isArray(targets)) {
      return res.status(400).json({ error: "Targets must be an array" });
    }

    try {
      for (const row of targets) {
        await pool.query(
          "INSERT INTO targets(first_name,last_name,email,department) VALUES($1,$2,$3,$4)",
          [row.first_name, row.last_name, row.email, row.department || "General"]
        );
      }
      return res.json({ message: "Targets imported", count: targets.length });
    } catch (dbError) {
      console.warn("Bulk create falling back to demo store:", dbError.message);
      bulkAddDemoTargets(targets);
      return res.json({ message: "Targets imported in demo mode", count: targets.length });
    }
  } catch (error) {
    console.error("Bulk create failed:", error);
    res.status(500).json({ error: "Failed to import targets" });
  }
};

export const deleteTarget = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM targets WHERE id=$1", [id]);
      return res.json({ message: "Target deleted" });
    } catch (dbError) {
      console.warn("Delete target falling back to demo store:", dbError.message);
      deleteDemoTarget(id);
      return res.json({ message: "Target deleted in demo mode" });
    }
  } catch (error) {
    console.error("Delete target failed:", error);
    res.status(500).json({ error: "Failed to delete target" });
  }
};
