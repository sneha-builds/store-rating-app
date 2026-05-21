// src/pages/Owner/OwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';

const OwnerDashboard = () => {
  const { logout } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showPasswordTab, setShowPasswordTab] = useState(false);

  const fetchOwnerAnalytics = async () => {
    try {
      const res = await API.get('/api/owner/dashboard');
      setStoreData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve your store analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerAnalytics();
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await API.put('/api/owner/update-password', passwordForm);
      setMsg({ type: 'success', text: 'Owner password updated successfully!' });
      setPasswordForm({ newPassword: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed.' });
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading your store portal...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <div>
          <h2 style={{ margin: '0' }}>🏪 Business Owner Portal</h2>
          {storeData && <p style={{ margin: '5px 0 0 0', color: '#666' }}>Managing: <strong>{storeData.storeName}</strong></p>}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowPasswordTab(!showPasswordTab)} style={{ padding: '8px 16px', background: '#6C757D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {showPasswordTab ? 'Back to Analytics' : 'Change Password'}
          </button>
          <button onClick={logout} style={{ padding: '8px 16px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {msg.text && <div style={{ padding: '12px', marginTop: '15px', borderRadius: '4px', background: msg.type === 'success' ? '#D4EDDA' : '#F8D7DA', color: msg.type === 'success' ? '#155724' : '#721C24' }}>{msg.text}</div>}
      {error && <div style={{ padding: '20px', textAlign: 'center', background: '#FFF3CD', color: '#856404', marginTop: '20px', borderRadius: '6px' }}>⚠️ {error}</div>}

      {/* CONDITIONAL WINDOW: CHANGE PASSWORD */}
      {showPasswordTab ? (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '6px' }}>
          <h3>Update Business Password</h3>
          <form onSubmit={handlePasswordUpdate}>
            <div style={{ marginBottom: '15px' }}>
              <label>New Password:</label>
              <input type="password" required placeholder="8-16 chars, 1 Upper, 1 Special" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ newPassword: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save New Password</button>
          </form>
        </div>
      ) : (
        /* MAIN VIEW: METRICS & REVIEW LIST */
        storeData && (
          <div style={{ marginTop: '20px' }}>
            {/* Store Score Banner */}
            <div style={{ background: '#F8F9FA', borderLeft: '6px solid #FFC107', padding: '20px', borderRadius: '4px', marginBottom: '30px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Performance</h4>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#222' }}>
                {storeData.averageRating > 0 ? `${storeData.averageRating} / 5 ★` : 'No Ratings Yet'}
              </p>
            </div>

            {/* Reviewers Data Table */}
            <h3>Customer Feedback Log</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: 'white' }}>
              <thead>
                <tr style={{ background: '#f4f4f4', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px' }}>Customer Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Address</th>
                  <th style={{ padding: '12px' }}>Rating Given</th>
                  <th style={{ padding: '12px' }}>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {storeData.reviewers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>No feedback submissions have been registered for your establishment yet.</td>
                  </tr>
                ) : (
                  storeData.reviewers.map((rev, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{rev.name}</td>
                      <td style={{ padding: '12px', color: '#555' }}>{rev.email}</td>
                      <td style={{ padding: '12px', color: '#555', fontSize: '14px' }}>{rev.address}</td>
                      <td style={{ padding: '12px', color: '#FFC107', fontWeight: 'bold', fontSize: '16px' }}>{rev.rating_value} ★</td>
                      <td style={{ padding: '12px', color: '#888', fontSize: '13px' }}>{new Date(rev.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default OwnerDashboard;