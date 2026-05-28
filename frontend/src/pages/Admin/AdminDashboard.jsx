// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('metrics');

  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'owner' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Filter & Sort states
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '', sortBy: 'name', order: 'ASC' });
  const [storeFilters, setStoreFilters] = useState({ name: '', address: '', sortBy: 'name', order: 'ASC' });

  // Fetch metrics data
  const fetchMetrics = async () => {
    try {
      const res = await API.get('/api/admin/dashboard');
      setMetrics(res.data);
    } catch (err) { console.error(err); }
  };

  // Fetch users with filters/sorting
  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams(userFilters).toString();
      const res = await API.get(`/api/admin/users?${params}`);
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  // Fetch stores with filters/sorting
  const fetchStores = async () => {
    try {
      const params = new URLSearchParams(storeFilters).toString();
      const res = await API.get(`/api/admin/stores?${params}`);
      setStores(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [userFilters, activeTab]);

  useEffect(() => {
    if (activeTab === 'stores') fetchStores();
  }, [storeFilters, activeTab]);

  // Handle Form Submissions
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await API.post('/api/admin/users', userForm);
      setMsg({ type: 'success', text: 'User added successfully!' });
      setUserForm({ name: '', email: '', password: '', address: '', role: 'owner' });
      fetchMetrics();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add user.' });
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await API.post('/api/admin/stores', {
        ...storeForm,
        owner_id: storeForm.owner_id ? parseInt(storeForm.owner_id) : null
      });
      setMsg({ type: 'success', text: 'Store added successfully!' });
      setStoreForm({ name: '', email: '', address: '', owner_id: '' });
      fetchMetrics();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add store.' });
    }
  };

  const toggleSort = (tab, field) => {
    if (tab === 'user') {
      const isAsc = userFilters.sortBy === field && userFilters.order === 'ASC';
      setUserFilters({ ...userFilters, sortBy: field, order: isAsc ? 'DESC' : 'ASC' });
    } else {
      const isAsc = storeFilters.sortBy === field && storeFilters.order === 'ASC';
      setStoreFilters({ ...storeFilters, sortBy: field, order: isAsc ? 'DESC' : 'ASC' });
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#FAF7F2', 
      minHeight: '100vh', 
      padding: '4vw', 
      maxWidth: '1250px', 
      margin: '0 auto', 
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      color: '#1E293B'
    }}>
      {/* Dynamic Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '2px solid #1E293B', 
        paddingBottom: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{ margin: '0', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800' }}> System Administrator Control Center</h2>
        <button 
          onClick={logout} 
          style={{ 
            padding: '10px 20px', 
            background: '#1E293B', 
            color: '#FAF7F2', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(30, 41, 59, 0.1)'
          }}
        >
          Logout
        </button>
      </div>

      {/* Responsive Tab Buttons */}
      <div style={{ margin: '24px 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['metrics', 'users', 'stores'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            style={{ 
              padding: '12px 20px', 
              background: activeTab === tab ? '#1E293B' : '#FFFFFF', 
              color: activeTab === tab ? '#FAF7F2' : '#1E293B', 
              border: activeTab === tab ? 'none' : '1px solid #E5E7EB', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              flex: '1 1 auto',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            {tab === 'metrics' ? 'Dashboard Overview' : tab === 'users' ? 'Manage Users' : 'Manage Stores'}
          </button>
        ))}
      </div>

      {/* Dynamic Notifications */}
      {msg.text && (
        <div style={{ 
          padding: '14px', 
          marginBottom: '24px', 
          borderRadius: '8px', 
          fontWeight: '600',
          background: msg.type === 'success' ? '#FFFFFF' : '#FFFFFF', 
          borderLeft: `5px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`,
          color: '#1E293B',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          {msg.type === 'success' ? '✅' : '❌'} {msg.text}
        </div>
      )}

      {/* TAB 1: METRICS */}
      {activeTab === 'metrics' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
          gap: '24px', 
          marginTop: '20px' 
        }}>
          {[
            { title: 'Total Users', val: metrics.totalUsers, accent: '#3B82F6' },
            { title: 'Registered Stores', val: metrics.totalStores, accent: '#10B981' },
            { title: 'Submitted Ratings', val: metrics.totalRatings, accent: '#F59E0B' }
          ].map((box, idx) => (
            <div key={idx} style={{ 
              padding: '32px 24px', 
              background: '#FFFFFF', 
              borderRadius: '16px', 
              textAlign: 'center', 
              boxShadow: '0 10px 25px -5px rgba(30, 41, 59, 0.03)',
              borderTop: `4px solid ${box.accent}`
            }}>
              <h3 style={{ margin: '0', color: '#6B7280', fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{box.title}</h3>
              <p style={{ fontSize: '42px', fontWeight: '800', margin: '12px 0 0 0', color: '#1E293B' }}>{box.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MANAGE USERS */}
      {activeTab === 'users' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Add New Corporate User</h3>
          <form onSubmit={handleCreateUser} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px', 
            background: '#FFFFFF', 
            padding: '24px', 
            borderRadius: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <input type="text" placeholder="Name (Min 20 chars)" required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none' }} />
            <input type="email" placeholder="Email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none' }} />
            <input type="password" placeholder="Password" required value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none' }} />
            <input type="text" placeholder="Address" required value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', flexGrow: '1', outline: 'none', fontWeight: '600' }}>
                <option value="owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" style={{ padding: '12px 20px', background: '#1E293B', color: '#FAF7F2', border: 'none', fontWeight: '600', cursor: 'pointer', borderRadius: '8px' }}>Add</button>
            </div>
          </form>

          <h3 style={{ marginTop: '40px', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>System Users Inventory</h3>
          {/* Filters Deck */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="🔍 Filter by Name" value={userFilters.name} onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#1E293B', flex: '1 1 200px' }} />
            <input type="text" placeholder="✉️ Filter by Email" value={userFilters.email} onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#1E293B', flex: '1 1 200px' }} />
            <input type="text" placeholder="📍 Filter by Address" value={userFilters.address} onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#1E293B', flex: '1 1 200px' }} />
            <select value={userFilters.role} onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#1E293B', flex: '1 1 150px', fontWeight: '600' }}>
              <option value="">All Roles</option>
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Responsive Table Pane Wrapper */}
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '16px', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>USER ID</th>
                  <th onClick={() => toggleSort('user', 'name')} style={{ padding: '16px', cursor: 'pointer', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Name ↕</th>
                  <th onClick={() => toggleSort('user', 'email')} style={{ padding: '16px', cursor: 'pointer', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Email ↕</th>
                  <th onClick={() => toggleSort('user', 'address')} style={{ padding: '16px', cursor: 'pointer', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Address ↕</th>
                  <th onClick={() => toggleSort('user', 'role')} style={{ padding: '16px', cursor: 'pointer', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Role ↕</th>
                  <th style={{ padding: '16px', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Owner Store Rating</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF7F2' }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#6B7280' }}>#{u.id}</td>
                    <td style={{ padding: '16px', color: '#1E293B', fontWeight: '600' }}>{u.name}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{u.email}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{u.address}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', background: u.role === 'admin' ? '#E0F2FE' : u.role === 'owner' ? '#FEF3C7' : '#D1FAE5', color: u.role === 'admin' ? '#0369A1' : u.role === 'owner' ? '#B45309' : '#047857' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#F59E0B' }}>{u.role === 'owner' ? (u.store_rating ? `★ ${Number(u.store_rating).toFixed(2)}` : 'Unrated') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE STORES */}
      {activeTab === 'stores' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Add New Registered Store</h3>
          <form onSubmit={handleCreateStore} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px', 
            background: '#FFFFFF', 
            padding: '24px', 
            borderRadius: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <input type="text" placeholder="Store Name" required value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none' }} />
            <input type="email" placeholder="Store Email" required value={storeForm.email} onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none' }} />
            <input type="text" placeholder="Store Address" required value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none' }} />
            <input type="text" pattern="[0-9]*" placeholder="Owner User ID (Optional)" value={storeForm.owner_id} onChange={(e) => {const val = e.target.value; if (val === '' || /^[0-9\b]+$/.test(val)){setStoreForm({ ...storeForm, owner_id: val});}}} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none' }} />
            <button type="submit" style={{ padding: '12px 20px', background: '#1E293B', color: '#FAF7F2', border: 'none', fontWeight: '600', cursor: 'pointer', borderRadius: '8px' }}>Add Store</button>
          </form>

          <h3 style={{ marginTop: '40px', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Registered Stores Directory</h3>
          {/* Filters Deck */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="🔍 Search by Store Name" value={storeFilters.name} onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#1E293B', flex: '1 1 250px' }} />
            <input type="text" placeholder="📍 Search by Address" value={storeFilters.address} onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#1E293B', flex: '1 1 250px' }} />
          </div>

          {/* Responsive Table Pane Wrapper */}
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th onClick={() => toggleSort('store', 'name')} style={{ padding: '16px', cursor: 'pointer', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Store Name ↕</th>
                  <th style={{ padding: '16px', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Store Email</th>
                  <th onClick={() => toggleSort('store', 'address')} style={{ padding: '16px', cursor: 'pointer', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Address ↕</th>
                  <th onClick={() => toggleSort('store', 'overall_rating')} style={{ padding: '16px', cursor: 'pointer', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Overall Avg Rating ↕</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s, idx) => (
                  <tr key={s.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF7F2' }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#1E293B' }}>{s.name}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{s.email}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{s.address}</td>
                    <td style={{ padding: '16px', color: '#F59E0B', fontWeight: '800' }}>{s.overall_rating > 0 ? `★ ${s.overall_rating} / 5` : 'Not Rated'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;