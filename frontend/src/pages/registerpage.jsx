import { useState , useEffect} from 'react';
import '../styles/loginpage.css';
import NotAuthnav from '../components/notauthnav';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../util';
import { handleError, handleSuccess } from '../../util.js';
import API from "../config/api";

const RegisterPage = () => {
  const [handlename, setHandlename] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signupInfo = {
      handle: handlename,
      name: name,
      email: email,
      password: password
    };


        if ( !handlename || !name || !email || !password) {
            return handleError(' Handle name, Full name, Email and Password are all required')
        }
         setIsSubmitting(true);
        try {
        const url = `${API}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
             let result = {};
            try {
                result = await response.json();
            } catch {
                result = { message: `Server returned ${response.status} ${response.statusText}` };
            }

            console.log('SIGNUP RESPONSE:', { url, status: response.status, result });
            const { message, success, jwtToken, error } = result;
           if (response.ok && success) {
                handleSuccess(message);
                localStorage.setItem('otptoken', jwtToken);
                setTimeout(() => {
                    navigate('/otpverify')
                }, 1000)
            } else if (error) {
               
                const details = error?.details?.[0]?.message;
                handleError(details || message || 'Signup failed');
            } else {
                handleError(message || `Signup failed with status ${response.status}`);
            }
          
        } catch (err) {
            console.error('SIGNUP ERROR:', err);
            handleError(err?.message || 'Network error. Please check the backend URL and try again.');
        } finally {
            setIsSubmitting(false);
        }
  };
   useEffect(()=>{
      {isAuthenticated() ? navigate('/profile') : ''}
    },[navigate])

  return (
    <>
    <NotAuthnav/>
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join <span className="brand">ZCoder</span></h2>
          <p>Create your developer profile and start collaborating</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form" >


          <div className="form-group">
            <label htmlFor="handlename">Handle Name</label>
            <input
              type="text"
              id="handlename"
              value={handlename}
              onChange={(e) => setHandlename(e.target.value)}
              placeholder="Enter your handle name (must be unique with no spaces)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="coder@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
         
          
             <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;
