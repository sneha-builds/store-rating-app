// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '' });
  const [uiErrors, setUiErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Instant frontend UX checking before hitting the network
  const validateForm = () => {
    const errors = {};
    if (formData.name.length < 20 || formData.name.length > 60) {
      errors.name = 'Name must be between 20 and 60 characters long.';
    }
    if (formData.address.length > 400) {
      errors.address = 'Address cannot exceed 400 characters.';
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      errors.password = 'Password length must range from 8 to 16 characters.';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must feature at least one uppercase letter.';
    } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      errors.password = 'Password must feature at least one special character.';
    }
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiErrors({});
    setServerError('');

    const validationMatches = validateForm();
    if (Object.keys(validationMatches).length > 0) {
      setUiErrors(validationMatches);
      return;
    }

    try {
      await API.post('/auth/signup', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      // Catch either structural backend express-validator fields array or custom string message
      if (err.response?.data?.errors) {
        const backendValidationMsg = err.response.data.errors.map(el => el.msg).join(' | ');
        setServerError(backendValidationMsg);
      } else {
        setServerError(err.response?.data?.message || 'Registration failed.');
      }
    }
  };

  return (
    <div style={{
      backgroundColor: '#FAF7F2', // Soothing warm cream canvas
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      color: '#1E293B'
    }}>
      {/* Floating Authentication Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '480px', 
        background: '#FFFFFF', 
        padding: '40px 32px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px -15px rgba(30, 41, 59, 0.05), 0 1px 3px rgba(30, 41, 59, 0.01)',
        boxSizing: 'border-box'
      }}>
        
        {/* Registration Title Block */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: '#1E293B' }}>
            Normal User Registration
          </h2>
          <p style={{ margin: '0', color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>
            Create your consumer marketplace profile instance
          </p>
        </div>

        {/* Dynamic Process Notices */}
        {success && (
          <div style={{ 
            padding: '12px 14px', 
            marginBottom: '20px', 
            borderRadius: '8px', 
            fontSize: '14px',
            fontWeight: '600',
            background: '#FFFFFF', 
            borderLeft: '4px solid #10B981',
            color: '#1E293B',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
             Success! Redirecting to login portal...
          </div>
        )}

        {serverError && (
          <div style={{ 
            padding: '12px 14px', 
            marginBottom: '20px', 
            borderRadius: '8px', 
            fontSize: '14px',
            fontWeight: '600',
            background: '#FFFFFF', 
            borderLeft: '4px solid #EF4444',
            color: '#1E293B',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            ⚠️ {serverError}
          </div>
        )}
        
        {/* Main Entry Form Block */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Input Unit: Full Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Full Name (Min 20 characters)
            </label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Your full legal name structure"
              value={formData.name} 
              onChange={handleChange} 
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: uiErrors.name ? '1px solid #EF4444' : '1px solid #E5E7EB', 
                backgroundColor: '#FAF7F2', 
                color: '#1E293B', 
                fontSize: '15px', 
                outline: 'none', 
                boxSizing: 'border-box' 
              }} 
            />
            {uiErrors.name && <small style={{ color: '#EF4444', fontWeight: '600', marginTop: '2px' }}>⚠️ {uiErrors.name}</small>}
          </div>

          {/* Input Unit: Email Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="name@example.com"
              value={formData.email} 
              onChange={handleChange} 
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: '1px solid #E5E7EB', 
                backgroundColor: '#FAF7F2', 
                color: '#1E293B', 
                fontSize: '15px', 
                outline: 'none', 
                boxSizing: 'border-box' 
              }} 
            />
          </div>

          {/* Input Unit: Physical Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Physical Address (Max 400 characters)
            </label>
            <textarea 
              name="address" 
              required 
              rows="3" 
              placeholder="Enter complete residential location data..."
              value={formData.address} 
              onChange={handleChange} 
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: uiErrors.address ? '1px solid #EF4444' : '1px solid #E5E7EB', 
                backgroundColor: '#FAF7F2', 
                color: '#1E293B', 
                fontSize: '15px', 
                outline: 'none', 
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'sans-serif'
              }} 
            />
            {uiErrors.address && <small style={{ color: '#EF4444', fontWeight: '600', marginTop: '2px' }}>⚠️ {uiErrors.address}</small>}
          </div>

          {/* Input Unit: Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password (8-16 chars, 1 Upper, 1 Special)
            </label>
            <input 
              type="password" 
              name="password" 
              required 
              placeholder="••••••••••••"
              value={formData.password} 
              onChange={handleChange} 
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '8px', 
                border: uiErrors.password ? '1px solid #EF4444' : '1px solid #E5E7EB', 
                backgroundColor: '#FAF7F2', 
                color: '#1E293B', 
                fontSize: '15px', 
                outline: 'none', 
                boxSizing: 'border-box' 
              }} 
            />
            {uiErrors.password && <small style={{ color: '#EF4444', fontWeight: '600', marginTop: '2px' }}>⚠️ {uiErrors.password}</small>}
          </div>

          {/* Core Submit Button Accent */}
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: '#1E293B', 
              color: '#FAF7F2', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              marginTop: '12px',
              boxShadow: '0 4px 12px rgba(30, 41, 59, 0.15)',
              transition: 'background 0.2s'
            }}
          >
            Complete Registration
          </button>
        </form>

        {/* Alternate Navigation Routing Anchor Link */}
        <p style={{ textAlign: 'center', marginTop: '28px', marginBottom: '0', fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
          Already possess an account?{' '}
          <Link 
            to="/login" 
            style={{ color: '#1E293B', fontWeight: '700', textDecoration: 'underline' }}
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;