import { useState } from "react";
import { supabase } from "../supabase";

const schedule = [
  "Monday 9:00 AM – 12:00 PM: Planting and weeding",
  "Wednesday 2:00 PM – 5:00 PM: Compost care",
  "Saturday 10:00 AM – 1:00 PM: Harvest prep",
  "Sunday 11:00 AM – 2:00 PM: Community harvest",
];

function VolunteerPage() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setSubmitting(true);

    const form = event.target;
    const formData = new FormData(form);

    const { error } = await supabase.from("volunteers").insert([
      {
        name: formData.get("name"),
        email: formData.get("email"),
        preferred_day: formData.get("day"),
        notes: formData.get("notes"),
      },
    ]);

    if (error) {
      setStatus("There was a problem submitting your sign-up. Please try again later.");
    } else {
      form.reset();
      setStatus("Thank you! Your volunteer request was received.");
    }

    setSubmitting(false);
  };

  return (
    <section className="page-section">
      <div className="form-card card">
        <h2>Volunteer sign-up</h2>
        <p>Pick a day and join our garden team. We'll save your request for the garden administrators to review.</p>
        <form onSubmit={handleSubmit} className="form-card" style={{ display: "grid", gap: "1.25rem" }}>
          <label>
            Full name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Preferred day
            <select name="day" required>
              <option value="">Select a day</option>
              <option>Monday morning</option>
              <option>Wednesday afternoon</option>
              <option>Saturday</option>
              <option>Sunday community harvest</option>
            </select>
          </label>
          <label>
            Notes
            <textarea name="notes" placeholder="Tell us if you have gardening experience or special availability." />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Sign Up"}
          </button>
        </form>

        {status && <div className="status-box">{status}</div>}
      </div>

      <div className="card">
        <h2>Upcoming volunteer days</h2>
        <ul>
          {schedule.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default VolunteerPage;
