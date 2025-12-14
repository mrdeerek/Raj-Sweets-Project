import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });

            if (res.data.user.role !== 'ADMIN') {
                setError("Access Denied. You are not an admin.");
                return;
            }

            login(res.data.token, res.data.user);
            navigate("/admin");
        } catch (err) {
            console.error("Admin Login Error:", err);
            if (!err.response) {
                setError("Server is unavailable. Please check backend connection.");
            } else if (err.code === "ERR_NETWORK" || err.message.includes("Network Error")) {
                setError("Network Error: Unable to reach the server.");
            } else if (err.response.status === 401) {
                setError("Invalid email or password");
            } else {
                setError(err.response?.data?.message || "Login failed due to an error");
            }
        }
    };

    return (
        <div className="auth-wrapper">
            <Link to="/" className="auth-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.png" alt="Raj Sweets" style={{ height: '50px', objectFit: 'contain' }} />
                <span style={{ fontSize: '16px', color: '#555', fontWeight: 'normal' }}>Admin</span>
            </Link>

            <div className="auth-form">
                <h1 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '20px', lineHeight: 1.2 }}>Admin Sign in</h1>

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
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: '#555',
                                    fontWeight: 'bold'
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
                        Sign In
                    </button>
                </form>
            </div>

            <Link to="/login" className="link" style={{ fontSize: '13px' }}>
                Back to User Login
            </Link>
        </div>
    );
}
