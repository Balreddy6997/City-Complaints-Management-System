import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/api";

const AuthPage = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "citizen", phone: "", address: "", adminCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError(""); setSuccess("");
    if (!form.email || !form.password) return setError("Email and password are required.");
    if (tab === "register" && !form.name) return setError("Name is required.");
    setLoading(true);
    try {
      const endpoint = tab === "login" ? "/auth/login" : "/auth/register";
      const body = tab === "login" ? { email: form.email, password: form.password } : form;
      const data = await apiFetch(endpoint, "POST", body);
      if (data.message) setError(data.message);
      else { login(data.user, data.token); setSuccess("Welcome! Redirecting..."); }
    } catch (err) { 
      console.error("Auth error:", err);
      setError(err.message || "Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-grid" />
        <div className="auth-brand">
          <div className="auth-logo">🏙️</div>
          <h1>Smart City<br />CMS</h1>
          <p>A unified platform for citizens to report issues and officials to resolve them efficiently.</p>
        </div>
        <div className="auth-features">
          {[
            ["📍", "Real-time complaint tracking with location"],
            ["📊", "Analytics dashboard for city officials"],
            ["🔔", "Instant notifications on status updates"],
            ["🔒", "Role-based secure access control"],
          ].map(([icon, text]) => (
            <div className="auth-feature" key={text}>
              <span className="auth-feature-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-title">
          {tab === "login" ? "Welcome back" : "Create account"}
        </div>
        <div className="auth-form-sub">
          {tab === "login" ? "Sign in to your account to continue" : "Register to start submitting complaints"}
        </div>

        <div className="tab-row">
          <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
          <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setError(""); }}>Register</button>
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}
        {success && <div className="success-msg">✅ {success}</div>}

        {tab === "register" && (
          <>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="John Smith" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765..." />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" name="role" value={form.role} onChange={handle}>
                  <option value="citizen">Citizen</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" name="address" value={form.address} onChange={handle} placeholder="123 Main St, City" />
            </div>
            {form.role === "admin" && (
              <div className="form-group">
                <label className="form-label">🔐 Admin Registration Code *</label>
                <input 
                  className="form-input" 
                  name="adminCode"
                  value={form.adminCode} 
                  onChange={handle} 
                  placeholder="e.g. ADMIN-AP-2024"
                  style={{ 
                    borderColor: "rgba(124,58,237,0.5)",
                    background: "rgba(124,58,237,0.05)" 
                  }}
                />
                <div style={{ 
                  fontSize: "0.72rem", color: "var(--muted)", 
                  marginTop: 6, lineHeight: 1.5 
                }}>
                  🛡️ Admin codes are provided by the system administrator only.
                  Contact your district office to get a valid code.
                </div>
              </div>
            )}
          </>
        )}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" name="password" value={form.password} onChange={handle} placeholder="••••••••" />
        </div>

        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
