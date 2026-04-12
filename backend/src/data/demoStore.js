import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storeFile = path.join(__dirname, "../../data/demo-store.json");

const defaultState = {
  organization: {
    id: 1,
    name: "PhishScale Demo Org"
  },
  templates: [
    {
      id: 1,
      name: "Urgent: Password Expiry",
      category: "IT",
      subject: "Microsoft 365 password expiry notice",
      html: '<div style="font-family:Segoe UI,Tahoma,sans-serif;padding:24px;"><h2>Password Expiry Notice</h2><p>Hello {{first_name}},</p><p>Your Microsoft 365 password is about to expire. Review your account now to avoid interruption.</p><p><a href="https://example.com">Review account</a></p><p>Security Operations</p></div>'
    },
    {
      id: 2,
      name: "HR: New Policy Review",
      category: "HR",
      subject: "Action required: updated employee handbook",
      html: '<div style="font-family:Segoe UI,Tahoma,sans-serif;padding:24px;"><h2>Updated Policy Review</h2><p>Hi {{first_name}},</p><p>HR published an updated handbook for {{department}}. Review and acknowledge it before end of day.</p><p><a href="https://example.com">Open policy portal</a></p><p>People Operations</p></div>'
    },
    {
      id: 3,
      name: "FedEx: Delivery Failed",
      category: "Logistics",
      subject: "Delivery attempt failed for your package",
      html: '<div style="font-family:Arial,sans-serif;padding:24px;"><h2>Delivery Exception</h2><p>Dear {{first_name}},</p><p>We could not complete delivery for your package assigned to {{email}}. Confirm your details to reschedule.</p><p><a href="https://example.com">Track package</a></p><p>FedEx Delivery Team</p></div>'
    }
  ],
  campaigns: [
    {
      id: 1,
      name: "M365 Password Expiry",
      template_id: 1,
      subject: "Microsoft 365 password expiry notice",
      template:
        '<div style="font-family:Segoe UI,Tahoma,sans-serif;padding:24px;"><h2>Password Expiry Notice</h2><p>Hello {{first_name}},</p><p>Your Microsoft 365 password is about to expire. Review your account now to avoid interruption.</p><p><a href="https://example.com">Review account</a></p><p>Security Operations</p></div>',
      landing_page: "/fake-login",
      created_at: new Date().toISOString()
    }
  ],
  targets: [
    {
      id: 1,
      first_name: "Demo",
      last_name: "User",
      email: "demo.user@example.com",
      department: "Engineering",
      organization_id: 1
    },
    {
      id: 2,
      first_name: "Avery",
      last_name: "Nguyen",
      email: "avery.nguyen@example.com",
      department: "HR",
      organization_id: 1
    },
    {
      id: 3,
      first_name: "Jordan",
      last_name: "Patel",
      email: "jordan.patel@example.com",
      department: "Finance",
      organization_id: 1
    }
  ],
  campaignTargets: [],
  events: []
};

const ensureStoreFile = () => {
  const dir = path.dirname(storeFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, `${JSON.stringify(defaultState, null, 2)}\n`, "utf8");
  }
};

const readState = () => {
  ensureStoreFile();

  try {
    const raw = fs.readFileSync(storeFile, "utf8");
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (error) {
    fs.writeFileSync(storeFile, `${JSON.stringify(defaultState, null, 2)}\n`, "utf8");
    return structuredClone(defaultState);
  }
};

const writeState = (state) => {
  ensureStoreFile();
  fs.writeFileSync(storeFile, `${JSON.stringify(state, null, 2)}\n`, "utf8");
};

export const getDemoCampaigns = () => readState().campaigns;
export const getDemoTargets = () => readState().targets;
export const getDemoEvents = () => readState().events;
export const getDemoTemplates = () => readState().templates;
export const getDemoOrganization = () => readState().organization;
export const getDemoCampaignTargets = () => readState().campaignTargets;

export const addDemoCampaign = ({ id, name, template_id, subject, template, landing_page }) => {
  const state = readState();
  const campaignId = Number(
    id ||
      (state.campaigns.length
        ? Math.max(...state.campaigns.map((item) => Number(item.id))) + 1
        : 1)
  );

  const existingIndex = state.campaigns.findIndex((item) => Number(item.id) === campaignId);
  const campaign = {
    id: campaignId,
    name,
    template_id: template_id || null,
    subject: subject || name,
    template,
    landing_page: landing_page || "/fake-login",
    created_at: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    state.campaigns[existingIndex] = campaign;
  } else {
    state.campaigns.push(campaign);
  }

  writeState(state);
  return campaign;
};

export const addDemoTarget = ({ first_name, last_name, email, department, organization_id }) => {
  const state = readState();
  const target = {
    id: state.targets.length
      ? Math.max(...state.targets.map((item) => Number(item.id))) + 1
      : 1,
    first_name,
    last_name,
    email,
    department: department || "General",
    organization_id: organization_id || state.organization.id
  };

  state.targets.push(target);
  writeState(state);
  return target;
};

export const addDemoCampaignTarget = ({ campaign_id, target_id, tracking_id }) => {
  const state = readState();
  state.campaignTargets.push({
    campaign_id,
    target_id,
    tracking_id,
    sent_at: new Date().toISOString()
  });
  writeState(state);
};

export const addDemoEvent = ({ tracking_id, type }) => {
  const state = readState();
  state.events.push({
    id: state.events.length + 1,
    tracking_id,
    type,
    created_at: new Date().toISOString()
  });
  writeState(state);
};

export const findDemoCampaignById = (campaignId) =>
  readState().campaigns.find((item) => Number(item.id) === Number(campaignId)) || null;

export const findDemoTemplateById = (templateId) =>
  readState().templates.find((item) => Number(item.id) === Number(templateId)) || null;
