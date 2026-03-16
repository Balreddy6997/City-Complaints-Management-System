import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Styles
import "./styles/global.css";

// Layout
import Sidebar from "./components/layout/Sidebar";

// Pages - Auth
import AuthPage from "./pages/Authpage";

// Pages - Shared
import HomePage    from "./pages/Homepage";
import ProfilePage from "./pages/Profilepage";

// Pages - Admin
import AdminDashboard from "./pages/admin/Admindashboard";
import Analytics      from "./pages/admin/Analytics";
import AllComplaints  from "./pages/admin/Allcomplaints";
import UsersPage      from "./pages/admin/Userspage";

// Pages - Citizen
import CitizenDashboard  from "./pages/citizen/Citizendashboard";
import SubmitComplaint   from "./pages/citizen/Submitcomplaint";
import ComplaintFormPage from "./pages/citizen/Complaintformpage";
import MyComplaints      from "./pages/citizen/Mycomplaints";

// ── Dashboard Shell ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const [page,              setPage]              = useState("home");
  const [selectedCategory,  setSelectedCategory]  = useState("Roads");
  const isAdmin = user?.role === "admin";

  const renderPage = () => {
    // Shared pages (all roles)
    if (page === "home")    return <HomePage    setPage={setPage} />;
    if (page === "profile") return <ProfilePage setPage={setPage} />;

    // Admin pages
    if (isAdmin) {
      if (page === "dashboard")  return <AdminDashboard />;
      if (page === "complaints") return <AllComplaints  />;
      if (page === "users")      return <UsersPage      />;
      if (page === "analytics")  return <Analytics />;
    }

    // Citizen / Officer pages
    if (page === "dashboard")    return <CitizenDashboard setPage={setPage} />;
    if (page === "submit")       return <SubmitComplaint  setPage={setPage} setComplaintCategory={setSelectedCategory} />;
    if (page === "complaintform") return <ComplaintFormPage setPage={setPage} selectedCategory={selectedCategory} />;
    if (page === "mycomplaints") return <MyComplaints />;

    return null;
  };

  return (
    <div className="dashboard">
      <Sidebar page={page} setPage={setPage} />
      <div className="main-content">{renderPage()}</div>
    </div>
  );
};

// ── App Root ───────────────────────────────────────────────────────────────────
const AppContent = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <AuthPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}