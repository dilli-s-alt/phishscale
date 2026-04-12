import express from "express";
import cors from "cors";
import { isSendgridConfigured, isSmtpConfigured } from "./config/mail.js";

import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import targetRoutes from "./routes/targetRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    port: process.env.PORT || 5000,
    frontend: process.env.FRONTEND_URL || "http://localhost:5173",
    mail: isSendgridConfigured()
      ? "sendgrid-ready"
      : isSmtpConfigured()
        ? "smtp-ready"
        : "mail-not-configured"
  });
});

app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/targets", targetRoutes);
app.use("/api/track", trackingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
