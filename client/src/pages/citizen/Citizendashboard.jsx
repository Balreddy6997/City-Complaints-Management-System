import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";
import { StatusBadge, PriorityBadge } from "../../components/common/Badges";
import AP_DISTRICTS from "../../data/districts";

const CitizenDashboard = ({ setPage }) => {
  const { token, user } = useAuth();
  const [complaints,    setComplaints]    = useState([]);
  const [districtFilter,setDistrictFilter]= useState("All");
  

  useEffect(() => {
    apiFetch("/complaints", "GET", null, token)
      .then(d => { if (Array.isArray(d)) setComplaints(d); })
      .catch(() => {});
  }, [token]);

  // ── Compute stats from citizen's own complaints ─────────────
  const total      = complaints.length;
  const pending    = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved   = complaints.filter(c => c.status === "Resolved").length;
  const rejected   = complaints.filter(c => c.status === "Rejected").length;

  // ── Category breakdown ──────────────────────────────────────
  const catMap = {};
  complaints.forEach(c => { catMap[c.category] = (catMap[c.category] || 0) + 1; });
  const cats     = Object.entries(catMap).map(([_id, count]) => ({ _id, count }))
                         .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...cats.map(c => c.count), 1);
  const colors   = ["#00e5ff","#7c3aed","#10b981","#f59e0b","#ef4444","#8b5cf6"];

  // ── District breakdown ──────────────────────────────────────
  const distMap = {};
  complaints.forEach(c => {
    if (c.district) distMap[c.district] = (distMap[c.district] || 0) + 1;
  });
  const allDistrictStats = Object.entries(distMap).map(([_id, total]) => {
    const dc = complaints.filter(c => c.district === _id);
    return {
      _id,
      total,
      pending:    dc.filter(c => c.status === "Pending").length,
      inProgress: dc.filter(c => c.status === "In Progress").length,
      resolved:   dc.filter(c => c.status === "Resolved").length,
    };
  }).sort((a, b) => b.total - a.total);

  const filteredDistrictStats = districtFilter === "All"
    ? allDistrictStats
    : allDistrictStats.filter(stat => {
        const d = AP_DISTRICTS.find(d => d.name === stat._id);
        return d && d.region === districtFilter;
      });

  // ── Recent complaints ───────────────────────────────────────
  const recent = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h2>My Dashboard</h2>
          <p>Welcome back, {user?.name?.split(" ")[0]} — here's your complaint overview</p>
        </div>
        <button
          onClick={() => setPage("submit")}
          className="btn-primary"
          style={{ width: "auto", padding: "10px 22px" }}
        >
          + Raise Complaint
        </button>
      </div>

      {/* ── Stat Cards — same as admin ── */}
      <div className="stats-grid">
        {[
          { label: "Total Complaints", num: total,      icon: "📋", cls: "blue"   },
          { label: "Pending",          num: pending,    icon: "🕐", cls: "orange" },
          { label: "In Progress",      num: inProgress, icon: "⚡", cls: "purple" },
          { label: "Resolved",         num: resolved,   icon: "✅", cls: "green"  },
          { label: "Rejected",         num: rejected,   icon: "❌", cls: "blue"   },
        ].map(({ label, num, icon, cls }) => (
          <div className={`stat-card ${cls}`} key={label}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-num">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts — same layout as admin ── */}
      <div className="charts-grid">

        {/* Category Bar Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📊 My Complaints by Category</span>
          </div>
          {cats.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📭</div>
              <p>No complaints yet.</p>
            </div>
          ) : (
            <div className="bar-chart">
              {cats.map(({ _id, count }, i) => (
                <div className="bar-row" key={_id}>
                  <div className="bar-label">{_id}</div>
                  <div className="bar-track">
                    <div className="bar-fill"
                      style={{ width: `${(count / maxCount) * 100}%`, background: colors[i % colors.length] }} />
                  </div>
                  <div className="bar-count">{count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolution Rate */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📈 My Resolution Rate</span>
          </div>
          {total === 0 ? (
            <div className="empty">
              <div className="empty-icon">📊</div>
              <p>No data yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Resolved",    val: resolved,   color: "#10b981" },
                { label: "In Progress", val: inProgress, color: "#00e5ff" },
                { label: "Pending",     val: pending,    color: "#f59e0b" },
                { label: "Rejected",    val: rejected,   color: "#ef4444" },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    marginBottom: 6, fontSize: "0.85rem" }}>
                    <span style={{ color: "#94a3b8" }}>{label}</span>
                    <span style={{ color: "#fff" }}>
                      {total > 0 ? Math.round((val / total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="bar-track" style={{ height: 10 }}>
                    <div className="bar-fill"
                      style={{ width: `${total > 0 ? (val / total) * 100 : 0}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Recent Complaints Table — same as admin ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🕐 Recent Complaints</span>
          <button
            onClick={() => setPage("mycomplaints")}
            className="btn-sm"
            style={{ width: "auto", padding: "6px 16px" }}
          >
            View All →
          </button>
        </div>
        {recent.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <p>No complaints yet.</p>
            <button
              onClick={() => setPage("submit")}
              className="btn-primary"
              style={{ marginTop: 12, width: "auto", padding: "10px 24px" }}
            >
              Raise Your First Complaint
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Citizen</th>   {/* ← add this */}
                  <th>Category</th>
                  <th>District</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 500 }}>{c.title}</td>
                    <td style={{ color: "#94a3b8" }}>{c.citizen?.name || "N/A"}</td>  {/* ← add this */}
                    <td><span className="badge badge-progress">{c.category}</span></td>
                    <td style={{ color: "#94a3b8" }}>📍 {c.district || "—"}</td>
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

      {/* ── District Overview — same as admin ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🗺️ My Complaints by District — Andhra Pradesh</span>
        </div>

        {/* Region filter buttons — same as admin */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["All", "North Andhra", "Godavari", "Krishna", "South Andhra", "Rayalaseema"].map(region => (
            <button
              key={region}
              className={`btn-sm ${districtFilter === region ? "btn-primary" : "btn-accent"}`}
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

        {allDistrictStats.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🗺️</div>
            <p>No district data yet. Submit complaints with districts to see data here.</p>
          </div>
        ) : filteredDistrictStats.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🗺️</div>
            <p>No complaints in {districtFilter} yet.</p>
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
                  const rate = d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0;
                  return (
                    <tr key={d._id}>
                      <td style={{ fontWeight: 600 }}>📍 {d._id}</td>
                      <td>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "var(--accent)" }}>
                          {d.total}
                        </span>
                      </td>
                      <td><span style={{ color: "#f59e0b", fontWeight: 600 }}>{d.pending}</span></td>
                      <td><span style={{ color: "#00e5ff", fontWeight: 600 }}>{d.inProgress}</span></td>
                      <td><span style={{ color: "#10b981", fontWeight: 600 }}>{d.resolved}</span></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: "var(--surface2)",
                            borderRadius: 3, overflow: "hidden", minWidth: 80 }}>
                            <div style={{
                              height: "100%", borderRadius: 3, width: `${rate}%`,
                              background: rate >= 70 ? "#10b981" : rate >= 40 ? "#f59e0b" : "#ef4444",
                              transition: "width 1s ease",
                            }} />
                          </div>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600,
                            color: rate >= 70 ? "#10b981" : rate >= 40 ? "#f59e0b" : "#ef4444" }}>
                            {rate}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          rate >= 70 ? "badge-resolved" :
                          rate >= 40 ? "badge-progress" : "badge-pending"
                        }`}>
                          {rate >= 70 ? "✅ Good" : rate >= 40 ? "⚡ Active" : "🕐 Needs Attention"}
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

export default CitizenDashboard;