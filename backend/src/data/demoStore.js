import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storeFile = path.join(__dirname, "../../data/demo-store.json");

const defaultState = {
  organization: {
    id: 1,
    name: "PhishScale Pro Corp"
  },
  templates: [
    {
      id: 1,
      name: "Urgent: Password Expiry",
      category: "IT Security",
      subject: "Action Required: Your Microsoft 365 password expires in 24 hours",
      html: `<div style="background-color:#f4f4f4;padding:40px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 2px 5px rgba(0,0,0,0.1);"><div style="padding:32px;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png" width="90" style="margin-bottom:24px;" alt="Microsoft"><h2 style="color:#2b2b2b;margin:0 0 16px 0;font-size:18px;font-weight:600;">Office 365: Password Expiry Notice</h2><p style="color:#505050;font-size:15px;line-height:1.6;margin:0 0 24px 0;">Hello {{first_name}},<br><br>Security policy requires all employees in the <strong>{{department}}</strong> department to update their Microsoft 365 credentials every 90 days. Your current password is set to expire in less than <strong>24 hours</strong>.</p><div style="text-align:left;margin-bottom:32px;"><a href="{{tracking_url}}" style="background-color:#0067b8;color:#ffffff;padding:10px 24px;text-decoration:none;border-radius:2px;font-weight:400;display:inline-block;font-size:15px;">Keep current password</a></div><p style="color:#808080;font-size:12px;border-top:1px solid #eeeeee;padding-top:24px;margin:0;">This is a mandatory security notification. Replies to this email are not monitored.<br>Microsoft Security Services &copy; 2026</p></div></div></div>`
    },
    {
      id: 2,
      name: "HR: New Policy",
      category: "Human Resources",
      subject: "Notice: Mandatory Updated Employee Conduct Policy 2026",
      html: `<div style="background-color:#f8f9fa;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #e0e0e0;border-top:4px solid #007bff;"><div style="padding:40px;"><h1 style="color:#333;font-size:22px;margin:0 0 20px 0;">New Corporate Policy Implemented</h1><p style="font-size:15px;color:#444;line-height:1.5;">Dear {{first_name}} {{last_name}},<br><br>The Board of Directors has approved an updated Employee Conduct and Data Sensitivity policy for the <strong>{{department}}</strong> department, effective immediately.</p><p style="font-size:15px;color:#444;line-height:1.5;">All employees are required to review and digitally sign the acknowledgement form by the end of their current shift.</p><div style="margin:32px 0;"><a href="{{tracking_url}}" style="background-color:#007bff;color:#ffffff;padding:12px 30px;text-decoration:none;border-radius:4px;font-weight:600;font-size:15px;display:inline-block;">Review Policy Documents</a></div><p style="font-size:13px;color:#999;font-style:italic;">Human Resources Compliance Team | PhishScale Pro Corp</p></div></div></div>`
    },
    {
      id: 3,
      name: "FedEx: Delivery Failed",
      category: "Logistics",
      subject: "Action Required: FedEx Package #882193 Delivery Exception",
      html: `<div style="background-color:#f4f4f4;padding:40px;font-family:Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-top:5px solid #4d148c;"><div style="padding:30px;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/FedEx_Corporation_-_Logo.svg/512px-FedEx_Corporation_-_Logo.svg.png" width="100" style="margin-bottom:20px;"><h2 style="color:#333;font-size:20px;">Delivery Exception</h2><p style="color:#555;font-size:15px;line-height:1.5;">Hello {{first_name}},<br><br>We attempted to deliver a package to your office in <strong>{{department}}</strong> today at 10:15 AM, but no one was available to sign for it.</p><p style="color:#555;font-size:15px;">To avoid the package being returned to the sender, please reschedule the delivery within 24 hours.</p><div style="margin:30px 0;"><a href="{{tracking_url}}" style="background-color:#ff6600;color:#ffffff;padding:12px 25px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;">Reschedule Delivery</a></div><p style="color:#999;font-size:12px;">Tracking ID: FDX-8821-XP992<br>FedEx Express Services &copy; 2026</p></div></div></div>`
    }
  ],
  campaigns: [],
  targets: [
    { "id": 1, "first_name": "Patricia", "last_name": "Wilson", "email": "pwilson@phish-demo.com", "department": "Facilities", "organization_id": 1 },
    { "id": 2, "first_name": "Richard", "last_name": "Taylor", "email": "rtaylor@phish-demo.com", "department": "Research", "organization_id": 1 },
    { "id": 3, "first_name": "Christopher", "last_name": "Garcia", "email": "cgarcia@phish-demo.com", "department": "Customer Support", "organization_id": 1 },
    { "id": 4, "first_name": "Thomas", "last_name": "Jackson", "email": "tjackson@phish-demo.com", "department": "Facilities", "organization_id": 1 },
    { "id": 5, "first_name": "Jennifer", "last_name": "Anderson", "email": "janderson@phish-demo.com", "department": "Logistics", "organization_id": 1 },
    { "id": 6, "first_name": "Jessica", "last_name": "Hernandez", "email": "jhernandez@phish-demo.com", "department": "HR", "organization_id": 1 },
    { "id": 7, "first_name": "Barbara", "last_name": "Martin", "email": "bmartin@phish-demo.com", "department": "Engineering", "organization_id": 1 },
    { "id": 8, "first_name": "Linda", "last_name": "Garcia", "email": "lgarcia@phish-demo.com", "department": "Facilities", "organization_id": 1 },
    { "id": 9, "first_name": "Robert", "last_name": "Martin", "email": "rmartin@phish-demo.com", "department": "Security", "organization_id": 1 },
    { "id": 10, "first_name": "David", "last_name": "Wilson", "email": "dwilson@phish-demo.com", "department": "Security", "organization_id": 1 },
    { "id": 11, "first_name": "Richard", "last_name": "Martin", "email": "rmartin2@phish-demo.com", "department": "IT", "organization_id": 1 },
    { "id": 12, "first_name": "James", "last_name": "Johnson", "email": "jjohnson@phish-demo.com", "department": "IT", "organization_id": 1 },
    { "id": 13, "first_name": "Joseph", "last_name": "Garcia", "email": "jgarcia2@phish-demo.com", "department": "Customer Support", "organization_id": 1 },
    { "id": 14, "first_name": "Susan", "last_name": "Williams", "email": "swilliams@phish-demo.com", "department": "Sales", "organization_id": 1 },
    { "id": 15, "first_name": "James", "last_name": "Moore", "email": "jmoore@phish-demo.com", "department": "Finance", "organization_id": 1 },
    { "id": 16, "first_name": "John", "last_name": "Hernandez", "email": "jhernandez2@phish-demo.com", "department": "Sales", "organization_id": 1 },
    { "id": 17, "first_name": "Richard", "last_name": "Williams", "email": "rwilliams@phish-demo.com", "department": "Security", "organization_id": 1 },
    { "id": 18, "first_name": "Karen", "last_name": "Brown", "email": "kbrown@phish-demo.com", "department": "Facilities", "organization_id": 1 },
    { "id": 19, "first_name": "Elizabeth", "last_name": "Johnson", "email": "ejohnson@phish-demo.com", "department": "Research", "organization_id": 1 },
    { "id": 20, "first_name": "John", "last_name": "Anderson", "email": "janderson2@phish-demo.com", "department": "IT", "organization_id": 1 },
    { "id": 21, "first_name": "Michael", "last_name": "Martinez", "email": "mmartinez@phish-demo.com", "department": "Legal", "organization_id": 1 },
    { "id": 22, "first_name": "Susan", "last_name": "Brown", "email": "sbrown@phish-demo.com", "department": "Logistics", "organization_id": 1 },
    { "id": 23, "first_name": "William", "last_name": "Taylor", "email": "wtaylor@phish-demo.com", "department": "Security", "organization_id": 1 },
    { "id": 24, "first_name": "Richard", "last_name": "Thomas", "email": "rthomas@phish-demo.com", "department": "Operations", "organization_id": 1 },
    { "id": 25, "first_name": "William", "last_name": "Hernandez", "email": "whernandez@phish-demo.com", "department": "Security", "organization_id": 1 },
    { "id": 26, "first_name": "Mary", "last_name": "Lopez", "email": "mlopez@phish-demo.com", "department": "Procurement", "organization_id": 1 },
    { "id": 27, "first_name": "Mary", "last_name": "Wilson", "email": "mwilson@phish-demo.com", "department": "Customer Support", "organization_id": 1 },
    { "id": 28, "first_name": "David", "last_name": "Martinez", "email": "dmartinez@phish-demo.com", "department": "Operations", "organization_id": 1 },
    { "id": 29, "first_name": "James", "last_name": "Thomas", "email": "jthomas@phish-demo.com", "department": "HR", "organization_id": 1 },
    { "id": 30, "first_name": "Patricia", "last_name": "Smith", "email": "psmith@phish-demo.com", "department": "Engineering", "organization_id": 1 },
    { "id": 31, "first_name": "James", "last_name": "Garcia", "email": "jgarcia3@phish-demo.com", "department": "Sales", "organization_id": 1 },
    { "id": 32, "first_name": "Michael", "last_name": "Rodriguez", "email": "mrodriguez@phish-demo.com", "department": "Finance", "organization_id": 1 },
    { "id": 33, "first_name": "Robert", "last_name": "Davis", "email": "rdavis@phish-demo.com", "department": "Legal", "organization_id": 1 },
    { "id": 34, "first_name": "Mary", "last_name": "Hernandez", "email": "mhernandez@phish-demo.com", "department": "Marketing", "organization_id": 1 },
    { "id": 35, "first_name": "William", "last_name": "Lopez", "email": "wlopez@phish-demo.com", "department": "Operations", "organization_id": 1 },
    { "id": 36, "first_name": "David", "last_name": "Gonzalez", "email": "dgonzalez@phish-demo.com", "department": "IT", "organization_id": 1 },
    { "id": 37, "first_name": "Richard", "last_name": "Wilson", "email": "rwilson@phish-demo.com", "department": "Executive", "organization_id": 1 },
    { "id": 38, "first_name": "Joseph", "last_name": "Anderson", "email": "janderson3@phish-demo.com", "department": "Research", "organization_id": 1 },
    { "id": 39, "first_name": "Thomas", "last_name": "Taylor", "email": "ttaylor@phish-demo.com", "department": "Procurement", "organization_id": 1 },
    { "id": 40, "first_name": "Christopher", "last_name": "Moore", "email": "cmoore@phish-demo.com", "department": "Security", "organization_id": 1 },
    { "id": 41, "first_name": "Karen", "last_name": "Jackson", "email": "kjackson@phish-demo.com", "department": "Logistics", "organization_id": 1 },
    { "id": 42, "first_name": "Sarah", "last_name": "Martin", "email": "smartin@phish-demo.com", "department": "Facilities", "organization_id": 1 },
    { "id": 43, "first_name": "Michael", "last_name": "Thompson", "email": "mthompson@phish-demo.com", "department": "Engineering", "organization_id": 1 },
    { "id": 44, "first_name": "Elizabeth", "last_name": "White", "email": "ewhite@phish-demo.com", "department": "HR", "organization_id": 1 },
    { "id": 45, "first_name": "James", "last_name": "Harris", "email": "jharris@phish-demo.com", "department": "Executive", "organization_id": 1 },
    { "id": 46, "first_name": "Patricia", "last_name": "Clark", "email": "pclark@phish-demo.com", "department": "Finance", "organization_id": 1 },
    { "id": 47, "first_name": "John", "last_name": "Lewis", "email": "jlewis@phish-demo.com", "department": "Research", "organization_id": 1 },
    { "id": 48, "first_name": "Jennifer", "last_name": "Walker", "email": "jwalker@phish-demo.com", "department": "Marketing", "organization_id": 1 },
    { "id": 49, "first_name": "Michael", "last_name": "Hall", "email": "mhall@phish-demo.com", "department": "Legal", "organization_id": 1 },
    { "id": 50, "first_name": "Linda", "last_name": "Allen", "email": "lallen@phish-demo.com", "department": "Operations", "organization_id": 1 }
  ],
  campaignTargets: [],
  events: [],
  users: []
};

export const addDemoUser = (user) => {
  const state = readState();
  state.users.push({ ...user, id: Date.now().toString() });
  writeState(state);
  return state.users[state.users.length - 1];
};

export const findDemoUserByEmail = (email) =>
  readState().users.find((u) => u.email === email) || null;

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

export const resetDemoStore = () => {
  const currentState = readState();
  const newState = {
    ...structuredClone(defaultState),
    users: currentState.users || []
  };
  writeState(newState);
  return true;
};
