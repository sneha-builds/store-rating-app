// src/pages/User/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { logout } = useAuth();
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '', sortBy: 'name', order: 'ASC' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showPasswordTab, setShowPasswordTab] = useState(false);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`/api/user/stores?${params}`);
      setStores(res.data);
    } catch (err) {
      console.error('Error loading directory directory:', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const handleRatingSubmit = async (storeId, score) => {
    try {
      await API.post(`/api/user/stores/${storeId}/rate`, { ratingValue: score });
      fetchStores(); // Refresh local list state data to update averages instantly
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record rating.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await API.put('/api/user/update-password', passwordForm);
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ newPassword: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed.' });
    }
  };

  const toggleSort = (field) => {
    const isAsc = filters.sortBy === field && filters.order === 'ASC';
    setFilters({ ...filters, sortBy: field, order: isAsc ? 'DESC' : 'ASC' });
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2>👤 Verified Customer Marketplace</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowPasswordTab(!showPasswordTab)} style={{ padding: '8px 16px', background: '#6C757D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {showPasswordTab ? 'Back to Stores' : 'Change Password'}
          </button>
          <button onClick={logout} style={{ padding: '8px 16px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {msg.text && <div style={{ padding: '12px', marginTop: '15px', borderRadius: '4px', background: msg.type === 'success' ? '#D4EDDA' : '#F8D7DA', color: msg.type === 'success' ? '#155724' : '#721C24' }}>{msg.text}</div>}

      {/* CONDITIONAL COMPONENT: PASSWORD REMODEL WINDOW */}
      {showPasswordTab ? (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '6px' }}>
          <h3>Update Your Secure Password</h3>
          <form onSubmit={handlePasswordUpdate}>
            <div style={{ marginBottom: '15px' }}>
              <label>New Password:</label>
              <input type="password" required placeholder="8-16 chars, 1 Upper, 1 Special" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ newPassword: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Commit Changes</button>
          </form>
        </div>
      ) : (
        /* MAIN COMPONENT: STORE BROWSER CARDS */
        <div style={{ marginTop: '20px' }}>
          {/* Active Search & Filtering Bars */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', background: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
            <input type="text" placeholder="🔍 Search stores by name..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} style={{ padding: '8px', flexGrow: '1', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="📍 Search by address..." value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} style={{ padding: '8px', flexGrow: '1', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button onClick={() => toggleSort('overall_rating')} style={{ padding: '8px 12px', cursor: 'pointer', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}>
              Sort by Rating {filters.sortBy === 'overall_rating' ? (filters.order === 'ASC' ? '🔼' : '🔽') : '↕'}
            </button>
          </div>

          {/* Dynamic Grid Layout Display */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {stores.length === 0 ? <p>No registered establishments match your query.</p> : stores.map(store => (
              <div key={store.id} style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', background: 'white' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{store.name}</h3>
                <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>📍 {store.address}</p>
                
                {/* Visual Average Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '14px', color: '#555' }}>Community Rating:</span>
                  <span style={{ color: '#B06000', fontWeight: 'bold' }}>
                    {store.overall_rating > 0 ? `${store.overall_rating} / 5 ★` : 'No reviews'}
                  </span>
                </div>

                {/* Interactive Star Selection Bar */}
                <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#444', fontWeight: store.user_submitted_rating > 0 ? 'bold' : 'normal' }}>
                    {store.user_submitted_rating > 0 ? `Your Rating: ${store.user_submitted_rating} ★` : 'You haven\'t rated this store'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        onClick={() => handleRatingSubmit(store.id, star)}
                        style={{
                          fontSize: '24px',
                          cursor: 'pointer',
                          color: star <= (store.user_submitted_rating || 0) ? '#FFC107' : '#E0E0E0',
                          transition: 'color 0.1s ease'
                        }}
                        title={`Rate ${star} Stars`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;