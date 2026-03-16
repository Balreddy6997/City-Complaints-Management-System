import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "📋", title: "Easy Complaint Filing",    desc: "Submit civic complaints in under 2 minutes with category-specific forms and photo evidence." },
  { icon: "📍", title: "Location Tracking",         desc: "Pin your exact issue location so city teams can find and fix problems accurately." },
  { icon: "🔔", title: "Real-Time Updates",         desc: "Get instant status updates as your complaint moves from Pending to Resolved." },
  { icon: "📊", title: "City-Wide Analytics",       desc: "Admins get live dashboards showing complaint trends, hotspots, and resolution rates." },
  { icon: "🔒", title: "Secure & Private",          desc: "Your data is encrypted and secure. Only assigned officers can view your details." },
  { icon: "⚡", title: "Fast Resolution",           desc: "Automated routing ensures complaints reach the right department within hours." },
];

const news = [
  { tag: "Infrastructure", title: "New Smart Roads Initiative Launched",      desc: "City deploys IoT sensors across 50 km of roads to detect potholes and damage in real-time.",                                          img: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=400&q=70" },
  { tag: "Water",          title: "Water Pipeline Upgrade Complete",           desc: "Phase 1 of the city-wide water pipeline modernization has been completed, serving 200,000 residents.",                                  img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&q=70" },
  { tag: "Technology",     title: "CMS Portal Reaches 10,000 Citizens",       desc: "Our complaint management system has helped resolve over 8,500 civic issues this year alone.",                                            img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70" },
];

const HomePage = ({ setPage }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* Hero */}
      <div className="home-hero">
        <img
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80"
          alt="Smart City"
          onError={e => { e.target.style.display = "none"; e.target.parentNode.style.background = "linear-gradient(135deg,#0d1b2e,#1a1040)"; }}
        />
        <div className="home-hero-overlay">
          <h1>Smart City<br />Complaint Portal</h1>
          <p>Your voice matters. Report civic issues, track resolutions, and help build a better city for everyone.</p>
          {!isAdmin && (
            <button
              onClick={() => setPage("submit")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 28px", background: "linear-gradient(135deg,var(--accent),#0099cc)",
                border: "none", borderRadius: 12, color: "#000",
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem",
                cursor: "pointer", boxShadow: "0 8px 24px rgba(0,229,255,0.3)", width: "fit-content"
              }}
            >
              🏙️ Raise a Complaint
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="home-stats-row">
        {[
          { num: "12,480+", label: "Complaints Resolved"    },
          { num: "98",      label: "City Departments"       },
          { num: "48 hrs",  label: "Avg. Resolution Time"   },
          { num: "94%",     label: "Citizen Satisfaction"   },
        ].map(({ num, label }) => (
          <div className="home-stat" key={label}>
            <div className="home-stat-num">{num}</div>
            <div className="home-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, marginBottom: 6 }}>
          Why Use Smart City CMS?
        </h3>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 20 }}>
          Built for citizens, managed by the city — a transparent platform for better governance.
        </p>
      </div>
      <div className="home-features-grid">
        {features.map(f => (
          <div className="home-feature-card" key={f.title}>
            <div className="home-feature-icon">{f.icon}</div>
            <div className="home-feature-title">{f.title}</div>
            <div className="home-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* News */}
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, marginBottom: 6 }}>
          City News & Updates
        </h3>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 20 }}>
          Latest infrastructure and civic improvement announcements.
        </p>
      </div>
      <div className="home-news-grid">
        {news.map(n => (
          <div className="news-card" key={n.title}>
            <div className="news-card-img">
              <img src={n.img} alt={n.title} onError={e => { e.target.style.display = "none"; e.target.parentNode.style.background = "var(--surface2)"; }} />
            </div>
            <div className="news-card-body">
              <span className="news-tag">{n.tag}</span>
              <div className="news-card-title">{n.title}</div>
              <div className="news-card-desc">{n.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px", textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏙️</div>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", fontWeight: 800, marginBottom: 10, color: "#fff" }}>
          About This Platform
        </h3>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 600, margin: "0 auto 20px" }}>
          The Smart City Complaint Management System is an initiative by the City Municipal Corporation to bridge the gap between citizens and city services. Our mission is to make governance transparent, responsive, and data-driven.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {["📞 8500002028", "📧 bandibalreddy0@gmail.com", "🕐 24/7 Support"].map(item => (
            <span key={item} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 16px", fontSize: "0.82rem", color: "var(--muted)" }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;