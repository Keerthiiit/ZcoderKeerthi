import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { handleError, handleSuccess } from '../../util';
import '../styles/solutionlist.css';
import API from "../config/api";

const SolutionListHandle = () => {
  const { id } = useParams();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [languageFilter, setLanguageFilter] = useState('all');
  const navigate= useNavigate();

 useEffect(() => {
  const fetchSolutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const handle = localStorage.getItem('handle');

      if (!token || !handle) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API}/solutions/bypid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Important!
        },
        body: JSON.stringify({ pid: id }),
      });

      const data = await response.json();

      if (data.success) {
        const filteredSolutions = data.solutions.filter(
          (sol) => sol.handlename === handle
        );
        setSolutions(filteredSolutions);
      } else {
        handleError(data.message || 'Something went wrong');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('handle');
      console.error('Token verification failed', err);
      setError(err.message || 'Failed to fetch solutions');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  fetchSolutions();
}, [id, navigate]);


  const sortedSolutions = [...solutions].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const filteredSolutions = sortedSolutions.filter(solution => {
    if (languageFilter === 'all') return true;
    return solution.language === languageFilter;
  });

  const handleDelete = async(solution) =>{
        try {
        
                const token = localStorage.getItem('token');
        
                const response = await fetch(`${API}/solutions/delete`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({

                    token: token,
                    pid: solution.pid,
                    handlename: solution.handlename,
                    language: solution.language,
                    approach: solution.approach,
                    code: solution.code

                  }),
                });
        
                const data = await response.json();
                if (data.success) {
                  handleSuccess('Solution deleted succesfully! Reload the page')
        
                } else {
                  handleError(data.message)
                  console.error('Failed to delete');
                  // console.log(data);
                }
              } catch (error) {
                handleError('Error deleting solution', error);
                console.error('Error deleting solution', error);
              }
  }



  if (loading) return <div className="loading">Loading solutions...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (filteredSolutions.length === 0) return  (
  <div className="no-solutions">
    
       <p>
        No solutions found
        </p>
    <button onClick={() => {
            setLanguageFilter('all');
    }} className='clear-filters'>
            Clear Filters
    
    </button>
    
    </div>

  );

  return (
    <div className="solution-list">
      <div className="solution-controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Language:</label>
          <select 
            value={languageFilter} 
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="all">All Languages</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
          </select>
        </div>
      </div>

      {filteredSolutions.map(solution => (
        <div key={solution._id} className="solution-card">
          <div className="solution-header">
            <div className="solution-author">
              <Link className="author-name"
                  style={{ textDecoration: "none" }}
                  to={`/user/${solution.handlename}`}
                >
                  @{solution.handlename}
                </Link>

              <span className={`language-tag ${solution.language}`}>
                {solution.language}
              </span>
            </div>
            <div className="solution-meta">
                <span>❤️ {solution.likes} likes</span>
              <span className="solution-date">
                {new Date(solution.createdAt).toLocaleDateString()}
              </span>
              <div className="modal-actions">
               <button onClick={() => {handleDelete(solution)}}>Delete</button>
              </div>
            </div>
          </div>

          <div className="solution-explanation">
            <h4>Approach</h4>
            <p>{solution.approach}</p>
          </div>

          <div className="solution-code">
            <pre>{solution.code}</pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SolutionListHandle;