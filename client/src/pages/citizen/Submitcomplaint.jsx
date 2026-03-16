
export const CATEGORIES_DATA = [
  {
    name: "Roads",
    icon: "🛣️",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg,#78350f,#92400e)",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500&q=80",
    desc: "Potholes, road damage, broken pavements, traffic signals",
  },
  {
    name: "Water",
    icon: "💧",
    color: "#0ea5e9",
    gradient: "linear-gradient(135deg,#0c4a6e,#075985)",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&q=80",
    desc: "Water leaks, supply issues, drainage blockages, contamination",
  },
  {
    name: "Electricity",
    icon: "⚡",
    color: "#facc15",
    gradient: "linear-gradient(135deg,#713f12,#854d0e)",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&q=80",
    desc: "Power outages, streetlight failures, transformer issues",
  },
  {
    name: "Sanitation",
    icon: "🗑️",
    color: "#10b981",
    gradient: "linear-gradient(135deg,#064e3b,#065f46)",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    desc: "Garbage collection, public toilet issues, waste dumping",
  },
  {
    name: "Parks",
    icon: "🌳",
    color: "#22c55e",
    gradient: "linear-gradient(135deg,#14532d,#166534)",
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=500&q=80",
    desc: "Damaged equipment, overgrown areas, broken benches, lighting",
  },
  {
    name: "Other",
    icon: "📌",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg,#3b0764,#4c1d95)",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80",
    desc: "Noise pollution, stray animals, illegal construction, misc",
  },
];

const SubmitComplaint = ({ setPage, setComplaintCategory }) => {
  return (
    <>
      <div className="page-header">
        <h2>Raise a Complaint</h2>
        <p>Select a category below to report your issue to the city department</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {CATEGORIES_DATA.map(cat => (
          <div
            key={cat.name}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Category Image */}
            <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
              <img
                src={cat.image}
                alt={cat.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => {
                  e.target.style.display = "none";
                  e.target.parentNode.style.background = cat.gradient;
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(10,15,30,0.85) 0%, rgba(0,0,0,0.1) 60%)"
              }} />
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                borderRadius: 12, padding: "6px 12px",
                display: "flex", alignItems: "center", gap: 6
              }}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: cat.color }}>
                  {cat.name}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: "18px 20px 20px" }}>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: 18, minHeight: 42 }}>
                {cat.desc}
              </p>
              <button
                onClick={() => {
                  setComplaintCategory(cat.name);
                  setPage("complaintform");
                }}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`,
                  border: `1px solid ${cat.color}55`,
                  borderRadius: 12,
                  color: cat.color,
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${cat.color}28`;
                  e.currentTarget.style.boxShadow = `0 4px 20px ${cat.color}30`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `linear-gradient(135deg,${cat.color}22,${cat.color}11)`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {cat.icon} Raise Complaint
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SubmitComplaint;