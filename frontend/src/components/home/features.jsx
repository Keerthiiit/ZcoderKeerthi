import '../../styles/home/features.css'

const Features = () => {
  return (
    <section className="features-section">
        <h2 className="section-title">Why Choose ZCoder?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Stay Ahead with Upcoming Contests</h3>
            <p>Discover and prepare for upcoming coding competitions from various platforms - all in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🫂</div>
            <h3>Collaborative Learning</h3>
            <p>Join interactive rooms to discuss solutions and get feedback from peers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Organized Resources</h3>
            <p>Bookmark and tag problems to create your personalized study plan.</p>
          </div>
        </div>
      </section>
  )
}

export default Features