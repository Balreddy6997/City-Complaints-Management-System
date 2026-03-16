import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";
import { StatusBadge, PriorityBadge } from "../../components/common/Badges";

const MyComplaints = () => {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    apiFetch("/complaints/my", "GET", null, token)
      .then(d => { if (Array.isArray(d)) setComplaints(d); })
      .catch(() => {});
  }, [token]);

  return (
    <>
      <div className="page-header">
        <h2>My Complaints</h2>
        <p>All complaints you have submitted</p>
      </div>
      <div className="card">
        {complaints.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <p>You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Category</th><th>District</th><th>Location</th><th>Priority</th><th>Status</th><th>Submitted</th></tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{c.description?.slice(0, 60)}...</div>
                    </td>
                    <td><span className="badge badge-progress">{c.category}</span></td>
                    <td style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                      📍 {c.district || "—"}
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{c.location?.address || "—"}</td>
                    <td><PriorityBadge p={c.priority} /></td>
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
  );
};

export default MyComplaints;