import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Papa from "papaparse";
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
  const [importing, setImporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [templates, setTemplates] = useState([]);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, campaignsRes, targetsRes, templatesRes] = await Promise.all([
        API.get("/api/analytics"),
        API.get("/api/campaign"),
        API.get("/api/targets"),
        API.get("/api/campaign/templates")
      ]);

      setStats(statsRes.data);
      setCampaigns(Array.isArray(campaignsRes.data) ? campaignsRes.data : []);
      setTargets(Array.isArray(targetsRes.data) ? targetsRes.data : []);
      setTemplates(Array.isArray(templatesRes.data) ? templatesRes.data : []);
      setStatus(`Data refreshed at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      setStatus(getApiErrorMessage(error, "Refresh failed."));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Universal Discovery Strategy
    const parseConfig = {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.replace(/[^\x20-\x7E]/g, "").toLowerCase().trim(),
      complete: (results) => {
        let items = mapResults(results);
        
        // If Strategy A (headers) failed to find emails, try Strategy B (no headers)
        if (items.length === 0) {
          Papa.parse(file, {
            header: false,
            skipEmptyLines: "greedy",
            complete: (res2) => {
              items = mapResults(res2);
              submitPayload(items);
            }
          });
        } else {
          submitPayload(items);
        }
      }
    };

    const mapResults = (results) => {
      const pEmails = ["email", "e-mail", "mail", "email address"];
      const pFirst = ["first name", "firstname", "first_name", "fname", "given name", "name"];
      const pLast = ["last name", "lastname", "last_name", "lname", "surname"];
      const pDept = ["department", "dept", "team", "group", "division"];

      return results.data.map((row) => {
        const isObj = row !== null && typeof row === "object" && !Array.isArray(row);
        let email, first, last, dept;

        if (isObj) {
          const keys = Object.keys(row);
          const getV = (names) => {
            const k = keys.find(key => names.includes(key));
            return k ? row[k] : null;
          };
          email = getV(pEmails);
          first = getV(pFirst);
          last = getV(pLast);
          dept = getV(pDept);
        } else if (Array.isArray(row)) {
          const emailIdx = row.findIndex(v => v?.toString().includes("@"));
          if (emailIdx !== -1) {
            email = row[emailIdx];
            first = row[0] === email ? "New" : row[0];
            last = row[1] === email ? "Target" : row[1];
            dept = row[3] || "General";
          }
        }

        if (!email || !email.toString().includes("@")) return null;

        return {
          first_name: first || "New",
          last_name: last || "Target",
          email: email.toString().trim(),
          department: dept || "General"
        };
      }).filter(t => t !== null);
    };

    const submitPayload = (payload) => {
      if (payload.length === 0) {
        alert("Could not find any valid email addresses in the file. Please ensure your CSV has an 'Email' column.");
        setImporting(false);
        return;
      }

      API.post("/api/targets/bulk", { targets: payload })
        .then(() => {
          alert(`🎉 Successfully imported ${payload.length} targets!`);
          fetchData();
        })
        .catch((err) => alert(getApiErrorMessage(err, "CSV Import failed.")))
        .finally(() => {
          setImporting(false);
          e.target.value = null;
        });
    };

    Papa.parse(file, parseConfig);
  };

  const deleteTarget = (id) => {
    if (!window.confirm("Delete this target?")) return;
    API.delete(`/api/targets/${id}`)
      .then(() => fetchData())
      .catch((err) => alert(getApiErrorMessage(err, "Delete failed")));
  };

  const deleteCampaign = (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    API.delete(`/api/campaign/${id}`)
      .then(() => fetchData())
      .catch((err) => alert(getApiErrorMessage(err, "Delete failed")));
  };

  const deleteTemplate = (id) => {
    if (!window.confirm("Delete this template?")) return;
    API.delete(`/api/campaign/templates/${id}`)
      .then(() => fetchData())
      .catch((err) => alert(getApiErrorMessage(err, "Delete failed")));
  };

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 className="page-title">PhishScale Dashboard</h1>
            <button
              onClick={fetchData}
              className="ghost-btn"
              disabled={refreshing}
              style={{ padding: "8px 20px" }}
            >
              {refreshing ? "Refreshing..." : "↺ Refresh Data"}
            </button>
          </div>
          <p>Global security simulation management. Backend status: {status}</p>
        </section>

        <section className="stats-grid">
          <div className="stat-card panel-card">
            <span className="eyebrow">Campaigns</span>
            <div className="stat-value">{campaigns.length}</div>
            <div className="stat-detail">Pretexts created</div>
          </div>
          <div className="stat-card panel-card">
            <span className="eyebrow">Targets</span>
            <div className="stat-value">{targets.length}</div>
            <div className="stat-detail">Employees in scope</div>
          </div>
          <div className="stat-card panel-card highlight">
            <span className="eyebrow">Open Rate</span>
            <div className="stat-value">{stats.open_rate}%</div>
            <div className="stat-detail">{stats.opens} total opens</div>
          </div>
          <div className="stat-card panel-card critical">
            <span className="eyebrow">Compromised</span>
            <div className="stat-value">{stats.submit_rate}%</div>
            <div className="stat-detail">{stats.submitted} leaked data</div>
          </div>
        </section>

        <div className="info-grid">
          <section className="panel-card">
            <h2 className="panel-heading">Target Management</h2>
            <div className="button-row" style={{ marginBottom: "20px" }}>
              <label className="primary-btn" style={{ cursor: "pointer" }}>
                {importing ? "Importing..." : "CSV Import Targets"}
                <input type="file" accept=".csv" onChange={handleCsvImport} style={{ display: "none" }} />
              </label>
              <Link to="/campaign" className="ghost-btn">New Campaign</Link>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Dept</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {targets.map((t) => (
                    <tr key={t.id}>
                      <td>{t.first_name} {t.last_name}</td>
                      <td>{t.email}</td>
                      <td>{t.department}</td>
                      <td style={{ textAlign: "right" }}>
                        <button onClick={() => deleteTarget(t.id)} className="delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {targets.length === 0 && (
                    <tr><td colSpan="4">No targets. Use CSV Import to add employees.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel-card">
            <h2 className="panel-heading">Phish-prone Departments</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Compromise Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentRows.map((row) => (
                    <tr key={row.department}>
                      <td>{row.department}</td>
                      <td>{((row.submitted / row.total) * 100 || 0).toFixed(1)}%</td>
                    </tr>
                  ))}
                  {departmentRows.length === 0 && (
                    <tr><td colSpan="2">No data yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="panel-card" style={{ marginTop: "24px" }}>
          <h2 className="panel-heading">Template Library (Pretexts)</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Template Name</th>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.category}</td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => deleteTemplate(t.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
                {templates.length === 0 && (
                  <tr><td colSpan="3">No templates created. Add one in the Campaign section.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel-card" style={{ marginTop: "24px" }}>
          <h2 className="panel-heading">Active Campaigns</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Landing Page</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td><code>{c.landing_page}</code></td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => deleteCampaign(c.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
                {campaigns.length === 0 && (
                  <tr><td colSpan="3">No campaigns created.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
