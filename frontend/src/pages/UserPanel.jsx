import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();


    const cards = [
        {
            icon: "📦",
            title: "Your Orders",
            desc: "Track, return, or buy things again",
            link: "/orders"
        },
        {
            icon: "📍",
            title: "Your Addresses",
            desc: "Edit addresses for orders and gifts",
            action: () => {
                alert("You can add/edit your address during checkout in the Cart.");
                navigate("/cart");
            }
        },
    ];

    const handleCardClick = (card) => {
        if (card.link) {
            navigate(card.link);
        } else if (card.action) {
            card.action();
        }
    };

    return (
        <div className="account-container">
            <h1 className="account-header">Your Account</h1>

            <div className="account-grid">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="account-card"
                        onClick={() => handleCardClick(card)}
                        title={card.title}
                    >
                        <div className="account-card-icon">{card.icon}</div>
                        <div className="account-card-content">
                            <div className="account-card-title">{card.title}</div>
                            <div className="account-card-desc">{card.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <h3>Account Details</h3>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>User ID:</strong> <span style={{ fontFamily: 'monospace' }}>{user?._id}</span></p>
                <p><strong>Role:</strong> {user?.role}</p>
                <button onClick={() => {
                    // For testing purposes, print the token or logout
                    console.log("User Data:", user);
                }} style={{ fontSize: '10px', marginTop: '10px', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>
                    Debug Info
                </button>
            </div>

        </div>
    );
}
