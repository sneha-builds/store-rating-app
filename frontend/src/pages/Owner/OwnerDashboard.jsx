// // src/pages/Owner/OwnerDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import API from '../../api';
// import { useAuth } from '../../context/AuthContext';

// const OwnerDashboard = () => {
//   const { logout } = useAuth();
//   const [storeData, setStoreData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [passwordForm, setPasswordForm] = useState({ newPassword: '' });
//   const [msg, setMsg] = useState({ type: '', text: '' });
//   const [showPasswordTab, setShowPasswordTab] = useState(false);

//   const fetchOwnerAnalytics = async () => {
//     try {
//       const res = await API.get('/api/owner/dashboard');
//       setStoreData(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to retrieve your store analysis.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOwnerAnalytics();
//   }, []);

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault();
//     setMsg({ type: '', text: '' });
//     try {
//       await API.put('/api/owner/update-password', passwordForm);
//       setMsg({ type: 'success', text: 'Owner password updated successfully!' });
//       setPasswordForm({ newPassword: '' });
//     } catch (err) {
//       setMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed.' });
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ 
//         backgroundColor: '#FAF7F2', 
//         minHeight: '100vh', 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         fontFamily: 'sans-serif', 
//         color: '#1E293B',
//         fontWeight: '600'
//       }}>
//         Loading your store portal...
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       backgroundColor: '#FAF7F2', 
//       minHeight: '100vh', 
//       padding: '4vw', 
//       maxWidth: '1250px', 
//       margin: '0 auto', 
//       fontFamily: 'sans-serif',
//       boxSizing: 'border-box',
//       color: '#1E293B'
//     }}>
//       {/* Header Panel */}
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         borderBottom: '2px solid #1E293B', 
//         paddingBottom: '16px',
//         marginBottom: '24px',
//         flexWrap: 'wrap',
//         gap: '16px'
//       }}>
//         <div>
//           <h2 style={{ margin: '0', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800' }}> Business Owner Portal</h2>
//           {storeData && <p style={{ margin: '6px 0 0 0', color: '#6B7280', fontSize: '15px' }}>Managing: <strong style={{ color: '#1E293B' }}>{storeData.storeName}</strong></p>}
//         </div>
//         <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//           <button 
//             onClick={() => {
//               setShowPasswordTab(!showPasswordTab);
//               setMsg({ type: '', text: '' });
//             }} 
//             style={{ 
//               padding: '10px 18px', 
//               background: '#FFFFFF', 
//               color: '#1E293B', 
//               border: '1px solid #E5E7EB', 
//               borderRadius: '8px', 
//               cursor: 'pointer',
//               fontWeight: '600',
//               fontSize: '14px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
//             }}
//           >
//             {showPasswordTab ? 'Back to Analytics' : 'Change Password'}
//           </button>
//           <button 
//             onClick={logout} 
//             style={{ 
//               padding: '10px 18px', 
//               background: '#1E293B', 
//               color: '#FAF7F2', 
//               border: 'none', 
//               borderRadius: '8px', 
//               cursor: 'pointer',
//               fontWeight: '600',
//               fontSize: '14px',
//               boxShadow: '0 4px 12px rgba(30, 41, 59, 0.1)'
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Notifications and Error Banners */}
//       {msg.text && (
//         <div style={{ 
//           padding: '14px', 
//           marginBottom: '24px', 
//           borderRadius: '8px', 
//           fontWeight: '600',
//           background: '#FFFFFF', 
//           borderLeft: `5px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`,
//           color: '#1E293B',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
//         }}>
//           {msg.type === 'success' ? '✅' : '❌'} {msg.text}
//         </div>
//       )}

//       {error && (
//         <div style={{ 
//           padding: '16px', 
//           background: '#FFFFFF', 
//           color: '#1E293B', 
//           borderLeft: '5px solid #F59E0B',
//           marginBottom: '24px', 
//           borderRadius: '8px',
//           fontWeight: '600',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
//         }}>
//           ⚠️ {error}
//         </div>
//       )}

//       {/* CONDITIONAL WINDOW: CHANGE PASSWORD */}
//       {showPasswordTab ? (
//         <div style={{ 
//           maxWidth: '420px', 
//           margin: '40px auto', 
//           padding: '28px', 
//           background: '#FFFFFF',
//           borderRadius: '16px',
//           boxShadow: '0 10px 30px rgba(30, 41, 59, 0.03)',
//           boxSizing: 'border-box'
//         }}>
//           <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>Update Business Password</h3>
//           <form onSubmit={handlePasswordUpdate}>
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280' }}>New Password:</label>
//               <input 
//                 type="password" 
//                 required 
//                 placeholder="8-16 chars, 1 Upper, 1 Special" 
//                 value={passwordForm.newPassword} 
//                 onChange={(e) => setPasswordForm({ newPassword: e.target.value })} 
//                 style={{ 
//                   width: '100%', 
//                   padding: '12px', 
//                   marginTop: '6px',
//                   borderRadius: '8px',
//                   border: '1px solid #E5E7EB',
//                   backgroundColor: '#FAF7F2',
//                   color: '#1E293B',
//                   boxSizing: 'border-box',
//                   outline: 'none'
//                 }} 
//               />
//             </div>
//             <button 
//               type="submit" 
//               style={{ 
//                 width: '100%', 
//                 padding: '12px', 
//                 background: '#1E293B', 
//                 color: '#FAF7F2', 
//                 border: 'none', 
//                 borderRadius: '8px', 
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 boxShadow: '0 4px 12px rgba(30, 41, 59, 0.1)'
//               }}
//             >
//               Save New Password
//             </button>
//           </form>
//         </div>
//       ) : (
//         /* MAIN VIEW: METRICS & REVIEW LIST */
//         storeData && (
//           <div style={{ marginTop: '20px' }}>
//             {/* Store Score Banner */}
//             <div style={{ 
//               background: '#FFFFFF', 
//               borderTop: '4px solid #F59E0B', 
//               padding: '28px 24px', 
//               borderRadius: '16px', 
//               marginBottom: '36px',
//               boxShadow: '0 10px 25px -5px rgba(30, 41, 59, 0.03)'
//             }}>
//               <h4 style={{ margin: '0 0 8px 0', color: '#6B7280', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Performance</h4>
//               <p style={{ margin: '0', fontSize: '38px', fontWeight: '800', color: '#1E293B' }}>
//                 {storeData.averageRating > 0 ? `★ ${storeData.averageRating} / 5` : 'No Ratings Yet'}
//               </p>
//             </div>

//             {/* Reviewers Data Table */}
//             <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Customer Feedback Log</h3>
            
//             {/* Mobile Touch Responsive Table Scroller Pane */}
//             <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
//               <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
//                 <thead>
//                   <tr style={{ textAlign: 'left' }}>
//                     <th style={{ padding: '16px', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Customer Name</th>
//                     <th style={{ padding: '16px', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Email</th>
//                     <th style={{ padding: '16px', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Address</th>
//                     <th style={{ padding: '16px', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Rating Given</th>
//                     <th style={{ padding: '16px', color: '#1E293B', fontWeight: '700', borderBottom: '2px solid #1E293B' }}>Date Submitted</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {storeData.reviewers.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#6B7280', backgroundColor: '#FFFFFF' }}>
//                         No feedback submissions have been registered for your establishment yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     storeData.reviewers.map((rev, index) => (
//                       <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAF7F2' }}>
//                         <td style={{ padding: '16px', color: '#1E293B', fontWeight: '600' }}>{rev.name}</td>
//                         <td style={{ padding: '16px', color: '#6B7280' }}>{rev.email}</td>
//                         <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>{rev.address}</td>
//                         <td style={{ padding: '16px', color: '#F59E0B', fontWeight: '800', fontSize: '16px' }}>★ {rev.rating_value}</td>
//                         <td style={{ padding: '16px', color: '#6B7280', fontSize: '13px' }}>{new Date(rev.updated_at).toLocaleDateString()}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default OwnerDashboard;


// src/pages/Owner/OwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useSystemTheme } from '../../hooks/useSystemTheme';

const OwnerDashboard = () => {
  const { logout } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showPasswordTab, setShowPasswordTab] = useState(false);
  const theme = useSystemTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchOwnerAnalytics = async () => {
      try {
        const res = await API.get('/api/owner/dashboard');
        setStoreData(res.data);
      } catch (err) { setError('Failed to retrieve analytics.'); } finally { setLoading(false); }
    };
    fetchOwnerAnalytics();
  }, []);

  if (loading) return <div style={{ backgroundColor: isDark ? '#000000' : '#FAF7F2', minHeight: '100vh', color: '#FFF', padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ 
      backgroundColor: isDark ? '#000000' : '#FAF7F2', 
      minHeight: '100vh', padding: '4vw', maxWidth: '1250px', margin: '0 auto', fontFamily: 'sans-serif', color: isDark ? '#FFFFFF' : '#1E293B', transition: 'background-color 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${isDark ? '#F59E0B' : '#1E293B'}`, paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0', color: isDark ? '#F59E0B' : '#1E293B' }}>🏪 Business Owner Portal</h2>
          {storeData && <p style={{ color: '#6B7280' }}>Managing: {storeData.storeName}</p>}
        </div>
        <button onClick={logout} style={{ padding: '10px 18px', background: isDark ? '#F59E0B' : '#1E293B', color: isDark ? '#000000' : '#FAF7F2', border: 'none', borderRadius: '8px', fontWeight: '700' }}>Logout</button>
      </div>

      {storeData && !showPasswordTab && (
        <div>
          <div style={{ background: isDark ? '#121212' : '#FFFFFF', borderTop: '4px solid #F59E0B', padding: '28px 24px', borderRadius: '16px', marginBottom: '36px' }}>
            <h4 style={{ margin: '0', color: '#6B7280' }}>Current Performance</h4>
            <p style={{ margin: '10px 0 0 0', fontSize: '38px', fontWeight: '800', color: isDark ? '#F59E0B' : '#1E293B' }}>★ {storeData.averageRating || 'Unrated'}</p>
          </div>

          <div style={{ width: '100%', overflowX: 'auto', borderRadius: '12px' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: isDark ? '#F59E0B' : '#1E293B' }}>
                  <th style={{ padding: '16px' }}>Customer</th>
                  <th style={{ padding: '16px' }}>Rating</th>
                  <th style={{ padding: '16px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {storeData.reviewers.map((rev, index) => (
                  <tr key={index} style={{ backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{rev.name}</td>
                    <td style={{ padding: '16px', color: '#F59E0B', fontWeight: '800' }}>★ {rev.rating_value}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{new Date(rev.updated_at).toLocaleDateString()}</td>
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

export default OwnerDashboard;