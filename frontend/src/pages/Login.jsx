import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'ADMIN') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper" style={{ backgroundImage: "url('/login-bg.jpg')", backgroundSize: 'cover', backgroundAttachment: 'fixed', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Link to="/" className="auth-logo">
        <img src="/logo-nobg.png" alt="Raj Sweets" style={{ height: '80px', objectFit: 'contain' }} />
      </Link>

      <div className="auth-form">
        <h1 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '20px', lineHeight: 1.2 }}>Sign in</h1>

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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '13px', color: '#0066c0', textDecoration: 'none' }}>Forgot your password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '35px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#555'
                }}
              >
                {showPassword ? (
                  /* Eye Slash Icon */
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  /* Eye Icon */
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth">
            Continue
          </button>
        </form>

        <p className="legal-text">
          By continuing, you agree to Raj-Sweets's <Link to="#" className="link">Conditions of Use</Link> and <Link to="#" className="link">Privacy Notice</Link>.
        </p>
      </div>

      <div style={{ width: '350px' }}>
        <div className="auth-divider">
          <span className="auth-divider-text">New to Raj-Sweets?</span>
        </div>

        <Link to="/register" className="btn-create-account">
          Create your Raj-Sweets account
        </Link>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/admin-login" className="link" style={{ fontSize: '13px', fontWeight: 'bold' }}>
            Admin Panel Login
          </Link>
        </div>
      </div>
    </div>
  );
}
