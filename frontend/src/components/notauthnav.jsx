import { NavLink } from 'react-router-dom';
import '../styles/notauthnav.css'
const NotAuthnav = () => {
  return (
    <header className="header">
        <nav className="nav">
          <NavLink to="/" className="logo">ZCoder</NavLink>
          <div className="nav-links">
            <NavLink to="/contests" className={({ isActive }) => isActive ? "nav-link-active" : ""}>Contests</NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link-active" : ""} >Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link-active" : ""} >Register</NavLink>
          </div>
        </nav>
     </header>
  )
}

export default NotAuthnav;