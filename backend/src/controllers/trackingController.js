import { pool } from "../config/db.js";
import { addDemoEvent } from "../data/demoStore.js";

const getFrontendUrl = () => {
  if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes("localhost")) {
    return process.env.FRONTEND_URL;
  }
  return "https://frontend-psi-gold-34.vercel.app";
};

const frontendBaseUrl = getFrontendUrl();

export const trackOpen = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "INSERT INTO events(tracking_id,type) VALUES($1,'open')",
      [id]
    );
  } catch (dbError) {
    console.warn("Track open falling back to demo store:", dbError.message);
    addDemoEvent({ tracking_id: id, type: "open" });
  }

  // transparent pixel
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
    "base64"
  );

  res.set("Content-Type", "image/png");
  res.send(pixel);
};

export const trackClick = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "INSERT INTO events(tracking_id,type) VALUES($1,'click')",
      [id]
    );
  } catch (dbError) {
    console.warn("Track click falling back to demo store:", dbError.message);
    addDemoEvent({ tracking_id: id, type: "click" });
  }

  res.redirect(`${frontendBaseUrl}/fake-login?tid=${id}`);
};

export const captureData = async (req, res) => {
  const { tracking_id } = req.body;

  try {
    await pool.query(
      "INSERT INTO events(tracking_id,type) VALUES($1,'submitted')",
      [tracking_id]
    );
  } catch (dbError) {
    console.warn("Track submit falling back to demo store:", dbError.message);
    addDemoEvent({ tracking_id, type: "submitted" });
  }

  res.redirect(`${frontendBaseUrl}/caught`);
};
