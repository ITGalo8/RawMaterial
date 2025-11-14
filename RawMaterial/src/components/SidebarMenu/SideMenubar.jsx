import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import {
  FaWarehouse,
  FaPlus,
  FaBox,
  FaCogs,
  FaClipboardList,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaSignOutAlt,
} from "react-icons/fa";
import "./SidebarMenu.css";

const SideMenubar = () => {
  const [openMenus, setOpenMenus] = useState({
    company: false,
    vendor: false,
    purchase: false,
  });

  const { user, logout } = useUser();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const lineWorkerRoles = [
    "MPC Work",
    "Assemble",
    "Disassemble",
    "Stamping",
    "Testing",
    "Winding",
    "Winding Connection",
  ];

  if (!user) return <div className="sidebar">Loading...</div>;

  return (
    <div className="sidebar">
      {/* User Profile */}
      <div className="user-profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser className="avatar-icon" />
          </div>
          <div className="profile-info">
            <div className="user-name">{user.name || user.email}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <ul className="sidebar-list">

        {/* Line Worker Item Request */}
        {lineWorkerRoles.includes(user.role) && (
          <li>
            <NavLink to="Item-Request" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaWarehouse /> Item Request
            </NavLink>
          </li>
        )}

        {/* Store Menu */}
        {user.role === "Store" && (
          <>
            <li>
              <NavLink to="store-keeper" className={({ isActive }) => (isActive ? "active" : "")}>
                <FaClipboardList /> Approval Request
              </NavLink>
            </li>

            <li>
              <NavLink to="user-stock-data" className={({ isActive }) => (isActive ? "active" : "")}>
                <FaBox /> User Stock Data
              </NavLink>
            </li>

            <li>
              <NavLink to="stock-update" className={({ isActive }) => (isActive ? "active" : "")}>
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

        {/* Admin Dashboard */}
        {(user.role === "Superadmin" ||
          user.role === "Testing" ||
          user.role === "Admin") && (
          <li>
            <NavLink to="admin-dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaCogs /> Admin Dashboard
            </NavLink>
          </li>
        )}

        {/* Purchase Panel */}
        {user.role === "Purchase" && (
          <>
            {/* Company */}
            <li className="menu-item-with-dropdown">
              <div className="menu-header" onClick={() => toggleMenu("company")}>
                <span className="menu-title">
                  <FaBuilding /> Company
                </span>
                <span className="menu-arrow">
                  {openMenus.company ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              {openMenus.company && (
                <ul className="submenu">
                  <li>
                    <NavLink to="add-company">Add Company</NavLink>
                  </li>
                  <li>
                    <NavLink to="update-company">Update Company</NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* Vendor */}
            <li className="menu-item-with-dropdown">
              <div className="menu-header" onClick={() => toggleMenu("vendor")}>
                <span className="menu-title">
                  <FaBuilding /> Vendor
                </span>
                <span className="menu-arrow">
                  {openMenus.vendor ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              {openMenus.vendor && (
                <ul className="submenu">
                  <li>
                    <NavLink to="add-vendor">Add Vendor</NavLink>
                  </li>
                  <li>
                    <NavLink to="update-vendor">Update Vendor</NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* Purchase */}
            <li className="menu-item-with-dropdown">
              <div className="menu-header" onClick={() => toggleMenu("purchase")}>
                <span className="menu-title">
                  <FaBuilding /> Purchase
                </span>
                <span className="menu-arrow">
                  {openMenus.purchase ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              {openMenus.purchase && (
                <ul className="submenu">
                  <li>
                    <NavLink to="create-purchase-order">Create Purchase Order</NavLink>
                  </li>
                  <li>
                    <NavLink to="show-purchase-orders">Show Purchase Orders</NavLink>
                  </li>
                </ul>
              )}
            </li>
          </>
        )}

        {/* Service Process Request (MOVED OUTSIDE purchase block & FIXED) */}
        {(user.role === "MPC Work" || user.role === "Disassemble") && (
          <li>
            <NavLink
              to="service-process-request"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCogs /> Service Process Request
            </NavLink>
          </li>
        )}
      </ul>

      {/* Logout Button */}
      <div className="logout-section">
        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default SideMenubar;
