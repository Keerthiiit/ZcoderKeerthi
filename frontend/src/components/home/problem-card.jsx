import '../../styles/home/problem-section.css';
import { Link } from "react-router-dom";

const Problemcard = ({ problem }) => {

  const problemUrl = `/problems/${problem.pid}`; // ✅ ADD THIS LINE

  return (
    <article className="problem-card">
      <Link to={problemUrl} className="problem-card-link" aria-label={`Solve ${problem.title}`}>
        <div className="problem-header">
          <h3>{problem.title}</h3>
          <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="topics">
          {(problem.topics || []).map(topic => (
            <span key={topic} className="topic-tag">{topic}</span>
          ))}
        </div>
      </Link>

      <div className="problem-footer">
        <span>Solved by {problem.solved}+ users</span>
        <Link to={problemUrl} className="solve-button">Solve</Link>
      </div>
    </article>
  );
}

export default Problemcard;