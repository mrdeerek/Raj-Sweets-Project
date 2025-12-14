import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await api.post("/auth/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <Link to="/" className="auth-logo">
                <img src="/logo.png" alt="Raj Sweets" style={{ height: '50px', objectFit: 'contain' }} />
            </Link>

            <div className="auth-form">
                <h1 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '10px', lineHeight: 1.2 }}>Password assistance</h1>
                <p style={{ fontSize: '13px', marginBottom: '20px' }}>Enter the email address associated with your Raj-Sweets account.</p>

                {message && (
                    <div style={{
                        marginBottom: '1rem',
                        border: '1px solid #067D62',
                        borderRadius: '4px',
                        padding: '1rem',
                        backgroundColor: '#f4fbf9'
                    }}>
                        <div style={{ color: '#067D62', fontSize: '14px', fontWeight: '700' }}>Email Sent</div>
                        <div style={{ fontSize: '13px' }}>{message}</div>
                    </div>
                )}

                {error && (
                    <div style={{
                        marginBottom: '1rem',
                        border: '1px solid #c40000',
                        borderRadius: '4px',
                        padding: '1rem',
                        backgroundColor: '#fffcfc'
                    }}>
                        <div style={{ color: '#c40000', fontSize: '14px', fontWeight: '700' }}>Problem</div>
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

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? "Sending..." : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
