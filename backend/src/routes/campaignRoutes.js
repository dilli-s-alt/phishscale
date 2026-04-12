import express from "express";
import {
  createCampaign,
  getCampaigns,
  getTemplates,
  sendCampaign
} from "../controllers/campaignController.js";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/templates", getTemplates);
router.post("/create", createCampaign);
router.post("/send", sendCampaign);

export default router;
