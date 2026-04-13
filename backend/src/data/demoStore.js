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
      name: "Microsoft: Password Expiry",
      category: "IT Security",
      subject: "Action Required: Your Microsoft 365 password expires in 24 hours",
      html: `
<div style="background-color:#f4f4f4;padding:40px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
    <div style="padding:32px;">
      <img src="https://static.thenounproject.com/png/3685375-200.png" width="40" height="40" style="margin-bottom:24px;" alt="Microsoft Logo">
      <h2 style="color:#2b2b2b;margin:0 0 16px 0;font-size:20px;font-weight:600;">Password Expiry Notice</h2>
      <p style="color:#505050;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
        Hello {{first_name}},<br><br>
        Security policy requires all employees in the <strong>{{department}}</strong> department to update their Microsoft 365 credentials every 90 days. 
        Your current password is set to expire in less than <strong>24 hours</strong>.
      </p>
      <div style="text-align:center;margin-bottom:32px;">
        <a href="{{tracking_url}}" style="background-color:#0067b8;color:#ffffff;padding:12px 32px;text-decoration:none;border-radius:2px;font-weight:600;display:inline-block;font-size:15px;">Keep Current Password</a>
      </div>
      <p style="color:#808080;font-size:12px;border-top:1px solid #eeeeee;padding-top:24px;margin:0;">
        This is an automated notification. Managed by Global Security Operations.
      </p>
    </div>
  </div>
</div>`
    },
    {
      id: 2,
      name: "HR: Employee Handbook Update",
      category: "Human Resources",
      subject: "Important: New Company Policy and Employee Handbook 2026",
      html: `
<div style="background-color:#fafafa;padding:40px;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #e0e0e0;">
    <div style="background-color:#4a90e2;padding:20px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">HR Connect</h1>
    </div>
    <div style="padding:40px;">
      <p style="font-size:16px;color:#333;line-height:1.5;">
        Dear {{first_name}},<br><br>
        Our Employee Handbook has been updated for 2026. All employees in <strong>{{department}}</strong> are required to review the new policies regarding remote work and personal time off.
      </p>
      <p style="font-size:16px;color:#333;line-height:1.5;">
        Please acknowledge receipt by signing through our secure employee portal below.
      </p>
      <div style="margin:40px 0;text-align:center;">
        <a href="{{tracking_url}}" style="background-color:#4a90e2;color:#ffffff;padding:15px 40px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:16px;">Sign Handbook</a>
      </div>
      <p style="font-size:14px;color:#999;">
        Human Resources Department | PhishScale Tech
      </p>
    </div>
  </div>
</div>`
    },
    {
      id: 3,
      name: "IT: Server Maintenance Alert",
      category: "IT Support",
      subject: "Urgent: Unscheduled Maintenance for your Workstation",
      html: `
<div style="background-color:#1a1a1b;padding:40px;font-family:'Courier New',Courier,monospace;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:40px;border-left:5px solid #ff4b2b;">
    <h3 style="color:#ff4b2b;margin-top:0;">CRITICAL SYSTEM ALERT</h3>
    <p style="color:#333;font-size:14px;line-height:1.6;">
      <strong>DEVICE ID:</strong> workstation-{{id}}<br>
      <strong>USER:</strong> {{first_name}} {{last_name}}<br>
      <strong>STATUS:</strong> CRITICAL UPDATES REQUIRED
    </p>
    <p style="color:#333;font-size:14px;line-height:1.6;">
      We have detected unusual activity on your assigned workstation. To prevent data loss, please initiate the system health check immediately.
    </p>
    <div style="margin:30px 0;">
      <a href="{{tracking_url}}" style="background-color:#333;color:#ffffff;padding:10px 25px;text-decoration:none;font-weight:bold;display:inline-block;">Run Diagnostic Tool</a>
    </div>
    <p style="color:#666;font-size:12px;">
      Automated System Alert - Global IT Infrastructure Team
    </p>
  </div>
</div>`
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
