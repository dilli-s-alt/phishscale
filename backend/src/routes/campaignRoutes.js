import express from "express";
import {
  createCampaign,
  getCampaigns,
  getTemplates,
  sendCampaign,
  deleteCampaign,
  deleteTemplate
} from "../controllers/campaignController.js";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/templates", getTemplates);
router.post("/create", createCampaign);
router.post("/send", sendCampaign);
router.delete("/templates/:id", deleteTemplate);
router.delete("/:id", deleteCampaign);

export default router;
