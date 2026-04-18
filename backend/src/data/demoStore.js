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
      name: "Microsoft 365: Password Retention",
      category: "IT Security",
      subject: "Action Required: Your Microsoft 365 password expires in 24 hours",
      html: `<div style="background-color:#f4f4f4;padding:40px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 2px 5px rgba(0,0,0,0.1);"><div style="padding:32px;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png" width="90" style="margin-bottom:24px;" alt="Microsoft"><h2 style="color:#2b2b2b;margin:0 0 16px 0;font-size:18px;font-weight:600;">Office 365: Password Expiry Notice</h2><p style="color:#505050;font-size:15px;line-height:1.6;margin:0 0 24px 0;">Hello {{first_name}},<br><br>Security policy requires all employees in the <strong>{{department}}</strong> department to update their Microsoft 365 credentials every 90 days. Your current password is set to expire in less than <strong>24 hours</strong>.</p><div style="text-align:left;margin-bottom:32px;"><a href="{{tracking_url}}" style="background-color:#0067b8;color:#ffffff;padding:10px 24px;text-decoration:none;border-radius:2px;font-weight:400;display:inline-block;font-size:15px;">Keep current password</a></div><p style="color:#808080;font-size:12px;border-top:1px solid #eeeeee;padding-top:24px;margin:0;">This is a mandatory security notification. Replies to this email are not monitored.<br>Microsoft Security Services &copy; 2026</p></div></div></div>`
    },
    {
      id: 2,
      name: "HR: 2026 Employee Benefits",
      category: "Human Resources",
      subject: "Urgent: Review your 2026 Benefits Plan Enrollment",
      html: `<div style="background-color:#f8f9fa;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #e0e0e0;border-top:4px solid #007bff;"><div style="padding:40px;"><h1 style="color:#333;font-size:22px;margin:0 0 20px 0;">Benefit Enrollment Period Closing</h1><p style="font-size:15px;color:#444;line-height:1.5;">Dear {{first_name}} {{last_name}},<br><br>The annual open enrollment period for 2026 benefits is coming to a close. Records indicate you have not yet confirmed your selections for the <strong>{{department}}</strong> health and pension plans.</p><p style="font-size:15px;color:#444;line-height:1.5;">Please review and sign your enrollment documents by the end of the business day to ensure uninterrupted coverage.</p><div style="margin:32px 0;"><a href="{{tracking_url}}" style="background-color:#007bff;color:#ffffff;padding:12px 30px;text-decoration:none;border-radius:4px;font-weight:600;font-size:15px;display:inline-block;">Launch HR Portal</a></div><p style="font-size:13px;color:#999;font-style:italic;">Human Resources Department | Global Operations Team</p></div><div style="background-color:#f1f3f5;padding:15px 40px;font-size:11px;color:#777;">This email contains confidential employee information intended for {{email}}.</div></div></div>`
    },
    {
      id: 3,
      name: "IT: Unusual Login Activity",
      category: "Security Support",
      subject: "Security Alert: Unusual sign-in discovered",
      html: `<div style="background-color:#fff;padding:40px;font-family:Arial,sans-serif;"><div style="max-width:550px;margin:0 auto;border:1px solid #ddd;padding:32px;"><div style="text-align:center;margin-bottom:24px;"><div style="background-color:#ffcc00;padding:8px 16px;display:inline-block;border-radius:20px;font-size:12px;font-weight:bold;color:#000;">SECURITY ALERT</div></div><h2 style="font-size:20px;color:#111;margin:0 0 16px 0;text-align:center;">Was this you?</h2><p style="font-size:14px;color:#555;line-height:1.6;">We detected a recent sign-in to your account from an unrecognized device or location.</p><table style="width:100%;background-color:#f9f9f9;padding:16px;border-radius:8px;margin-bottom:24px;font-size:14px;"><tr><td style="color:#888;padding:4px 0;">User:</td><td>{{first_name}} {{last_name}}</td></tr><tr><td style="color:#888;padding:4px 0;">Dept:</td><td>{{department}}</td></tr><tr><td style="color:#888;padding:4px 0;">Location:</td><td>Lagos, Nigeria (IP: 102.89.2.4)</td></tr><tr><td style="color:#888;padding:4px 0;">Browser:</td><td>Chrome (Unknown OS)</td></tr></table><p style="font-size:14px;color:#555;line-height:1.6;margin-bottom:24px;">If this wasn't you, your account may be compromised. Please secure your account immediately.</p><div style="text-align:center;"><a href="{{tracking_url}}" style="background-color:#d93025;color:#ffffff;padding:12px 40px;text-decoration:none;border-radius:4px;font-weight:bold;">Secruity Checkup</a></div></div></div>`
    },
    {
      id: 4,
      name: "Finance: Outstanding Invoice #4492",
      category: "Accounting",
      subject: "OVERDUE: Action required on Invoice #4492",
      html: `<div style="font-family:sans-serif;padding:20px;color:#333;"><h2>Invoice Overdue</h2><p>Our records show an outstanding balance for your recent software procurement in the <strong>{{department}}</strong> department.</p><p>Please review the attached invoice and process payment immediately to avoid service interruption.</p><a href="{{tracking_url}}" style="color:#d93025;font-weight:bold;">Review Unpaid Invoice #4492</a></div>`
    },
    {
      id: 5,
      name: "Legal: Updated Privacy Policy",
      category: "Compliance",
      subject: "Mandatory: Review and Accept New Employee Privacy Policy",
      html: `<div style="font-family:serif;padding:30px;background:#f0f0f0;"><div style="background:#fff;padding:20px;border:1px solid #ccc;"><h3>Employee Compliance Notice</h3><p>Dear {{first_name}},</p><p>The Legal department has updated the employee data privacy policy. As a member of <strong>{{department}}</strong>, you are required to acknowledge these changes by the end of the week.</p><a href="{{tracking_url}}">Accept Policy Changes</a></div></div>`
    },
    {
      id: 6,
      name: "Executive: Confidential Q3 Roadmap",
      category: "Management",
      subject: "Strictly Confidential: Q3 Strategic Product Roadmap",
      html: `<div style="background:#1a1a1a;color:#eee;padding:40px;font-family:Helvetica;"><h3>INTERNAL ONLY</h3><p>Team,</p><p>Attached is the confidential Q3 roadmap for the <strong>{{department}}</strong> division. Leakage of this document will result in disciplinary action.</p><p><a href="{{tracking_url}}" style="color:#4caf50;">View Roadmap.pdf</a></p></div>`
    },
    {
      id: 7,
      name: "Security: Fraudulent Activity Detected",
      category: "IT Security",
      subject: "Alert: Corporate Credit Card Fraud Detection",
      html: `<div style="padding:20px;border:2px solid red;"><h2>Fraud Alert</h2><p>Our system detected suspicious activity on a corporate card registered to the <strong>{{department}}</strong> budget.</p><p>Please verify these transactions immediately: <a href="{{tracking_url}}">Verify Activity</a></p></div>`
    },
    {
      id: 8,
      name: "Payroll: Performance Bonus Update",
      category: "Human Resources",
      subject: "Payroll: Confirmation of Q1 Performance Bonus",
      html: `<div style="background:#e8f5e9;padding:20px;"><h2>Bonus Confirmation</h2><p>Good news {{first_name}}!</p><p>Your Q1 performance bonus has been approved. View the breakdown for the <strong>{{department}}</strong> team here: <a href="{{tracking_url}}">Bonus Statement</a></p></div>`
    },
    {
      id: 9,
      name: "Marketing: New Brand Guidelines",
      category: "Marketing",
      subject: "Urgent: Update your email signature with new brand assets",
      html: `<div style="padding:20px;"><h2>New Brand Identity</h2><p>We've launched a new brand identity. All <strong>{{department}}</strong> employees must update their signatures by Monday.</p><a href="{{tracking_url}}">Download Signature Assets</a></div>`
    },
    {
      id: 10,
      name: "IT: Ticket #8821 Resolved",
      category: "Support",
      subject: "ServiceDesk: Ticket #8821 has been marked as resolved",
      html: `<div style="padding:20px;"><h3>Ticket Resolved</h3><p>The issue reported for <strong>{{department}}</strong> has been fixed. Please rate our service: <a href="{{tracking_url}}">Rate Support Quality</a></p></div>`
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
  writeState(defaultState);
  return true;
};
