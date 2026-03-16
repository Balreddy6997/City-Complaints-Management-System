import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const Analytics = () => {
  const { token } = useAuth();
  const [stats,      setStats]      = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    apiFetch("/admin/stats",  "GET", null, token).then(setStats).catch(() => {});
    apiFetch("/complaints",   "GET", null, token)
      .then(d => { if (Array.isArray(d)) setComplaints(d); })
      .catch(() => {});
  }, [token]);

  // Use demo data if backend not connected
  const s = stats || { 
    total: 142, pending: 47, resolved: 83, 
    inProgress: 12, users: 389 
  };

  const cats = stats?.byCategory || [
    { _id: "Roads",       count: 42 },
    { _id: "Water",       count: 31 },
    { _id: "Electricity", count: 28 },
    { _id: "Sanitation",  count: 22 },
    { _id: "Parks",       count: 11 },
    { _id: "Other",       count: 8  },
  ];

  const catColors = {
    Roads:       "#f59e0b",
    Water:       "#0ea5e9",
    Electricity: "#facc15",
    Sanitation:  "#10b981",
    Parks:       "#22c55e",
    Other:       "#a78bfa",
  };

  const totalCats  = cats.reduce((a, c) => a + c.count, 0);
  const maxCount   = Math.max(...cats.map(c => c.count));
  const resolveRate = s.total > 0 ? Math.round((s.resolved / s.total) * 100) : 0;
  const pendingRate = s.total > 0 ? Math.round((s.pending  / s.total) * 100) : 0;
  const progressRate= s.total > 0 ? Math.round((s.inProgress/s.total)* 100) : 0;

  // Monthly trend demo data
  const monthlyData = [
    { month: "Aug", complaints: 18, resolved: 12 },
    { month: "Sep", complaints: 24, resolved: 18 },
    { month: "Oct", complaints: 31, resolved: 22 },
    { month: "Nov", complaints: 28, resolved: 25 },
    { month: "Dec", complaints: 35, resolved: 28 },
    { month: "Jan", complaints: 42, resolved: 35 },
    { month: "Feb", complaints: 38, resolved: 32 },
    { month: "Mar", complaints: s.total || 45, resolved: s.resolved || 38 },
  ];
  const maxMonthly = Math.max(...monthlyData.map(m => m.complaints));

  // Priority breakdown demo
  const priorities = complaints.length > 0 ? [
    { label: "High",   count: complaints.filter(c => c.priority === "High").length,   color: "#ef4444" },
    { label: "Medium", count: complaints.filter(c => c.priority === "Medium").length, color: "#f59e0b" },
    { label: "Low",    count: complaints.filter(c => c.priority === "Low").length,    color: "#10b981" },
  ] : [
    { label: "High",   count: 38, color: "#ef4444" },
    { label: "Medium", count: 61, color: "#f59e0b" },
    { label: "Low",    count: 43, color: "#10b981" },
  ];
  const totalPriority = priorities.reduce((a, p) => a + p.count, 0);

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <h2>Analytics & Insights</h2>
        <p>Deep dive into complaint trends, resolution rates and city performance</p>
      </div>

      {/* Time filter buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {["all", "week", "month", "year"].map(f => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`btn-sm ${timeFilter === f ? "btn-primary" : "btn-accent"}`}
            style={timeFilter === f ? { 
              padding: "8px 18px", width: "auto", 
              fontFamily: "'DM Sans',sans-serif" 
            } : {}}
          >
            {f === "all" ? "All Time" : 
             f === "week" ? "This Week" : 
             f === "month" ? "This Month" : "This Year"}
          </button>
        ))}
      </div>

      {/* KPI Cards Row */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", 
        gap: 16, 
        marginBottom: 28 
      }}>
        {[
          { 
            label: "Resolution Rate", 
            value: `${resolveRate}%`, 
            icon: "✅", 
            color: "#10b981",
            sub: `${s.resolved} of ${s.total} resolved`
          },
          { 
            label: "Pending Rate", 
            value: `${pendingRate}%`, 
            icon: "🕐", 
            color: "#f59e0b",
            sub: `${s.pending} awaiting action`
          },
          { 
            label: "In Progress", 
            value: `${progressRate}%`, 
            icon: "⚡", 
            color: "#00e5ff",
            sub: `${s.inProgress} being handled`
          },
          { 
            label: "Avg Per Category", 
            value: Math.round(s.total / 6) || 0, 
            icon: "📊", 
            color: "#a78bfa",
            sub: "across 6 categories"
          },
          { 
            label: "Citizens Engaged", 
            value: s.users || 0, 
            icon: "👥", 
            color: "#f59e0b",
            sub: "registered users"
          },
        ].map(({ label, value, icon, color, sub }) => (
          <div key={label} style={{
            background: "var(--surface)",
            border: `1px solid ${color}30`,
            borderRadius: 16,
            padding: "20px 18px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, 
              height: 3, background: color 
            }} />
            <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
            <div style={{ 
              fontFamily: "'Syne',sans-serif", fontSize: "1.9rem", 
              fontWeight: 800, color 
            }}>
              {value}
            </div>
            <div style={{ 
              color: "var(--text)", fontSize: "0.82rem", 
              fontWeight: 600, marginTop: 4 
            }}>
              {label}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: 2 }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Trend Chart + Category Donut Row */}
      <div style={{ 
        display: "grid", gridTemplateColumns: "1.5fr 1fr", 
        gap: 20, marginBottom: 24 
      }}>

        {/* Monthly Trend Bar Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📈 Monthly Complaint Trends</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Last 8 months
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 200, paddingBottom: 24, position: "relative" }}>
            {monthlyData.map((m, i) => (
              <div key={i} style={{ 
                flex: 1, display: "flex", flexDirection: "column", 
                alignItems: "center", gap: 4, height: "100%",
                justifyContent: "flex-end"
              }}>
                {/* Resolved bar (front) */}
                <div style={{ width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                  <div style={{
                    width: "55%", position: "absolute", right: "5%",
                    height: `${(m.complaints / maxMonthly) * 140}px`,
                    background: "rgba(0,229,255,0.2)",
                    borderRadius: "4px 4px 0 0",
                    border: "1px solid rgba(0,229,255,0.3)",
                    bottom: 0,
                  }} />
                  <div style={{
                    width: "55%", position: "absolute", left: "5%",
                    height: `${(m.resolved / maxMonthly) * 140}px`,
                    background: "linear-gradient(to top, #10b981, #34d399)",
                    borderRadius: "4px 4px 0 0",
                    bottom: 0,
                  }} />
                </div>
                <div style={{ 
                  fontSize: "0.65rem", color: "var(--muted)", 
                  marginTop: 6, position: "absolute", bottom: 0 
                }}>
                  {m.month}
                </div>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--muted)" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "linear-gradient(to top,#10b981,#34d399)" }} />
              Resolved
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--muted)" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(0,229,255,0.2)", border: "1px solid rgba(0,229,255,0.3)" }} />
              Total Complaints
            </div>
          </div>
        </div>
        <br />

        {/* Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🍩 Category Breakdown</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cats.map(({ _id, count }) => {
              const pct = totalCats > 0 ? Math.round((count / totalCats) * 100) : 0;
              return (
                <div key={_id}>
                  <div style={{ 
                    display: "flex", justifyContent: "space-between", 
                    marginBottom: 4, fontSize: "0.8rem" 
                  }}>
                    <span style={{ color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ 
                        width: 8, height: 8, borderRadius: "50%", 
                        background: catColors[_id] || "#64748b" 
                      }} />
                      {_id}
                    </span>
                    <span style={{ color: "var(--muted)" }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ 
                    height: 6, background: "var(--surface2)", 
                    borderRadius: 3, overflow: "hidden" 
                  }}>
                    <div style={{ 
                      height: "100%", borderRadius: 3,
                      width: `${(count / maxCount) * 100}%`,
                      background: catColors[_id] || "#64748b",
                      transition: "width 1s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority Breakdown + Resolution Funnel Row */}
      <div style={{ 
        display: "grid", gridTemplateColumns: "1fr 1fr", 
        gap: 20, marginBottom: 24 
      }}>

        {/* Priority Breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎯 Priority Distribution</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {priorities.map(({ label, count, color }) => {
              const pct = totalPriority > 0 
                ? Math.round((count / totalPriority) * 100) : 0;
              return (
                <div key={label}>
                  <div style={{ 
                    display: "flex", justifyContent: "space-between", 
                    marginBottom: 6, fontSize: "0.85rem" 
                  }}>
                    <span style={{ 
                      color: color, fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 8 
                    }}>
                      <span style={{
                        display: "inline-block", width: 10, height: 10,
                        borderRadius: "50%", background: color
                      }} />
                      {label} Priority
                    </span>
                    <span style={{ color: "var(--muted)" }}>
                      {count} complaints ({pct}%)
                    </span>
                  </div>
                  <div style={{ 
                    height: 10, background: "var(--surface2)", 
                    borderRadius: 5, overflow: "hidden" 
                  }}>
                    <div style={{ 
                      height: "100%", borderRadius: 5,
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}99)`,
                      transition: "width 1s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Priority summary boxes */}
          <div style={{ 
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", 
            gap: 10, marginTop: 20 
          }}>
            {priorities.map(({ label, count, color }) => (
              <div key={label} style={{
                background: `${color}12`,
                border: `1px solid ${color}30`,
                borderRadius: 10, padding: "12px 8px", textAlign: "center"
              }}>
                <div style={{ 
                  fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", 
                  fontWeight: 800, color 
                }}>
                  {count}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 2 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Resolution Funnel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🔄 Resolution Funnel</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Total Received",  count: s.total,      color: "#00e5ff", width: "100%"           },
              { label: "In Progress",     count: s.inProgress, color: "#a78bfa", width: `${progressRate + 20}%` },
              { label: "Resolved",        count: s.resolved,   color: "#10b981", width: `${resolveRate}%`       },
              { label: "Pending",         count: s.pending,    color: "#f59e0b", width: `${pendingRate}%`        },
            ].map(({ label, count, color, width }) => (
              <div key={label} style={{
                background: `${color}10`,
                border: `1px solid ${color}25`,
                borderRadius: 10, padding: "14px 16px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width, background: `${color}15`,
                  transition: "width 1s ease",
                }} />
                <div style={{ 
                  position: "relative", display: "flex", 
                  justifyContent: "space-between", alignItems: "center" 
                }}>
                  <span style={{ color: "var(--text)", fontSize: "0.85rem", fontWeight: 500 }}>
                    {label}
                  </span>
                  <span style={{ 
                    color, fontFamily: "'Syne',sans-serif", 
                    fontWeight: 800, fontSize: "1.1rem" 
                  }}>
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Performance score */}
          <div style={{
            marginTop: 20, padding: "16px", textAlign: "center",
            background: resolveRate >= 70 
              ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
            border: `1px solid ${resolveRate >= 70 ? "#10b981" : "#f59e0b"}30`,
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>
              {resolveRate >= 80 ? "🏆" : resolveRate >= 60 ? "👍" : "⚠️"}
            </div>
            <div style={{ 
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              color: resolveRate >= 70 ? "#10b981" : "#f59e0b",
              fontSize: "1.1rem", marginBottom: 4,
            }}>
              {resolveRate >= 80 ? "Excellent Performance" 
               : resolveRate >= 60 ? "Good Performance" 
               : "Needs Improvement"}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
              {resolveRate}% resolution rate · {s.total} total complaints
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Insight Cards */}
      <div style={{ 
        display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", 
        gap: 16, marginBottom: 24 
      }}>
      </div>
    </>
  );
};

export default Analytics;
