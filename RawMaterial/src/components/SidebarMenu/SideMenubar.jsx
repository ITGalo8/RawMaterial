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

  // Allowed roles for Line Worker menu
  const lineWorkerRoles = [
    "MPC Work",
    "Assemble",
    "Diassemble",
    "Stamping",
    "Store",
    "Testing",
    "Winding",
    "Winding Connection",
  ];

  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        {lineWorkerRoles.includes(role) && (
          <li>
            <NavLink to="lineworker-dashboard">
              <FaWarehouse /> Line Worker Dashboard
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SideMenubar;
