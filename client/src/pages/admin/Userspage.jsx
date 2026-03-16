import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

const UsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch("/admin/users", "GET", null, token)
      .then(d => { if (Array.isArray(d)) setUsers(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <div className="page-header">
        <h2>User Management</h2>
        <p>View and manage registered citizens and officers</p>
      </div>
      <div className="card">
        {loading ? (
          <div className="empty">
            <div className="empty-icon">⌛</div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">👥</div>
            <p>No users registered yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Address</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: "#64748b", fontSize: "0.85rem" }}>{u.email}</td>
                    <td><span className="badge badge-progress">{u.role}</span></td>
                    <td style={{ color: "#94a3b8" }}>{u.phone || "—"}</td>
                    <td style={{ color: "#94a3b8", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>{u.address || "—"}</td>
                    <td style={{ color: "#64748b" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
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

export default UsersPage;