// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaWarehouse,
//   FaPlus,
//   FaBox,
//   FaCogs,
//   FaClipboardList,
//   FaTools,
//   FaTimesCircle,
//   FaIndustry,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import "./SidebarMenu.css";

// const SideMenubar = ({ role }) => {
//   const [openMenus, setOpenMenus] = useState({
//     repair: false,
//     reject: false,
//     production: false,
//     bom: false,
//   });

//   const toggleMenu = (menu) => {
//     setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
//   };

//   // Allowed roles for Line Worker menu (excluding Store and Admin)
//   const lineWorkerRoles = [
//     "MPC Work",
//     "Assemble",
//     "Diassemble",
//     "Stamping",
//     "Testing",
//     "Winding",
//     "Winding Connection",
//   ];

//   return (
//     <div className="sidebar">
//       <ul className="sidebar-list">
//         {/* Line Worker Dashboard - NOT shown for Store and Admin roles */}
//         {lineWorkerRoles.includes(role) && (
//           <li>
//             <NavLink to="lineworker-dashboard">
//               <FaWarehouse /> Line Worker Dashboard
//             </NavLink>
//           </li>
//         )}

//         {/* StoreKeeper page only visible for Store role */}
//         {role === "Store" && (
//           <li>
//             <NavLink to="store-keeper">
//               <FaWarehouse /> Approval Request
//             </NavLink>

//              <NavLink to="user-stock-data">
//               <FaWarehouse /> User Stock Data
//             </NavLink>

//              <NavLink to="stock-update">
//               <FaWarehouse /> Stock Update
//             </NavLink>

//             <NavLink to="stock-update-history">
//               <FaWarehouse /> Stock Update History
//             </NavLink>

//           </li>
//         )}

//         {/* Additional menus for Superadmin and Testing roles */}
//         {(role === "Superadmin" || role === "Testing") && (
//           <li>
//             <NavLink to="admin-dashboard">
//               <FaCogs /> Admin Dashboard
//             </NavLink>
//           </li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default SideMenubar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import {
  FaWarehouse,
  FaPlus,
  FaBox,
  FaCogs,
  FaClipboardList,
  FaTools,
  FaTimesCircle,
  FaIndustry,
  FaSignOutAlt,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "./SidebarMenu.css";

const SideMenubar = () => {
  const [openMenus, setOpenMenus] = useState({
    repair: false,
    reject: false,
    production: false,
    bom: false,
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useUser();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Allowed roles for Line Worker menu (excluding Store and Admin)
  const lineWorkerRoles = [
    "MPC Work",
    "Assemble",
    "Diassemble",
    "Stamping",
    "Testing",
    "Winding",
    "Winding Connection",
  ];

  if (!user) {
    return <div className="sidebar">Loading...</div>;
  }

  return (
    <div className="sidebar">
      {/* User Profile Section */}
      <div className="user-profile-section">
        <div className="profile-header" onClick={toggleProfile}>
          <div className="profile-avatar">
            <FaUser className="avatar-icon" />
          </div>
          <div className="profile-info">
            <div className="user-name">{user.name || user.email}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="sidebar-list">
        {/* Line Worker Dashboard - NOT shown for Store and Admin roles */}
        {lineWorkerRoles.includes(user.role) && (
          <li>
            <NavLink
              to="lineworker-dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaWarehouse /> Line Worker Dashboard
            </NavLink>
          </li>
        )}

        {/* StoreKeeper pages only visible for Store role */}
        {user.role === "Store" && (
          <>
            <li>
              <NavLink
                to="store-keeper"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaClipboardList /> Approval Request
              </NavLink>
            </li>
            <li>
              <NavLink
                to="user-stock-data"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaBox /> User Stock Data
              </NavLink>
            </li>
            <li>
              <NavLink
                to="stock-update"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaPlus /> Stock Update
              </NavLink>
            </li>
            <li>
              <NavLink
                to="stock-update-history"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaClipboardList /> Stock Update History
              </NavLink>
            </li>
          </>
        )}

        {/* Additional menus for Superadmin and Testing roles */}
        {(user.role === "Superadmin" || user.role === "Testing") && (
          <li>
            <NavLink
              to="admin-dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCogs /> Admin Dashboard
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SideMenubar;
