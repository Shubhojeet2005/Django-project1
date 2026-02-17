import "./About.css";

function About() {
  return (
    <div className="about-page">
      <header className="about-hero">
        <h1>About MyStore</h1>
        <p>
          A tiny, opinionated demo shop built to feel delightful and clean –
          just like your favorite stationery store.
        </p>
      </header>

      <section className="about-section">
        <h2>What we’re about</h2>
        <p>
          This project pairs a Django REST backend with a modern React frontend.
          It was designed to be simple enough to understand at a glance, but
          polished enough to feel like a real product.
        </p>
        <p>
          Browse products, manage your cart, check out securely, and revisit
          your order history – all in a calm, focused interface.
        </p>
      </section>

      <section className="about-section about-grid">
        <div className="about-card">
          <h3>Built for learning</h3>
          <p>
            The codebase is intentionally small and approachable, so you can
            explore React components, API calls, JWT auth, and Django models
            without getting lost.
          </p>
        </div>
        <div className="about-card">
          <h3>Enjoyable to use</h3>
          <p>
            Thoughtful spacing, gentle colors, and clear typography make it
            pleasant to browse and test – even when you’re just poking at the
            API.
          </p>
        </div>
        <div className="about-card">
          <h3>Easy to extend</h3>
          <p>
            Add new pages, tweak the styling, or connect to real data – the
            structure is ready for you to customize.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;

