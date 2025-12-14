import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import SweetCard from "../components/SweetCard";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [loading, setLoading] = useState(true);

  const loadSweets = async () => {
    setLoading(true);
    try {
      const res = query
        ? await api.get(`/sweets/search?query=${query}`)
        : await api.get("/sweets");
      setSweets(res.data.value || res.data);
    } catch (error) {
      console.error("Failed to load sweets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, [query]);

  return (
    <div className="home" style={{
      backgroundImage: "url('/dashboard-bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <div className="home-container" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', minHeight: '100vh', paddingBottom: '2rem' }}>


        {/* Content Area */}
        <div style={{ padding: "0 1rem", marginTop: query ? "1rem" : undefined, backgroundColor: 'transparent', minHeight: '50vh' }}>
          {query && (
            <div style={{ padding: '1rem', background: '#fff', marginBottom: '1rem', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <span style={{ fontWeight: 'bold' }}>{sweets.length}</span> results for <span style={{ color: '#C7511F', fontWeight: 'bold' }}>"{query}"</span>
            </div>
          )}
          {!query && <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', paddingTop: '20px', color: '#232f3e', textShadow: '1px 1px 2px white' }}>Best Sellers in Sweets</h2>}

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>Loading sweets...</div>
          ) : sweets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: 'white', borderRadius: '8px', marginTop: '1rem' }}>
              <h3>No match found</h3>
              <p>Try checking your spelling or use different keywords.</p>
            </div>
          ) : (
            <div className="product-grid">
              {sweets.map((s) => (
                <SweetCard key={s._id} sweet={s} refresh={loadSweets} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
