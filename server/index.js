import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4174;
const DATA_FILE = path.join(process.cwd(), "server", "data.json");
const ADMIN_EMAIL = "admin@communitygarden.org";
const ADMIN_PASSWORD = "garden123";
const ADMIN_TOKEN = "garden-admin-token-2026";

app.use(cors({ origin: "http://localhost:4173" }));
app.use(express.json());

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (error) {
    return { volunteers: [], memberships: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  if (auth === `Bearer ${ADMIN_TOKEN}`) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN, user: { email: ADMIN_EMAIL, name: "Garden Admin" } });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

app.get("/api/volunteers", requireAuth, (req, res) => {
  const data = readData();
  res.json(data.volunteers);
});

app.post("/api/volunteers", (req, res) => {
  const { name, email, day, notes } = req.body;
  if (!name || !email || !day) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const data = readData();
  const newVolunteer = {
    id: Date.now().toString(),
    name,
    email,
    day,
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };
  data.volunteers.unshift(newVolunteer);
  writeData(data);
  res.status(201).json(newVolunteer);
});

app.delete("/api/volunteers/:id", requireAuth, (req, res) => {
  const data = readData();
  const next = data.volunteers.filter((item) => item.id !== req.params.id);
  data.volunteers = next;
  writeData(data);
  res.json({ success: true });
});

app.get("/api/memberships", requireAuth, (req, res) => {
  const data = readData();
  res.json(data.memberships);
});

app.post("/api/memberships", (req, res) => {
  const { name, email, plan, message } = req.body;
  if (!name || !email || !plan) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const data = readData();
  const newMembership = {
    id: Date.now().toString(),
    name,
    email,
    plan,
    message: message || "",
    createdAt: new Date().toISOString(),
  };
  data.memberships.unshift(newMembership);
  writeData(data);
  res.status(201).json(newMembership);
});

app.delete("/api/memberships/:id", requireAuth, (req, res) => {
  const data = readData();
  data.memberships = data.memberships.filter((item) => item.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Community Garden API available at http://localhost:${PORT}`);
});
