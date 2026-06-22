import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotAuthnav from '../components/notauthnav';
import { isAuthenticated, isotpAuthenticated } from '../../util';
import { handleError, handleSuccess } from '../../util.js';
import API from "../config/api";
import '../styles/otpverify.css';

const OTPVerify = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(15);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{4}$/.test(pasteData)) {
      const pasteArray = pasteData.split('').slice(0, 4);
      setOtp(pasteArray);
      inputRefs.current[3].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setError('Please enter a 4-digit OTP');
      handleError('Please enter a 4-digit OTP')
      return;
    }

    const token = localStorage.getItem('otptoken');
    const otpinfo = {
        token: token,
        otp: otpCode
    }

    setIsLoading(true);
    setError('');

    try {
            const url = `${API}/auth/otpverify`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(otpinfo)
            });

            const result = await response.json();
            const { message, success, error } = result;

            if (success) {

                handleSuccess(message);
                localStorage.removeItem('otptoken');

                setTimeout(() => {
                    navigate('/login')
                }, 1000)

            } 
            else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } 
            else if (!success) {
                handleError(message);
            }

            console.log(result);
            setIsLoading(false);

    } 
    catch (err) 
    {
            handleError(err);
            setIsLoading(false);
    }
    
  };


  const handleResend = async () => {
    setCountdown(15);
    setError('');
    console.log('Resending OTP...');
    const token = localStorage.getItem('otptoken');
    const otpinfo = {
        otptoken: token,
    }

    try {
       const url = `${API}/auth/resendotp`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(otpinfo)
            });

            const result = await response.json();
            const { message, success, otptoken, error } = result;

            if (success) {
                handleSuccess(message);
                localStorage.setItem('otptoken', otptoken);
            } 
            else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } 
            else if (!success) {
                handleError(message);
            }

            console.log(result);
            setIsLoading(false);

    } 
    catch (err) 
    {
            handleError(err);
            setIsLoading(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(()=>{
        {isAuthenticated() ? navigate('/profile') : isotpAuthenticated() ? '' : navigate('/register')}
      },[navigate])

  return (
    <>
    <NotAuthnav/>
    <div className="otp-verify-container">
      <div className="otp-verify-card">
        <h2>Verify OTP</h2>
        <p className="otp-instructions">
          We've sent a 4-digit verification code to your email
        </p>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
                maxLength={1}
                inputMode="numeric"
                autoFocus={index === 0}
                className="otp-input"
              />
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="verify-button"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="resend-section">
          <p>Didn't receive code?</p>
          <button
            onClick={handleResend}
            disabled={countdown > 0}
            className={`resend-button ${countdown > 0 ? 'disabled' : ''}`}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default OTPVerify;