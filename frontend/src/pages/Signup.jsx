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
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '25px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Normal User Registration</h2>
      {success && <p style={{ color: 'green', fontWeight: 'bold' }}>Success! Redirecting to login portal...</p>}
      {serverError && <p style={{ color: 'red', background: '#fff0f0', padding: '8px' }}>{serverError}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name (Min 20 chars):</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          {uiErrors.name && <small style={{ color: 'red' }}>{uiErrors.name}</small>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email Address:</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Physical Address (Max 400 chars):</label>
          <textarea name="address" required value={formData.address} onChange={handleChange} rows="3" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          {uiErrors.address && <small style={{ color: 'red' }}>{uiErrors.address}</small>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password (8-16 chars, 1 Upper, 1 Special):</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          {uiErrors.password && <small style={{ color: 'red' }}>{uiErrors.password}</small>}
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28A745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Complete Registration
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already possess an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;