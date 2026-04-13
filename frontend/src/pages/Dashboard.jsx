import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API, getApiErrorMessage } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    opens: 0,
    clicks: 0,
    submitted: 0,
    open_rate: "0.00",
    click_rate: "0.00",
    submit_rate: "0.00",
    department_breakdown: []
  });
  const [status, setStatus] = useState("Loading analytics...");
  const [campaigns, setCampaigns] = useState([]);
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    API.get("/api/analytics")
      .then((res) => {
        setStats(res.data);
        setStatus("Live metrics loaded from the backend.");
      })
      .catch((error) => {
        setStatus(getApiErrorMessage(error, "Analytics could not be loaded."));
      });

    API.get("/api/campaign")
      .then((res) => setCampaigns(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCampaigns([]));

    API.get("/api/targets")
      .then((res) => setTargets(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTargets([]));
  }, []);

  const departmentSummary = stats.department_breakdown?.reduce((acc, item) => {
    const key = item.department || "General";
    if (!acc[key]) {
      acc[key] = {
        department: key,
        total: 0,
        opened: 0,
        clicked: 0,
        submitted: 0
      };
    }

    acc[key].total += 1;
    acc[key].opened += item.opened ? 1 : 0;
    acc[key].clicked += item.clicked ? 1 : 0;
    acc[key].submitted += item.submitted ? 1 : 0;
    return acc;
  }, {});

  const departmentRows = Object.values(departmentSummary || {});

  return (
    <div className="page-shell">
      <div className="dashboard-shell">
        <section className="hero-banner">
          <span className="eyebrow">Simulation Overview</span>
          <h1 className="page-title">PhishScale Dashboard</h1>
          <p>
            Monitor how targets moved from open to click to data submission, then break the results down by department
            so admins can see which teams need more training.
          </p>
        </section>

        <section className="stats-grid">
          <article className="stat-card panel-card">
            <span className="eyebrow">Campaigns</span>
            <div className="stat-value">{campaigns.length}</div>
            <div className="stat-detail">Pretexts created</div>
          </article>

          <article className="stat-card panel-card">
            <span className="eyebrow">Targets</span>
            <div className="stat-value">{targets.length}</div>
            <div className="stat-detail">Employees in scope</div>
          </article>

          <article className="stat-card panel-card">
            <span className="eyebrow">Opens</span>
            <div className="stat-value">{stats.opens}</div>
            <div className="stat-detail">{stats.open_rate}% open rate</div>
          </article>

          <article className="stat-card panel-card">
            <span className="eyebrow">Clicks</span>
            <div className="stat-value">{stats.clicks}</div>
            <div className="stat-detail">{stats.click_rate}% click rate</div>
          </article>

          <article className="stat-card panel-card">
            <span className="eyebrow">Submissions</span>
            <div className="stat-value">{stats.submitted}</div>
            <div className="stat-detail">{stats.submit_rate}% submission rate</div>
          </article>
        </section>

        <section className="info-grid">
          <article className="panel-card info-card">
            <h2 className="panel-heading">PhishScale Flow</h2>
            <p className="panel-copy">
              Upload or create targets, choose a phishing pretext, run a safe test mode to yourself, then watch the
              analytics update as users open, click, and submit.
            </p>
            <div className="button-row">
              <Link className="primary-btn" to="/campaign">
                Launch Campaigns
              </Link>
              <Link className="ghost-btn" to="/fake-login">
                Preview Landing Page
              </Link>
            </div>
          </article>

          <article className="panel-card info-card">
            <h2 className="panel-heading">Backend status</h2>
            <p className="panel-copy">{status}</p>
            <div className="button-row">
              <a className="ghost-btn" href={`${API.defaults.baseURL}/health`} target="_blank" rel="noreferrer">
                Health Check
              </a>
            </div>
          </article>
        </section>

        <section className="panel-card">
          <span className="eyebrow">Department Report</span>
          <h2 className="panel-heading">Who Needs More Training?</h2>
          <p className="panel-copy">
            This breakdown mirrors the case-study reporting goal by highlighting which departments are opening,
            clicking, and submitting most often.
          </p>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Targets</th>
                  <th>Opened</th>
                  <th>Clicked</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {departmentRows.length ? (
                  departmentRows.map((row) => (
                    <tr key={row.department}>
                      <td>{row.department}</td>
                      <td>{row.total}</td>
                      <td>{row.opened}</td>
                      <td>{row.clicked}</td>
                      <td>{row.submitted}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No department analytics yet. Send a campaign in test or live mode to populate results.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
