import { API, getApiErrorMessage } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const defaultTemplate = `
<div style="font-family:Segoe UI,Tahoma,sans-serif;padding:24px;">
  <h2>Password Expiry Notice</h2>
  <p>Hello {{first_name}},</p>
  <p>Your Microsoft 365 password is about to expire. Review your account now to avoid interruption.</p>
  <p><a href="https://example.com">Review account</a></p>
  <p>Security Operations</p>
</div>
`.trim();

export default function Campaign() {
  const [campaignName, setCampaignName] = useState("M365 Password Expiry");
  const [template, setTemplate] = useState(defaultTemplate);
  const [subject, setSubject] = useState("Microsoft 365 password expiry notice");
  const [email, setEmail] = useState("");
  const [campaignId, setCampaignId] = useState(1);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [backendMessage, setBackendMessage] = useState("Checking backend status...");
  const [templates, setTemplates] = useState([]);
  const [targets, setTargets] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [sendMode, setSendMode] = useState("test");
  const [targetForm, setTargetForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "Engineering"
  });

  useEffect(() => {
    let cancelled = false;
    let intervalId = null;

    const checkBackend = async () => {
      try {
        const { data } = await API.get("/health");
        if (cancelled) {
          return;
        }

        setBackendReady(true);
        setBackendMessage(`Backend ready on port ${data?.port ?? 5000}. Mail mode: ${data?.mail ?? "unknown"}.`);

        if (intervalId) {
          clearInterval(intervalId);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setBackendReady(false);
        setBackendMessage("Backend is offline or still starting. The page will keep checking automatically.");
      }
    };

    checkBackend();
    intervalId = window.setInterval(checkBackend, 2000);

    API.get("/campaign/templates")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setTemplates(data);
        if (data.length) {
          setSelectedTemplateId(data[0].id);
          setCampaignName(data[0].name);
          setSubject(data[0].subject);
          setTemplate(data[0].html);
        }
      })
      .catch(() => setTemplates([]));

    API.get("/targets")
      .then((res) => {
        setTargets(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTargets([]));

    return () => {
      cancelled = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const onSelectTemplate = (templateId) => {
    const selected = templates.find((item) => Number(item.id) === Number(templateId));
    setSelectedTemplateId(Number(templateId));
    if (selected) {
      setCampaignName(selected.name);
      setSubject(selected.subject);
      setTemplate(selected.html);
    }
  };

  const createCampaign = async () => {
    try {
      setIsError(false);
      const { data } = await API.post("/campaign/create", {
        name: campaignName,
        template,
        template_id: selectedTemplateId,
        subject,
        landing_page: "/fake-login"
      });
      setCampaignId(data?.campaign?.id || 1);
      setMessage(`Campaign created with ID ${data?.campaign?.id ?? 1}.`);
    } catch (error) {
      setIsError(true);
      setMessage(getApiErrorMessage(error, "Campaign creation failed."));
    }
  };

  const send = async () => {
    try {
      setIsError(false);
      const { data } = await API.post("/campaign/send", {
        campaign_id: Number(campaignId),
        test_email: email,
        mode: sendMode
      });
      const deliveryCount = data?.deliveries?.length || 0;
      const previewOnly = data?.deliveries?.filter((item) => item.delivery === "preview_only").length || 0;
      const firstError = data?.deliveries?.find((item) => item.error)?.error;

      if (previewOnly > 0) {
        setMessage(firstError
          ? `Campaign processed (Preview Mode). Note: ${firstError}`
          : `Campaign processed for ${deliveryCount} recipient(s). ${previewOnly} delivery attempt(s) ran in preview mode.`
        );
      } else {
        setMessage(`Campaign dispatch request sent successfully to ${deliveryCount} recipient(s).`);
      }
    } catch (error) {
      setIsError(true);
      setMessage(getApiErrorMessage(error, "Campaign send failed. Check whether the backend server was restarted."));
    }
  };

  const createTarget = async () => {
    try {
      setIsError(false);
      const { data } = await API.post("/targets", targetForm);
      setTargets((prev) => [...prev, data]);
      setTargetForm({
        first_name: "",
        last_name: "",
        email: "",
        department: targetForm.department
      });
      setMessage(`Target ${data.first_name} ${data.last_name} added successfully.`);
    } catch (error) {
      setIsError(true);
      setMessage(getApiErrorMessage(error, "Target creation failed."));
    }
  };

  return (
    <div className="page-shell">
      <div className="dashboard-shell">
        <section className="panel-card">
          <span className="eyebrow">Phase 1 + 2</span>
          <h1 className="page-title">Campaign Composer</h1>
          <p className="panel-copy">
            Choose a phishing pretext, customize the email body, and prepare a safe simulation campaign with tracked
            clicks and submissions.
          </p>
          <p className={`status-text${backendReady ? "" : " error"}`}>{backendMessage}</p>

          <div className="template-grid">
            {templates.map((item) => (
              <button
                key={item.id}
                className={`template-card${selectedTemplateId === item.id ? " active" : ""}`}
                onClick={() => onSelectTemplate(item.id)}
                type="button"
              >
                <span className="eyebrow">{item.category}</span>
                <strong>{item.name}</strong>
                <span>{item.subject}</span>
              </button>
            ))}
          </div>

          <div className="stack">
            <div className="field">
              <label htmlFor="campaign-name">Campaign name</label>
              <input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="campaign-subject">Subject line</label>
              <input
                id="campaign-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="campaign-template">HTML template</label>
              <textarea
                id="campaign-template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              />
            </div>
          </div>

          <div className="button-row">
            <button className="primary-btn" onClick={createCampaign} disabled={!backendReady}>
              Create Campaign
            </button>
            <Link className="ghost-btn" to="/dashboard">
              Back to Dashboard
            </Link>
          </div>
        </section>

        <section className="panel-card">
          <span className="eyebrow">Phase 1</span>
          <h2 className="panel-heading">Target Management</h2>
          <p className="panel-copy">
            Add individual employees with department metadata so analytics can identify which teams are most phish-prone.
          </p>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="target-first-name">First name</label>
              <input
                id="target-first-name"
                value={targetForm.first_name}
                onChange={(e) => setTargetForm((prev) => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="target-last-name">Last name</label>
              <input
                id="target-last-name"
                value={targetForm.last_name}
                onChange={(e) => setTargetForm((prev) => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="target-email">Email</label>
              <input
                id="target-email"
                type="email"
                value={targetForm.email}
                onChange={(e) => setTargetForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="target-department">Department</label>
              <input
                id="target-department"
                value={targetForm.department}
                onChange={(e) => setTargetForm((prev) => ({ ...prev, department: e.target.value }))}
              />
            </div>
          </div>
          <div className="button-row">
            <button className="primary-btn" onClick={createTarget} disabled={!backendReady}>
              Add Target
            </button>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((target) => (
                  <tr key={target.id}>
                    <td>{target.first_name} {target.last_name}</td>
                    <td>{target.email}</td>
                    <td>{target.department || "General"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel-card">
          <span className="eyebrow">Phase 2</span>
          <h2 className="panel-heading">Send Test Campaign</h2>
          <p className="panel-copy">
            Use test mode during demos so the campaign goes only to you. Switch to live mode when you want to send to
            every imported target.
          </p>
          <div className="stack">
            <div className="field">
              <label htmlFor="campaign-id">Campaign ID</label>
              <input
                id="campaign-id"
                type="number"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="send-mode">Mode</label>
              <select
                id="send-mode"
                className="field-select"
                value={sendMode}
                onChange={(e) => setSendMode(e.target.value)}
              >
                <option value="test">Test mode</option>
                <option value="live">Live mode</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="test-email">Test email</label>
              <input
                id="test-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="button-row">
            <button className="primary-btn" onClick={send} disabled={!backendReady}>
              Send Campaign
            </button>
            <Link className="ghost-btn" to="/fake-login">
              Preview Trap
            </Link>
          </div>

          <p className={`status-text${isError ? " error" : ""}`}>{message}</p>
        </section>
      </div>
    </div>
  );
}
