import { Link } from 'react-router-dom';
import '../styles/notfound.css';
import NotAuthnav from '../components/notauthnav';
import AuthNav from '../components/authnav';
import { isAuthenticated } from '../../util';

const NotFound = () => {
  return (
    <>
    { isAuthenticated() ? <AuthNav/> : <NotAuthnav />}
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-button">
          Return Home
        </Link>
      </div>
    </div>
    </>
  );
};

export default NotFound;