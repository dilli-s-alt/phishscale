import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/campaign", label: "Campaigns", icon: "📧" },
    { path: "/fake-login", label: "Preview Trap", icon: "⚓" },
  ];

  // Hide sidebar on landing/login/trap pages for a cleaner feel
  const hideSidebar = ["/", "/fake-login", "/caught"].includes(location.pathname);

  if (hideSidebar) return children;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-dot"></div>
          <span>PhishScale Pro</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Security Ops</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
