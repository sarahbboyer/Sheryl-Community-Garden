import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="page-section">
      <div className="hero-card hero-copy">
        <p className="eyebrow">Welcome to the community garden</p>
        <h2>Fresh food, friendly neighbors, and hands-on learning.</h2>
        <p>Our garden is a place where people come together to plant, grow, and share the harvest. This prototype makes it easy to explore, sign up, and help manage garden activity.</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          <Link className="button" to="/volunteer">Volunteer</Link>
          <Link className="button button-secondary" to="/membership">Membership</Link>
        </div>
      </div>

      <div className="info-grid">
        <div className="card">
          <h3>Community-first gardening</h3>
          <p>We offer shared beds, tools, compost workshops, harvest days, and support for new gardeners.</p>
        </div>
        <div className="card">
          <h3>Volunteer-led events</h3>
          <p>Weekly volunteer days keep the garden growing. Everyone is welcome, whether you want to plant, prune, or harvest.</p>
        </div>
        <div className="card">
          <h3>Future memberships</h3>
          <p>Become a garden member to support the space, receive seasonal updates, and access member-only gatherings.</p>
        </div>
      </div>

      <div className="page-section">
        <div className="media-grid">
          <div className="media-card card">
            <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80" alt="Community garden beds" />
            <p>Raised beds filled with fresh produce.</p>
          </div>
          <div className="media-card card">
            <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80" alt="People working in a community garden" />
            <p>Volunteers sharing garden work and conversation.</p>
          </div>
        </div>
      </div>

      <div className="page-section card">
        <h2>Garden tour video</h2>
        <p>See our space in action and get a feel for the energy of the garden.</p>
        <div className="video-wrapper">
          <iframe src="https://www.youtube.com/embed/1aZ_2XvmgJ0" title="Community garden tour" allowFullScreen />
        </div>
      </div>

      <div className="page-section card glow-panel">
        <h2>Grow with us</h2>
        <p>Sign up as a volunteer, explore membership, or let the admin team know you'd like to visit.</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <Link className="button" to="/volunteer">Volunteer</Link>
          <Link className="button button-secondary" to="/admin">Admin</Link>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
