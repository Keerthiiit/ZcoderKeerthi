import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/codeeditor';
import SolutionList from '../components/solutionlist';
import SolutionListHandle from '../components/solutionlisthandle';
import AuthNav from '../components/authnav';
import { isAuthenticated } from '../../util';
import NotFound from './notfound';
import { handleSuccess, handleError } from '../../util';
import '../styles/singleproblem.css';
import API from "../config/api";

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('problem');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const navigate= useNavigate();

  const [approach, setApproach] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  
  useEffect(() => {
    const fetchProblem = async () => {

      try{
            const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login');
              return;
            }

            const response = await fetch(`${API}/problems/singleproblem`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: token, pid: id }),
            });

            const problemData = await response.json();

          if (response.status === 401 || response.status === 403) {
              localStorage.removeItem('token');
              localStorage.removeItem('handle');
              navigate('/login');
              return;
            }

            if (response.status === 404 || !problemData?.problem) {
              setProblem(null);
              return;
            }

            if (problemData.success) {
                setProblem(problemData.problem);
                const storedBookmarks = localStorage.getItem('bookmarks');
                const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
                const bookmarked = bookmarks.includes(problemData.problem.pid); 
                setIsBookmarked(bookmarked);
            } else {
             setError(problemData.message || 'Unable to load problem');
            }
          } catch (err) {
      
            setError(err.message);
         console.error('Problem fetch failed', err);
          }

          setLoading(false);
    };

    fetchProblem();
  }, [id, navigate]);

  useEffect(()=>{
          if (!isAuthenticated()) {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            navigate('/login');
          }
    },[navigate]);



  const handleBookmark = async () => {
      try {

        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

        const newBookmarks = isBookmarked
          ? bookmarks.filter(b => b !== problem.pid)
          : [...bookmarks, problem.pid];


       const updateRes = await fetch(`${API}/user/setbookmark`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookmarks: newBookmarks }),
        });

        const updateData = await updateRes.json();

        if (updateData.success) {
          handleSuccess('Bookmark updated successfully!');
          localStorage.setItem('bookmarks', JSON.stringify(updateData.bookmarks))
          setIsBookmarked(!isBookmarked);
        } else {
          handleError(updateData.message || 'Error updating bookmark');
        }
      } catch (error) {
        handleError('Error updating bookmark');
        console.error('Bookmark update error:', error);
      }

};


const handleSubmitSolution = async () => {

    const token = localStorage.getItem('token');
    const handle = localStorage.getItem('handle'); 
    const pid = problem.pid;

    if (!approach.trim() || !code.trim()) {
      handleError("Please fill in both code and approach");
      return;
    }

    const payload = {
      token: token,
      pid: pid,
      handlename: handle,
      code: code,
      language: language,
      approach: approach
    };

      try {
       const res = await fetch(`${API}/solutions/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

        const data = await res.json();
        if (data.success) {
          handleSuccess('Solution posted successfully! Reload the page');
          setShowSolutionForm(false);
          
        } else {
          handleError(data.message || 'Submission failed');
        }
      } catch (err) {
        console.error(err);
        handleError("An error occurred.");
      }
    

  };

  if (loading) return <div className="loading">Loading problem...</div>;
  if (!problem) return <NotFound/>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
     <>
    <AuthNav/>
    <div className="problem-page">
      <div className="problem-header">
        <h1>{problem.title}</h1>
        <div className="problem-actions">
          <button 
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmark}
          >
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
          <button 
            className="solution-btn"
            onClick={() => setActiveTab('solutions')}
          >
            View Solutions
          </button>
          <button 
            className="submit-btn"
            onClick={() => setShowSolutionForm(true)}
          >
            Post Solution
          </button>
        </div>
      </div>

      <div className="problem-tabs">
        <button 
          className={activeTab === 'problem' ? 'active' : ''}
          onClick={() => setActiveTab('problem')}
        >
          Problem
        </button>
        <button 
          className={activeTab === 'solutions' ? 'active' : ''}
          onClick={() => setActiveTab('solutions')}
        >
          Solutions
        </button>
        <button 
          className={activeTab === 'discuss' ? 'active' : ''}
          onClick={() => setActiveTab('discuss')}
        >
          My Solutions
        </button>
      </div>

      <div className="problem-content">
        {activeTab === 'problem' && (
          <div className="problem-statement">
            <div className="description">
              <h2>Description</h2>
              <p>{problem.description}</p>
            </div>

            <div className="examples">
              <h2>Examples</h2>
              {problem.examples.map((example, index) => (
                <div key={index} className="example">
                  <div className="example-input">
                    <strong>Input:</strong> 
                    <pre>{example.input}</pre>
                  </div>
                  <div className="example-output">
                    <strong>Output:</strong> 
                    <pre>{example.output}</pre>
                  </div>
                  {example.explanation && (
                    <div className="example-explanation">
                      <strong>Explanation:</strong> 
                      <p>{example.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="constraints">
                <h2>Constraints</h2>
                <ul>
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
            </div>


            <div className="code-editor-section">
            <h2>Code Editor</h2>
             <textarea
  placeholder="Write your code here..."
  value={code}
  onChange={(e) => setCode(e.target.value)}
  rows={10}
  style={{ width: '100%', fontFamily: 'monospace' }}
/>
 <CodeEditor 
                problemId={problem.pid}
                initialCode={code}
                onCodeChange={(newCode) => setCode(newCode)}
                onLanguageChange={(newLang) => setLanguage(newLang)}
              />
            </div>
          </div>
        )}

        {activeTab === 'solutions' && (
          <SolutionList problemId={problem.pid} />
        )}

        {activeTab === 'discuss' && (
          <SolutionListHandle problemId={problem.pid} />
        )}
      </div>

      

      {showSolutionForm && (
        <div className="solution-form-modal">
          <div className="modal-content">
            <h2>Post Your Solution</h2>
            <textarea
                placeholder="Explain your approach..."
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
              />
            <CodeEditor 
                problemId={problem.pid}
                initialCode={code}
                onCodeChange={(newCode) => setCode(newCode)}
                onLanguageChange={(newLang) => setLanguage(newLang)}
              />
            <div className="modal-actions">
              <button onClick={() => setShowSolutionForm(false)}>Cancel</button>
              <button onClick={handleSubmitSolution}>Post Solution</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ProblemPage;