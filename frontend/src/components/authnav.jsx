import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { handleSuccess } from '../../util';
import '../styles/authnav.css';

const AuthNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('handle');
    handleSuccess('Logged out Successfully');
    setTimeout(() => {
                    navigate('/login')
      }, 1000)
  };

  return (
    <header className="auth-header-nav">
      <nav className="auth-nav">
        <NavLink to="/" className="auth-logo">ZCoder</NavLink>

        <div className="auth-nav-links">
          <NavLink 
            to="/contests" 
            className={({ isActive }) => isActive ? "auth-nav-link-active" : "auth-nav-link"}
          >
            Contests
          </NavLink>
          <NavLink 
            to="/problems" 
            className={({ isActive }) => isActive ? "auth-nav-link-active" : "auth-nav-link"}
          >
            Problems
          </NavLink>
          <NavLink 
            to="/rooms" 
            className={({ isActive }) => isActive ? "auth-nav-link-active" : "auth-nav-link"}
          >
            Rooms
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => isActive ? "auth-nav-link-active" : "auth-nav-link"}
          >
            Profile
          </NavLink>

          <button className="logout-button" onClick={handleLogout}>
              <svg className="logout-icon" viewBox="0 0 24 24">
                <path d="M14 8V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-2h2v2c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V6c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v2h-2z"/>
                <path d="M22 12l-4-4v3h-9v2h9v3l4-4z"/>
              </svg>
              <span className="logout-text">Logout</span>
          </button>

        </div>

     
        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            {mobileMenuOpen ? (
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            ) : (
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            )}
          </svg>
        </button>

        <div className={`mobile-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink 
            to="/contests" 
            className={({ isActive }) => isActive ? "auth-nav-link-active" : "auth-nav-link"}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contests
          </NavLink>
          <NavLink 
            to="/problems" 
            className={({ isActive }) => isActive ? "auth-nav-link-active" : "auth-nav-link"}
            onClick={() => setMobileMenuOpen(false)}
          >
            Problems
          </NavLink>
  
          <NavLink 
            to="/rooms" 
            className={({ isActive }) => isActive ? "auth-nav-link-active" : "auth-nav-link"}
            onClick={() => setMobileMenuOpen(false)}
          >
            Rooms
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => isActive ? "auth-nav-link-active" : "auth-nav-link"}
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </NavLink>
          <button className="logout-button" onClick={handleLogout}>
              <svg className="logout-icon" viewBox="0 0 24 24">
                <path d="M14 8V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-2h2v2c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V6c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v2h-2z"/>
                <path d="M22 12l-4-4v3h-9v2h9v3l4-4z"/>
              </svg>
              <span className="logout-text">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default AuthNav;