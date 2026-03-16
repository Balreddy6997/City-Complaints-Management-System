import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";
import { StatusBadge, PriorityBadge } from "../../components/common/Badges";
import AP_DISTRICTS from "../../data/districts";
import Toast from "../../components/common/Toast";

const AllComplaints = () => {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [toast, setToast]   = useState(null);
  const [photoModal, setPhotoModal] = useState(null); // { title, images } or null

  const fetchComplaints = () =>
    apiFetch("/complaints", "GET", null, token).then(d => { if (Array.isArray(d)) setComplaints(d); });

  useEffect(() => { fetchComplaints(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id, status) => {
    const data = await apiFetch(`/complaints/${id}`, "PUT", { status }, token);
    if (data._id) { setToast({ msg: "Status updated!", type: "success" }); fetchComplaints(); }
  };

  const statuses = ["All", "Pending", "In Progress", "Resolved", "Rejected"];
  const filtered = complaints.filter(c => {
    const matchStatus   = filter === "All" || c.status === filter;
    const matchDistrict = districtFilter === "All" || 
                          c.district === districtFilter;
    return matchStatus && matchDistrict;
  });

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h2>All Complaints</h2>
        <p>Manage and update the status of all complaints</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button
            key={s}
            className={`btn-sm ${filter === s ? "btn-primary" : "btn-accent"}`}
            style={filter === s ? { padding: "8px 18px", width: "auto", fontFamily: "'DM Sans',sans-serif" } : {}}
            onClick={() => setFilter(s)}
          >{s}</button>
        ))}
        <select
          className="form-select"
          style={{ width: 200, padding: "8px 12px", fontSize: "0.85rem" }}
          value={districtFilter}
          onChange={e => setDistrictFilter(e.target.value)}
        >
          <option value="All">🗺️ All Districts</option>
          {AP_DISTRICTS.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📭</div><p>No complaints found.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Citizen</th><th>Category</th><th>District</th><th>Location</th><th>Priority</th><th>Photos</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{c.description?.slice(0, 50)}...</div>
                    </td>
                    <td style={{ color: "#94a3b8" }}>{c.citizen?.name || "N/A"}</td>
                    <td><span className="badge badge-progress">{c.category}</span></td>
                    <td>
                      <span style={{ 
                        fontSize: "0.8rem", color: "#94a3b8",
                        display: "flex", alignItems: "center", gap: 4 
                      }}>
                        📍 {c.district || "—"}
                      </span>
                    </td>
                    <td style={{ color: "#64748b", fontSize: "0.82rem" }}>{c.location?.address || "—"}</td>
                    <td><PriorityBadge p={c.priority} /></td>
                    <td>
                      {c.images && c.images.length > 0 ? (
                        <button
                          onClick={() => setPhotoModal({ title: c.title, images: c.images })}
                          style={{
                            background: "rgba(0,229,255,0.1)",
                            border: "1px solid rgba(0,229,255,0.25)",
                            borderRadius: 8,
                            color: "var(--accent)",
                            padding: "5px 12px",
                            cursor: "pointer",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          📷 {c.images.length} photo{c.images.length > 1 ? "s" : ""}
                        </button>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>No photos</span>
                      )}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: 140, padding: "6px 10px", fontSize: "0.8rem" }}
                        value={c.status}
                        onChange={e => updateStatus(c._id, e.target.value)}
                      >
                        {["Pending","In Progress","Resolved","Rejected"].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {photoModal && (
        <div
          onClick={() => setPhotoModal(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 32,
              maxWidth: 800,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", color: "#fff", fontSize: "1.1rem", marginBottom: 4 }}>
                  📷 Complaint Photos
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{photoModal.title}</p>
              </div>
              <button
                onClick={() => setPhotoModal(null)}
                style={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text)",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                ✕ Close
              </button>
            </div>

            {photoModal.images.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
                No photos attached to this complaint.
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 14,
              }}>
                {photoModal.images.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(`http://localhost:5000/uploads/${img}`, '_blank')}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${img}`}
                      alt=""
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={e => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div style={{
                      display: "none",
                      aspectRatio: "4/3",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: 16,
                      background: "var(--surface2)",
                    }}>
                      <span style={{ fontSize: 32 }}>❌</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center" }}>
                        File not found on server
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#64748b", wordBreak: "break-all", textAlign: "center" }}>
                        {img}
                      </span>
                    </div>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "rgba(0,0,0,0.6)",
                      padding: "6px 10px",
                      fontSize: "0.72rem",
                      color: "#fff",
                    }}>
                      Photo {i + 1} · Click to open full size
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default AllComplaints;