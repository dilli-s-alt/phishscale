export default function Caught() {
  return (
    <div className="center-shell">
      <div className="alert-card">
        <span className="eyebrow">Awareness Moment</span>
        <h1>Oops. This was a simulation.</h1>
        <p className="page-subtitle">
          Your password was discarded immediately and never stored. This page is the teachable moment admins use to
          reinforce the phishing clues you missed.
        </p>

        <div className="clue-list">
          <div className="clue-card">
            <h3>Suspicious sender details</h3>
            <p>Look closely at the full sender domain and reply-to address before trusting an urgent message.</p>
          </div>

          <div className="clue-card">
            <h3>Pressure tactics</h3>
            <p>Attackers create urgency so people act before they verify the request.</p>
          </div>

          <div className="clue-card">
            <h3>Mismatched destination</h3>
            <p>A login page can look familiar and still be hosted on the wrong URL. The address bar matters.</p>
          </div>
        </div>

        <div className="button-row">
          <a className="primary-btn" href="/">
            Restart Simulation
          </a>
          <a className="ghost-btn" href="/dashboard">
            Open Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
