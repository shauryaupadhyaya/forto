import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/sidebar.css";

const sidebarLinks = [
  { name: "Dashboard", to: "/" },
  { name: "Tasks", to: "/tasks" },
  { name: "Habits", to: "/habits" },
  { name: "Focus Timer", to: "/pomodoro" },
  { name: "Projects", to: "/projects" },
  { name: "Calendar", to: "/calendar" },
  { name: "Analytics", to: "/analytics" }
];

function Layout() {
  const location = useLocation();
  const [mode, setMode] = useState("dark");

  const isDark = mode === "dark";
  const theme = {
    sidebarBg: isDark ? "#1E2530" : "#F5F7FA",
    mainBg: isDark ? "#151922" : "#F5F7FA",
    sidebarText: isDark ? "#A6B0C3" : "#153963",
    sidebarTextActive: isDark ? "#FFF" : "#0055CC",
    sidebarHighlight: isDark ? "#263043" : "#E3EEFF",
    logoBg: "#3479FF",
  };

  return (
    <div style={{ background: theme.mainBg }}>
      <aside
        className="sidebar"
        style={{
          background: theme.sidebarBg,
          color: theme.sidebarText,
        }}
      >
        <div className="sidebar-logo" style={{ background: theme.logoBg }}></div>
        
        <nav className="sidebar-nav">
          {sidebarLinks.map(({ name, to }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={name}
                to={to}
                className={`sidebar-link${isActive ? " active" : ""}`}
                style={{
                  background: isActive ? theme.sidebarHighlight : "transparent",
                  color: isActive ? theme.sidebarTextActive : theme.sidebarText,
                }}
              >
                {name}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-xp">
            <span>Level 1</span>
            <span style={{ float: "right" }}>0 XP</span>
            <div className="sidebar-xp-bar">
              <div className="sidebar-xp-progress" style={{ width: "0%" }}></div>
            </div>
          </div>
          <button
            className="sidebar-mode-btn"
            onClick={() => setMode(isDark ? "light" : "dark")}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>
      <main
        style={{
          marginLeft: "250px",
          background: theme.mainBg,
          minHeight: "100vh",
          transition: "background 0.2s",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;