import { useEffect, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import { supabase } from "./supabase";
import HomePage from "./pages/HomePage";
import VolunteerPage from "./pages/VolunteerPage";
import MembershipPage from "./pages/MembershipPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
          <Route path="/admin" element={<AdminPage session={session} />} />
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
