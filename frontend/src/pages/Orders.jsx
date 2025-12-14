import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>Please <Link to="/login" style={{ color: '#007185' }}>Sign In</Link> to view your orders.</h2>
            </div>
        )
    }

    if (loading) return <div style={{ padding: '20px' }}>Loading your orders...</div>;

    return (
        <div style={{ backgroundImage: "url('/orders-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '8px', minHeight: '80vh' }}>
                <h1>Your Orders</h1>
                <div style={{ marginTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
                    <span style={{ fontWeight: 'bold', borderBottom: '3px solid #e47911', paddingBottom: '5px', display: 'inline-block' }}>Orders</span>
                </div>

                {orders.length === 0 ? (
                    <div style={{ padding: '40px 0', color: '#555' }}>
                        <p>You have not placed any orders yet. Visit <Link to="/" style={{ color: '#007185' }}>shop</Link> to browse sweets.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {orders.map(order => (
                            <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ backgroundColor: '#f0f2f2', padding: '15px', color: '#565959', fontSize: '14px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', textTransform: 'uppercase' }}>Order Placed</div>
                                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', textTransform: 'uppercase' }}>Total</div>
                                        <div>₹{order.totalAmount}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', textTransform: 'uppercase' }}>Ship To</div>
                                        <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.shippingAddress}>
                                            {order.shippingAddress}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', textTransform: 'uppercase' }}>Order # {order._id.slice(-6).toUpperCase()}</div>
                                    </div>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ marginTop: 0, color: order.status === 'Pending' ? '#e47911' : '#007600' }}>
                                        {order.status}
                                    </h3>
                                    <div>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '20px', marginTop: '10px', borderBottom: idx < order.items.length - 1 ? '1px solid #eee' : 'none', paddingBottom: '10px' }}>
                                                {item.sweet?.imageUrl && (
                                                    <img src={item.sweet.imageUrl} alt={item.sweet.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#007185' }}>
                                                        {item.sweet?.name || 'Unknown Item'}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#565959' }}>
                                                        Quantity: {item.quantity}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#B12704', fontWeight: 'bold' }}>
                                                        ₹{item.priceAtPurchase || item.sweet?.price}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
