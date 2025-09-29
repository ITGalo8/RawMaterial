import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
} from "react-icons/fa";
import "./SidebarMenu.css";

const SideMenubar = ({ role }) => {
  const [openMenus, setOpenMenus] = useState({
    repair: false,
    reject: false,
    production: false,
    bom: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
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

  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        {/* Line Worker Dashboard - NOT shown for Store and Admin roles */}
        {lineWorkerRoles.includes(role) && (
          <li>
            <NavLink to="lineworker-dashboard">
              <FaWarehouse /> Line Worker Dashboard
            </NavLink>
          </li>
        )}

        {/* StoreKeeper page only visible for Store role */}
        {role === "Store" && (
          <li>
            <NavLink to="store-keeper">
              <FaWarehouse /> Approval Request
            </NavLink>

             <NavLink to="user-stock-data">
              <FaWarehouse /> User Stock Data
            </NavLink>

             <NavLink to="stock-update">
              <FaWarehouse /> Stock Update
            </NavLink>

            <NavLink to="stock-update-history">
              <FaWarehouse /> Stock Update History
            </NavLink>

            
          </li>
        )}

        {/* Additional menus for Superadmin and Testing roles */}
        {(role === "Superadmin" || role === "Testing") && (
          <li>
            <NavLink to="admin-dashboard">
              <FaCogs /> Admin Dashboard
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SideMenubar;