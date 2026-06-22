import { useState, useEffect } from 'react';
import '../styles/contestpage.css';
import NotAuthnav from '../components/notauthnav';
import AuthNav from '../components/authnav';
import { isAuthenticated } from '../../util';
import Footer from '../components/footer';
import Contestcard from '../components/contest/contestcard';
import API from "../config/api";

const ContestPage = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {

    const fetchContests = async () => {
      try {

        const response = await fetch(`${API}/contests`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data.objects);
        setContests(data);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        console.log(err.message);
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const filteredContests = contests.filter(contest => {

    // Apply filter
    if (filter !== 'all' && !contest.href.includes(filter)) {
      return false;
    }
    
    // Apply search
    if (searchQuery && !contest.event.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  

  return (
    <>
    { isAuthenticated() ? <AuthNav/> : <NotAuthnav />}
    <div className="contest-container">
      <div className="contest-header">
        <h1>Upcoming Coding Contests</h1>
        <p>Never miss a coding competition again. Find and register for upcoming contests.</p>
      </div>

      <div className="contest-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search contests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter.includes('codeforces') ? 'active' : ''}
            onClick={() => setFilter('codeforces')}
          >
            Codeforces
          </button>
          <button 
            className={filter.includes('leetcode') ? 'active' : ''}
            onClick={() => setFilter('leetcode')}
          >
            LeetCode
          </button>
          <button 
            className={filter.includes('atcoder') ? 'active' : ''}
            onClick={() => setFilter('atcoder')}
          >
            AtCoder
          </button>
          <button 
            className={filter.includes('codechef') ? 'active' : ''}
            onClick={() => setFilter('codechef')}
          >
            CodeChef
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading contests...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error loading contests: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : filteredContests.length === 0 ? (
        <div className="no-contests">
          <p>No contests found matching your criteria.</p>
          <button onClick={() => {
            setFilter('all');
            setSearchQuery('');
          }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="contest-list">
          {filteredContests.map(contest => (
            <Contestcard key={contest.id} contest={contest}/>
          ))}
        </div>
      )}

      <div className="contest-footer">
        <p>Data fetched from various programming competition platforms</p>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ContestPage;