import { useEffect, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VolunteerPage from "./pages/VolunteerPage";
import MembershipPage from "./pages/MembershipPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("gardenAdminToken") || "");

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("gardenAdminToken", adminToken);
    } else {
      localStorage.removeItem("gardenAdminToken");
    }
  }, [adminToken]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Community Garden</p>
          <h1>Grow together in a neighborhood garden</h1>
        </div>
        <nav className="site-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/volunteer">Volunteer</NavLink>
          <NavLink to="/membership">Membership</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/admin" element={<AdminPage adminToken={adminToken} onSignIn={setAdminToken} onSignOut={() => setAdminToken("")} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div>
          <p>Community Garden • Prototype web app • © 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
