import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, getApiErrorMessage } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setIsError(true);
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);
      setMessage("");

      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const { data } = await API.post(endpoint, { email, password });

      if (mode === "register") {
        setIsError(false);
        setMessage("✅ Account created! You can now sign in.");
        setMode("login");
        setPassword("");
        return;
      }

      if (data?.token) {
        localStorage.setItem("phishscale-token", data.token);
      }
      navigate("/dashboard");
    } catch (error) {
      setIsError(true);
      setMessage(getApiErrorMessage(error, `${mode === "login" ? "Login" : "Registration"} failed. Please try again.`));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setMessage("");
    setIsError(false);
  };

  return (
    <div className="center-shell">
      <div className="auth-card">
        <div className="brand-row">
          <div className="brand-dot"></div>
          <div className="brand-name" style={{ color: "#0f172a", fontSize: "1.2rem" }}>PhishScale Pro</div>
        </div>

        <h1 className="page-title">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p className="page-subtitle">
          {mode === "login"
            ? "Sign in with your account credentials to access the dashboard."
            : "Register a new account to access the PhishScale platform."}
        </p>

        <div className="stack">
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: "48px", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "1.1rem",
                  padding: "4px",
                  cursor: "pointer",
                  color: "#64748b",
                  lineHeight: 1
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        <div className="button-row" style={{ marginTop: "24px" }}>
          <button
            className="primary-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1, padding: "13px" }}
          >
            {loading ? "Please wait..." : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <button className="link-btn" onClick={switchMode}>
            {mode === "login"
              ? "Don't have an account? Sign up →"
              : "Already have an account? Sign in →"}
          </button>
        </div>

        {message && (
          <p className={`status-text${isError ? " error" : ""}`} style={{ textAlign: "center", marginTop: "16px" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}


export default function Login() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setIsError(false);
      setMessage("");

      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const { data } = await API.post(endpoint, {
        email,
        password
      });

      if (mode === "register") {
        setMessage("Account created! You can now sign in.");
        setMode("login");
        return;
      }

      if (data?.token) {
        localStorage.setItem("phishscale-token", data.token);
      }

      setMessage("Redirecting...");
      navigate("/dashboard");
    } catch (error) {
      setIsError(true);
      setMessage(getApiErrorMessage(error, `${mode === "login" ? "Login" : "Registration"} failed.`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-shell">
      <div className="auth-card">
        <div className="brand-row">
          <div className="brand-dot"></div>
          <div className="brand-name" style={{ color: "#0f172a", fontSize: "1.2rem" }}>PhishScale Pro</div>
        </div>

        <h1 className="page-title">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p className="page-subtitle">
          {mode === "login"
            ? "Enter your credentials to access the security console."
            : "Set up a new administrator account for PhishScale."}
        </p>

        <div className="stack">
          <div className="field">
            <label htmlFor="email">Work Email</label>
            <input
              id="email"
              type="email"
              placeholder="admin@enterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field" style={{ position: "relative" }}>
            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "45px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  padding: "4px",
                  cursor: "pointer",
                  color: "#64748b"
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
        </div>

        <div className="button-row" style={{ marginTop: "24px" }}>
          <button className="primary-btn" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
            {loading ? "Processing..." : (mode === "login" ? "Sign In" : "Register")}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="link-btn"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}
          >
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <p className={`status-text${isError ? " error" : ""}`} style={{ textAlign: "center" }}>{message}</p>
      </div>
    </div>
  );
}
