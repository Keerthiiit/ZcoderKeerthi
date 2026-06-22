import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import AuthNav from '../components/authnav';
import { isAuthenticated } from '../../util';
import '../styles/problemspage.css';
import API from "../config/api";

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Easiest');
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [selectedSolved, setSelectedSolved] = useState('All');
  const navigate= useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {

          const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login');
              return;
            }

           const response = await fetch(`${API}/problems`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });

            const problemsData = await response.json();

            if (problemsData && problemsData.success) {
              setProblems(problemsData.problems);
            } else {
              localStorage.removeItem('token');
              navigate('/login');
            }
          } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            setError(err.message);
            console.error('Token verification failed', err);
            navigate('/login');
          }
        
          setLoading(false);
      } 
      fetchProblems();
  }, [navigate]);

  useEffect(() => {
    const savedSolved = JSON.parse(localStorage.getItem('solvedProblems')) || [];
    setSolvedProblems(savedSolved);
  }, []);

  useEffect(()=>{
          if (!isAuthenticated()) {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            navigate('/login');
          }
    },[navigate]);


  const toggleSolvedStatus = (problemId) => {
    setSolvedProblems(prev => {
      const newSolved = prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId];
      
      localStorage.setItem('solvedProblems', JSON.stringify(newSolved));
      return newSolved;
    });
  };

  const filteredProblems = problems.filter(problem => {

      // Search filter
      if (searchQuery && !problem.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'All' && problem.difficulty !== difficultyFilter) {
        return false;
      }

      // Topic filter
      if (topicFilter !== 'All' && !problem.topics.includes(topicFilter)) {
        return false;
      }

      if (selectedSolved === 'solved' && !solvedProblems.includes(problem.id)) {
        return false;
      }

      if (selectedSolved === 'unsolved' && solvedProblems.includes(problem.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {

      // Sorting
      if (sortBy === 'Easiest') {
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      if (sortBy === 'Hardest') {
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      }
      if (sortBy === 'Most-solved') return b.solved - a.solved;
      if (sortBy === 'Least-solved') return a.solved - b.solved;
      return 0;
    });

 
  const allTopics = Array.from( new Set(problems.flatMap(problem => problem.topics))).sort();

  const totalProblems = problems.length;
  const solvedCount = solvedProblems.length;
  const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  return (
    <>
    <AuthNav/>
    <div className="problems-container">
      <div className="problems-header">
        <h1>Problems</h1>
        <p>Practice coding problems to improve your skills</p>
      </div>

      <div className="progress-section">
        <h3>Your Progress</h3>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>{solvedCount} of {totalProblems} solved ({progressPercentage}%)</span>
        </div>
      </div>

      <div className="problems-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

        <div className="filter-controls">

        <div className="filter-group">
            <label>Status</label>
            <select
            value={selectedSolved}
            onChange={(e) => setSelectedSolved(e.target.value)}
            >
            <option value="All">All Problems</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
            </select>
        </div>


          <div className="filter-group">
            <label htmlFor="difficulty-filter">Difficulty:</label>
            <select
              id="difficulty-filter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          

          <div className="filter-group">
            <label htmlFor="topic-filter">Topic:</label>
            <select
              id="topic-filter"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="All">All</option>
              {allTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              
              <option value="Easiest">Easiest</option>
              <option value="Hardest">Hardest</option>
              <option value="Most-solved">Most Solved</option>
              <option value="Least-solved">Least Solved</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading problems...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error loading problems: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="no-problems">
          <p>No problems found matching your criteria.</p>
          <button onClick={() => {
            setSearchQuery('');
            setDifficultyFilter('All');
            setTopicFilter('All');
          }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="problems-list">
          <div className="problems-list-header">
            <div className="header-title">Title</div>
            <div className="header-difficulty">Difficulty</div>
            <div className="header-topics">Topics</div>
            <div className="header-stats">Solved By</div>
          </div>

          {filteredProblems.map(problem => (
            <div key={problem.pid} className="problem-div">
            <div className="problem-main">
            <button 
                className={`solved-checkbox ${solvedProblems.includes(problem.pid) ? 'solved' : ''}`}
                onClick={() => toggleSolvedStatus(problem.pid)}
                aria-label={solvedProblems.includes(problem.pid) ? 'Mark as unsolved' : 'Mark as solved'}
              >
                {solvedProblems.includes(problem.pid) ? '✓' : ''}
              </button>
            <Link 
              to={`/problems/${problem.pid}`}  
              className={`problem-item`}
            >
              <div className="problem-title">
                {problem.title}
              </div>
              <div className={`problem-difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </div>
              <div className="problem-topics">
                {problem.topics.map(topic => (
                  <span key={topic} className="topic-tag">{topic}</span>
                ))}
              </div>
              <div className="problem-stats">
                {problem.solved.toLocaleString()}
              </div>
            </Link>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
     </> 
  );
};

export default ProblemsPage;