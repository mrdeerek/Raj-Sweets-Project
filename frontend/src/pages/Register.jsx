import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await api.post("/auth/register", { email, password });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.status === 409) {
        setError("This email is already registered. Please use a different email or sign in.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <Link to="/" className="auth-logo">
        <img src="/logo.png" alt="Raj Sweets" style={{ height: '50px', objectFit: 'contain' }} />
      </Link>

      <div className="auth-form">
        <h1 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '20px', lineHeight: 1.2 }}>Create account</h1>

        {error && (
          <div style={{
            marginBottom: '1rem',
            border: '1px solid #c40000',
            borderRadius: '4px',
            padding: '1rem',
            boxShadow: '0 1px 1px rgba(0,0,0,0.1) inset'
          }}>
            <div style={{ color: '#c40000', fontSize: '14px', fontWeight: '700' }}>There was a problem</div>
            <div style={{ fontSize: '13px' }}>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              placeholder="At least 6 characters"
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <div style={{ fontSize: '11px', color: '#2b2b2b', marginTop: '4px' }}>
              <span style={{ color: '#007185' }}>ℹ</span> Passwords must be at least 6 characters.
            </div>
          </div>

          <button type="submit" className="btn-auth">
            Create your Raj-Sweets account
          </button>
        </form>

        <div className="auth-divider"></div>

        <p className="legal-text" style={{ marginTop: 0 }}>
          Already have an account? <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
