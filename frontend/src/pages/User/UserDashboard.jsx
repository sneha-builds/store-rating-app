// // src/pages/User/UserDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import API from '../../api';
// import { useAuth } from '../../context/AuthContext';

// const UserDashboard = () => {
//   const { logout } = useAuth();
//   const [stores, setStores] = useState([]);
//   const [filters, setFilters] = useState({ name: '', address: '', sortBy: 'name', order: 'ASC' });
//   const [passwordForm, setPasswordForm] = useState({ newPassword: '' });
//   const [msg, setMsg] = useState({ type: '', text: '' });
//   const [showPasswordTab, setShowPasswordTab] = useState(false);

//   const fetchStores = async () => {
//     try {
//       const params = new URLSearchParams(filters).toString();
//       const res = await API.get(`/api/user/stores?${params}`);
//       setStores(res.data);
//     } catch (err) {
//       console.error('Error loading directory data:', err);
//     }
//   };

//   useEffect(() => {
//     fetchStores();
//   }, [filters]);

//   const handleRatingSubmit = async (storeId, score) => {
//     try {
//       await API.post(`/api/user/stores/${storeId}/rate`, { ratingValue: score });
//       fetchStores(); // Refresh local list state data to update averages instantly
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to record rating.');
//     }
//   };

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault();
//     setMsg({ type: '', text: '' });
//     try {
//       await API.put('/api/user/update-password', passwordForm);
//       setMsg({ type: 'success', text: 'Password updated successfully!' });
//       setPasswordForm({ newPassword: '' });
//     } catch (err) {
//       setMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed.' });
//     }
//   };

//   const toggleSort = (field) => {
//     const isAsc = filters.sortBy === field && filters.order === 'ASC';
//     setFilters({ ...filters, sortBy: field, order: isAsc ? 'DESC' : 'ASC' });
//   };

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
//         <h2 style={{ margin: '0', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800' }}> Verified Customer Marketplace</h2>
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
//             {showPasswordTab ? 'Back to Stores' : 'Change Password'}
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

//       {/* Dynamic Notifications */}
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

//       {/* CONDITIONAL COMPONENT: PASSWORD REMODEL WINDOW */}
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
//           <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>Update Your Secure Password</h3>
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
//               Commit Changes
//             </button>
//           </form>
//         </div>
//       ) : (
//         /* MAIN COMPONENT: STORE BROWSER CARDS */
//         <div style={{ marginTop: '20px' }}>
//           {/* Active Search & Filtering Bars */}
//           <div style={{ 
//             display: 'flex', 
//             gap: '12px', 
//             marginBottom: '32px', 
//             background: '#FFFFFF', 
//             padding: '16px', 
//             borderRadius: '14px',
//             flexWrap: 'wrap',
//             boxShadow: '0 4px 20px rgba(30, 41, 59, 0.02)'
//           }}>
//             <input 
//               type="text" 
//               placeholder="🔍 Search stores by name..." 
//               value={filters.name} 
//               onChange={(e) => setFilters({ ...filters, name: e.target.value })} 
//               style={{ padding: '12px 16px', flex: '1 1 250px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }} 
//             />
//             <input 
//               type="text" 
//               placeholder="📍 Search by address..." 
//               value={filters.address} 
//               onChange={(e) => setFilters({ ...filters, address: e.target.value })} 
//               style={{ padding: '12px 16px', flex: '1 1 250px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FAF7F2', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }} 
//             />
//             <button 
//               onClick={() => toggleSort('overall_rating')} 
//               style={{ 
//                 padding: '12px 20px', 
//                 cursor: 'pointer', 
//                 background: '#FFFFFF', 
//                 color: '#1E293B',
//                 border: '1px solid #E5E7EB', 
//                 borderRadius: '8px',
//                 fontWeight: '600',
//                 fontSize: '14px',
//                 flex: '1 1 auto'
//               }}
//             >
//               Sort by Rating {filters.sortBy === 'overall_rating' ? (filters.order === 'ASC' ? '🔼' : '🔽') : '↕'}
//             </button>
//           </div>

//           {/* Responsive CSS Grid Auto-Layout */}
//           <div style={{ 
//             display: 'grid', 
//             gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', 
//             gap: '24px' 
//           }}>
//             {stores.length === 0 ? (
//               <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6B7280', padding: '40px 0' }}>No registered establishments match your query.</p>
//             ) : stores.map(store => (
//               <div 
//                 key={store.id} 
//                 style={{ 
//                   padding: '24px', 
//                   borderRadius: '16px', 
//                   backgroundColor: '#FFFFFF', 
//                   boxShadow: '0 10px 30px -5px rgba(30, 41, 59, 0.03), 0 4px 12px -2px rgba(30, 41, 59, 0.01)', 
//                   display: 'flex', 
//                   flexDirection: 'column', 
//                   justifyContent: 'space-between'
//                 }}
//               >
//                 <div>
//                   <h3 style={{ margin: '0 0 6px 0', fontSize: '19px', color: '#1E293B', fontWeight: '700' }}>{store.name}</h3>
//                   <p style={{ margin: '0 0 20px 0', color: '#6B7280', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {store.address}</p>
//                 </div>
                
//                 <div>
//                   {/* Visual Average Score Section */}
//                   <div style={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center', 
//                     borderTop: '1px solid #FAF7F2', 
//                     paddingTop: '16px', 
//                     marginBottom: '16px' 
//                   }}>
//                     <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>Community Rating</span>
//                     <span style={{ color: '#F59E0B', fontWeight: '700', fontSize: '15px' }}>
//                       {store.overall_rating > 0 ? `★ ${store.overall_rating} / 5` : 'No reviews'}
//                     </span>
//                   </div>

//                   {/* Interactive Star Selection Bar */}
//                   <div style={{ backgroundColor: '#FAF7F2', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
//                     <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#1E293B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
//                       {store.user_submitted_rating > 0 ? `Your Rating: ${store.user_submitted_rating} ★` : 'Tap stars to submit feedback'}
//                     </p>
//                     <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
//                       {[1, 2, 3, 4, 5].map(star => (
//                         <span
//                           key={star}
//                           onClick={() => handleRatingSubmit(store.id, star)}
//                           style={{
//                             fontSize: '26px',
//                             cursor: 'pointer',
//                             color: star <= (store.user_submitted_rating || 0) ? '#F59E0B' : '#E5E7EB',
//                             transition: 'transform 0.1s ease, color 0.1s ease',
//                             display: 'inline-block'
//                           }}
//                           onMouseEnter={(e) => e.target.style.transform = 'scale(1.15)'}
//                           onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
//                           title={`Rate ${star} Stars`}
//                         >
//                           ★
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;




// src/pages/User/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useSystemTheme } from '../../hooks/useSystemTheme';

const UserDashboard = () => {
  const { logout } = useAuth();
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '', sortBy: 'name', order: 'ASC' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showPasswordTab, setShowPasswordTab] = useState(false);
  const theme = useSystemTheme();
  const isDark = theme === 'dark';

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`/api/user/stores?${params}`);
      setStores(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStores(); }, [filters]);

  const handleRatingSubmit = async (storeId, score) => {
    try {
      await API.post(`/api/user/stores/${storeId}/rate`, { ratingValue: score });
      fetchStores();
    } catch (err) { alert('Failed to record rating.'); }
  };

  return (
    <div style={{ 
      backgroundColor: isDark ? '#000000' : '#FAF7F2', 
      minHeight: '100vh', padding: '4vw', maxWidth: '1250px', margin: '0 auto', fontFamily: 'sans-serif', color: isDark ? '#FFFFFF' : '#1E293B', transition: 'background-color 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${isDark ? '#F59E0B' : '#1E293B'}`, paddingBottom: '16px', marginBottom: '24px' }}>
        <h2 style={{ margin: '0', fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: '800', color: isDark ? '#F59E0B' : '#1E293B' }}>👤 Customer Marketplace</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowPasswordTab(!showPasswordTab)} style={{ padding: '10px 18px', background: isDark ? '#121212' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E293B', border: '1px solid #E5E7EB', borderRadius: '8px' }}>Password</button>
          <button onClick={logout} style={{ padding: '10px 18px', background: isDark ? '#F59E0B' : '#1E293B', color: isDark ? '#000000' : '#FAF7F2', border: 'none', borderRadius: '8px', fontWeight: '700' }}>Logout</button>
        </div>
      </div>

      {!showPasswordTab && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', background: isDark ? '#121212' : '#FFFFFF', padding: '16px', borderRadius: '14px' }}>
            <input type="text" placeholder="🔍 Search by name..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} style={{ padding: '12px 16px', flex: '1 1 250px', borderRadius: '8px', border: '1px solid #333', backgroundColor: isDark ? '#1E1E1E' : '#FAF7F2', color: '#FFF' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
            {stores.map(store => (
              <div key={store.id} style={{ padding: '24px', borderRadius: '16px', backgroundColor: isDark ? '#121212' : '#FFFFFF', border: isDark ? '1px solid #222' : 'none' }}>
                <h3 style={{ margin: '0 0 6px 0', color: isDark ? '#F59E0B' : '#1E293B' }}>{store.name}</h3>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>📍 {store.address}</p>
                <div style={{ backgroundColor: isDark ? '#1E1E1E' : '#FAF7F2', padding: '14px', borderRadius: '12px', textAlign: 'center', marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} onClick={() => handleRatingSubmit(store.id, star)} style={{ fontSize: '26px', cursor: 'pointer', color: star <= (store.user_submitted_rating || 0) ? '#F59E0B' : '#444' }}>★</span>
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