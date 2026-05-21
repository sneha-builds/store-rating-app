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
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2>👑 System Administrator Control Center</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>

      {/* Tab Navigation */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button onClick={() => setActiveTab('metrics')} style={{ padding: '10px 20px', background: activeTab === 'metrics' ? '#007BFF' : '#f0f0f0', color: activeTab === 'metrics' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Dashboard Overview</button>
        <button onClick={() => setActiveTab('users')} style={{ padding: '10px 20px', background: activeTab === 'users' ? '#007BFF' : '#f0f0f0', color: activeTab === 'users' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Manage Users</button>
        <button onClick={() => setActiveTab('stores')} style={{ padding: '10px 20px', background: activeTab === 'stores' ? '#007BFF' : '#f0f0f0', color: activeTab === 'stores' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Manage Stores</button>
      </div>

      {msg.text && <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '4px', background: msg.type === 'success' ? '#D4EDDA' : '#F8D7DA', color: msg.type === 'success' ? '#155724' : '#721C24' }}>{msg.text}</div>}

      {/* TAB 1: METRICS */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '30px', background: '#E8F0FE', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0', color: '#1A73E8' }}>Total Users</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{metrics.totalUsers}</p>
          </div>
          <div style={{ padding: '30px', background: '#E6F4EA', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0', color: '#137333' }}>Registered Stores</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{metrics.totalStores}</p>
          </div>
          <div style={{ padding: '30px', background: '#FEF7E0', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0', color: '#B06000' }}>Submitted Ratings</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{metrics.totalRatings}</p>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE USERS */}
      {activeTab === 'users' && (
        <div>
          <h3>Add New Corporate User (Admin / Store Owner)</h3>
          <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', background: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
            <input type="text" placeholder="Name (Min 20 chars)" required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} style={{ padding: '8px' }} />
            <input type="email" placeholder="Email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} style={{ padding: '8px' }} />
            <input type="password" placeholder="Password" required value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} style={{ padding: '8px' }} />
            <input type="text" placeholder="Address" required value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} style={{ padding: '8px' }} />
            <div style={{ display: 'flex', gap: '5px' }}>
              <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} style={{ padding: '8px', flexGrow: '1' }}>
                <option value="owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" style={{ padding: '8px 12px', background: '#28A745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Add</button>
            </div>
          </form>

          <h3 style={{ marginTop: '30px' }}>System Users Inventory</h3>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="text" placeholder="Filter by Name" value={userFilters.name} onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })} style={{ padding: '6px' }} />
            <input type="text" placeholder="Filter by Email" value={userFilters.email} onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })} style={{ padding: '6px' }} />
            <input type="text" placeholder="Filter by Address" value={userFilters.address} onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })} style={{ padding: '6px' }} />
            <select value={userFilters.role} onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })} style={{ padding: '6px' }}>
              <option value="">All Roles</option>
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f4f4f4', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px' }}>USER ID</th>
                <th onClick={() => toggleSort('user', 'name')} style={{ padding: '10px', cursor: 'pointer' }}>Name ↕</th>
                <th onClick={() => toggleSort('user', 'email')} style={{ padding: '10px', cursor: 'pointer' }}>Email ↕</th>
                <th onClick={() => toggleSort('user', 'address')} style={{ padding: '10px', cursor: 'pointer' }}>Address ↕</th>
                <th onClick={() => toggleSort('user', 'role')} style={{ padding: '10px', cursor: 'pointer' }}>Role ↕</th>
                <th style={{ padding: '10px' }}>Owner Store Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold', color: '#666' }}>#{u.id}</td>
                  <td style={{ padding: '10px' }}>{u.name}</td>
                  <td style={{ padding: '10px' }}>{u.email}</td>
                  <td style={{ padding: '10px' }}>{u.address}</td>
                  <td style={{ padding: '10px' }}><span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '12px', background: u.role === 'admin' ? '#E8F0FE' : u.role === 'owner' ? '#FEF7E0' : '#E6F4EA' }}>{u.role}</span></td>
                  <td style={{ padding: '10px' }}>{u.role === 'owner' ? (u.store_rating ? `${u.store_rating} ★` : 'No reviews yet') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: MANAGE STORES */}
      {activeTab === 'stores' && (
        <div>
          <h3>Add New Registered Store</h3>
          <form onSubmit={handleCreateStore} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', background: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
            <input type="text" placeholder="Store Name" required value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} style={{ padding: '8px' }} />
            <input type="email" placeholder="Store Email" required value={storeForm.email} onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })} style={{ padding: '8px' }} />
            <input type="text" placeholder="Store Address" required value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} style={{ padding: '8px' }} />
            <input type="text" pattern="[0-9]*" placeholder="Owner User ID (Optional)" value={storeForm.owner_id} onChange={(e) => {const val = e.target.value; if (val === '' || /^[0-9\b]+$/.test(val)){setStoreForm({ ...storeForm, owner_id: val});}}} style={{ padding: '8px' }} />
            <button type="submit" style={{ padding: '8px 12px', background: '#28A745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Add Store</button>
          </form>

          <h3 style={{ marginTop: '30px' }}>Registered Stores Directory</h3>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="text" placeholder="Search by Store Name" value={storeFilters.name} onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })} style={{ padding: '6px' }} />
            <input type="text" placeholder="Search by Address" value={storeFilters.address} onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })} style={{ padding: '6px' }} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f4f4f4', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                <th onClick={() => toggleSort('store', 'name')} style={{ padding: '10px', cursor: 'pointer' }}>Store Name ↕</th>
                <th style={{ padding: '10px' }}>Store Email</th>
                <th onClick={() => toggleSort('store', 'address')} style={{ padding: '10px', cursor: 'pointer' }}>Address ↕</th>
                <th onClick={() => toggleSort('store', 'overall_rating')} style={{ padding: '10px', cursor: 'pointer' }}>Overall Avg Rating ↕</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.name}</td>
                  <td style={{ padding: '10px' }}>{s.email}</td>
                  <td style={{ padding: '10px' }}>{s.address}</td>
                  <td style={{ padding: '10px', color: '#B06000', fontWeight: 'bold' }}>{s.overall_rating > 0 ? `${s.overall_rating} / 5 ★` : 'Not Rated'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;