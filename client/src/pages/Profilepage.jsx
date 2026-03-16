import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/api";
import { StatusBadge } from "../components/common/Badges";

const ProfilePage = ({ setPage }) => {
  const { user, token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      apiFetch("/complaints", "GET", null, token)
        .then(d => { if (Array.isArray(d)) setComplaints(d); })
        .catch(() => {});
    }
  }, [isAdmin, token]);

  const myComplaints = complaints.filter(c =>
    c.citizen?._id === user?.id || c.citizen === user?.id
  );

  const total    = myComplaints.length;
  const resolved = myComplaints.filter(c => c.status === "Resolved").length;
  const pending  = myComplaints.filter(c => c.status === "Pending").length;
  const rate     = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const roleColor = { admin: "#a78bfa", citizen: "var(--accent)", officer: "#10b981" };
  const joinDate  = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" });

  return (
    <>
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Your account information and activity</p>
      </div>

      {/* Hero card */}
      <div className="profile-hero">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="profile-avatar-big">{user?.name?.[0]?.toUpperCase()}</div>
        <div className="profile-hero-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <div className="profile-badges">
            <span className="badge" style={{ background: `${roleColor[user?.role] || "var(--accent)"}20`, color: roleColor[user?.role] || "var(--accent)", textTransform: "capitalize" }}>
              {user?.role === "admin" ? "🛡️" : user?.role === "officer" ? "👷" : "👤"} {user?.role}
            </span>
            <span className="badge badge-resolved">✅ Verified Account</span>
            <span className="badge badge-progress">📅 Member since {joinDate}</span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="profile-grid" style={{ marginBottom: 24 }}>
        {[
          { label: "Full Name",     value: user?.name  || "—",    icon: "👤" },
          { label: "Email Address", value: user?.email || "—",    icon: "📧" },
          { label: "Account Role",  value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—", icon: "🔑" },
          { label: "User ID",       value: user?.id ? `#${user.id.slice(-8).toUpperCase()}` : "—", icon: "🆔" },
        ].map(({ label, value, icon }) => (
          <div className="profile-field" key={label}>
            <div className="profile-field-label">{icon} {label}</div>
            <div className="profile-field-value">{value}</div>
          </div>
        ))}
      </div>

      {/* Citizen activity */}
      {!isAdmin && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header"><span className="card-title">📊 My Activity Summary</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 16 }}>
              {[
                { label: "Total Filed",   num: total,    color: "var(--accent)"  },
                { label: "Resolved",      num: resolved, color: "var(--green)"   },
                { label: "Pending",       num: pending,  color: "var(--orange)"  },
                { label: "Success Rate",  num: `${rate}%`, color: "#a78bfa"      },
              ].map(({ label, num, color }) => (
                <div key={label} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, color }}>{num}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">📋 Recent Activity</span>
              <button className="btn-sm btn-accent" onClick={() => setPage("mycomplaints")}>View All</button>
            </div>
            {complaints.length === 0 ? (
              <div className="empty"><div className="empty-icon">📝</div><p>No complaints filed yet.</p></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {myComplaints.slice(0, 5).map(c => (
                      <tr key={c._id}>
                        <td style={{ fontWeight: 500 }}>{c.title}</td>
                        <td><span className="badge badge-progress">{c.category}</span></td>
                        <td><StatusBadge status={c.status} /></td>
                        <td style={{ color: "#64748b" }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Admin quick actions */}
      {isAdmin && (
        <div className="card">
          <div className="card-header"><span className="card-title">🛡️ Admin Quick Actions</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
            {[
              { label: "View All Complaints",  icon: "📋", page: "complaints" },
              { label: "Analytics Dashboard",  icon: "📈", page: "analytics"  },
              { label: "Manage Users",          icon: "👥", page: "users"      },
            ].map(item => (
              <button key={item.label} onClick={() => setPage(item.page)} style={{
                padding: 16, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12,
                color: "var(--text)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem",
                textAlign: "left", display: "flex", alignItems: "center", gap: 10
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;