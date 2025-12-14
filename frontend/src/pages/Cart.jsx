import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const Cart = () => {
    const { cart, cartCount, loading, removeFromCart, updateQuantity, fetchCart } = useCart();
    const [address, setAddress] = useState('');
    const [ordering, setOrdering] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            setOrdering(true);
            await api.post('/orders', { shippingAddress: address });
            await fetchCart(); // Refresh cart to empty it
            navigate('/orders'); // Redirect to orders page
        } catch (error) {
            alert(error.response?.data?.message || 'Checkout failed');
        } finally {
            setOrdering(false);
        }
    };

    const subtotal = cart?.items?.reduce((total, item) => total + (item.sweet?.price || 0) * item.quantity, 0) || 0;

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading cart...</div>;
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#EAEDED', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexDirection: 'column' }}>
                <div style={{ marginBottom: '10px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#007185', display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
                        <span style={{ fontSize: '18px', marginRight: '5px' }}>‹</span> Back to Dashboard
                    </Link>
                </div>
                <div style={{ display: 'flex', gap: '20px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>

                    {/* Cart Items Section */}
                    <div style={{ flex: 3, backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}>
                        <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>Shopping Cart</h2>

                        {(!cart || cart.items.length === 0) ? (
                            <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                <h3 style={{ color: '#565959' }}>Your Raj Sweets Cart is empty.</h3>
                                <p>Check your Saved for later items below or <Link to="/" style={{ color: '#007185', textDecoration: 'none' }}>continue shopping</Link>.</p>
                            </div>
                        ) : (
                            <div>
                                {cart.items.map((item) => {
                                    if (!item.sweet) return null;
                                    return (
                                        <div key={item._id} style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '20px 0', gap: '20px' }}>
                                            <div style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0', flexShrink: 0 }}>
                                                {item.sweet.imageUrl ? (
                                                    <img src={item.sweet.imageUrl} alt={item.sweet.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>No Image</div>
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '500' }}>
                                                        <Link to={`/sweets/${item.sweet._id}`} style={{ textDecoration: 'none', color: '#0F1111' }}>
                                                            {item.sweet.name}
                                                        </Link>
                                                    </h3>
                                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{item.sweet.price}</div>
                                                </div>
                                                <div style={{ color: '#007600', fontSize: '12px', marginBottom: '8px' }}>In Stock</div>
                                                <div style={{ fontSize: '12px', color: '#565959', marginBottom: '4px' }}>Sold by Raj Sweets</div>
                                                <div style={{ fontSize: '12px', color: '#565959' }}>Gift options not available.</div>

                                                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D5D9D9', borderRadius: '7px', background: '#F0F2F2', height: '28px', boxShadow: '0 1px 2px rgba(15,17,17,.15)' }}>
                                                        <button
                                                            onClick={() => updateQuantity(item.sweet._id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            style={{ border: 'none', background: 'transparent', padding: '0 8px', cursor: 'pointer', fontSize: '14px' }}
                                                        >−</button>
                                                        <span style={{ fontSize: '13px', background: 'white', padding: '0 10px', height: '100%', display: 'flex', alignItems: 'center', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }}>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.sweet._id, item.quantity + 1)}
                                                            disabled={item.sweet.quantity && item.quantity >= item.sweet.quantity}
                                                            style={{ border: 'none', background: 'transparent', padding: '0 8px', cursor: 'pointer', fontSize: '14px' }}
                                                        >+</button>
                                                    </div>
                                                    <div style={{ height: '14px', borderLeft: '1px solid #ddd' }}></div>
                                                    <button
                                                        onClick={() => removeFromCart(item.sweet._id)}
                                                        style={{ background: 'none', border: 'none', color: '#007185', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: '500', marginTop: '10px' }}>
                                    Subtotal ({cartCount} items): <span style={{ fontWeight: 'bold' }}>₹{subtotal}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Checkout Sidebar */}
                    {cart && cart.items.length > 0 && (

                        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '4px', height: 'fit-content' }}>
                            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '15px' }}>
                                Subtotal ({cartCount} items): <span style={{ fontWeight: 'bold' }}>₹{subtotal}</span>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Shipping Address:</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your full street address, city, state and zip code"
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        minHeight: '80px',
                                        fontSize: '13px'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', marginBottom: '15px' }}>
                                <input type="checkbox" defaultChecked /> This order contains a gift
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleCheckout}
                                disabled={ordering || !address.trim()}
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 5px rgba(213,217,217,.5)',
                                    opacity: (ordering || !address.trim()) ? 0.7 : 1,
                                    cursor: (ordering || !address.trim()) ? 'not-allowed' : 'pointer'
                                }}>
                                {ordering ? 'Placing Order...' : 'Proceed to Buy'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
