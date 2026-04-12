import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../api";

export default function FakeLogin() {
  const [params] = useSearchParams();
  const tid = params.get("tid");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email");

  const submit = async () => {
    await API.post("/track/submit", {
      tracking_id: tid
    });
    window.location.href = "/caught";
  };

  return (
    <div className="ms-shell">
      <div className="ms-card">
        <div className="brand-row">
          <div className="brand-grid" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="brand-name">Microsoft</div>
        </div>

        {step === "email" ? (
          <>
            <span className="eyebrow">Phase 3</span>
            <h2 className="page-title">Sign in</h2>
            <input
              className="ms-input"
              type="email"
              placeholder="Email, phone, or Skype"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && email) setStep("password");
              }}
            />
            <div className="button-row">
              <button className="primary-btn" onClick={() => email && setStep("password")}>
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ms-email-row">
              <button className="ms-back" onClick={() => setStep("email")} aria-label="Back">
                ←
              </button>
              <span>{email}</span>
            </div>
            <h2 className="page-title">Enter password</h2>
            <p className="page-subtitle">For simulation purposes, the password is never stored. Submission only records that data was entered.</p>
            <input
              className="ms-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && password) submit();
              }}
            />
            <div className="button-row">
              <button className="primary-btn" onClick={submit} disabled={!password}>
                Sign in
              </button>
            </div>
          </>
        )}
      </div>

      <div className="ms-footer">
        <a href="/">Security Training Console</a>
        <a href="/caught">Educational Page</a>
      </div>
    </div>
  );
}
