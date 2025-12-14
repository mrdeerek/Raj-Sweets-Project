import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sweet, setSweet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchSweet = async () => {
            try {
                const res = await api.get(`/sweets/${id}`);
                setSweet(res.data);
            } catch (err) {
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };
        fetchSweet();
    }, [id]);

    const purchase = async () => {
        try {
            await api.post(`/sweets/${sweet._id}/purchase`, { quantity: parseInt(qty) });
            alert(`Successfully added ${qty} item(s) to cart!`);
            window.location.reload(); // simple refresh to update stock
        } catch (err) {
            alert("Purchase failed");
        }
    };

    if (loading) return <div className="p-4" style={{ padding: '2rem' }}>Loading...</div>;
    if (error) return <div className="p-4" style={{ padding: '2rem' }}>{error}</div>;
    if (!sweet) return null;

    const imageUrl = sweet.imageUrl || `https://placehold.co/600x400/orange/white?text=${encodeURIComponent(sweet.name)}`;

    return (
        <div style={{ backgroundColor: "white", minHeight: "100vh", paddingBottom: "2rem" }}>
            <div className="container" style={{ display: 'flex', gap: '2rem', padding: '2rem', flexWrap: 'wrap' }}>

                {/* Left Column: Image */}
                <div style={{ flex: '0 0 40%', minWidth: '300px' }}>
                    <div style={{ position: 'sticky', top: '20px' }}>
                        <img
                            src={imageUrl}
                            alt={sweet.name}
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                        />
                    </div>
                </div>

                {/* Center Column: Details */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '500', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                        {sweet.name}
                    </h1>


                    <hr style={{ border: '0', borderTop: '1px solid #e7e7e7', margin: '1rem 0' }} />

                    <div style={{ fontSize: '28px', color: '#B12704', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '14px', verticalAlign: 'top', color: '#565959', marginRight: '2px' }}>₹</span>
                        {sweet.price}
                    </div>

                    <div style={{ color: '#565959', fontSize: '14px', marginBottom: '1rem' }}>
                        Inclusive of all taxes
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0.5rem' }}>About this item</h3>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '14px', lineHeight: '1.5' }}>
                            {sweet.description ? (
                                <li>{sweet.description}</li>
                            ) : (
                                <li>Delicious {sweet.category} made with premium ingredients.</li>
                            )}
                            <li>Freshly prepared and packed.</li>
                            <li>Perfect for gifting and festivals.</li>
                            <li>Store in a cool and dry place.</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Buy Box */}
                <div style={{ flex: '0 0 240px' }}>
                    <div style={{ border: '1px solid #d5d9d9', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontSize: '28px', color: '#B12704', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '14px', verticalAlign: 'top', color: '#565959', marginRight: '2px' }}>₹</span>
                            {sweet.price}
                        </div>

                        <div style={{ fontSize: '14px', color: '#007185', marginBottom: '0.5rem' }}>
                            FREE delivery <b>Tuesday, 18 June</b>.
                            <br />Order within 12 hrs 3 mins.
                        </div>

                        <div style={{ fontSize: '14px', color: '#007185', marginBottom: '1rem' }}>
                            <span style={{ color: '#333' }}>Delivering to: </span> <b>Mumbai 400001</b>
                        </div>

                        <div style={{ fontSize: '18px', color: sweet.quantity > 0 ? '#007600' : '#B12704', marginBottom: '1rem' }}>
                            {sweet.quantity > 0 ? "In Stock" : "Currently Unavailable"}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Quantity:</label>
                            <select
                                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                            >
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>

                        <button
                            onClick={purchase}
                            disabled={sweet.quantity === 0}
                            className="btn"
                            style={{ width: '100%', backgroundColor: '#f7ca00', borderRadius: '20px', marginBottom: '10px' }}
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={purchase}
                            disabled={sweet.quantity === 0}
                            className="btn"
                            style={{ width: '100%', backgroundColor: '#fa8900', borderRadius: '20px' }}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
