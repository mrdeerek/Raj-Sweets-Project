import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues with Webpack/Vite
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, setLocationName }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 13);
        }
    }, [position, map]);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
                .then(res => res.json())
                .then(data => {
                    const city = data.address.city || data.address.town || data.address.village || data.address.county;
                    const postcode = data.address.postcode;
                    if (city && postcode) {
                        setLocationName(`${city} ${postcode}`);
                    } else if (data.display_name) {
                        // truncated display name
                        setLocationName(data.display_name.split(',')[0]);
                    }
                })
                .catch(err => console.error("Geocoding error:", err));
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const locationRoute = useLocation();
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("Mumbai 400001");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [newLocation, setNewLocation] = useState("");

    // Map states
    const [mapPosition, setMapPosition] = useState(null); // {lat, lng}
    const [showLangMenu, setShowLangMenu] = useState(false);

    useEffect(() => {
        // 1. Try to get from local storage
        const savedLoc = localStorage.getItem('user_location');
        if (savedLoc) {
            setLocation(savedLoc);
        } else {
            // 2. If not saved, try live location
            detectLiveLocation();
        }
    }, []);

    const detectLiveLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setMapPosition({ lat: latitude, lng: longitude });

                    // Reverse geocode to get text
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                        .then(res => res.json())
                        .then(data => {
                            const city = data.address.city || data.address.town || data.address.village || data.address.county;
                            const postcode = data.address.postcode;
                            let locString = "Select Location";
                            if (city && postcode) {
                                locString = `${city} ${postcode}`;
                            } else if (data.display_name) {
                                locString = data.display_name.split(',')[0];
                            }
                            setLocation(locString);
                            localStorage.setItem('user_location', locString);
                        })
                        .catch(err => console.error("Geocoding failed", err));
                },
                (err) => {
                    console.error("Location permission denied or error", err);
                    // Fallback already set to Mumbai
                }
            );
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/?query=${encodeURIComponent(query)}`);
        } else {
            navigate('/');
        }
    };

    const handleUpdateLocation = (e) => {
        e.preventDefault();
        if (newLocation.trim()) {
            setLocation(newLocation);
            localStorage.setItem('user_location', newLocation);
            setShowLocationModal(false);
        }
    };

    return (
        <nav className="navbar">
            {/* Location Modal */}
            {showLocationModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '500px', // Wider for map
                        maxWidth: '90%',
                        color: 'black',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#0F1111' }}>Choose your location</h3>
                            <button onClick={() => setShowLocationModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                        </div>

                        <p style={{ fontSize: '13px', color: '#565959', margin: 0 }}>
                            Select your delivery location to see accurate product availability.
                        </p>

                        <div style={{ height: '300px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                            <MapContainer
                                center={mapPosition || [19.0760, 72.8777]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker
                                    position={mapPosition}
                                    setPosition={setMapPosition}
                                    setLocationName={setNewLocation}
                                />
                            </MapContainer>
                        </div>

                        <form onSubmit={handleUpdateLocation} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter pincode or city"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ border: '1px solid #D5D9D9', background: '#f0f2f2', whiteSpace: 'nowrap' }}
                                    onClick={() => {
                                        detectLiveLocation();
                                        // Also need to set newLocation to what detect finds, but detect sets main location
                                        // We'll rely on map click for explicit manual setting or just typing
                                    }}
                                >
                                    Detect
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ borderRadius: '8px', padding: '8px', fontSize: '14px', width: '100%' }}
                            >
                                Apply Location
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Top Belt */}
            <div className="nav-top">
                {locationRoute.pathname !== '/' && (
                    <button
                        onClick={() => navigate('/')}
                        className="nav-item"
                        style={{
                            background: 'transparent',
                            border: '1px solid #d4af37',
                            color: '#d4af37',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 'bold',
                            marginRight: '10px',
                            height: '40px',
                            minHeight: 'auto',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>←</span> <span className="nav-back-text">Dashboard</span>
                    </button>
                )}
                <Link to="/" className="nav-logo">
                    <img src="/logo-nobg.png" alt="Raj Sweets" style={{ height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 2px #d4af37)' }} />
                </Link>

                {/* Location - Simplified */}
                <div className="nav-item nav-location" onClick={() => {
                    setNewLocation(location);
                    setShowLocationModal(true);
                }}>
                    <span style={{ fontSize: '18px', marginRight: '5px' }}>📍</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="nav-line-1" style={{ color: '#e0c097', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivering to</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{location.length > 20 ? location.substring(0, 18) + '...' : location}</span>
                    </div>
                </div>

                {/* Search Belt */}
                <form className="nav-search-container" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="nav-search-input"
                        placeholder="Search for premium sweets..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="nav-search-btn">
                        <span style={{ fontSize: '18px', color: '#3e000c' }}>🔍</span>
                    </button>
                </form>

                {/* Account */}
                <Link
                    to={!user ? "/login" : (user.role === 'ADMIN' ? "/admin" : "/account")}
                    className="nav-item"
                    style={{ textDecoration: 'none', color: 'white', alignItems: 'center', flexDirection: 'row', gap: '8px' }}
                >
                    <span style={{ fontSize: '20px' }}>👤</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="nav-line-1" style={{ fontSize: '11px', color: '#e0c097' }}>Welcome</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{user ? user.email.split('@')[0] : "Sign In"}</span>
                    </div>
                </Link>

                {/* Orders */}
                <Link to="/orders" className="nav-item nav-orders" style={{ textDecoration: 'none', color: 'white', alignItems: 'center', flexDirection: 'row', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📦</span>
                    <span style={{ fontWeight: 'bold' }}>Orders</span>
                </Link>

                {/* Cart */}
                <Link to="/cart" className="nav-item nav-cart" style={{ textDecoration: 'none' }}>
                    <div className="cart-icon-container">
                        <span className="cart-count">{cartCount}</span>
                        <span style={{ fontSize: '24px' }}>🛒</span>
                        <span className="cart-text-label" style={{ fontWeight: 'bold' }}>Cart</span>
                    </div>
                    {/* Text removed for cleaner look, handled by icon */}
                </Link>

                {/* Logout */}
                {user && (
                    <div className="nav-item" onClick={logout} style={{ marginLeft: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#e0c097' }}>Logout</span>
                    </div>
                )}
            </div>

            {/* Animated Welcome Banner */}
            <div className="nav-bottom" style={{ overflow: 'hidden', position: 'relative', padding: '8px 0' }}>
                <div className="scrolling-banner">
                    <span className="banner-text">Welcome to Raj Sweets</span>
                    <span className="banner-text">Welcome to Raj Sweets</span>
                    <span className="banner-text">Welcome to Raj Sweets</span>
                    <span className="banner-text">Welcome to Raj Sweets</span>
                    <span className="banner-text">Welcome to Raj Sweets</span>
                    <span className="banner-text">Welcome to Raj Sweets</span>
                    <span className="banner-text">Welcome to Raj Sweets</span>
                    <span className="banner-text">Welcome to Raj Sweets</span>
                </div>
            </div>
        </nav>
    );
}
