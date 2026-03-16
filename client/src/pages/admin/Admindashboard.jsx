import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";
import { StatusBadge, PriorityBadge } from "../../components/common/Badges";
import AP_DISTRICTS from "../../data/districts";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [districtStats, setDistrictStats] = useState([]);
  const [districtFilter, setDistrictFilter] = useState("All");

  useEffect(() => {
    apiFetch("/admin/stats",  "GET", null, token).then(setStats).catch(() => {});
    apiFetch("/complaints",   "GET", null, token).then(d => { if (Array.isArray(d)) setRecent(d.slice(0, 6)); }).catch(() => {});
    apiFetch("/admin/district-stats", "GET", null, token)
      .then(d => { if (Array.isArray(d)) setDistrictStats(d); })
      .catch(() => {});
  }, [token]);

  const s = stats || { total: 142, pending: 47, resolved: 83, inProgress: 12, users: 389 };
  const cats = stats?.byCategory || [
    { _id: "Roads",       count: 42 },
    { _id: "Water",       count: 31 },
    { _id: "Electricity", count: 28 },
    { _id: "Sanitation",  count: 22 },
    { _id: "Parks",       count: 11 },
    { _id: "Other",       count: 8  },
  ];
  const maxCount = Math.max(...cats.map(c => c.count));
  const colors   = ["#00e5ff","#7c3aed","#10b981","#f59e0b","#ef4444","#8b5cf6"];

  // Filter districtStats based on selected region
  const filteredDistrictStats = districtFilter === "All"
    ? districtStats
    : districtStats.filter(stat => {
        const district = AP_DISTRICTS.find(d => d.name === stat._id);
        return district && district.region === districtFilter;
      });

  return (
    <>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Overview of all complaints and city services</p>
      </div>

      <div className="stats-grid">
        {[
          { label: "Total Complaints",      num: s.total,      icon: "📋", cls: "blue"   },
          { label: "Pending",               num: s.pending,    icon: "🕐", cls: "orange" },
          { label: "In Progress",           num: s.inProgress, icon: "⚡", cls: "purple" },
          { label: "Resolved",              num: s.resolved,   icon: "✅", cls: "green"  },
          { label: "Registered Citizens",   num: s.users,      icon: "👥", cls: "blue"   },
        ].map(({ label, num, icon, cls }) => (
          <div className={`stat-card ${cls}`} key={label}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-num">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">📊 Complaints by Category</span></div>
          <div className="bar-chart">
            {cats.map(({ _id, count }, i) => (
              <div className="bar-row" key={_id}>
                <div className="bar-label">{_id}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(count / maxCount) * 100}%`, background: colors[i % colors.length] }} />
                </div>
                <div className="bar-count">{count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">📈 Resolution Rate</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Resolved",    val: s.resolved,   color: "#10b981" },
              { label: "In Progress", val: s.inProgress, color: "#00e5ff" },
              { label: "Pending",     val: s.pending,    color: "#f59e0b" },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
                  <span style={{ color: "#94a3b8" }}>{label}</span>
                  <span style={{ color: "#fff" }}>{s.total > 0 ? Math.round((val / s.total) * 100) : 0}%</span>
                </div>
                <div className="bar-track" style={{ height: 10 }}>
                  <div className="bar-fill" style={{ width: `${s.total > 0 ? (val / s.total) * 100 : 0}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">🕐 Recent Complaints</span></div>
        {recent.length === 0 ? (
          <div className="empty"><div className="empty-icon">📭</div><p>No complaints yet. Connect your backend to see data.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Citizen</th><th>Category</th><th>Status</th><th>Priority</th><th>Date</th></tr></thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 500 }}>{c.title}</td>
                    <td style={{ color: "#94a3b8" }}>{c.citizen?.name || "N/A"}</td>
                    <td><span className="badge badge-progress">{c.category}</span></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><PriorityBadge p={c.priority} /></td>
                    <td style={{ color: "#64748b" }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* District Overview */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🗺️ District-wise Overview — Andhra Pradesh</span>
        </div>

        {/* District filter buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["All", "North Andhra", "Godavari", "Krishna", 
            "South Andhra", "Rayalaseema"].map(region => (
            <button
              key={region}
              className={`btn-sm ${districtFilter === region 
                ? "btn-primary" : "btn-accent"}`}
              style={districtFilter === region ? { 
                padding: "8px 16px", width: "auto",
                fontFamily: "'DM Sans',sans-serif" 
              } : {}}
              onClick={() => setDistrictFilter(region)}
            >
              {region}
            </button>
          ))}
        </div>

        {districtStats.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🗺️</div>
            <p>No district data yet. Submit complaints with districts to see data here.</p>
          </div>
        ) : filteredDistrictStats.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🗺️</div>
            <p>No complaints in the {districtFilter === "All" ? "selected region" : districtFilter} yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Total</th>
                  <th>Pending</th>
                  <th>In Progress</th>
                  <th>Resolved</th>
                  <th>Resolution Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDistrictStats.map(d => {
                  const rate = d.total > 0 
                    ? Math.round((d.resolved / d.total) * 100) : 0;
                  return (
                    <tr key={d._id}>
                      <td style={{ fontWeight: 600 }}>📍 {d._id || "Unknown"}</td>
                      <td>
                        <span style={{ 
                          fontFamily: "'Syne',sans-serif", 
                          fontWeight: 700, color: "var(--accent)" 
                        }}>
                          {d.total}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                          {d.pending}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: "#00e5ff", fontWeight: 600 }}>
                          {d.inProgress}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: "#10b981", fontWeight: 600 }}>
                          {d.resolved}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ 
                            flex: 1, height: 6, background: "var(--surface2)", 
                            borderRadius: 3, overflow: "hidden", minWidth: 80 
                          }}>
                            <div style={{ 
                              height: "100%", borderRadius: 3,
                              width: `${rate}%`,
                              background: rate >= 70 
                                ? "#10b981" : rate >= 40 
                                ? "#f59e0b" : "#ef4444",
                              transition: "width 1s ease",
                            }} />
                          </div>
                          <span style={{ 
                            fontSize: "0.82rem", fontWeight: 600,
                            color: rate >= 70 
                              ? "#10b981" : rate >= 40 
                              ? "#f59e0b" : "#ef4444" 
                          }}>
                            {rate}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          rate >= 70 ? "badge-resolved" : 
                          rate >= 40 ? "badge-progress" : "badge-pending"
                        }`}>
                          {rate >= 70 ? "✅ Good" : 
                           rate >= 40 ? "⚡ Active" : "🕐 Needs Attention"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;