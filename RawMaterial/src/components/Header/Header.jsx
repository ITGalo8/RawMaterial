// // components/Header/Header.js
// import React from 'react';
// import { useUser } from '../../Context/UserContext'
// import './Header.css';

// const Header = () => {
//   const { user, logout } = useUser();

//   return (
//     <header className="header">
//       <div className="header-content">
//         <div className="header-title">
//           <h1>Stock Management System</h1>
//         </div>
        
//         <div className="user-profile">
//           {user && (
//             <div className="user-info">
//               <div className="user-details">
//                 <span className="user-name">{user.name}</span>
//                 <span className="user-role">{user.role}</span>
//               </div>
//               <button onClick={logout} className="logout-btn">
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;