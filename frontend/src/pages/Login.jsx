// // src/pages/Login.jsx
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import API from '../api';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await API.post('/auth/login', { email, password });
//       const { user, token } = response.data;
      
//       // Save data into context state
//       login(user, token);

//       // Programmatic Redirect based on the returned user role payload
//       if (user.role === 'admin') navigate('/admin/dashboard');
//       else if (user.role === 'owner') navigate('/owner/dashboard');
//       else navigate('/user/dashboard');

//     } catch (err) {
//       setError(err.response?.data?.message || 'Authentication failed. Check your inputs.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       backgroundColor: '#FAF7F2', // Soothing warm cream canvas
//       minHeight: '100vh',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: '20px',
//       fontFamily: 'sans-serif',
//       boxSizing: 'border-box',
//       color: '#1E293B'
//     }}>
//       {/* Floating Authentication Card Container */}
//       <div style={{
//         width: '100%',
//         maxWidth: '440px',
//         background: '#FFFFFF', // Pure white card
//         padding: '40px 32px',
//         borderRadius: '20px',
//         boxShadow: '0 20px 40px -15px rgba(30, 41, 59, 0.05), 0 1px 3px rgba(30, 41, 59, 0.01)',
//         boxSizing: 'border-box'
//       }}>
        
//         {/* App Branding Header */}
//         <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//           <h2 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: '#1E293B' }}>
//             Unified Portal Login
//           </h2>
//           <p style={{ margin: '0', color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>
//             Access your multi-role platform instance
//           </p>
//         </div>

//         {/* Dynamic Error/Success Alerts */}
//         {error && (
//           <div style={{ 
//             padding: '12px 14px', 
//             marginBottom: '20px', 
//             borderRadius: '8px', 
//             fontSize: '14px',
//             fontWeight: '600',
//             background: '#FFFFFF', 
//             borderLeft: '4px solid #EF4444',
//             color: '#1E293B',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
//           }}>
//             ⚠️ {error}
//           </div>
//         )}

//         {/* Main Credentials Form */}
//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
//           {/* Email Input Field Block */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//             <label style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//               Email Address
//             </label>
//             <input 
//               type="email" 
//               required 
//               placeholder="name@company.com" 
//               value={email} 
//               onChange={(e) => setEmail(e.target.value)} 
//               style={{ 
//                 width: '100%',
//                 padding: '14px 16px', 
//                 borderRadius: '8px', 
//                 border: '1px solid #E5E7EB', 
//                 backgroundColor: '#FAF7F2', // Recessed slightly into the card
//                 color: '#1E293B',
//                 fontSize: '15px',
//                 outline: 'none',
//                 boxSizing: 'border-box'
//               }} 
//             />
//           </div>

//           {/* Password Input Field Block */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//             <label style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//               Secure Password
//             </label>
//             <input 
//               type="password" 
//               required 
//               placeholder="••••••••••••" 
//               value={password} 
//               onChange={(e) => setPassword(e.target.value)} 
//               style={{ 
//                 width: '100%',
//                 padding: '14px 16px', 
//                 borderRadius: '8px', 
//                 border: '1px solid #E5E7EB', 
//                 backgroundColor: '#FAF7F2',
//                 color: '#1E293B',
//                 fontSize: '15px',
//                 outline: 'none',
//                 boxSizing: 'border-box'
//               }} 
//             />
//           </div>

//           {/* Premium Core Action Button */}
//           <button 
//             type="submit" 
//             disabled={loading}
//             style={{ 
//               padding: '14px', 
//               background: '#1E293B', // Beautiful deep slate instead of blue
//               color: '#FAF7F2', 
//               border: 'none', 
//               borderRadius: '8px', 
//               cursor: loading ? 'not-allowed' : 'pointer',
//               fontWeight: '700',
//               fontSize: '15px',
//               marginTop: '10px',
//               opacity: loading ? 0.7 : 1,
//               boxShadow: '0 4px 12px rgba(30, 41, 59, 0.15)',
//               transition: 'background 0.2s'
//             }}
//           >
//             {loading ? 'Authenticating...' : 'Sign In'}
//           </button>
//         </form>

//         {/* Bottom Context Switch Switcher Link */}
//         <p style={{ textAlign: 'center', marginTop: '24px', marginBottom: '0', fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
//           New user?{' '}
//           <Link 
//             to="/signup" 
//             style={{ color: '#1E293B', fontWeight: '700', textDecoration: 'underline' }}
//           >
//             Register here
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Login;


// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useSystemTheme } from '../hooks/useSystemTheme';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useSystemTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      const { user, token } = response.data;
      login(user, token);

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/user/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: isDark ? '#000000' : '#FAF7F2',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      color: isDark ? '#FAF7F2' : '#1E293B',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: isDark ? '#121212' : '#FFFFFF',
        padding: '40px 32px',
        borderRadius: '20px',
        border: isDark ? '1px solid #222222' : 'none',
        boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.7)' : '0 20px 40px -15px rgba(30, 41, 59, 0.05)',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', color: isDark ? '#F59E0B' : '#1E293B' }}>
            Unified Portal Login
          </h2>
          <p style={{ margin: '0', color: isDark ? '#9CA3AF' : '#6B7280', fontSize: '14px' }}>
            Access your multi-role platform instance
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '12px 14px', 
            marginBottom: '20px', 
            borderRadius: '8px', 
            fontSize: '14px',
            fontWeight: '600',
            background: isDark ? '#1A1A1A' : '#FFFFFF', 
            borderLeft: '4px solid #EF4444',
            color: isDark ? '#F87171' : '#1E293B'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: isDark ? '#F59E0B' : '#1E293B', textTransform: 'uppercase' }}>
              Email Address
            </label>
            <input 
              type="email" 
              required 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ 
                width: '100%',
                padding: '14px 16px', 
                borderRadius: '8px', 
                border: isDark ? '1px solid #333333' : '1px solid #E5E7EB', 
                backgroundColor: isDark ? '#1E1E1E' : '#FAF7F2', 
                color: isDark ? '#FFFFFF' : '#1E293B',
                fontSize: '15px',
                outline: 'none'
              }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: isDark ? '#F59E0B' : '#1E293B', textTransform: 'uppercase' }}>
              Secure Password
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ 
                width: '100%',
                padding: '14px 16px', 
                borderRadius: '8px', 
                border: isDark ? '1px solid #333333' : '1px solid #E5E7EB', 
                backgroundColor: isDark ? '#1E1E1E' : '#FAF7F2',
                color: isDark ? '#FFFFFF' : '#1E293B',
                fontSize: '15px',
                outline: 'none'
              }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '14px', 
              background: isDark ? '#F59E0B' : '#1E293B', 
              color: isDark ? '#000000' : '#FAF7F2', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px',
              marginTop: '10px'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', marginBottom: '0', fontSize: '14px', color: isDark ? '#9CA3AF' : '#6B7280' }}>
          New user?{' '}
          <Link to="/signup" style={{ color: isDark ? '#F59E0B' : '#1E293B', fontWeight: '700' }}>
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;