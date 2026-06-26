// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { useUser } from "../../Context/UserContext";
// import { PiWarehouseBold } from "react-icons/pi";
// import { SiUnity } from "react-icons/si";
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
// } from "react-icons/fa";
// import { MdOutlinePayment } from "react-icons/md";
// import { MdPayments } from "react-icons/md";
// import { IoStorefrontSharp } from "react-icons/io5";
// import { MdDashboard } from "react-icons/md";
// const SideMenubar = () => {
//   const [openMenus, setOpenMenus] = useState({
//     company: false,
//     vendor: false,
//     purchase: false,
//     Item: false,
//     Payment: false,
//   });
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const changePasswordRoles = ["Purchase", "Verification", "Admin", "Accounts"];

//   const { user, logout } = useUser();

//   const toggleMenu = (menu) => {
//     setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   const lineWorkerRoles = [
//     "SFG Work",
//     "Assemble",
//     "Disassemble",
//     "Stamping",
//     "Winding",
//     "Winding Connection",
//   ];

//   const PendinglineWorkerRoles = [
//     "SFG Work",
//     "Assemble",
//     "Disassemble",
//     "Stamping",
//     "Testing",
//     "Winding",
//     "Winding Connection",
//   ];

//   if (!user)
//     return (
//       <div className="w-64 bg-gray-800 text-white h-screen p-4">Loading...</div>
//     );

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
//           ${mobileMenuOpen
//             ? "translate-x-0"
//             : "-translate-x-full lg:translate-x-0"
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
//                 {user?.role === "Admin" ? "Super Admin" : user?.role}
//               </div>
//             </div>
//           </div>
//         </div>

//         <ul className="flex-1 py-5 overflow-y-auto">
//           {lineWorkerRoles.includes(user.role) && (
//             <li>
//               <NavLink
//                 to="Item-Request"
//                 className={({ isActive }) =>
//                   `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                    border-l-4 border-transparent transition-all gap-3 ${isActive
//                     ? "bg-yellow-300 text-black border-yellow-600"
//                     : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <FaWarehouse className="text-lg" />
//                 Item Request
//               </NavLink>
//             </li>
//           )}

//           {lineWorkerRoles.includes(user.role) && (
//             <li>
//               <NavLink
//                 to="Item-Request-history"
//                 className={({ isActive }) =>
//                   `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                    border-l-4 border-transparent transition-all gap-3 ${isActive
//                     ? "bg-yellow-300 text-black border-yellow-600"
//                     : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <FaWarehouse className="text-lg" />
//                 Item Request History
//               </NavLink>
//             </li>
//           )}

//           {lineWorkerRoles.includes(user.role) && (
//             <li>
//               <NavLink
//                 to="user-Stock"
//                 className={({ isActive }) =>
//                   `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                    border-l-4 border-transparent transition-all gap-3 ${isActive
//                     ? "bg-yellow-300 text-black border-yellow-600"
//                     : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <FaWarehouse className="text-lg" />
//                 User Stock Data
//               </NavLink>
//             </li>
//           )}

//           {PendinglineWorkerRoles.includes(user.role) && (
//             <li>
//               <NavLink
//                 to="pending-process"
//                 className={({ isActive }) =>
//                   `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                    border-l-4 border-transparent transition-all gap-3 ${isActive
//                     ? "bg-yellow-300 text-black border-yellow-600"
//                     : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <FaWarehouse className="text-lg" />
//                 Pending Process
//               </NavLink>
//             </li>
//           )}

//           {(user.role === "SFG Work" || user.role === "Disassemble") && (
//             <>
//               <li>
//                 <NavLink
//                   to="service-process-request"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <FaCogs className="text-lg" />
//                   Service Process Request
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {/* Store Menu */}
//           {user.role === "Store" && (
//             <>
//               <li>
//                 <NavLink
//                   to="store-keeper"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <FaClipboardList className="text-lg" />
//                   Approval Request
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="single-out"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <FaClipboardList className="text-lg" />
//                   Raw Material Out
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="po-stock-receiving"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <FaPlus className="text-lg" />
//                   PO Stock Receiving
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {(user.role === "Store" || user.role === "Production") && (
//             <>
//               <li>
//                 <NavLink
//                   to="user-stock-data"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <IoStorefrontSharp className="text-lg" />
//                   User Stock History
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {(user.role === "Store" || user.role === "Production") && (
//             <>
//               <li>
//                 <NavLink
//                   to="direct-item-issue-history"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <IoStorefrontSharp className="text-lg" />
//                   Direct Item Issue History
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {(user.role === "Purchase" || user.role === "Admin") && (
//             <>
//               <li>
//                 <NavLink
//                   to="purchase-dashboard"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <MdDashboard className="text-lg" />
//                   Purchase Dashboard
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="price-comparision"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <MdDashboard className="text-lg" />
//                   Price Comparision
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {(user.role === "Store" ||
//             user.role === "Production" ||
//             user.role === "Admin") && (
//               <>
//                 <li>
//                   <NavLink
//                     to="store-tracking"
//                     className={({ isActive }) =>
//                       `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                         ? "bg-yellow-300 text-black border-yellow-600"
//                         : ""
//                       }`
//                     }
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <IoStorefrontSharp className="text-lg" />
//                     Service Tracking
//                   </NavLink>
//                 </li>
//               </>
//             )}

//           {(user.role === "Verification" ||
//             user.role === "Admin" ||
//             user.role === "Accounts") && (
//               <>
//                 <li>
//                   <NavLink
//                     to="po-invoice"
//                     className={({ isActive }) =>
//                       `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                         ? "bg-yellow-300 text-black border-yellow-600"
//                         : ""
//                       }`
//                     }
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <FaFileInvoice className="text-lg" />
//                     PO Invoice
//                   </NavLink>
//                 </li>
//               </>
//             )}

//           {/* Admin Dashboard */}
//           {(user.role === "Superadmin" || user.role === "Admin") && (
//             <li>
//               <NavLink
//                 to="admin-dashboard"
//                 className={({ isActive }) =>
//                   `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                    border-l-4 border-transparent transition-all gap-3 ${isActive
//                     ? "bg-yellow-300 text-black border-yellow-600"
//                     : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <MdOutlinePayment className="text-lg" />
//                 Payment Approval
//               </NavLink>
//             </li>
//           )}

//           {user.role === "Admin" && (
//             <>
//               <li>
//                 <NavLink
//                   to="approval-po-invoice"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <FaFileInvoice className="text-lg" />
//                   PO Approval Invoice
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {(user.role === "Verification" || user.role === "Accounts") && (
//             <>
//               <li>
//                 <NavLink
//                   to="payment-request-details"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <IoStorefrontSharp className="text-lg" />
//                   Payment Request Details
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {user.role === "Accounts" && (
//             <>
//               <li>
//                 <NavLink
//                   to="account-details"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <IoStorefrontSharp className="text-lg" />
//                   Vendor Details
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {(user.role === "Store" ||
//             user.role === "Purchase" ||
//             user.role === "Production" ||
//             user.role === "Admin") && (
//               <>
//                 <li>
//                   <NavLink
//                     to="raw-material-stock"
//                     className={({ isActive }) =>
//                       `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                         ? "bg-yellow-300 text-black border-yellow-600"
//                         : ""
//                       }`
//                     }
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <IoStorefrontSharp className="text-lg" />
//                     Raw Material Stock
//                   </NavLink>
//                 </li>
//               </>
//             )}

//           {(user?.role === "Purchase" ||
//             user?.role === "Admin" ||
//             user?.role === "Production" ||
//             user?.role === "Store") && (
//               <>
//                 <li>
//                   <NavLink
//                     to="installation-stock"
//                     className={({ isActive }) =>
//                       `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                         ? "bg-yellow-300 text-black border-yellow-600"
//                         : ""
//                       }`
//                     }
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <FaCogs className="text-lg" />
//                     Installation Stock Data
//                   </NavLink>
//                 </li>
//               </>
//             )}

//           {(user?.role === "Purchase" ||
//             user?.role === "Admin" ||
//             user?.role === "Production") && (
//               <>
//                 <li>
//                   <NavLink
//                     to="Installation"
//                     className={({ isActive }) =>
//                       `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                         ? "bg-yellow-300 text-black border-yellow-600"
//                         : ""
//                       }`
//                     }
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <FaCogs className="text-lg" />
//                     Installation Shortage
//                   </NavLink>
//                 </li>
//               </>
//             )}

//           {user.role === "Purchase" && (
//             <>
//               <li>
//                 <NavLink
//                   to="add-warehouse"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <PiWarehouseBold className="text-lg" />
//                   Add Warehouse
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {user.role === "Purchase" && (
//             <>
//               <li>
//                 <NavLink
//                   to="add-unit"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <SiUnity className="text-lg" />
//                   Add Unit
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {user.role === "Purchase" && (
//             <>
//               {/* Company */}
//               <li className="border-b border-gray-300">
//                 <div
//                   className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                   text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                   onClick={() => toggleMenu("Item")}
//                 >
//                   <span className="flex items-center gap-3 text-sm font-medium">
//                     <FaBuilding className="text-lg" />
//                     Item
//                   </span>
//                   <span className="text-gray-600 transition-transform">
//                     {openMenus.Item ? <FaChevronUp /> : <FaChevronDown />}
//                   </span>
//                 </div>

//                 {openMenus.Item && (
//                   <ul className="bg-yellow-50">
//                     <li>
//                       <NavLink
//                         to="add-raw-material"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Add Raw Material
//                       </NavLink>
//                     </li>

//                     <li>
//                       <NavLink
//                         to="item-details"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Item Detail
//                       </NavLink>
//                     </li>
//                   </ul>
//                 )}
//               </li>
//             </>
//           )}

//           {/* Purchase Panel */}
//           {user.role === "Purchase" && (
//             <>
//               {/* Company */}
//               <li className="border-b border-gray-300">
//                 <div
//                   className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                   text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                   onClick={() => toggleMenu("company")}
//                 >
//                   <span className="flex items-center gap-3 text-sm font-medium">
//                     <FaBuilding className="text-lg" />
//                     Company
//                   </span>
//                   <span className="text-gray-600 transition-transform">
//                     {openMenus.company ? <FaChevronUp /> : <FaChevronDown />}
//                   </span>
//                 </div>

//                 {openMenus.company && (
//                   <ul className="bg-yellow-50">
//                     <li>
//                       <NavLink
//                         to="add-company"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Add Company
//                       </NavLink>
//                     </li>

//                     <li>
//                       <NavLink
//                         to="update-company"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Update Company
//                       </NavLink>
//                     </li>

//                     <li>
//                       <NavLink
//                         to="active-deactivate-company"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         All Company
//                       </NavLink>
//                     </li>
//                   </ul>
//                 )}
//               </li>

//               {/* Vendor */}
//               <li className="border-b border-gray-300">
//                 <div
//                   className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                   text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                   onClick={() => toggleMenu("vendor")}
//                 >
//                   <span className="flex items-center gap-3 text-sm font-medium">
//                     <FaBuilding className="text-lg" />
//                     Vendor
//                   </span>
//                   <span className="text-gray-600 transition-transform">
//                     {openMenus.vendor ? <FaChevronUp /> : <FaChevronDown />}
//                   </span>
//                 </div>

//                 {openMenus.vendor && (
//                   <ul className="bg-yellow-50">
//                     <li>
//                       <NavLink
//                         to="add-vendor"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Add Vendor
//                       </NavLink>
//                     </li>

//                     <li>
//                       <NavLink
//                         to="update-vendor"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Update Vendor
//                       </NavLink>
//                     </li>

//                     <li>
//                       <NavLink
//                         to="active-deactivate-vendor"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         All Vendor
//                       </NavLink>
//                     </li>
//                   </ul>
//                 )}
//               </li>

//               {/* Purchase */}
//               <li className="border-b border-gray-300">
//                 <div
//                   className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                   text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                   onClick={() => toggleMenu("purchase")}
//                 >
//                   <span className="flex items-center gap-3 text-sm font-medium">
//                     <FaBuilding className="text-lg" />
//                     Purchase
//                   </span>
//                   <span className="text-gray-600 transition-transform">
//                     {openMenus.purchase ? <FaChevronUp /> : <FaChevronDown />}
//                   </span>
//                 </div>

//                 {openMenus.purchase && (
//                   <ul className="bg-yellow-50">
//                     <li>
//                       <NavLink
//                         to="create-purchase-order"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Create Purchase Order
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink
//                         to="show-purchase-orders"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Show Purchase Orders
//                       </NavLink>
//                     </li>


//                     <li>
//                       <NavLink
//                         to="invoice-po"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Invoice PO Document
//                       </NavLink>
//                     </li>
//                   </ul>
//                 )}
//               </li>
//               <li className="border-b border-gray-300">
//                 <div
//                   className="flex items-center justify-between px-5 py-3 cursor-pointer 
//                   text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all"
//                   onClick={() => toggleMenu("Payment")}
//                 >
//                   <span className="flex items-center gap-3 text-sm font-medium">
//                     <MdOutlinePayment className="text-lg" />
//                     Payment
//                   </span>
//                   <span className="text-gray-600 transition-transform">
//                     {openMenus.Payment ? <FaChevronUp /> : <FaChevronDown />}
//                   </span>
//                 </div>

//                 {openMenus.Payment && (
//                   <ul className="bg-yellow-50">
//                     <li>
//                       <NavLink
//                         to="payment-pending"
//                         className={({ isActive }) =>
//                           `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                             ? "bg-yellow-300 text-black border-yellow-600"
//                             : ""
//                           }`
//                         }
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         Payment Pending
//                       </NavLink>
//                     </li>
//                   </ul>
//                 )}
//               </li>
//             </>
//           )}

//           {/* <li>
//             <NavLink
//               to="po-payment-details"
//               className={({ isActive }) =>
//                 `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${
//                              isActive
//                                ? "bg-yellow-300 text-black border-yellow-600"
//                                : ""
//                            }`
//               }
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               PO Payment Details
//             </NavLink>
//           </li> */}

//           {(user.role === "Purchase" || user.role === "Admin") && (
//             <li>
//               <NavLink
//                 to="po-payment-details"
//                 className={({ isActive }) =>
//                   `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                    border-l-4 border-transparent transition-all gap-3 ${isActive
//                     ? "bg-yellow-300 text-black border-yellow-600"
//                     : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <MdOutlinePayment className="text-lg" />
//                 PO Payment Details
//               </NavLink>
//             </li>
//           )}

//           {(user.role === "Admin" || user.role === "Production") && (
//             <>
//               <li>
//                 <NavLink
//                   to="vendor-all-details"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                      border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <IoStorefrontSharp className="text-lg" />
//                   Vendor Order History
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {(user.role === "Purchase" ||
//             user.role === "Production" ||
//             user.role === "Admin") && (
//               <li>
//                 <NavLink
//                   to="po-order-details"
//                   className={({ isActive }) =>
//                     `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                    border-l-4 border-transparent transition-all gap-3 ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <MdOutlinePayment className="text-lg" />
//                   PO Received Details
//                 </NavLink>
//               </li>
//             )}


//           {(user.role === "Store") && (
//             <li>
//               <NavLink
//                 to="stock-update"
//                 className={({ isActive }) =>
//                   `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//                    border-l-4 border-transparent transition-all gap-3 ${isActive
//                     ? "bg-yellow-300 text-black border-yellow-600"
//                     : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <MdOutlinePayment className="text-lg" />
//                 Raw Material Stock Add
//               </NavLink>
//             </li>
//           )}

//           {(user.role === "PrePurchase") && (

//             <>
//               <li>
//                 <NavLink
//                   to="pre-po"
//                   className={({ isActive }) =>
//                     `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                       ? "bg-yellow-300 text-black border-yellow-600"
//                       : ""
//                     }`
//                   }
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Pre Po
//                 </NavLink>
//               </li>
//             </>
//           )}


//           {(user.role === "PrePurchase" || user.role === "Purchase") && (
//             <li>
//               <NavLink
//                 to="pre-po-request-history"
//                 className={({ isActive }) =>
//                   `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
//                            border-transparent transition-all relative text-sm ${isActive
//                     ? "bg-yellow-300 text-black border-yellow-600"
//                     : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Pre Po Request History
//               </NavLink>
//             </li>
//           )}

//         </ul>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-400 mt-auto">
//           {changePasswordRoles.includes(user.role) && (
//             <li>
//               <NavLink
//                 to="change-password"
//                 className={({ isActive }) =>
//                   `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
//          border-l-4 border-transparent transition-all gap-3 ${isActive ? "bg-yellow-300 text-black border-yellow-600" : ""
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <FaCogs className="text-lg" />
//                 Change Password
//               </NavLink>
//             </li>
//           )}
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


import React, { useState, useEffect } from "react";
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

// Static role arrays (moved outside component)
const LINE_WORKER_ROLES = [
  "SFG Work",
  "Assemble",
  "Disassemble",
  "Stamping",
  "Winding",
  "Winding Connection",
];
const PENDING_LINE_WORKER_ROLES = [
  "SFG Work",
  "Assemble",
  "Disassemble",
  "Stamping",
  "Testing",
  "Winding",
  "Winding Connection",
];
const CHANGE_PASSWORD_ROLES = ["Purchase", "Verification", "Admin", "Accounts"];

// Helper to check if a user role is in a list
const hasRole = (user, roles) => user && roles.includes(user.role);

const SideMenubar = () => {
  const { user, logout } = useUser();
  const [openMenus, setOpenMenus] = useState({
    company: false,
    vendor: false,
    purchase: false,
    Item: false,
    Payment: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse state

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (!user) {
    return (
      <div className="w-64 bg-gray-800 text-white h-screen p-4">Loading...</div>
    );
  }

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // -------- Menu Item Configuration (flat & nested) --------
  // Flat items: path, label, icon, roles (array of roles that can see it)
  const flatMenuItems = [
    {
      path: "Item-Request",
      label: "Item Request",
      icon: FaWarehouse,
      roles: LINE_WORKER_ROLES,
    },
    {
      path: "Item-Request-history",
      label: "Item Request History",
      icon: FaWarehouse,
      roles: LINE_WORKER_ROLES,
    },
    {
      path: "user-Stock",
      label: "User Stock Data",
      icon: FaWarehouse,
      roles: LINE_WORKER_ROLES,
    },
    {
      path: "pending-process",
      label: "Pending Process",
      icon: FaWarehouse,
      roles: PENDING_LINE_WORKER_ROLES,
    },
    {
      path: "service-process-request",
      label: "Service Process Request",
      icon: FaCogs,
      roles: ["SFG Work", "Disassemble"],
    },
    {
      path: "store-keeper",
      label: "Approval Request",
      icon: FaClipboardList,
      roles: ["Store"],
    },
    {
      path: "single-out",
      label: "Raw Material Out",
      icon: FaClipboardList,
      roles: ["Store"],
    },
    {
      path: "po-stock-receiving",
      label: "PO Stock Receiving",
      icon: FaPlus,
      roles: ["Store"],
    },
    {
      path: "user-stock-data",
      label: "User Stock History",
      icon: IoStorefrontSharp,
      roles: ["Store", "Production"],
    },
    {
      path: "direct-item-issue-history",
      label: "Direct Item Issue History",
      icon: IoStorefrontSharp,
      roles: ["Store", "Production"],
    },
    {
      path: "purchase-dashboard",
      label: "Purchase Dashboard",
      icon: MdDashboard,
      roles: ["Purchase", "Admin"],
    },
    {
      path: "price-comparision",
      label: "Price Comparision",
      icon: MdDashboard,
      roles: ["Purchase", "Admin"],
    },
    {
      path: "store-tracking",
      label: "Service Tracking",
      icon: IoStorefrontSharp,
      roles: ["Store", "Production", "Admin"],
    },
    {
      path: "po-invoice",
      label: "PO Invoice",
      icon: FaFileInvoice,
      roles: ["Verification", "Admin", "Accounts"],
    },
    {
      path: "admin-dashboard",
      label: "Payment Approval",
      icon: MdOutlinePayment,
      roles: ["Superadmin", "Admin"],
    },
    {
      path: "approval-po-invoice",
      label: "PO Approval Invoice",
      icon: FaFileInvoice,
      roles: ["Admin"],
    },
    {
      path: "payment-request-details",
      label: "Payment Request Details",
      icon: IoStorefrontSharp,
      roles: ["Verification", "Accounts"],
    },
    {
      path: "account-details",
      label: "Vendor Details",
      icon: IoStorefrontSharp,
      roles: ["Accounts"],
    },
    {
      path: "raw-material-stock",
      label: "Raw Material Stock",
      icon: IoStorefrontSharp,
      roles: ["Store", "Purchase", "Production", "Admin"],
    },
    {
      path: "installation-stock",
      label: "Installation Stock Data",
      icon: FaCogs,
      roles: ["Purchase", "Admin", "Production", "Store"],
    },
    {
      path: "Installation",
      label: "Installation Shortage",
      icon: FaCogs,
      roles: ["Purchase", "Admin", "Production"],
    },
    {
      path: "add-warehouse",
      label: "Add Warehouse",
      icon: PiWarehouseBold,
      roles: ["Purchase"],
    },
    {
      path: "add-unit",
      label: "Add Unit",
      icon: SiUnity,
      roles: ["Purchase"],
    },
    {
      path: "po-payment-details",
      label: "PO Payment Details",
      icon: MdOutlinePayment,
      roles: ["Purchase", "Admin"],
    },
    {
      path: "vendor-all-details",
      label: "Vendor Order History",
      icon: IoStorefrontSharp,
      roles: ["Admin", "Production"],
    },
    {
      path: "po-order-details",
      label: "PO Received Details",
      icon: MdOutlinePayment,
      roles: ["Purchase", "Production", "Admin"],
    },
    {
      path: "stock-update",
      label: "Raw Material Stock Add",
      icon: MdOutlinePayment,
      roles: ["Store"],
    },
    {
      path: "pre-po",
      label: "Pre Po",
      icon: FaClipboardList, // using same icon, can be changed
      roles: ["PrePurchase"],
    },
    {
      path: "pre-po-request-history",
      label: "Pre Po Request History",
      icon: FaClipboardList,
      roles: ["PrePurchase", "Purchase"],
    },
  ];

  // Nested menus configuration
  const nestedMenus = [
    {
      key: "Item",
      label: "Item",
      icon: FaBuilding,
      roles: ["Purchase"],
      items: [
        { path: "add-raw-material", label: "Add Raw Material" },
        { path: "item-details", label: "Item Detail" },
      ],
    },
    {
      key: "company",
      label: "Company",
      icon: FaBuilding,
      roles: ["Purchase"],
      items: [
        { path: "add-company", label: "Add Company" },
        { path: "update-company", label: "Update Company" },
        { path: "active-deactivate-company", label: "All Company" },
      ],
    },
    {
      key: "vendor",
      label: "Vendor",
      icon: FaBuilding,
      roles: ["Purchase", "PrePurchase"],
      items: [
        { path: "add-vendor", label: "Add Vendor" },
        { path: "update-vendor", label: "Update Vendor" },
        { path: "active-deactivate-vendor", label: "All Vendor" },
      ],
    },
    {
      key: "purchase",
      label: "Purchase",
      icon: FaBuilding,
      roles: ["Purchase"],
      items: [
        { path: "create-purchase-order", label: "Create Purchase Order" },
        { path: "show-purchase-orders", label: "Show Purchase Orders" },
        { path: "invoice-po", label: "Invoice PO Document" },
      ],
    },
    {
      key: "Payment",
      label: "Payment",
      icon: MdOutlinePayment,
      roles: ["Purchase"],
      items: [{ path: "payment-pending", label: "Payment Pending" }],
    },
  ];

  // Determine if a flat item is visible for the current user
  const isFlatItemVisible = (item) => {
    return item.roles.some((role) => user.role === role);
  };

  // Determine if a nested menu is visible
  const isNestedMenuVisible = (menu) => {
    return menu.roles.some((role) => user.role === role);
  };

  // ---------- Render helpers ----------
  const renderFlatItem = (item) => {
    if (!isFlatItemVisible(item)) return null;
    const Icon = item.icon;
    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
             border-l-4 border-transparent transition-all gap-3 ${
               isActive ? "bg-yellow-300 text-black border-yellow-600" : ""
             } ${isCollapsed ? "justify-center px-2" : ""}`
          }
          onClick={closeMobileMenu}
        >
          <Icon className="text-lg" />
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      </li>
    );
  };

  const renderNestedMenu = (menu) => {
    if (!isNestedMenuVisible(menu)) return null;
    const Icon = menu.icon;
    const isOpen = openMenus[menu.key];

    return (
      <li key={menu.key} className="border-b border-gray-300">
        <div
          className={`flex items-center justify-between px-5 py-3 cursor-pointer 
            text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 border-transparent transition-all
            ${isCollapsed ? "justify-center px-2" : ""}`}
          onClick={() => toggleMenu(menu.key)}
        >
          <span className="flex items-center gap-3 text-sm font-medium">
            <Icon className="text-lg" />
            {!isCollapsed && <span>{menu.label}</span>}
          </span>
          {!isCollapsed && (
            <span className="text-gray-600 transition-transform">
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          )}
        </div>
        {isOpen && !isCollapsed && (
          <ul className="bg-yellow-50">
            {menu.items.map((subItem) => (
              <li key={subItem.path}>
                <NavLink
                  to={subItem.path}
                  className={({ isActive }) =>
                    `block py-2 px-5 pl-14 text-gray-700 hover:text-black hover:bg-yellow-100 border-l-4 
                     border-transparent transition-all relative text-sm ${
                       isActive ? "bg-yellow-300 text-black border-yellow-600" : ""
                     }`
                  }
                  onClick={closeMobileMenu}
                >
                  {subItem.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  // ---------- JSX ----------
  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-yellow-400 text-black p-2 rounded-md shadow-lg"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col 
          bg-gradient-to-b from-[#F9EA76] to-[#FFF9DD] z-40
          transition-all duration-300 ease-in-out
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isCollapsed ? "w-16" : "w-64"}`}
      >
        {/* User profile & collapse toggle */}
        <div className="bg-gray-700 border-b border-gray-600 p-4 flex items-center justify-between">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}
          >
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="text-white text-xl" />
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1">
                <div className="font-semibold text-white text-base truncate">
                  {user.name || user.email}
                </div>
                <div className="text-gray-300 text-sm capitalize truncate">
                  {user?.role === "Admin" ? "Super Admin" : user?.role}
                </div>
              </div>
            )}
          </div>
          {/* Close button for mobile (inside sidebar) */}
          <button
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Collapse toggle for desktop */}
        <button
          className="hidden lg:flex items-center justify-center w-full py-2 text-gray-700 hover:bg-yellow-100 transition-colors"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <FaChevronDown className="text-lg" />
          ) : (
            <FaChevronUp className="text-lg" />
          )}
        </button>

        {/* Menu items */}
        <ul className="flex-1 py-2 overflow-y-auto">
          {flatMenuItems.map(renderFlatItem)}
          {nestedMenus.map(renderNestedMenu)}
        </ul>

        {/* Logout and Change Password */}
        <div className="p-4 border-t border-gray-400 mt-auto">
          {CHANGE_PASSWORD_ROLES.includes(user.role) && (
            <NavLink
              to="change-password"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 text-gray-700 hover:text-black hover:bg-yellow-100 
                 border-l-4 border-transparent transition-all gap-3 ${
                   isActive ? "bg-yellow-300 text-black border-yellow-600" : ""
                 } ${isCollapsed ? "justify-center px-2" : ""}`
              }
              onClick={closeMobileMenu}
            >
              <FaCogs className="text-lg" />
              {!isCollapsed && <span>Change Password</span>}
            </NavLink>
          )}
          <button
            className={`w-full bg-red-500 text-white border-none py-2 px-4 rounded 
              flex items-center justify-center gap-2 text-sm hover:bg-red-600 transition-colors
              ${isCollapsed ? "px-0" : ""}`}
            onClick={logout}
          >
            <FaSignOutAlt className="text-lg" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenubar;