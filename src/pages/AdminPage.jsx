import { useEffect, useMemo, useState } from "react";

function AdminPage({ adminToken, onSignIn, onSignOut }) {
  const [loginError, setLoginError] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = Boolean(adminToken);

  const fetchData = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const [volRes, memRes] = await Promise.all([
        fetch("http://localhost:4174/api/volunteers", { headers: { Authorization: `Bearer ${adminToken}` } }),
        fetch("http://localhost:4174/api/memberships", { headers: { Authorization: `Bearer ${adminToken}` } }),
      ]);

      if (!volRes.ok || !memRes.ok) {
        throw new Error("Unable to load admin data.");
      }

      setVolunteers(await volRes.json());
      setMemberships(await memRes.json());
    } catch (error) {
      setStatus("Unable to load admin dashboard. Please verify your login.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [adminToken]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("http://localhost:4174/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      onSignIn(data.token);
      form.reset();
    } catch (error) {
      setLoginError("Sign in failed. Use the preview credentials in the README.");
    }
  };

  const handleDelete = async (type, id) => {
    if (!adminToken) return;
    try {
      const response = await fetch(`http://localhost:4174/api/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!response.ok) {
        throw new Error("Unable to remove item.");
      }

      if (type === "volunteers") {
        setVolunteers((current) => current.filter((item) => item.id !== id));
      } else {
        setMemberships((current) => current.filter((item) => item.id !== id));
      }
    } catch (error) {
      setStatus("Unable to remove the entry. Try again.");
    }
  };

  const handleAddVolunteer = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      name: formData.get("addName"),
      email: formData.get("addEmail"),
      day: formData.get("addDate"),
      notes: "Added by admin",
    };

    try {
      const response = await fetch("http://localhost:4174/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Unable to add volunteer.");
      const newItem = await response.json();
      setVolunteers((current) => [newItem, ...current]);
      event.target.reset();
      setStatus("Guest added to the volunteer list.");
    } catch (error) {
      setStatus("Could not add the guest. Please try again.");
    }
  };

  const signInForm = useMemo(
    () => (
      <div className="page-section card form-card">
        <h2>Admin sign in</h2>
        <p>Use the preview credentials from README to access the dashboard.</p>
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
    ),
    [loginError]
  );

  return (
    <section className="page-section">
      {isLoggedIn ? (
        <div className="dashboard-grid">
          <div className="panel-card card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Admin dashboard</p>
                <h2>Volunteer sign-ups</h2>
              </div>
              <button className="button button-secondary" onClick={onSignOut}>
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
                        <td>{volunteer.day}</td>
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
      ) : (
        signInForm
      )}
    </section>
  );
}

export default AdminPage;
