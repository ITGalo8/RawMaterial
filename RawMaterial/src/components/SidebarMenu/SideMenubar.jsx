import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { PiWarehouseBold } from "react-icons/pi";
import { SiUnity } from "react-icons/si";
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
  FaBars,
  FaTimes,
  FaFileInvoice,
} from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { IoStorefrontSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
const SideMenubar = () => {
  const [openMenus, setOpenMenus] = useState({
    company: false,
    vendor: false,
    purchase: false,
    Item: false,
    Payment: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const changePasswordRoles = ["Purchase", "Verification", "Admin", "Accounts"];

  const { user, logout } = useUser();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const lineWorkerRoles = [
    "SFG Work",
    "Assemble",
    "Disassemble",
    "Stamping",
    "Winding",
    "Winding Connection",
  ];

  const PendinglineWorkerRoles = [
    "SFG Work",
    "Assemble",
    "Disassemble",
    "Stamping",
    "Testing",
    "Winding",
    "Winding Connection",
  ];

  if (!user)
    return (
      <div className="w-64 bg-gray-800 text-white h-screen p-4">Loading...</div>
    );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-yellow-400 text-black p-2 rounded-md shadow-lg"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={`w-64 text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col 
          bg-gradient-to-b from-[#F9EA76] to-[#FFF9DD] z-40
          transition-transform duration-300 ease-in-out
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="bg-gray-700 border-b border-gray-600 p-4">
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <FaUser className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white text-base">
                {user.name || user.email}
              </div>
              <div className="text-gray-300 text-sm capitalize">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        <ul className="flex-1 py-5 overflow-y-auto">
          {lineWorkerRoles.includes(user.role) && (
            <li>
              <NavLink
                to="Item-Request"
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                   border-l-4 border-transparent transition-all gap-3 ${
                     isActive
                       ? "bg-yellow-300 text-black border-yellow-600"
                       : ""
                   }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaWarehouse className="text-lg" />
                Item Request
              </NavLink>
            </li>
          )}

          {lineWorkerRoles.includes(user.role) && (
            <li>
              <NavLink
                to="Item-Request-history"
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                   border-l-4 border-transparent transition-all gap-3 ${
                     isActive
                       ? "bg-yellow-300 text-black border-yellow-600"
                       : ""
                   }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaWarehouse className="text-lg" />
                Item Request History
              </NavLink>
            </li>
          )}

          {lineWorkerRoles.includes(user.role) && (
            <li>
              <NavLink
                to="user-Stock"
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                   border-l-4 border-transparent transition-all gap-3 ${
                     isActive
                       ? "bg-yellow-300 text-black border-yellow-600"
                       : ""
                   }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaWarehouse className="text-lg" />
                User Stock Data
              </NavLink>
            </li>
          )}

          {PendinglineWorkerRoles.includes(user.role) && (
            <li>
              <NavLink
                to="pending-process"
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                   border-l-4 border-transparent transition-all gap-3 ${
                     isActive
                       ? "bg-yellow-300 text-black border-yellow-600"
                       : ""
                   }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaWarehouse className="text-lg" />
                Pending Process
              </NavLink>
            </li>
          )}

          {(user.role === "SFG Work" || user.role === "Disassemble") && (
            <>
              <li>
                <NavLink
                  to="service-process-request"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCogs className="text-lg" />
                  Service Process Request
                </NavLink>
              </li>
            </>
          )}

          {/* Store Menu */}
          {user.role === "Store" && (
            <>
              <li>
                <NavLink
                  to="store-keeper"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaClipboardList className="text-lg" />
                  Approval Request
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="single-out"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaClipboardList className="text-lg" />
                  Raw Material Out
                </NavLink>
              </li>

              {/* <li>
                <NavLink
                  to="direct-item-issue-history"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaBox className="text-lg" />
                  Direct Item Issue History
                </NavLink>
              </li> */}

              <li>
                <NavLink
                  to="po-stock-receiving"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaPlus className="text-lg" />
                  PO Stock Receiving
                </NavLink>
              </li>
            </>
          )}

          {/* <li>
            <NavLink
              to="store-tracking"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaClipboardList className="text-lg" />
              Process Tracking
            </NavLink>
          </li> */}

          {(user.role === "Store" || user.role === "Production") && (
            <>
              <li>
                <NavLink
                  to="store-tracking"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IoStorefrontSharp className="text-lg" />
                  Store Tracking
                </NavLink>
              </li>
            </>
          )}

          {/* <li>
            <NavLink
              to="direct-item-issue-history"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaBox className="text-lg" />
              Direct Item Issue History
            </NavLink>
          </li> */}

          {(user.role === "Store" || user.role === "Production") && (
            <>
              <li>
                <NavLink
                  to="user-stock-data"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IoStorefrontSharp className="text-lg" />
                  User Stock History
                </NavLink>
              </li>
            </>
          )}

          {(user.role === "Store" || user.role === "Production") && (
            <>
              <li>
                <NavLink
                  to="direct-item-issue-history"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IoStorefrontSharp className="text-lg" />
                  Direct Item Issue History
                </NavLink>
              </li>
            </>
          )}

          {user.role === "Purchase" && (
            <>
              <li>
                <NavLink
                  to="purchase-dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MdDashboard className="text-lg" />
                  Purchase Dashboard
                </NavLink>
              </li>
            </>
          )}
          

          {user.role === "Verification" && (
            <>
              <li>
                <NavLink
                  to="po-invoice"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaFileInvoice className="text-lg" />
                  PO Invoice
                </NavLink>
              </li>
            </>
          )}

          {user.role === "Admin" && (
            <>
              <li>
                <NavLink
                  to="approval-po-invoice"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaFileInvoice className="text-lg" />
                  PO Approval Invoice
                </NavLink>
              </li>
            </>
          )}

          {(user.role === "Verification" || user.role === "Accounts") && (
            <>
              <li>
                <NavLink
                  to="payment-request-details"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IoStorefrontSharp className="text-lg" />
                  Payment Request Details
                </NavLink>
              </li>
            </>
          )}

          {user.role === "Accounts" && (
            <>
              <li>
                <NavLink
                  to="account-details"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IoStorefrontSharp className="text-lg" />
                  Vendor Details
                </NavLink>
              </li>
            </>
          )}

          {(user.role === "Store" ||
            user.role === "Purchase" ||
            user.role === "Production") && (
            <>
              <li>
                <NavLink
                  to="raw-material-stock"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IoStorefrontSharp className="text-lg" />
                  Raw Material Stock
                </NavLink>
              </li>
            </>
          )}

          {user.role === "Purchase" && (
            <>
              <li>
                <NavLink
                  to="installation-stock"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCogs className="text-lg" />
                  Installation Stock Data
                </NavLink>
              </li>
            </>
          )}


          {user.role === "Purchase" && (
            <>
              <li>
                <NavLink
                  to="add-warehouse"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PiWarehouseBold  className="text-lg" />
                  Add Warehouse
                </NavLink>
              </li>
            </>
          )}

          {user.role === "Purchase" && (
            <>
              <li>
                <NavLink
                  to="add-unit"
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                     border-l-4 border-transparent transition-all gap-3 ${
                       isActive
                         ? "bg-yellow-300 text-black border-yellow-600"
                         : ""
                     }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SiUnity   className="text-lg" />
                  Add Unit
                </NavLink>
              </li>
            </>
          )}

          {user.role === "Purchase" && (
            <>
              {/* Company */}
              <li className="border-b border-gray-300">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer 
                  text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
                  onClick={() => toggleMenu("Item")}
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <FaBuilding className="text-lg" />
                    Item
                  </span>
                  <span className="text-gray-600 transition-transform">
                    {openMenus.Item ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>

                {openMenus.Item && (
                  <ul className="bg-yellow-50">
                    <li>
                      <NavLink
                        to="add-raw-material"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Add Raw Material
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="item-details"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Item Detail
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}

          {/* Admin Dashboard */}
          {(user.role === "Superadmin" || user.role === "Admin") && (
            <li>
              <NavLink
                to="admin-dashboard"
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                   border-l-4 border-transparent transition-all gap-3 ${
                     isActive
                       ? "bg-yellow-300 text-black border-yellow-600"
                       : ""
                   }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdOutlinePayment className="text-lg" />
                Payment Approval
              </NavLink>
            </li>
          )}

          {/* Purchase Panel */}
          {user.role === "Purchase" && (
            <>
              {/* Company */}
              <li className="border-b border-gray-300">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer 
                  text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
                  onClick={() => toggleMenu("company")}
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <FaBuilding className="text-lg" />
                    Company
                  </span>
                  <span className="text-gray-600 transition-transform">
                    {openMenus.company ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>

                {openMenus.company && (
                  <ul className="bg-yellow-50">
                    <li>
                      <NavLink
                        to="add-company"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Add Company
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="update-company"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Update Company
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="active-deactivate-company"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        All Company
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Vendor */}
              <li className="border-b border-gray-300">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer 
                  text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
                  onClick={() => toggleMenu("vendor")}
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <FaBuilding className="text-lg" />
                    Vendor
                  </span>
                  <span className="text-gray-600 transition-transform">
                    {openMenus.vendor ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>

                {openMenus.vendor && (
                  <ul className="bg-yellow-50">
                    <li>
                      <NavLink
                        to="add-vendor"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Add Vendor
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="update-vendor"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Update Vendor
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="active-deactivate-vendor"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        All Vendor
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Purchase */}
              <li className="border-b border-gray-300">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer 
                  text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
                  onClick={() => toggleMenu("purchase")}
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <FaBuilding className="text-lg" />
                    Purchase
                  </span>
                  <span className="text-gray-600 transition-transform">
                    {openMenus.purchase ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>

                {openMenus.purchase && (
                  <ul className="bg-yellow-50">
                    <li>
                      <NavLink
                        to="create-purchase-order"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Create Purchase Order
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="show-purchase-orders"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Show Purchase Orders
                      </NavLink>
                    </li>

                     <li>
                      <NavLink
                        to="invoice-po"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Invoice PO Document
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className="border-b border-gray-300">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer 
                  text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
                  onClick={() => toggleMenu("Payment")}
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <MdOutlinePayment className="text-lg" />
                    Payment
                  </span>
                  <span className="text-gray-600 transition-transform">
                    {openMenus.Payment ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>

                {openMenus.Payment && (
                  <ul className="bg-yellow-50">
                    <li>
                      <NavLink
                        to="payment-pending"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Payment Pending
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="po-payment-details"
                        className={({ isActive }) =>
                          `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                           border-transparent transition-all relative text-sm ${
                             isActive
                               ? "bg-yellow-300 text-black border-yellow-600"
                               : ""
                           }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        PO Payment Details
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}
          {(user.role === "Purchase" || user.role === "Production") && (
            <li>
              <NavLink
                to="po-order-details"
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                   border-l-4 border-transparent transition-all gap-3 ${
                     isActive
                       ? "bg-yellow-300 text-black border-yellow-600"
                       : ""
                   }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdOutlinePayment className="text-lg" />
                PO Received Details
              </NavLink>
            </li>
          )}
        </ul>

        {/* Logout */}
        <div className="p-4 border-t border-gray-400 mt-auto">
          {changePasswordRoles.includes(user.role) && (
            <li>
              <NavLink
                to="change-password"
                className={({ isActive }) =>
                  `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
         border-l-4 border-transparent transition-all gap-3 ${
           isActive ? "bg-yellow-300 text-black border-yellow-600" : ""
         }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCogs className="text-lg" />
                Change Password
              </NavLink>
            </li>
          )}
          <button
            className="w-full bg-red-500 text-white border-none py-2 px-4 rounded 
            flex items-center justify-center gap-2 text-sm hover:bg-red-600 transition-colors"
            onClick={logout}
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenubar;




// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { useUser } from "../../Context/UserContext";
// import {
//   FaWarehouse,
//   FaPlus,
//   FaBox,
//   FaCogs,
//   FaClipboardList,
//   FaUser,
//   FaChevronDown,
//   FaChevronUp,
//   FaBuilding,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaFileInvoice,
//   FaPen,
// } from "react-icons/fa";
// import { MdOutlinePayment } from "react-icons/md";
// import { MdPayments } from "react-icons/md";
// import { IoStorefrontSharp } from "react-icons/io5";
// import { MdDashboard } from "react-icons/md";
// import { LiaSitemapSolid } from "react-icons/lia";
// import { IoBagAddSharp } from "react-icons/io5";
// import { IoAddCircleSharp } from "react-icons/io5";
// import { GrHistory, GrUpdate } from "react-icons/gr";
// import { PiBuildingsFill } from "react-icons/pi";
// import { MdOutlineCreateNewFolder } from "react-icons/md";
   
// const SideMenubar = () => {
//   const [company, setCompany] = useState(false);
//   const [vendor, setVendor] = useState(false);
//   const [purchase, setPurchase] = useState(false);
//   const [payment, setPayment] = useState(false);
//   const [item, setItem] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const { user, logout } = useUser();

//   const SINGLE_ITEMS = [
//     {
//       label: "Purchase Dashboard",
//       icon: <MdDashboard className="text-dark" />,
//       to: "purchase-dashboard",
//       show: (empData) => ["Purchase"].includes(empData.role),
//     },
//     {
//       label: "Raw Material Stock",
//       icon: <IoStorefrontSharp />,
//       to: "raw-material-stock-data",
//       show: (empData) => ["Purchase"].includes(empData.role),
//     },
//     {
//       label: "Installation Stock Data",
//       icon: <FaCogs className="text-dark" />,
//       to: "installation-stock-data",
//       show: (empData) => ["Purchase"].includes(empData.role),
//     },
//     {
//       label: "PO Received Details",
//       icon: <MdOutlinePayment className="text-dark" />,
//       to: "po-received-details",
//       show: (empData) => ["Purchase"].includes(empData.role),
//     },
//     {
//       label: "Approval Request",
//       icon: <FaClipboardList className="text-dark" />,
//       to: "store-keeper",
//       show: (empData) => ["Store"].includes(empData.role),
//     },
//     {
//       label: "Raw Material Out",
//       icon: <FaClipboardList className="text-dark" />,
//       to: "single-out",
//       show: (empData) => ["Store"].includes(empData.role),
//     },
//     {
//       label: "PO Stock Receiving",
//       icon: <FaPlus className="text-dark" />,
//       to: "po-stock-receiving",
//       show: (empData) => ["Store"].includes(empData.role),
//     },
//     {
//       label: "Store Tracking",
//       icon: <FaPen className="text-dark" />,
//       to: "store-tracking",
//       show: (empData) => ["Store"].includes(empData.role),
//     },
//     {
//       label: "User Stock History",
//       icon: <IoStorefrontSharp className="text-dark" />,
//       to: "user-stock-data",
//       show: (empData) => ["Store"].includes(empData.role),
//     },
//     {
//       label: "Direct Item Issue History",
//       icon: <IoStorefrontSharp className="text-dark" />,
//       to: "direct-item-issue-history",
//       show: (empData) => ["Store"].includes(empData.role),
//     },
//     {
//       label: "Raw Material Stock",
//       icon: <IoStorefrontSharp className="text-dark" />,
//       to: "raw-material-stock",
//       show: (empData) => ["Store"].includes(empData.role),
//     },
//     {
//       label: "PO Invoice",
//       icon: <FaFileInvoice className="text-dark" />,
//       to: "po-invoice",
//       show: (empData) => ["Verification"].includes(empData.role),
//     },
//     {
//       label: "Payment Request Details",
//       icon: <IoStorefrontSharp className="text-dark" />,
//       to: "payment-request-details",
//       show: (empData) => ["Verification", "Accounts"].includes(empData.role),
//     },
//     {
//       label: "Payment Approval",
//       icon: <MdOutlinePayment className="text-dark" />,
//       to: "admin-dashboard",
//       show: (empData) => ["Admin"].includes(empData.role),
//     },
//     {
//       label: "Vendor Details",
//       icon: <IoStorefrontSharp className="text-dark" />,
//       to: "account-details",
//       show: (empData) => ["Accounts"].includes(empData.role),
//     },
//     {
//       label: "Change Password",
//       icon: <FaCogs className="text-dark" />,
//       to: "change-password",
//       show: (empData) =>
//         ["Accounts", "Purchase", "Production", "Admin"].includes(empData.role),
//     },
//     {
//       label: "Item Request",
//       icon: <LiaSitemapSolid className="text-dark" />,
//       to: "Item-Request",
//       show: (empData) =>
//         [
//           "SFG Work",
//           "Assemble",
//           "Disassemble",
//           "Stamping",
//           "Winding",
//           "Winding Connection",
//         ].includes(empData.role),
//     },
//     {
//       label: "Item Request History",
//       icon: <FaWarehouse className="text-dark" />,
//       to: "Item-Request-history",
//       show: (empData) =>
//         [
//           "SFG Work",
//           "Assemble",
//           "Disassemble",
//           "Stamping",
//           "Winding",
//           "Winding Connection",
//         ].includes(empData.role),
//     },
//     {
//       label: "User Stock Data",
//       icon: <FaWarehouse className="text-dark" />,
//       to: "user-Stock",
//       show: (empData) =>
//         [
//           "SFG Work",
//           "Assemble",
//           "Disassemble",
//           "Stamping",
//           "Winding",
//           "Winding Connection",
//         ].includes(empData.role),
//     },
//     {
//       label: "Pending Process",
//       icon: <FaWarehouse className="text-dark" />,
//       to: "pending-process",
//       show: (empData) =>
//         [
//           "SFG Work",
//           "Assemble",
//           "Disassemble",
//           "Stamping",
//           "Testing",
//           "Winding",
//           "Winding Connection",
//         ].includes(empData.role),
//     },
//     {
//       label: "Service Process Request",
//       icon: <FaWarehouse className="text-dark" />,
//       to: "service-process-request",
//       show: (empData) =>
//         ["SFG Work", "Disassemble"].includes(empData.role),
//     },
//   ];

//   const rawMaterialMenuItems = [
//     {
//       label: "Add Raw Material",
//       icon: <IoBagAddSharp />,
//       to: "add-raw-material",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "Item Detail",
//       icon: <GrHistory />,
//       to: "item-details",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "Add Company",
//       icon: <IoAddCircleSharp />,
//       to: "add-company",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "Update Company",
//       icon: <GrUpdate />,
//       to: "update-company",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "All Company",
//       icon: <GrUpdate />,
//       to: "active-deactivate-company",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "Add Vendor",
//       icon: <PiBuildingsFill />,
//       to: "add-vendor",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "Update Vendor",
//       icon: <PiBuildingsFill />,
//       to: "update-vendor",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "All Vendor",
//       icon: <PiBuildingsFill />,
//       to: "active-deactivate-vendor",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "Create Purchase Order",
//       icon: <MdOutlineCreateNewFolder />,
//       to: "create-purchase-order",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "Show Purchase Orders",
//       icon: <MdOutlineCreateNewFolder />,
//       to: "show-purchase-orders",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "Payment Pending",
//       icon: <MdOutlinePayment />,
//       to: "payment-pending",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//     {
//       label: "PO Payment Details",
//       icon: <MdOutlinePayment />,
//       to: "po-payment-details",
//       show: (empData) => ["Purchase"].includes(empData?.role),
//     },
//   ];

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   if (!user)
//     return (
//       <div className="w-64 bg-gray-800 text-white h-screen p-4">Loading...</div>
//     );

//   const groupItemsByCategory = () => {
//     const groups = {
//       company: [],
//       vendor: [],
//       purchase: [],
//       payment: [],
//       item: [],
//     };

//     rawMaterialMenuItems.forEach((item) => {
//       if (item.to.includes("company")) groups.company.push(item);
//       else if (item.to.includes("vendor")) groups.vendor.push(item);
//       else if (item.to.includes("purchase-order") || item.to.includes("purchase-orders")) groups.purchase.push(item);
//       else if (item.to.includes("payment")) groups.payment.push(item);
//       else if (item.to.includes("raw-material") || item.to.includes("item-details")) groups.item.push(item);
//     });

//     return groups;
//   };

//   const groupedItems = groupItemsByCategory();

//   return (
//     <>
//       <button
//         className="lg:hidden fixed top-4 left-4 z-50 bg-yellow-400 text-black p-2 rounded-md shadow-lg"
//         onClick={toggleMobileMenu}
//       >
//         {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//       </button>

//       {mobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={toggleMobileMenu}
//         />
//       )}

//       <div
//         className={`w-64 text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col 
//           bg-gradient-to-b from-[#F9EA76] to-[#FFF9DD] z-40
//           transition-transform duration-300 ease-in-out
//           ${
//             mobileMenuOpen
//               ? "translate-x-0"
//               : "-translate-x-full lg:translate-x-0"
//           }`}
//       >
//         <div className="bg-gray-700 border-b border-gray-600 p-4">
//           <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
//             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-3">
//               <FaUser className="text-white text-xl" />
//             </div>
//             <div className="flex-1">
//               <div className="font-semibold text-white text-base">
//                 {user.name || user.email}
//               </div>
//               <div className="text-gray-300 text-sm capitalize">
//                 {user.role}
//               </div>
//             </div>
//           </div>
//         </div>

//         <ul className="flex-1 py-5 overflow-y-auto">
//           {/* Render Single Items */}
//           {SINGLE_ITEMS.map(
//             (menuItem, index) =>
//               menuItem.show(user) && (
//                 <li key={index}>
//                   <NavLink
//                     to={menuItem.to}
//                     className={({ isActive }) =>
//                       `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                        border-l-4 border-transparent transition-all gap-3 ${
//                          isActive
//                            ? "bg-yellow-300 text-black border-yellow-600"
//                            : ""
//                        }`
//                     }
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     {menuItem.icon}
//                     {menuItem.label}
//                   </NavLink>
//                 </li>
//               )
//           )}

//           {/* Render Grouped Items for Purchase Role */}
//           {user.role === "Purchase" && (
//             <>
//               {/* Item Menu */}
//               {groupedItems.item.length > 0 && (
//                 <li className="border-b border-gray-300">
//                   <div
//                     className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                     text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                     onClick={() => {
//                       setItem(!item);
//                       setCompany(false);
//                       setVendor(false);
//                       setPurchase(false);
//                       setPayment(false);
//                     }}
//                   >
//                     <span className="flex items-center gap-3 text-sm font-medium">
//                       <FaBuilding className="text-lg" />
//                       Item
//                     </span>
//                     <span className="text-gray-600 transition-transform">
//                       {item ? <FaChevronUp /> : <FaChevronDown />}
//                     </span>
//                   </div>

//                   {item && (
//                     <ul className="bg-yellow-50">
//                       {groupedItems.item.map((menuItem, index) => (
//                         <li key={index}>
//                           <NavLink
//                             to={menuItem.to}
//                             className={({ isActive }) =>
//                               `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                                border-transparent transition-all relative text-sm ${
//                                  isActive
//                                    ? "bg-yellow-300 text-black border-yellow-600"
//                                    : ""
//                                }`
//                             }
//                             onClick={() => setMobileMenuOpen(false)}
//                           >
//                             {menuItem.label}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               )}

//               {/* Company Menu */}
//               {groupedItems.company.length > 0 && (
//                 <li className="border-b border-gray-300">
//                   <div
//                     className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                     text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                     onClick={() => {
//                       setCompany(!company);
//                       setItem(false);
//                       setVendor(false);
//                       setPurchase(false);
//                       setPayment(false);
//                     }}
//                   >
//                     <span className="flex items-center gap-3 text-sm font-medium">
//                       <FaBuilding className="text-lg" />
//                       Company
//                     </span>
//                     <span className="text-gray-600 transition-transform">
//                       {company ? <FaChevronUp /> : <FaChevronDown />}
//                     </span>
//                   </div>

//                   {company && (
//                     <ul className="bg-yellow-50">
//                       {groupedItems.company.map((menuItem, index) => (
//                         <li key={index}>
//                           <NavLink
//                             to={menuItem.to}
//                             className={({ isActive }) =>
//                               `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                                border-transparent transition-all relative text-sm ${
//                                  isActive
//                                    ? "bg-yellow-300 text-black border-yellow-600"
//                                    : ""
//                                }`
//                             }
//                             onClick={() => setMobileMenuOpen(false)}
//                           >
//                             {menuItem.label}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               )}

//               {/* Vendor Menu */}
//               {groupedItems.vendor.length > 0 && (
//                 <li className="border-b border-gray-300">
//                   <div
//                     className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                     text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                     onClick={() => {
//                       setVendor(!vendor);
//                       setItem(false);
//                       setCompany(false);
//                       setPurchase(false);
//                       setPayment(false);
//                     }}
//                   >
//                     <span className="flex items-center gap-3 text-sm font-medium">
//                       <FaBuilding className="text-lg" />
//                       Vendor
//                     </span>
//                     <span className="text-gray-600 transition-transform">
//                       {vendor ? <FaChevronUp /> : <FaChevronDown />}
//                     </span>
//                   </div>

//                   {vendor && (
//                     <ul className="bg-yellow-50">
//                       {groupedItems.vendor.map((menuItem, index) => (
//                         <li key={index}>
//                           <NavLink
//                             to={menuItem.to}
//                             className={({ isActive }) =>
//                               `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                                border-transparent transition-all relative text-sm ${
//                                  isActive
//                                    ? "bg-yellow-300 text-black border-yellow-600"
//                                    : ""
//                                }`
//                             }
//                             onClick={() => setMobileMenuOpen(false)}
//                           >
//                             {menuItem.label}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               )}

//               {/* Purchase Menu */}
//               {groupedItems.purchase.length > 0 && (
//                 <li className="border-b border-gray-300">
//                   <div
//                     className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                     text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                     onClick={() => {
//                       setPurchase(!purchase);
//                       setItem(false);
//                       setCompany(false);
//                       setVendor(false);
//                       setPayment(false);
//                     }}
//                   >
//                     <span className="flex items-center gap-3 text-sm font-medium">
//                       <FaBuilding className="text-lg" />
//                       Purchase
//                     </span>
//                     <span className="text-gray-600 transition-transform">
//                       {purchase ? <FaChevronUp /> : <FaChevronDown />}
//                     </span>
//                   </div>

//                   {purchase && (
//                     <ul className="bg-yellow-50">
//                       {groupedItems.purchase.map((menuItem, index) => (
//                         <li key={index}>
//                           <NavLink
//                             to={menuItem.to}
//                             className={({ isActive }) =>
//                               `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                                border-transparent transition-all relative text-sm ${
//                                  isActive
//                                    ? "bg-yellow-300 text-black border-yellow-600"
//                                    : ""
//                                }`
//                             }
//                             onClick={() => setMobileMenuOpen(false)}
//                           >
//                             {menuItem.label}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               )}

//               {/* Payment Menu */}
//               {groupedItems.payment.length > 0 && (
//                 <li className="border-b border-gray-300">
//                   <div
//                     className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                     text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                     onClick={() => {
//                       setPayment(!payment);
//                       setItem(false);
//                       setCompany(false);
//                       setVendor(false);
//                       setPurchase(false);
//                     }}
//                   >
//                     <span className="flex items-center gap-3 text-sm font-medium">
//                       <MdOutlinePayment className="text-lg" />
//                       Payment
//                     </span>
//                     <span className="text-gray-600 transition-transform">
//                       {payment ? <FaChevronUp /> : <FaChevronDown />}
//                     </span>
//                   </div>

//                   {payment && (
//                     <ul className="bg-yellow-50">
//                       {groupedItems.payment.map((menuItem, index) => (
//                         <li key={index}>
//                           <NavLink
//                             to={menuItem.to}
//                             className={({ isActive }) =>
//                               `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                                border-transparent transition-all relative text-sm ${
//                                  isActive
//                                    ? "bg-yellow-300 text-black border-yellow-600"
//                                    : ""
//                                }`
//                             }
//                             onClick={() => setMobileMenuOpen(false)}
//                           >
//                             {menuItem.label}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               )}
//             </>
//           )}
//         </ul>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-400 mt-auto">
//           <button
//             className="w-full bg-red-500 text-white border-none py-2 px-4 rounded 
//             flex items-center justify-center gap-2 text-sm hover:bg-red-600 transition-colors"
//             onClick={logout}
//           >
//             <FaSignOutAlt className="text-lg" />
//             Logout
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SideMenubar;