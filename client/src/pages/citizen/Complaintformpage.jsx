import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiUpload } from "../../api/api";
import { CATEGORIES_DATA as CATEGORIES } from "./Submitcomplaint";
import AP_DISTRICTS from "../../data/districts";
import Toast from "../../components/common/Toast";

const ComplaintFormPage = ({ setPage, selectedCategory }) => {
  const { token } = useAuth();
  const cat = CATEGORIES.find(c => c.name === selectedCategory) || CATEGORIES[0];

  const [form, setForm] = useState({
    title: "", description: "", category: selectedCategory || "Roads",
    priority: "Low", district: "", location: { address: "" },
  });
  const [photos,    setPhotos]    = useState([]);
  const [drag,      setDrag]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handle    = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleLoc = (e) => setForm({ ...form, location: { address: e.target.value } });

  const addPhotos = (files) => {
    const valid = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .slice(0, 5 - photos.length);
    const newPhotos = valid.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
      size: (f.size / 1024).toFixed(0),
    }));
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
  };
  const removePhoto = (i) => {
    URL.revokeObjectURL(photos[i].preview);
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
  };

  const submit = async () => {
    console.log("📝 submitting complaint, district:", form.district);
    if (!form.title || !form.description)
      return setToast({ msg: "Title and description are required.", type: "error" });
    if (!form.location.address)
      return setToast({ msg: "Please enter a location.", type: "error" });
    if (!form.district) 
      return setToast({ msg: "Please select a district.", type: "error" });

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("priority", form.priority);
      formData.append("district", form.district);
      formData.append("location", JSON.stringify(form.location));
      photos.forEach(p => formData.append("images", p.file));

      const data = await apiUpload("/complaints", formData, token);
      console.log("📡 response from server", data);
      if (data._id) setSubmitted(true);
      else setToast({ msg: data.message || "Failed to submit.", type: "error" });
    } catch (err) {
      console.error("upload error", err);
      setToast({ msg: "Server error. Try again.", type: "error" });
    }
    setLoading(false);
  };

  // ── Success screen ──────────────────────────────────────────
  if (submitted) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>✅</div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", marginBottom: 12, color: "#fff" }}>Complaint Submitted!</h2>
      <p style={{ color: "var(--muted)", marginBottom: 8, fontSize: "1rem" }}>
        Your <strong style={{ color: cat.color }}>{selectedCategory}</strong> complaint has been received.
        {photos.length > 0 && <span> ({photos.length} photo{photos.length > 1 ? "s" : ""} attached)</span>}
      </p>
      <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: "0.9rem" }}>
        The city department will review and respond within 24–48 hours.
      </p>
      <div style={{ display: "flex", gap: 14 }}>
        <button onClick={() => setPage("submit")} style={{ padding: "13px 28px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem" }}>
          ← Raise Another
        </button>
        <button onClick={() => setPage("mycomplaints")} style={{ padding: "13px 28px", background: `linear-gradient(135deg,${cat.color},${cat.color}99)`, border: "none", borderRadius: 12, color: "#000", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>
          View My Complaints →
        </button>
      </div>
    </div>
  );

  // ── Form ────────────────────────────────────────────────────
  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <button onClick={() => setPage("submit")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.9rem", marginBottom: 24, padding: 0 }}>
        ← Back to Categories
      </button>

      {/* Banner */}
      <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 28, position: "relative", height: 180 }}>
        <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.style.display = "none"; e.target.parentNode.style.background = cat.gradient; }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(10,15,30,0.88) 0%,rgba(0,0,0,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{cat.icon}</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>{cat.name} Complaint</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{cat.desc}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: 24 }}>
          <span className="card-title">📝 Complaint Details</span>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Fields marked * are required</span>
        </div>

        <div className="form-grid">
          {/* Title */}
          <div className="form-group form-full">
            <label className="form-label">Complaint Title *</label>
            <input className="form-input" name="title" value={form.title} onChange={handle}
              placeholder={cat.name === "Roads" ? "e.g. Deep pothole on MG Road" : cat.name === "Water" ? "e.g. Water supply disrupted for 3 days" : "Briefly describe the issue"} />
          </div>

          {/* Category (locked) + Priority */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div style={{ padding: "12px 16px", background: "var(--bg)", border: `1px solid ${cat.color}55`, borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{cat.icon}</span>
              <span style={{ color: cat.color, fontWeight: 600 }}>{cat.name}</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Priority *</label>
            <select className="form-select" name="priority" value={form.priority} onChange={handle}>
              <option value="Low">🟢 Low — Minor inconvenience</option>
              <option value="Medium">🟡 Medium — Needs attention</option>
              <option value="High">🔴 High — Urgent / Safety risk</option>
            </select>
          </div>

          {/* District Selector */}
          <div className="form-group form-full">
            <label className="form-label">📍 Select District *</label>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", 
              gap: 8 
            }}>
              {AP_DISTRICTS.map(d => (
                <div
                  key={d.id}
                  onClick={() => setForm({ ...form, district: d.name })}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1px solid ${form.district === d.name 
                      ? "var(--accent)" : "var(--border)"}`,
                    background: form.district === d.name 
                      ? "rgba(0,229,255,0.1)" : "var(--bg)",
                    color: form.district === d.name 
                      ? "var(--accent)" : "var(--muted)",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: form.district === d.name ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{d.name}</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>{d.region}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="form-group form-full">
            <label className="form-label">Location / Address *</label>
            <input className="form-input" value={form.location.address} onChange={handleLoc}
              placeholder="e.g. Near City Park Gate, Sector 5, Ward 12" />
          </div>

          {/* Description */}
          <div className="form-group form-full">
            <label className="form-label">Detailed Description *</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handle} style={{ minHeight: 120 }}
              placeholder={`Describe the ${cat.name.toLowerCase()} issue:\n• When did you first notice it?\n• How severe is the problem?\n• Has it affected daily life?`} />
          </div>

          {/* Photo Upload */}
          <div className="form-group form-full">
            <label className="form-label">📸 Upload Photos ({photos.length}/5)</label>
            <div
              className={`upload-zone ${drag ? "drag" : ""}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); addPhotos(e.dataTransfer.files); }}
            >
              <input type="file" accept="image/*" multiple onChange={e => addPhotos(e.target.files)} disabled={photos.length >= 5} />
              <div className="upload-icon">📷</div>
              <div className="upload-text">
                <strong>Click to upload</strong> or drag &amp; drop photos here<br />
                <span style={{ fontSize: "0.78rem" }}>PNG, JPG, WEBP up to 10MB each · Max 5 photos</span>
              </div>
            </div>

            {photos.length > 0 && (
              <div className="photo-grid">
                {photos.map((p, i) => (
                  <div className="photo-thumb" key={i}>
                    <img src={p.preview} alt={p.name} />
                    <button className="photo-remove" onClick={() => removePhoto(i)}>✕</button>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.65)", padding: "3px 6px", fontSize: "0.65rem", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.size} KB
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info box */}
        <div style={{ background: `${cat.color}0f`, border: `1px solid ${cat.color}25`, borderRadius: 12, padding: "14px 18px", marginBottom: 24, marginTop: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>ℹ️</span>
          <div>
            <div style={{ fontSize: "0.82rem", color: cat.color, fontWeight: 600, marginBottom: 4 }}>What happens next?</div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Your complaint will be reviewed within <strong style={{ color: "var(--text)" }}>24–48 hours</strong>. The city's <strong style={{ color: "var(--text)" }}>{cat.name} Department</strong> will be assigned and you'll receive status updates.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={submit} disabled={loading} style={{ flex: 1, minWidth: 200, padding: "14px 0", background: loading ? "var(--surface2)" : `linear-gradient(135deg,${cat.color},${cat.color}bb)`, border: "none", borderRadius: 12, color: "#000", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : `0 6px 24px ${cat.color}40` }}>
            {loading ? "⏳ Submitting..." : `${cat.icon} Submit ${cat.name} Complaint →`}
          </button>
          <button onClick={() => setPage("submit")} style={{ padding: "14px 24px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--muted)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem" }}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ComplaintFormPage;