// src/App.jsx
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserDashboard from './pages/User/UserDashboard';
import OwnerDashboard from './pages/Owner/OwnerDashboard';

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Simple temporary dashboard layouts to check verification loops
const AdminDash = () => { const { logout } = useAuth(); return (<div><h2> System Admin View</h2><button onClick={logout}>Log Out</button></div>); };
const UserDash = () => { const { logout } = useAuth(); return (<div><h2> Normal User View</h2><button onClick={logout}>Log Out</button></div>); };
const OwnerDash = () => { const { logout } = useAuth(); return (<div><h2> Store Owner View</h2><button onClick={logout}>Log Out</button></div>); };
const Unauthorized = () => (<div><h2> 403 - Access Denied</h2><p>You do not have administrative clearance to access this panel view.</p></div>);

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