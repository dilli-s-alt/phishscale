import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      setIsError(false);
      setMessage("");

      const { data } = await API.post("/auth/login", {
        email,
        password
      });

      if (data?.token) {
        localStorage.setItem("phishscale-token", data.token);
      }

      setMessage("Login successful. Redirecting to the dashboard...");
      navigate("/dashboard");
    } catch (error) {
      setIsError(true);
      setMessage(
        error?.response?.data || "Login failed. Check backend, user seed data, and database connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-shell">
      <div className="auth-card">
        <div className="brand-row">
          <div className="brand-grid" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="brand-name">PhishScale</div>
        </div>

        <h1 className="page-title">Security Training Console</h1>
        <p className="page-subtitle">
          Built from your two references: a working simulation backend plus a polished phishing-awareness flow.
        </p>

        <div className="stack">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="button-row">
          <button className="primary-btn" onClick={login} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <button className="ghost-btn" onClick={() => navigate("/fake-login")}>
            Preview Landing Page
          </button>
        </div>

        <p className={`status-text${isError ? " error" : ""}`}>{message}</p>
      </div>
    </div>
  );
}
