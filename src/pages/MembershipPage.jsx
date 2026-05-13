import { useState } from "react";

const plans = [
  { title: "Garden Supporter", price: "$15/mo", description: "Access to updates, volunteer news, and garden events." },
  { title: "Harvest Friend", price: "$30/mo", description: "Includes community dinners and member newsletters." },
  { title: "Green Partner", price: "$50/mo", description: "Priority workshop invites and sponsored garden beds." },
];

function MembershipPage() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setSubmitting(true);
    const form = event.target;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      plan: formData.get("plan"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("http://localhost:4174/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to submit membership request.");
      }

      form.reset();
      setStatus("Thanks! Your membership request was submitted.");
    } catch (error) {
      setStatus("There was a problem with your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="card">
        <h2>Membership options</h2>
        <p>Support the garden and reserve your place in the community by requesting membership today.</p>
        <div className="plan-grid" style={{ marginTop: "1.5rem" }}>
          {plans.map((plan) => (
            <div key={plan.title} className="plan-card">
              <h3>{plan.title}</h3>
              <strong>{plan.price}</strong>
              <p>{plan.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="form-card card">
        <h2>Request membership</h2>
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
            Membership plan
            <select name="plan" required>
              <option value="">Choose a plan</option>
              {plans.map((plan) => (
                <option key={plan.title} value={plan.title}>
                  {plan.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Message
            <textarea name="message" placeholder="Tell us what drew you to the garden." />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Request membership"}
          </button>
        </form>

        {status && <div className="status-box">{status}</div>}

        <div style={{ marginTop: "1rem", color: "#4f6f4d" }}>
          <p>Membership payments are coming soon. Right now, this form stores your interest in the garden.</p>
        </div>
      </div>
    </section>
  );
}

export default MembershipPage;
