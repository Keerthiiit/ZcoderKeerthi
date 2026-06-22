import { Link } from "react-router-dom";
import { isAuthenticated } from "../../../util";
import developersimg from '../../assets/developers.jpg';
import '../../styles/home/hero-section.css'

const HeroSection = () => {
  return (

    <section className="hero-section">
        <div className="hero-content">
          <h1>Elevate Your Coding Skills With ZCoder</h1>
          <p className="hero-subtitle">
            Collaborate, learn, and solve problems with a community of developers.
            Bookmark solutions, join live discussions, and track your progress.
          </p>
           { isAuthenticated() ? "" : <div className="hero-buttons">
            <Link to="/register" className="cta-button primary">Get Started</Link>
            <Link to="/login" className="cta-button secondary">Login</Link>
          </div>}
  
        </div>
        <div className="hero-image">
          <img src={developersimg} alt="Developers collaborating" />
        </div>
    </section>

  )
}

export default HeroSection