import { pool } from "../config/db.js";
import { getDemoCampaignTargets, getDemoEvents, getDemoTargets } from "../data/demoStore.js";

export const getStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(DISTINCT tracking_id) FILTER (WHERE type='open') AS opens,
        COUNT(DISTINCT tracking_id) FILTER (WHERE type='click') AS clicks,
        COUNT(DISTINCT tracking_id) FILTER (WHERE type='submitted') AS submitted,
        COUNT(DISTINCT tracking_id) AS total
      FROM events
    `);

    const stats = result.rows[0];

    return res.json({
      ...stats,
      open_rate: ((stats.opens / stats.total) * 100 || 0).toFixed(2),
      click_rate: ((stats.clicks / stats.total) * 100 || 0).toFixed(2),
      submit_rate: ((stats.submitted / stats.total) * 100 || 0).toFixed(2)
    });
  } catch (dbError) {
    console.warn("Analytics falling back to demo store:", dbError.message);
    const events = getDemoEvents();
    const targets = getDemoTargets();
    const campaignTargets = getDemoCampaignTargets();
    const uniqueTrackingIds = [...new Set(events.map((event) => event.tracking_id))];
    const opens = new Set(events.filter((event) => event.type === "open").map((event) => event.tracking_id)).size;
    const clicks = new Set(events.filter((event) => event.type === "click").map((event) => event.tracking_id)).size;
    const submitted = new Set(
      events.filter((event) => event.type === "submitted").map((event) => event.tracking_id)
    ).size;
    const total = uniqueTrackingIds.length;

    const departmentBreakdown = targets.map((target) => {
      const trackingIds = campaignTargets
        .filter((item) => String(item.target_id) === String(target.id))
        .map((item) => item.tracking_id);
      const targetEvents = events.filter((event) => trackingIds.includes(event.tracking_id));
      return {
        department: target.department || "General",
        target: `${target.first_name} ${target.last_name}`,
        email: target.email,
        opened: targetEvents.some((event) => event.type === "open"),
        clicked: targetEvents.some((event) => event.type === "click"),
        submitted: targetEvents.some((event) => event.type === "submitted")
      };
    });

    return res.json({
      opens,
      clicks,
      submitted,
      total,
      open_rate: ((opens / total) * 100 || 0).toFixed(2),
      click_rate: ((clicks / total) * 100 || 0).toFixed(2),
      submit_rate: ((submitted / total) * 100 || 0).toFixed(2),
      department_breakdown: departmentBreakdown
    });
  }
};
