import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

export default function SweetCard({ sweet, refresh }) {
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleRate = async (ratingValue) => {
    try {
      await api.post(`/sweets/${sweet._id}/rate`, { rating: ratingValue });
      if (refresh) refresh();
      alert(`Thanks for rating it ${ratingValue} stars!`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Please login to rate sweets.");
        navigate("/login");
      } else {
        console.error("Rate Error", error);
        alert("Failed to submit rating.");
      }
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      await addToCart(sweet._id, qty);
      navigate("/cart");
    } catch (err) {
      alert(err.message || "Failed to proceed. Please login.");
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty < sweet.quantity) setQty(prev => prev + 1);
  };

  const decreaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty > 1) setQty(prev => prev - 1);
  };

  const imageUrl = sweet.imageUrl || `https://placehold.co/600x400/orange/white?text=${encodeURIComponent(sweet.name)}`;

  return (
    <div className="sweet-card">
      <div className="card-image-container">
        <img src={imageUrl} alt={sweet.name} className="card-img" />
        {sweet.quantity > 0 && sweet.quantity < 10 && (
          <div className="card-badge card-badge-limited">Only {sweet.quantity} left!</div>
        )}
        {sweet.quantity === 0 && (
          <div className="card-badge card-badge-soldout">Sold Out</div>
        )}

      </div>

      <div className="card-body">
        <div className="card-category-badge">{sweet.category}</div>

        <h3 className="card-title" style={{ color: 'inherit' }}>{sweet.name}</h3>

        {/* Rating Stars */}
        <div className="card-rating">
          <div className="stars" style={{ color: '#FFA41C', fontSize: '1.1rem', cursor: 'pointer' }} onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => handleRate(star)}
                style={{
                  transition: 'color 0.2s',
                  color: (hoverRating || sweet.rating) >= star ? '#FFA41C' : '#ddd'
                }}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-count" style={{ color: '#007185', marginLeft: '5px' }}>
            ({sweet.numReviews})
          </span>
        </div>

        {sweet.description && (
          <p className="card-description">
            {sweet.description}
          </p>
        )}

        <div className="card-footer">
          <div className="card-price-section">
            <div className="card-price">
              <span className="currency">₹</span>
              <span className="amount">{sweet.price}</span>
            </div>
            <div className={`stock-status ${sweet.quantity > 0 ? 'in-stock' : 'out-of-stock'}`} style={{ fontWeight: 'normal', color: '#555' }}>
              {sweet.quantity > 0 ? `${Math.max(0, sweet.quantity - qty)} in stock` : '0 in stock'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8px' }}>
            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D5D9D9', borderRadius: '8px', overflow: 'hidden', height: '36px' }}>
              <button
                onClick={decreaseQty}
                disabled={qty <= 1}
                style={{ flex: 1, border: 'none', background: '#F0F2F2', cursor: 'pointer', height: '100%', fontSize: '16px', color: '#0F1111' }}
              >−</button>
              <div style={{ flex: 1, textAlign: 'center', fontSize: '14px', fontWeight: 'bold', background: 'white', lineHeight: '36px' }}>
                {qty}
              </div>
              <button
                onClick={increaseQty}
                disabled={qty >= sweet.quantity}
                style={{ flex: 1, border: 'none', background: '#F0F2F2', cursor: 'pointer', height: '100%', fontSize: '16px', color: '#0F1111' }}
              >+</button>
            </div>

            <button
              className={`btn-add-to-cart ${sweet.quantity === 0 ? 'disabled' : ''}`}
              disabled={sweet.quantity === 0 || loading}
              onClick={handleBuyNow}
              style={{ fontSize: '13px', padding: '0 8px', background: '#FA8900', borderColor: '#FA8900', height: '36px' }}
            >
              {loading ? "..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
