import { useEffect, useState } from "react";
import "../styles/loginpage.css";
import { useNavigate } from "react-router-dom";
import NotAuthnav from "../components/notauthnav";

import { isAuthenticated, handleError, handleSuccess } from "../../util";
import API from "../config/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!email || !password) {
      handleError("Email and Password are required");
      return;
    }

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("LOGIN RESPONSE:", result);

      const { success, message, jwtToken, user, error } = result;

      // ❌ backend validation error
      if (error) {
        const details = error?.details?.[0]?.message;
        handleError(details || "Login failed");
        return;
      }

      // ❌ login failed
      if (!success) {
        handleError(message || "Invalid credentials");
        return;
      }

      // ✅ success login
      handleSuccess(message || "Login successful");

      // store auth data
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("handle", user?.handlename || "");
      localStorage.setItem("bookmarks", JSON.stringify(user?.bookmarks || []));

      // redirect
      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err) {
      console.error(err);
      handleError("Server error. Try again later.");
    }
  };

  return (
    <>
      <NotAuthnav />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>
              Welcome back to <span className="brand">ZCoder</span>
            </h2>
            <p>Log in to continue your coding journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coder@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Login
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;