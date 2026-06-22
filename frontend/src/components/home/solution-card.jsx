import { Link } from 'react-router-dom';
import '../../styles/home/solution-section.css';

const SolutionCard = ({ solution }) => {
  return (
    <div className="solution-item">
              <div className="solution-header">
                <h3>{solution.problem}</h3>
                <span className="language-tag">{solution.language}</span>
              </div>
              <p className="solution-excerpt">{solution.explanation}</p>
              <div className="solution-footer">
                <Link className="author-name"
                  style={{ textDecoration: "none" }}
                  to={`/user/${solution.author}`}
                >
                  @{solution.author}
                </Link>
                <span>❤️ {solution.votes} likes</span>
                <Link to={`/problems/${solution.id}`} className="view-button">View Solution</Link>
              </div>
        </div>
  )
}

export default SolutionCard