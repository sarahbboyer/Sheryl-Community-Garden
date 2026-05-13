const ADMIN_EMAIL = "admin@communitygarden.org";
const ADMIN_PASSWORD = "garden123";

function saveSignups(signups) {
  localStorage.setItem("gardenSignups", JSON.stringify(signups));
}

function loadSignups() {
  const raw = localStorage.getItem("gardenSignups");
  return raw ? JSON.parse(raw) : [];
}

function renderSignupTable() {
  const list = document.getElementById("signupList");
  if (!list) return;

  const signups = loadSignups();
  if (signups.length === 0) {
    list.innerHTML = "<p>No sign-ups yet. Add people to the garden roster to get started.</p>";
    return;
  }

  const rows = signups
    .map((signup, index) => `
      <tr>
        <td>${signup.name}</td>
        <td>${signup.email}</td>
        <td>${signup.date}</td>
        <td><button class="button button-secondary" data-index="${index}">Remove</button></td>
      </tr>
    `)
    .join("");

  list.innerHTML = `
    <table class="signup-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Visit date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  list.querySelectorAll("button[data-index]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = Number(event.target.dataset.index);
      const updated = loadSignups();
      updated.splice(index, 1);
      saveSignups(updated);
      renderSignupTable();
    });
  });
}

function initAdminPage() {
  const signInForm = document.getElementById("adminSignInForm");
  const adminDashboard = document.getElementById("adminDashboard");
  const signOutButton = document.getElementById("signOutButton");
  const addPersonForm = document.getElementById("adminAddPersonForm");

  if (!signInForm || !adminDashboard || !addPersonForm || !signOutButton) return;

  const signedIn = sessionStorage.getItem("gardenAdminSignedIn") === "true";
  setDashboardVisibility(signedIn);
  renderSignupTable();

  signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("gardenAdminSignedIn", "true");
      setDashboardVisibility(true);
      signInForm.reset();
    } else {
      alert("Sign in failed. Please use the preview credentials provided.");
    }
  });

  signOutButton.addEventListener("click", () => {
    sessionStorage.removeItem("gardenAdminSignedIn");
    setDashboardVisibility(false);
  });

  addPersonForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("personName").value.trim();
    const email = document.getElementById("personEmail").value.trim();
    const date = document.getElementById("personDate").value;

    if (!name || !email || !date) return;

    const signups = loadSignups();
    signups.push({ name, email, date });
    saveSignups(signups);
    renderSignupTable();
    addPersonForm.reset();
  });
}

function setDashboardVisibility(show) {
  const adminDashboard = document.getElementById("adminDashboard");
  const adminPanel = document.querySelector(".admin-panel");
  if (!adminDashboard || !adminPanel) return;
  adminDashboard.classList.toggle("hidden", !show);
  adminPanel.classList.toggle("hidden", show);
}

function initVolunteerPage() {
  const form = document.getElementById("volunteerForm");
  const successBox = document.getElementById("volunteerSuccess");

  if (!form || !successBox) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("volunteerName").value.trim();
    const email = document.getElementById("volunteerEmail").value.trim();
    const day = document.getElementById("volunteerDay").value;
    const notes = document.getElementById("volunteerNotes").value.trim();

    if (!name || !email || !day) return;

    const volunteers = JSON.parse(localStorage.getItem("gardenVolunteers") || "[]");
    volunteers.push({ name, email, day, notes, timestamp: new Date().toISOString() });
    localStorage.setItem("gardenVolunteers", JSON.stringify(volunteers));

    form.reset();
    successBox.classList.remove("hidden");
    setTimeout(() => successBox.classList.add("hidden"), 4500);
  });
}

function main() {
  initAdminPage();
  initVolunteerPage();
}

document.addEventListener("DOMContentLoaded", main);
