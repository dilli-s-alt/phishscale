import { pool } from "../config/db.js";
import {
  addDemoCampaign,
  addDemoCampaignTarget,
  findDemoCampaignById,
  findDemoTemplateById,
  getDemoCampaigns,
  getDemoOrganization,
  getDemoTargets,
  getDemoTemplates
} from "../data/demoStore.js";
import { generateId } from "../utils/generateId.js";
import { renderTemplate } from "../services/templateService.js";
import { sendEmail } from "../services/emailService.js";

export const getTemplates = async (req, res) => {
  try {
    res.json(getDemoTemplates());
  } catch (error) {
    console.error("Template fetch failed:", error);
    res.status(500).json({ error: "Failed to load templates" });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    res.json(getDemoCampaigns());
  } catch (error) {
    console.error("Campaign list failed:", error);
    res.status(500).json({ error: "Failed to load campaigns" });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const { name, template, template_id, subject, landing_page } = req.body;

    const chosenTemplate = template_id ? findDemoTemplateById(template_id) : null;
    const resolvedTemplate = template || chosenTemplate?.html;
    const resolvedSubject = subject || chosenTemplate?.subject || name;

    if (!name || !resolvedTemplate) {
      return res.status(400).json({ error: "Campaign name and template are required" });
    }

    try {
      const result = await pool.query(
        "INSERT INTO campaigns(name, template) VALUES($1,$2) RETURNING *",
        [name, resolvedTemplate]
      );

      addDemoCampaign({
        id: result.rows[0].id,
        name: result.rows[0].name,
        template_id,
        subject: resolvedSubject,
        template: result.rows[0].template,
        landing_page
      });

      return res.json({
        message: "Campaign created",
        campaign: {
          ...result.rows[0],
          template_id,
          subject: resolvedSubject,
          landing_page: landing_page || "/fake-login"
        }
      });
    } catch (dbError) {
      console.warn("Campaign create falling back to demo store:", dbError.message);
      const campaign = addDemoCampaign({
        name,
        template_id,
        subject: resolvedSubject,
        template: resolvedTemplate,
        landing_page
      });

      return res.json({
        message: "Campaign created in demo mode",
        campaign
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

export const sendCampaign = async (req, res) => {
  try {
    const { campaign_id, test_email, mode = "test" } = req.body;

    if (!campaign_id) {
      return res.status(400).json({ error: "campaign_id is required" });
    }

    let campaign = null;
    let targets = [];

    try {
      const campaignResult = await pool.query("SELECT * FROM campaigns WHERE id=$1", [campaign_id]);
      campaign = campaignResult.rows[0] || null;

      const targetsResult = await pool.query("SELECT * FROM targets");
      targets = targetsResult.rows;
    } catch (dbError) {
      console.warn("Campaign send falling back to demo store:", dbError.message);
      campaign = findDemoCampaignById(campaign_id);
      targets = getDemoTargets();
    }

    if (!campaign) {
      return res.status(404).json({
        error: "Campaign not found. Create the campaign again or use an existing campaign ID."
      });
    }

    if (!targets.length) {
      return res.status(400).json({ error: "No targets available. Upload or seed at least one target." });
    }

    const deliveries = [];
    const organization = getDemoOrganization();
    const selectedTargets = mode === "test" && test_email ? [targets[0]] : targets;

    for (const target of selectedTargets) {
      const trackingId = generateId();

      try {
        await pool.query(
          "INSERT INTO campaign_targets(campaign_id,target_id,tracking_id) VALUES($1,$2,$3)",
          [campaign_id, target.id, trackingId]
        );
      } catch (dbError) {
        addDemoCampaignTarget({
          campaign_id: Number(campaign_id),
          target_id: Number(target.id),
          tracking_id: trackingId
        });
      }

      const html = renderTemplate(
        campaign.template,
        {
          ...target,
          organization_name: organization.name
        },
        trackingId
      );
      const recipient = mode === "test" && test_email ? test_email : target.email;
      const delivery = await sendEmail({
        to: recipient,
        subject: campaign.subject || campaign.name,
        html
      });

      deliveries.push({
        recipient,
        tracking_id: trackingId,
        delivery: delivery.status,
        error: delivery.error || null
      });
    }

    res.json({
      message: "Campaign sent",
      mode,
      demo_mode: deliveries.some((item) => item.delivery !== "sent"),
      mail_configured: deliveries.every((item) => item.error !== "SendGrid is not configured. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL."),
      deliveries
    });
  } catch (error) {
    console.error("Send campaign failed:", error);
    res.status(500).json({ error: "Failed to send campaign" });
  }
};
