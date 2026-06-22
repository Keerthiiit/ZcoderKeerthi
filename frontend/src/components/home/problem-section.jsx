import React, { useState, useEffect } from "react";
import '../../styles/home/problem-section.css';
import { Link } from "react-router-dom";
import Problemcard from './problem-card';
import API from '../../config/api';
const Problems = () => {

  const [featuredProblems, setFeaturedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedProblems = async () => {
      try {
        const response = await fetch(`${API}/problems/featured?limit=3`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load featured problems');
        }

        setFeaturedProblems(data.problems || []);
      } catch (err) {
        setError(err.message || 'Unable to load featured problems');
      } finally {
        setLoading(false);
      }
    };
        fetchFeaturedProblems();
  }, []);

  return (
    <section className="problems-section">
          <div className="section-header">
        <h2 className="section-title">Featured Problems</h2>
        <Link to="/problems" className="view-all">View All →</Link>
      </div>

      {loading && <div className="problem-state">Loading featured problems...</div>}
      {!loading && error && <div className="problem-state error">{error}</div>}
      {!loading && !error && featuredProblems.length === 0 && (
        <div className="problem-state">No featured problems available right now.</div>
      )}

      {!loading && !error && featuredProblems.length > 0 && (

        <div className="problems-grid">
          {featuredProblems.map(problem => (
          <Problemcard key={problem.pid} problem={problem}/>
          ))}
        </div>
   )}
    </section>
  )
}

export default Problems;