import { useState, useEffect } from 'react';
import AuthNav from '../components/authnav';
import Footer from '../components/footer';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../styles/userprofile.css';
import API from '../config/api';

const Otheruserpage = () => {

  const { id } = useParams();

  const askedhandle = localStorage.getItem('handle');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('solutions');
  const [user, setUser] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [problems, setProblems] = useState([]);



    useEffect(() => {
        const fetchUser = async () => {
          try {

            const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login');
              return;
            }

            const request = {
                token: token,
                handle: id
            };

          const response = await fetch(`${API}/user/getother`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(request),
            });

            const userData = await response.json();

            if (userData && userData.success) {
              setUser(userData.user);
            } else {  
              navigate('/notfound');
            }
          } catch (err) {
            console.error('Token verification failed', err);
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            navigate('/login');
          }
        };

        fetchUser();
      }, [navigate, id]);

      useEffect(() => {
            if(askedhandle === id){
                navigate('/profile');
                return 
            }

      }, [navigate, askedhandle, id]);

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
                  localStorage.removeItem('handle');
                  navigate('/login');
                }
              } catch (err) {
                console.error('Token verification failed', err);
                localStorage.removeItem('token');
                localStorage.removeItem('handle');
                 navigate('/login');
              }
            };
      
            fetchProblems();
      }, [navigate]);

useEffect(() => {
        const fetchSolutions = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }

           const response = await fetch(`${API}/solutions/byhandle`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token:token, handlename: id }),
          });

          const SolutionsData = await response.json();

          if (SolutionsData && SolutionsData.success) {
            setSolutions(SolutionsData.solutions);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            navigate('/login');
          }
        } catch (err) {
          console.error('Token verification failed', err);
          localStorage.removeItem('token');
          localStorage.removeItem('handle');
           navigate('/login');
        }
      };

      fetchSolutions();
}, [navigate, id]);



      function getDaysPassed(timestamp) {
        const pastDate = new Date(timestamp);
        const now = new Date();

        const diffInMs = now - pastDate;

        const daysPassed = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        return daysPassed;
      }

  if (!user) return null;

   
  return (
    <>
    <AuthNav/>
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user.profilePic} alt="Profile" />
        </div>
        
        <div className="profile-info">
              <h1>{user.username}</h1>
                <a href={`/user/${user.handlename}`} className="handle-link">
                <p className="username">@{user.handlename}</p>
                </a>
              <p className="bio">{user.description}</p>
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{getDaysPassed(user.createdAt)}</span>
            <span className="stat-label">{ getDaysPassed(user.createdAt) === 1 ? 'Day' : 'Days'} with Us</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{solutions.length}</span>
            <span className="stat-label">{ solutions.length == 1 ? 'Solution' : 'Solutions'}</span>
          </div>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'solutions' ? 'active' : ''}`}
            onClick={() => setActiveTab('solutions')}
          >
            Solutions Posted
          </button>   
        </div>
        
        <div className="tab-content">
          {activeTab === 'solutions' && 
          
          (solutions.length === 0 ? (
                <p>No solutions yet.</p>
              ) :
          
          (
            solutions.map((solution, index) => {
            const matchedProblem = problems.find(problem => problem.pid === solution.pid);
            const problemTitle = matchedProblem ? matchedProblem.title : 'Solution';

            return (
              <div className="solution-card" key={index}>
                < Link
                  style={{ textDecoration: "none"}}
                  to={`/problems/${solution.pid}`}
                >
                <h3>{problemTitle}</h3>
                <p className="solution-desc">{solution.approach}</p>
                <div className="solution-meta-user">
                  <span className="language-tag">{solution.language}</span>
                  <span className="votes"> ❤️ {solution.likes || 0} likes</span>
                </div>
                </Link>
              </div>
            );
          })

          ))
        } 
         
      </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Otheruserpage;