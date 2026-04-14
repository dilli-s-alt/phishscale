import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storeFile = path.join(__dirname, "../../data/demo-store.json");

const defaultState = {
  organization: {
    id: 1,
    name: "PhishScale Platform"
  },
  templates: [],
  campaigns: [],
  targets: [],
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
export const deleteDemoTemplate = (templateId) => {
  const state = readState();
  state.templates = state.templates.filter((item) => Number(item.id) !== Number(templateId));
  writeState(state);
  return true;
};

export const addDemoTemplate = ({ name, category, subject, html }) => {
  const state = readState();
  const templateId = state.templates.length
    ? Math.max(...state.templates.map((item) => Number(item.id))) + 1
    : 1;

  const template = {
    id: templateId,
    name,
    category: category || "General",
    subject: subject || name,
    html
  };

  state.templates.push(template);
  writeState(state);
  return template;
};

export const deleteDemoTarget = (targetId) => {
  const state = readState();
  state.targets = state.targets.filter((item) => Number(item.id) !== Number(targetId));
  writeState(state);
  return true;
};

export const deleteDemoCampaign = (campaignId) => {
  const state = readState();
  state.campaigns = state.campaigns.filter((item) => Number(item.id) !== Number(campaignId));
  writeState(state);
  return true;
};

export const bulkAddDemoTargets = (targetsList) => {
  const state = readState();
  let nextId = state.targets.length
    ? Math.max(...state.targets.map((item) => Number(item.id))) + 1
    : 1;

  const newTargets = targetsList.map((item) => ({
    id: nextId++,
    first_name: item.first_name || "New",
    last_name: item.last_name || "Target",
    email: item.email,
    department: item.department || "General",
    organization_id: state.organization.id
  }));

  state.targets.push(...newTargets);
  writeState(state);
  return newTargets;
};

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

export const getDemoCampaignTargets = () => readState().campaignTargets;

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
