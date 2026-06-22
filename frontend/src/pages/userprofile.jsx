import { useState, useEffect } from 'react';
import AuthNav from '../components/authnav';
import Footer from '../components/footer.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { handleError, handleSuccess } from '../../util.js';
import '../styles/userprofile.css';
import API from "../config/api";

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bookmarkedProblems, setBookmarkedProblems] = useState([]);
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);

  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
          try {

            const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login');
              return;
            }

           const response = await fetch(`${API}/user/me`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });

            const userData = await response.json();

            if (userData && userData.success) {
              setUser(userData.user);
              setOriginalUser(userData.user);
            } else {
              localStorage.removeItem('token');
              navigate('/login');
            }
          } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('handle');
            console.error('Token verification failed', err);
            navigate('/login');
          }
        };

        fetchUser();
      }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setUser(originalUser);
    setIsEditing(false);
  }

  const handleSave = async () => {
      try {

        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('username', user.username);
        formData.append('description', user.description);

        if (selectedImage) {
          formData.append('profilePic', selectedImage);
        }

        const response = await fetch(`${API}/user/update`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          handleSuccess('Profile updated succesfully!')
          setUser(data.user);
          setIsEditing(false);
          setSelectedImage(null);
        } else {
          handleError(data.error.details[0].message)
          console.error('Update failed');
          // console.log(data);
        }
      } catch (error) {
        handleError('Error updating profile', error);
        console.error('Error updating profile', error);
      }
    };

    useEffect(() => {
        const fetchProblems = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }

       const response = await fetch(`${API}/problems/`, {
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

          const localhandle = localStorage.getItem('handle');

         const response = await fetch(`${API}/solutions/byhandle`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token:token, handlename: localhandle }),
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
}, [navigate]);

      useEffect(() => {
        const stored = localStorage.getItem('bookmarks');
        const bookmarks = stored ? JSON.parse(stored) : [];

        const filtered = problems.filter((problem) =>
          bookmarks.includes(problem.pid)
        );
        setBookmarkedProblems(filtered);
      }, [problems]);



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
          <img src={selectedImage ? URL.createObjectURL(selectedImage) : user.profilePic || '/default-profile.png'}
          alt="Profile"
  className="profile-picture"/>
          {isEditing && (
            <div className="avatar-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                id="profilePicInput"
                style={{ display: 'none' }}
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              <label htmlFor="profilePicInput" className="custom-upload-btn">
                Choose Image
              </label>
            </div>

          )}
        </div>
        
        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="profile-input"
              />
              <p className="username">@{user.handlename}</p>
            </>
          ) : (
            <>
              <h1>{user.username}</h1>
              <a href={`/user/${user.handlename}`} className="handle-link">
                <p className="username">@{user.handlename}</p>
                </a>
            </>
          )}
          
          {isEditing ? (
            <textarea
              name="description"
              value={user.description}
              onChange={handleInputChange}
              className="profile-textarea"
              rows="3"
            />
          ) : (
            <p className="bio">{user.description}</p>
          )}
          
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="save-btn">Save Profile</button>
                <button onClick={handleCancel} className="cancel-btn">Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
            )}
          </div>
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
            className={`tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks
          </button>
          <button
            className={`tab-btn ${activeTab === 'solutions' ? 'active' : ''}`}
            onClick={() => setActiveTab('solutions')}
          >
            My Solutions
          </button>
          
        </div>
        
        <div className="tab-content">
          {activeTab === 'bookmarks' && (
            <div className="bookmarks-grid">
              {bookmarkedProblems.length === 0 ? (
                <p>No bookmarks yet.</p>
              ) : (
                bookmarkedProblems.map((problem) => (
                  
                  <Link to={`/problems/${problem.pid}`} style={{ textDecoration: 'none' } } key={problem.pid}>
                  <div className="bookmark-card">
                    <h3>{problem.title}</h3>
                    <p className="bookmark-desc">
                      {problem.difficulty} • {problem.topics.join(', ')}
                    </p>
                    <div className="bookmark-tags">
                      {problem.topics.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  </Link>
                  
                ))
              )}
            </div>
          )}

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

export default UserProfilePage;