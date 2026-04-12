import express from "express";
import { trackOpen, trackClick, captureData } from "../controllers/trackingController.js";

const router = express.Router();

router.get("/open/:id", trackOpen);
router.get("/click/:id", trackClick);
router.post("/submit", captureData);

export default router;