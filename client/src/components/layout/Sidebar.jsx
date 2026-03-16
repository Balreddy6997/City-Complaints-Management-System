import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

// ── Logout Confirm Modal ──────────────────────────────────────
export const LogoutModal = ({ onConfirm, onCancel }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999,
    display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"
  }}>
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20,
      padding: "36px 40px", width: 360, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.5)"
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", marginBottom: 10, color: "#fff" }}>
        Logging out?
      </h3>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 28, lineHeight: 1.5 }}>
        You'll be signed out and returned to the login screen.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: "12px", background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 10, color: "var(--text)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem"
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: "12px", background: "linear-gradient(135deg,#ef4444,#dc2626)",
          border: "none", borderRadius: 10, color: "#fff", cursor: "pointer",
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem",
          boxShadow: "0 4px 16px rgba(239,68,68,0.35)"
        }}>Yes, Logout</button>
      </div>
    </div>
  </div>
);

// ── Sidebar ───────────────────────────────────────────────────
const Sidebar = ({ page, setPage }) => {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const isAdmin = user?.role === "admin";

  const navItems = isAdmin
    ? [
        { label: "MAIN", items: [
          { id: "home",       icon: "🏠", name: "Home"           },
          { id: "dashboard",  icon: "📊", name: "Dashboard"      },
          { id: "complaints", icon: "📋", name: "All Complaints"  },
        ]},
        { label: "MANAGEMENT", items: [
          { id: "users",     icon: "👥", name: "Users"     },
          { id: "analytics", icon: "📈", name: "Analytics" },
        ]},
      ]
    : [
        { label: "MAIN", items: [
          { id: "home",      icon: "🏠", name: "Home"            },
          { id: "dashboard", icon: "�", name: "All Complaints"       },
          { id: "submit",    icon: "➕", name: "Raise Complaint"  },
        ]},
        { label: "MY ACTIVITY", items: [
          { id: "mycomplaints", icon: "📋", name: "My Complaints" },
        ]},
      ];

  return (
    <>
      {showLogout && (
        <LogoutModal onConfirm={logout} onCancel={() => setShowLogout(false)} />
      )}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏙️</div>
          <span>SmartCity CMS</span>
        </div>

        {navItems.map(section => (
          <div className="nav-section" key={section.label}>
            <div className="nav-label">{section.label}</div>
            {section.items.map(item => (
              <div
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.name}
              </div>
            ))}
          </div>
        ))}

        {/* Account section */}
        <div className="nav-section" style={{ marginTop: 8 }}>
          <div className="nav-label">ACCOUNT</div>
          <div className="nav-item" onClick={() => setPage("profile")}>
            <span className="icon">👤</span>Profile
          </div>
          <div className="nav-item" onClick={() => setShowLogout(true)} style={{ color: "#ef4444" }}>
            <span className="icon">🚪</span>Logout
          </div>
        </div>

        {/* User card */}
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role" style={{ textTransform: "capitalize" }}>{user?.role}</div>
            </div>
            <button className="logout-btn" onClick={() => setShowLogout(true)} title="Logout" style={{ fontSize: 18 }}>
              🚪
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;