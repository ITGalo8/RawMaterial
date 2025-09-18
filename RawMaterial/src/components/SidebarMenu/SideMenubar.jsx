import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaWarehouse,
  FaPlus,
  FaBox,
  FaCogs,
  FaClipboardList,
  FaTools,
  FaHistory,
  FaTimesCircle,
  FaIndustry,
} from "react-icons/fa";
import "./SidebarMenu.css";

const SideMenubar = () => {
  const [openMenus, setOpenMenus] = useState({
    repair: false,
    reject: false,
    production: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-list">

        <li>
          <NavLink to="/dashboard">
            {/* <FaWarehouse /> */}
          </NavLink>
        </li>
        <li>
          <NavLink to="/raw-material-stock">
            <FaWarehouse /> Raw Material Stock
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-raw-material">
            <FaPlus /> Add Raw Material
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-item">
            <FaBox /> Add Item
          </NavLink>
        </li>
        <li>
          <NavLink to="/product-bom">
            <FaCogs /> Product Bom
          </NavLink>
        </li>
        <li>
          <NavLink to="/product-count">
            <FaClipboardList /> Product Count
          </NavLink>
        </li>

        {/* Repair Data */}
        <li onClick={() => toggleMenu("repair")} className="dropdown">
          <span>
            <FaTools /> Repair Data
          </span>
          {openMenus.repair && (
            <ul className="submenu">
              <li>
                <NavLink to="/repair/form">Repair Form</NavLink>
              </li>
              <li>
                <NavLink to="/repair/history">Repair History</NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Reject Data */}
        <li onClick={() => toggleMenu("reject")} className="dropdown">
          <span>
            <FaTimesCircle /> Reject Data
          </span>
          {openMenus.reject && (
            <ul className="submenu">
              <li>
                <NavLink to="/reject/form">Reject Form</NavLink>
              </li>
              <li>
                <NavLink to="/reject/history">Reject History</NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* New Production */}
        <li onClick={() => toggleMenu("production")} className="dropdown">
          <span>
            <FaIndustry /> New Production
          </span>
          {openMenus.production && (
            <ul className="submenu">
              <li>
                <NavLink to="/production/form">New Production Form</NavLink>
              </li>
              <li>
                <NavLink to="/production/history">New Production History</NavLink>
              </li>
            </ul>
          )}
        </li>

        <li>
          <NavLink to="/logout">
            <FaClipboardList /> Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideMenubar;
