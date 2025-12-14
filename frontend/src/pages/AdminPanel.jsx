import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    imageUrl: ""
  });
  const [sweets, setSweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchSweets = async () => {
    try {
      const res = await api.get("/sweets");
      setSweets(res.data);
    } catch (err) {
      console.error("Failed to fetch sweets");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchSweets();
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  // Stats Logic
  const totalSweets = sweets.length;
  const lowStock = sweets.filter(s => s.quantity < 5).length;
  const totalStockValue = sweets.reduce((acc, s) => acc + (s.price * s.quantity), 0).toLocaleString();

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", category: "", price: "", quantity: "", description: "", imageUrl: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (sweet) => {
    setEditingId(sweet._id);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || "",
      imageUrl: sweet.imageUrl || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sweet?")) {
      try {
        await api.delete(`/sweets/${id}`);
        fetchSweets();
      } catch (err) {
        alert("Failed to delete sweet");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: Number(formData.price), quantity: Number(formData.quantity) };
      if (editingId) {
        await api.put(`/sweets/${editingId}`, payload);
      } else {
        await api.post("/sweets", payload);
      }
      setIsModalOpen(false);
      fetchSweets();
    } catch (err) {
      alert("Operation failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const InventoryTable = () => (
    <table className="inventory-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock Level</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sweets.map(sweet => (
          <tr key={sweet._id}>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={sweet.imageUrl || "https://placehold.co/40"}
                  style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                  alt=""
                />
                <span style={{ fontWeight: '500' }}>{sweet.name}</span>
              </div>
            </td>
            <td>{sweet.category}</td>
            <td style={{ fontWeight: 'bold' }}>₹{sweet.price}</td>
            <td>
              <span className={`stock-badge ${sweet.quantity < 5 ? 'stock-low' : 'stock-ok'}`}>
                {sweet.quantity} {sweet.quantity < 5 ? '(Low)' : 'In Stock'}
              </span>
            </td>
            <td>
              <button
                onClick={() => handleEdit(sweet)}
                className="btn-action btn-action-edit"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(sweet._id)}
                className="btn-action btn-action-delete"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const UsersTable = () => (
    <table className="inventory-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Role</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u._id}>
            <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{u._id}</td>
            <td style={{ fontWeight: '500' }}>{u.email}</td>
            <td>
              <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: u.role === 'ADMIN' ? '#e6f7ff' : '#f5f5f5',
                color: u.role === 'ADMIN' ? '#007185' : '#555',
                fontSize: '0.75rem',
                fontWeight: '700',
                border: u.role === 'ADMIN' ? '1px solid #bae7ff' : '1px solid #ddd'
              }}>
                {u.role}
              </span>
            </td>
            <td>{new Date().toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#232f3e', marginBottom: '2rem', paddingLeft: '10px' }}>
          Admin Portal
        </div>
        <div
          className={`admin-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </div>
        <div
          className={`admin-menu-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          📦 Inventory
        </div>
        <div
          className={`admin-menu-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </div>

      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#232f3e', margin: 0 }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p style={{ color: '#666', marginTop: '5px' }}>
              {activeTab === 'dashboard' && "Overview of your store performance."}
              {activeTab === 'inventory' && "Manage your sweet products."}
              {activeTab === 'users' && "Manage registered users."}
            </p>
          </div>
          {activeTab === 'inventory' || activeTab === 'dashboard' ? (
            <button className="btn btn-primary" onClick={openAddModal}>
              + Add New Sweet
            </button>
          ) : null}
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="admin-stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Products</span>
                <span className="stat-value">{totalSweets}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Low Stock Alerts</span>
                <span className="stat-value" style={{ color: lowStock > 0 ? '#B12704' : '#007185' }}>{lowStock}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Inventory Value</span>
                <span className="stat-value">₹{totalStockValue}</span>
              </div>
            </div>

            <div className="admin-section-title">Recent Inventory</div>
            <InventoryTable />
          </>
        )}

        {activeTab === 'inventory' && (
          <>
            <InventoryTable />
          </>
        )}

        {activeTab === 'users' && (
          <>
            <UsersTable />
          </>
        )}



      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', color: '#232f3e' }}>{editingId ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input name="category" className="form-input" value={formData.category} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input name="price" type="number" className="form-input" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input name="quantity" type="number" className="form-input" value={formData.quantity} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input" style={{ height: '80px', fontFamily: 'inherit' }} value={formData.description} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="imageUrl" className="form-input" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? "Update" : "Create"}</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
