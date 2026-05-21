import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function AdminPage({ session }) {
  const [loginError, setLoginError] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = Boolean(session);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: volData, error: volError }, { data: memData, error: memError }] = await Promise.all([
      supabase.from("volunteers").select("*").order("created_at", { ascending: false }),
      supabase.from("memberships").select("*").order("created_at", { ascending: false }),
    ]);

    if (volError || memError) {
      setStatus("Unable to load admin data.");
    } else {
      setVolunteers(volData);
      setMemberships(memData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    const formData = new FormData(event.target);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (error) {
      setLoginError("Sign in failed. Check your email and password.");
    } else {
      event.target.reset();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleDelete = async (table, id) => {
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      setStatus("Unable to remove the entry. Try again.");
      return;
    }

    if (table === "volunteers") {
      setVolunteers((current) => current.filter((item) => item.id !== id));
    } else {
      setMemberships((current) => current.filter((item) => item.id !== id));
    }
  };

  const handleAddVolunteer = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const { data, error } = await supabase
      .from("volunteers")
      .insert([
        {
          name: formData.get("addName"),
          email: formData.get("addEmail"),
          preferred_day: formData.get("addDate"),
          notes: "Added by admin",
        },
      ])
      .select()
      .single();

    if (error) {
      setStatus("Could not add the guest. Please try again.");
      return;
    }

    setVolunteers((current) => [data, ...current]);
    event.target.reset();
    setStatus("Guest added to the volunteer list.");
  };

  if (!isLoggedIn) {
    return (
      <section className="page-section">
        <div className="page-section card form-card">
          <h2>Admin sign in</h2>
          <p>Sign in with your admin account to access the dashboard.</p>
          <form onSubmit={handleLogin} style={{ display: "grid", gap: "1rem" }}>
            <label>
              Email
              <input name="email" type="email" placeholder="admin@communitygarden.org" required />
            </label>
            <label>
              Password
              <input name="password" type="password" placeholder="Password" required />
            </label>
            <button type="submit">Sign In</button>
          </form>
          {loginError && <div className="status-box">{loginError}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="dashboard-grid">
        <div className="panel-card card">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Admin dashboard</p>
              <h2>Volunteer sign-ups</h2>
            </div>
            <button className="button button-secondary" onClick={handleSignOut}>
              Sign out
            </button>
          </div>

          {status && <div className="status-box">{status}</div>}

          <p>Review the people who signed up to visit the garden.</p>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Day</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">Loading...</td>
                  </tr>
                ) : volunteers.length === 0 ? (
                  <tr>
                    <td colSpan="4">No volunteers signed up yet.</td>
                  </tr>
                ) : (
                  volunteers.map((volunteer) => (
                    <tr key={volunteer.id}>
                      <td>{volunteer.name}</td>
                      <td>{volunteer.email}</td>
                      <td>{volunteer.preferred_day}</td>
                      <td>
                        <button className="button button-secondary" onClick={() => handleDelete("volunteers", volunteer.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-card card">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Membership requests</p>
              <h2>Pending applications</h2>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships.length === 0 ? (
                  <tr>
                    <td colSpan="4">No membership requests yet.</td>
                  </tr>
                ) : (
                  memberships.map((membership) => (
                    <tr key={membership.id}>
                      <td>{membership.name}</td>
                      <td>{membership.email}</td>
                      <td>{membership.plan}</td>
                      <td>
                        <button className="button button-secondary" onClick={() => handleDelete("memberships", membership.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <h3>Add a new guest manually</h3>
            <form onSubmit={handleAddVolunteer} style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
              <label>
                Name
                <input name="addName" type="text" required />
              </label>
              <label>
                Email
                <input name="addEmail" type="email" required />
              </label>
              <label>
                Visit date
                <input name="addDate" type="date" required />
              </label>
              <button type="submit">Add guest</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
