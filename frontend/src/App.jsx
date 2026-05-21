// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserDashboard from './pages/User/UserDashboard';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

const Unauthorized = () => (
  <div style={{
    backgroundColor: '#FAF7F2',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'sans-serif',
    boxSizing: 'border-box',
    color: '#1E293B'
  }}>
    <div style={{
      width: '100%',
      maxWidth: '440px',
      background: '#FFFFFF',
      padding: '40px 32px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px -15px rgba(30, 41, 59, 0.05)',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ margin: '0 0 12px 0', fontSize: '56px' }}>🛑</h2>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800' }}>403 - Access Denied</h3>
      <p style={{ margin: '0 0 24px 0', color: '#6B7280', fontSize: '15px', lineHeight: '1.5' }}>
        You do not possess the required structural security clearance parameters to view this dashboard panel layer.
      </p>
      <button 
        onClick={() => window.location.href = '/login'}
        style={{ 
          padding: '12px 24px', 
          background: '#1E293B', 
          color: '#FAF7F2', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(30, 41, 59, 0.15)'
        }}
      >
        Return to Gateway Secure Log In
      </button>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* SECURE ENCLAVE 1: System Administrators Only */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* SECURE ENCLAVE 2: Registered Customers Only */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>

        {/* SECURE ENCLAVE 3: Corporate Store Owners Only */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;