// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import Api from "../../auth/Api";
// import {
//   Search,
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";

// const PaymentPending = () => {
//   const [purchaseOrders, setPurchaseOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedRows, setExpandedRows] = useState(new Set());

//   // Search and Filter States
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchFilter, setSearchFilter] = useState("all");
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const [statusFilter, setStatusFilter] = useState("Pending");

//   // Pagination States
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(50);
//   const [totalPages, setTotalPages] = useState(1);

//   // Navigation hook
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await Api.get(
//           "/purchase/purchase-orders/payments/pending"
//         );
//         if (response.data.success) {
//           setPurchaseOrders(response.data.data);
//           // Calculate total pages
//           const totalPages = Math.ceil(
//             response.data.data.length / itemsPerPage
//           );
//           setTotalPages(totalPages);
//         } else {
//           setError(response.data.message || "Failed to fetch data");
//         }
//       } catch (err) {
//         console.error("Error fetching PO data:", err);
//         setError("Failed to fetch PO data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Format currency based on the actual currency in the data
//   const formatCurrency = (amount, currencyCode = "INR") => {
//     // Only include currencies that actually exist in your data
//     const localeMap = {
//       INR: "en-IN", // Indian Rupee
//       USD: "en-US", // US Dollar
//       CNY: "zh-CN", // Chinese Yuan
//     };

//     const locale = localeMap[currencyCode] || "en-IN"; // Default to INR if currency not found
//     const currency = currencyCode || "INR";

//     return new Intl.NumberFormat(locale, {
//       style: "currency",
//       currency: currency,
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   // Filter data based on search criteria
//   const filteredData = useMemo(() => {
//     const filtered = purchaseOrders.filter((po) => {
//       // Apply status filter
//       if (statusFilter !== "all" && po.paymentStatusFlag !== statusFilter) {
//         return false;
//       }

//       // If no search term, return true
//       if (!searchTerm.trim()) return true;

//       const term = searchTerm.toLowerCase();

//       switch (searchFilter) {
//         case "poNumber":
//           return po.poNumber.toLowerCase().includes(term);
//         case "company":
//           return po.companyName.toLowerCase().includes(term);
//         case "vendor":
//           return po.vendorName.toLowerCase().includes(term);
//         case "status":
//           return po.paymentStatusFlag.toLowerCase().includes(term);
//         case "all":
//         default:
//           return (
//             po.poNumber.toLowerCase().includes(term) ||
//             po.companyName.toLowerCase().includes(term) ||
//             po.vendorName.toLowerCase().includes(term) ||
//             po.paymentStatusFlag.toLowerCase().includes(term) ||
//             po.orderedItems.some(
//               (item) =>
//                 item.itemName.toLowerCase().includes(term) ||
//                 item.hsnCode?.toLowerCase().includes(term)
//             )
//           );
//       }
//     });

//     // Update total pages when filter changes
//     const totalPages = Math.ceil(filtered.length / itemsPerPage);
//     setTotalPages(totalPages);
//     setCurrentPage(1); // Reset to first page when filters change

//     return filtered;
//   }, [purchaseOrders, searchTerm, searchFilter, statusFilter, itemsPerPage]);

//   // Get current items for pagination
//   const currentItems = useMemo(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   }, [filteredData, currentPage, itemsPerPage]);

//   // Pagination functions
//   const goToPage = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     setExpandedRows(new Set()); // Close all expanded rows when changing page
//   };

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//       setExpandedRows(new Set());
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       setExpandedRows(new Set());
//     }
//   };

//   const toggleRowExpand = (id) => {
//     const newExpandedRows = new Set(expandedRows);
//     if (newExpandedRows.has(id)) {
//       newExpandedRows.delete(id);
//     } else {
//       newExpandedRows.add(id);
//     }
//     setExpandedRows(newExpandedRows);
//   };

//   const handleMakePayment = (po) => {
//     try {
//       navigate("../payment-request", {
//         state: {
//           poData: po,
//         },
//       });

//       console.log("Navigating with PO:", po.poId, po.poNumber);
//     } catch (err) {
//       console.error("Navigation error:", err);
//       setError("Failed to navigate to make payment page");
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "PartiallyPaid":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setSearchFilter("all");
//     setStatusFilter("all");
//     setCurrentPage(1);
//   };

//   const getStatusCounts = () => {
//     const counts = {
//       Pending: 0,
//       Completed: 0,
//     };
//     purchaseOrders.forEach((po) => {
//       if (counts[po.paymentStatusFlag] !== undefined) {
//         counts[po.paymentStatusFlag]++;
//       }
//     });
//     return counts;
//   };

//   const statusCounts = getStatusCounts();

//   // Calculate page numbers to display
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPagesToShow = 5;

//     if (totalPages <= maxPagesToShow) {
//       // Show all pages
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       // Show pages around current page
//       let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//       let endPage = startPage + maxPagesToShow - 1;

//       if (endPage > totalPages) {
//         endPage = totalPages;
//         startPage = Math.max(1, endPage - maxPagesToShow + 1);
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
//     }

//     return pageNumbers;
//   };

//   // Calculate total pending amount (in INR)
//   const calculateTotalPendingAmount = () => {
//     return purchaseOrders.reduce((total, po) => {
//       return total + po.pendingAmount;
//     }, 0);
//   };

//   // Calculate total paid amount (in INR)
//   const calculateTotalPaidAmount = () => {
//     return purchaseOrders.reduce((total, po) => {
//       return total + po.totalPaid;
//     }, 0);
//   };

//   // Get currency counts for display
//   const getCurrencyCounts = () => {
//     const counts = {};
//     purchaseOrders.forEach((po) => {
//       counts[po.currency] = (counts[po.currency] || 0) + 1;
//     });
//     return counts;
//   };

//   const currencyCounts = getCurrencyCounts();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//         <p>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
//         >
//           Reload Page
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Payment Pending</h1>
//           <p className="text-gray-600 mt-2">
//             Manage purchase orders with pending payments
//           </p>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search Bar */}
//             <div className="flex-1">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder={`Search ${
//                     searchFilter === "all" ? "all fields" : searchFilter
//                   }...`}
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Search Filter Dropdown */}
//             <div className="w-full md:w-48">
//               <select
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 value={searchFilter}
//                 onChange={(e) => setSearchFilter(e.target.value)}
//               >
//                 <option value="all">All Fields</option>
//                 <option value="poNumber">PO Number</option>
//                 <option value="company">Company</option>
//                 <option value="vendor">Vendor</option>
//                 <option value="status">Payment Status</option>
//               </select>
//             </div>

//             {/* Items Per Page */}
//             <div className="w-full md:w-32">
//               <select
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 value={itemsPerPage}
//                 onChange={(e) => {
//                   setItemsPerPage(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value="10">10 per page</option>
//                 <option value="25">25 per page</option>
//                 <option value="50">50 per page</option>
//                 <option value="100">100 per page</option>
//                 <option value="250">250 per page</option>
//               </select>
//             </div>

//             {/* Advanced Filters Toggle */}
//             <button
//               onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filters
//               {showAdvancedFilters ? (
//                 <ChevronUp className="h-4 w-4 ml-2" />
//               ) : (
//                 <ChevronDown className="h-4 w-4 ml-2" />
//               )}
//             </button>

//             {/* Clear Filters */}
//             {(searchTerm || statusFilter !== "all") && (
//               <button
//                 onClick={clearFilters}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>

//           {/* Advanced Filters */}
//           {showAdvancedFilters && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Status Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Payment Status
//                   </label>
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       onClick={() => setStatusFilter("all")}
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         statusFilter === "all"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                       }`}
//                     >
//                       All ({purchaseOrders.length})
//                     </button>
//                     <button
//                       onClick={() => setStatusFilter("Pending")}
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         statusFilter === "Pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                       }`}
//                     >
//                       Pending ({statusCounts.Pending})
//                     </button>
//                     <button
//                       onClick={() => setStatusFilter("Completed")}
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         statusFilter === "Completed"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                       }`}
//                     >
//                       Completed ({statusCounts.Completed})
//                     </button>
//                   </div>
//                 </div>

//                 {/* Currency Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Currency
//                   </label>
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       onClick={() => {
//                         // Clear currency filter - we'll handle this separately
//                         // For now, just show all
//                       }}
//                       className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
//                     >
//                       All Currencies
//                     </button>
//                     {Object.entries(currencyCounts).map(([currency, count]) => (
//                       <button
//                         key={currency}
//                         onClick={() => {
//                           // Add currency filter logic here if needed
//                         }}
//                         className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
//                       >
//                         {currency} ({count})
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Results Count */}
//           <div className="mt-4 flex justify-between items-center">
//             <p className="text-sm text-gray-600">
//               Showing <span className="font-medium">{currentItems.length}</span>{" "}
//               of <span className="font-medium">{filteredData.length}</span>{" "}
//               filtered POs (Total: {purchaseOrders.length} POs)
//               {(searchTerm || statusFilter !== "all") && (
//                 <button
//                   onClick={clearFilters}
//                   className="ml-2 text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   Clear filters
//                 </button>
//               )}
//             </p>
//             <div className="text-sm text-gray-600">
//               Page <span className="font-medium">{currentPage}</span> of{" "}
//               <span className="font-medium">{totalPages}</span>
//             </div>
//           </div>
//         </div>

//         {/* POs Table */}
//         {filteredData.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-8 text-center">
//             <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">
//               No POs found matching your criteria
//             </p>
//             {searchTerm && (
//               <p className="text-gray-400 mt-2">
//                 Try adjusting your search or filters
//               </p>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         PO Details
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Company
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Vendor
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Amounts
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Payment Status
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Items
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentItems.map((po) => (
//                       <React.Fragment key={po.poId}>
//                         <tr className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="font-medium text-gray-900">
//                               {po.poNumber}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               Sub: {formatCurrency(po.subTotal, po.currency)}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               Grand:{" "}
//                               {formatCurrency(po.grandTotal, po.currency)}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-900">
//                               {po.companyName}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-900">
//                               {po.vendorName}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm">
//                               <div className="text-green-600">
//                                 Paid:{" "}
//                                 {formatCurrency(po.totalPaid, po.currency)}
//                               </div>
//                               <div className="text-red-600 font-medium">
//                                 Pending:{" "}
//                                 {formatCurrency(po.pendingAmount, po.currency)}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
//                                 po.paymentStatusFlag
//                               )}`}
//                             >
//                               {po.paymentStatusFlag}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {po.orderedItems.length} item(s)
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <button
//                               onClick={() => toggleRowExpand(po.poId)}
//                               className="text-blue-600 hover:text-blue-900 mr-4"
//                             >
//                               {expandedRows.has(po.poId)
//                                 ? "Hide Items"
//                                 : "View Items"}
//                             </button>
//                             {po.paymentStatusFlag === "Pending" && (
//                               <button
//                                 onClick={() => handleMakePayment(po)}
//                                 className="text-green-600 hover:text-green-900"
//                               >
//                                 Payment Request
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                         {expandedRows.has(po.poId) && (
//                           <tr>
//                             <td colSpan="9" className="px-6 py-4 bg-gray-50">
//                               <div className="border border-gray-200 rounded-lg overflow-hidden">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                   <thead className="bg-gray-100">
//                                     <tr>
//                                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Item Name
//                                       </th>
//                                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                                         HSN Code
//                                       </th>
//                                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Quantity
//                                       </th>
//                                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Unit
//                                       </th>
//                                     </tr>
//                                   </thead>
//                                   <tbody className="bg-white divide-y divide-gray-200">
//                                     {po.orderedItems.map((item) => (
//                                       <tr
//                                         key={item.purchaseOrderItemId}
//                                         className="hover:bg-gray-50"
//                                       >
//                                         <td className="px-4 py-2 text-sm text-gray-900">
//                                           {item.itemName}
//                                         </td>
//                                         <td className="px-4 py-2 text-sm text-gray-500">
//                                           {item.hsnCode}
//                                         </td>
//                                         <td className="px-4 py-2 text-sm text-gray-900 font-medium">
//                                           {item.quantity}
//                                         </td>
//                                         <td className="px-4 py-2 text-sm text-gray-900 font-medium">
//                                           {item.unit}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </tbody>
//                                 </table>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Pagination Controls */}
//             <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={prevPage}
//                   disabled={currentPage === 1}
//                   className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
//                     currentPage === 1
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={nextPage}
//                   disabled={currentPage === totalPages}
//                   className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
//                     currentPage === totalPages
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">
//                       {(currentPage - 1) * itemsPerPage + 1}
//                     </span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(
//                         currentPage * itemsPerPage,
//                         filteredData.length
//                       )}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-medium">{filteredData.length}</span>{" "}
//                     results
//                   </p>
//                 </div>
//                 <div>
//                   <nav
//                     className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                     aria-label="Pagination"
//                   >
//                     {/* First Page Button */}
//                     <button
//                       onClick={() => goToPage(1)}
//                       disabled={currentPage === 1}
//                       className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
//                         currentPage === 1
//                           ? "text-gray-300 cursor-not-allowed"
//                           : "text-gray-500 hover:bg-gray-50"
//                       }`}
//                     >
//                       <span className="sr-only">First</span>
//                       <ChevronsLeft className="h-5 w-5" />
//                     </button>

//                     {/* Previous Page Button */}
//                     <button
//                       onClick={prevPage}
//                       disabled={currentPage === 1}
//                       className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
//                         currentPage === 1
//                           ? "text-gray-300 cursor-not-allowed"
//                           : "text-gray-500 hover:bg-gray-50"
//                       }`}
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ChevronLeft className="h-5 w-5" />
//                     </button>

//                     {/* Page Numbers */}
//                     {getPageNumbers().map((pageNum) => (
//                       <button
//                         key={pageNum}
//                         onClick={() => goToPage(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
//                             : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     ))}

//                     {/* Next Page Button */}
//                     <button
//                       onClick={nextPage}
//                       disabled={currentPage === totalPages}
//                       className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
//                         currentPage === totalPages
//                           ? "text-gray-300 cursor-not-allowed"
//                           : "text-gray-500 hover:bg-gray-50"
//                       }`}
//                     >
//                       <span className="sr-only">Next</span>
//                       <ChevronRight className="h-5 w-5" />
//                     </button>

//                     {/* Last Page Button */}
//                     <button
//                       onClick={() => goToPage(totalPages)}
//                       disabled={currentPage === totalPages}
//                       className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
//                         currentPage === totalPages
//                           ? "text-gray-300 cursor-not-allowed"
//                           : "text-gray-500 hover:bg-gray-50"
//                       }`}
//                     >
//                       <span className="sr-only">Last</span>
//                       <ChevronsRight className="h-5 w-5" />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>

//             {/* Page Jump */}
//             <div className="mt-4 flex justify-center">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-700">Go to page:</span>
//                 <input
//                   type="number"
//                   min="1"
//                   max={totalPages}
//                   value={currentPage}
//                   onChange={(e) => {
//                     const page = parseInt(e.target.value);
//                     if (page >= 1 && page <= totalPages) {
//                       goToPage(page);
//                     }
//                   }}
//                   className="w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//                 <span className="text-sm text-gray-700">of {totalPages}</span>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentPending;


import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  DollarSign,
} from "lucide-react";

const PaymentPending = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Pending");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Reduced default items
  const [totalPages, setTotalPages] = useState(1);

  // Navigation hook
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Api.get(
          "/purchase/purchase-orders/payments/pending"
        );
        if (response.data.success) {
          setPurchaseOrders(response.data.data);
          // Calculate total pages
          const totalPages = Math.ceil(
            response.data.data.length / itemsPerPage
          );
          setTotalPages(totalPages);
        } else {
          setError(response.data.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching PO data:", err);
        setError("Failed to fetch PO data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency based on the actual currency in the data
  const formatCurrency = (amount, currencyCode = "INR") => {
    // Only include currencies that actually exist in your data
    const localeMap = {
      INR: "en-IN", // Indian Rupee
      USD: "en-US", // US Dollar
      CNY: "zh-CN", // Chinese Yuan
    };

    const locale = localeMap[currencyCode] || "en-IN"; // Default to INR if currency not found
    const currency = currencyCode || "INR";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Filter data based on search criteria
  const filteredData = useMemo(() => {
    const filtered = purchaseOrders.filter((po) => {
      // Apply status filter
      if (statusFilter !== "all" && po.paymentStatusFlag !== statusFilter) {
        return false;
      }

      // If no search term, return true
      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase();

      switch (searchFilter) {
        case "poNumber":
          return po.poNumber.toLowerCase().includes(term);
        case "company":
          return po.companyName.toLowerCase().includes(term);
        case "vendor":
          return po.vendorName.toLowerCase().includes(term);
        case "status":
          return po.paymentStatusFlag.toLowerCase().includes(term);
        case "all":
        default:
          return (
            po.poNumber.toLowerCase().includes(term) ||
            po.companyName.toLowerCase().includes(term) ||
            po.vendorName.toLowerCase().includes(term) ||
            po.paymentStatusFlag.toLowerCase().includes(term) ||
            po.orderedItems.some(
              (item) =>
                item.itemName.toLowerCase().includes(term) ||
                item.hsnCode?.toLowerCase().includes(term)
            )
          );
      }
    });

    // Update total pages when filter changes
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPages);
    setCurrentPage(1); // Reset to first page when filters change

    return filtered;
  }, [purchaseOrders, searchTerm, searchFilter, statusFilter, itemsPerPage]);

  // Get current items for pagination
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, currentPage, itemsPerPage]);

  // Pagination functions
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    setExpandedRows(new Set()); // Close all expanded rows when changing page
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedRows(new Set());
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedRows(new Set());
    }
  };

  const toggleRowExpand = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleMakePayment = (po) => {
    try {
      navigate("../payment-request", {
        state: {
          poData: po,
        },
      });

      console.log("Navigating with PO:", po.poId, po.poNumber);
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate to make payment page");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "PartiallyPaid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSearchFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getStatusCounts = () => {
    const counts = {
      Pending: 0,
      Completed: 0,
    };
    purchaseOrders.forEach((po) => {
      if (counts[po.paymentStatusFlag] !== undefined) {
        counts[po.paymentStatusFlag]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Get currency counts for display
  const getCurrencyCounts = () => {
    const counts = {};
    purchaseOrders.forEach((po) => {
      counts[po.currency] = (counts[po.currency] || 0) + 1;
    });
    return counts;
  };

  const currencyCounts = getCurrencyCounts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Pending Details</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Manage purchase orders with pending payments
          </p>
        </div>

        {/* Search and Filters - Responsive Stack */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-6">
          <div className="flex flex-col space-y-3">
            {/* Top Row: Search and Controls */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-9 md:pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Search ${
                      searchFilter === "all" ? "all fields" : searchFilter
                    }...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Search Filter Dropdown */}
              <div className="w-full md:w-48">
                <select
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                >
                  <option value="all">All Fields</option>
                  <option value="poNumber">PO Number</option>
                  <option value="company">Company</option>
                  <option value="vendor">Vendor</option>
                  <option value="status">Payment Status</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Items per page and buttons */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Items Per Page */}
              <div className="w-full md:w-32">
                <select
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showAdvancedFilters ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </button>

              {/* Clear Filters */}
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm border border-transparent rounded-md shadow-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-1 text-xs md:text-sm rounded-full font-medium ${
                        statusFilter === "all"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      All ({purchaseOrders.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter("Pending")}
                      className={`px-3 py-1 text-xs md:text-sm rounded-full font-medium ${
                        statusFilter === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Pending ({statusCounts.Pending})
                    </button>
                    <button
                      onClick={() => setStatusFilter("Completed")}
                      className={`px-3 py-1 text-xs md:text-sm rounded-full font-medium ${
                        statusFilter === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Completed ({statusCounts.Completed})
                    </button>
                  </div>
                </div>

                {/* Currency Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(currencyCounts).map(([currency, count]) => (
                      <button
                        key={currency}
                        onClick={() => {
                          // Add currency filter logic here if needed
                        }}
                        className="px-3 py-1 text-xs md:text-sm rounded-full font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        {currency} ({count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-0">
              Showing <span className="font-medium">{currentItems.length}</span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              filtered POs (Total: {purchaseOrders.length} POs)
            </p>
            <div className="text-xs md:text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
          </div>
        </div>

        {/* POs Table */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
            <Search className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
            <p className="text-gray-500 text-base md:text-lg">
              No POs found matching your criteria
            </p>
            {searchTerm && (
              <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                Try adjusting your search or filters
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Cards View for small screens */}
            <div className="block md:hidden space-y-4">
              {currentItems.map((po) => (
                <div key={po.poId} className="bg-white rounded-lg shadow p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{po.poNumber}</h3>
                        <p className="text-sm text-gray-500">{po.companyName}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                          po.paymentStatusFlag
                        )}`}
                      >
                        {po.paymentStatusFlag}
                      </span>
                    </div>

                    {/* Vendor */}
                    <div>
                      <p className="text-sm text-gray-600">Vendor</p>
                      <p className="font-medium">{po.vendorName}</p>
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Sub Total</p>
                        <p className="font-medium">
                          {formatCurrency(po.subTotal, po.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Grand Total</p>
                        <p className="font-medium">
                          {formatCurrency(po.grandTotal, po.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600">Paid</p>
                        <p className="font-medium text-green-600">
                          {formatCurrency(po.totalPaid, po.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-red-600">Pending</p>
                        <p className="font-medium text-red-600">
                          {formatCurrency(po.pendingAmount, po.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Items Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {po.orderedItems.length} item(s)
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleRowExpand(po.poId)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {expandedRows.has(po.poId) ? "Hide" : "View"}
                        </button>
                        {po.paymentStatusFlag === "Pending" && (
                          <button
                            onClick={() => handleMakePayment(po)}
                            className="flex items-center text-sm text-green-600 hover:text-green-800"
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Pay
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Items */}
                    {expandedRows.has(po.poId) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                        <div className="space-y-2">
                          {po.orderedItems.map((item) => (
                            <div
                              key={item.purchaseOrderItemId}
                              className="bg-gray-50 p-2 rounded"
                            >
                              <p className="font-medium text-sm">{item.itemName}</p>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>HSN: {item.hsnCode}</span>
                                <span>
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        PO Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Amounts
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((po) => (
                      <React.Fragment key={po.poId}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 text-sm">
                              {po.poNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              Sub: {formatCurrency(po.subTotal, po.currency)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Grand:{" "}
                              {formatCurrency(po.grandTotal, po.currency)}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {po.companyName}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {po.vendorName}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="text-green-600 text-xs">
                                Paid:{" "}
                                {formatCurrency(po.totalPaid, po.currency)}
                              </div>
                              <div className="text-red-600 font-medium text-sm">
                                Pending:{" "}
                                {formatCurrency(po.pendingAmount, po.currency)}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusBadgeClass(
                                po.paymentStatusFlag
                              )}`}
                            >
                              {po.paymentStatusFlag}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500">
                                {po.orderedItems.length} item(s)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => toggleRowExpand(po.poId)}
                                className="inline-flex items-center text-blue-600 hover:text-blue-900 text-sm"
                              >
                                {/* <Eye className="h-4 w-4 mr-1" /> */}
                                {expandedRows.has(po.poId)
                                  ? "Hide Items"
                                  : "View Items"}
                              </button>
                              {po.paymentStatusFlag === "Pending" && (
                                <button
                                  onClick={() => handleMakePayment(po)}
                                  className="inline-flex items-center text-green-600 hover:text-green-900 text-sm"
                                >
                                  {/* <DollarSign className="h-4 w-4 mr-1" /> */}
                                  Make Payment
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedRows.has(po.poId) && (
                          <tr>
                            <td colSpan="7" className="px-4 py-4 bg-gray-50">
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Item Name
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        HSN Code
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Quantity
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Unit
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {po.orderedItems.map((item) => (
                                      <tr
                                        key={item.purchaseOrderItemId}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-3 py-2 text-sm text-gray-900">
                                          {item.itemName}
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-500">
                                          {item.hsnCode}
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900 font-medium">
                                          {item.quantity}
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900 font-medium">
                                          {item.unit}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="bg-white rounded-lg shadow px-3 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 text-sm border border-gray-300 font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-3 py-2 text-sm border border-gray-300 font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
            </div>

            {/* Page Jump */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      goToPage(page);
                    }
                  }}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-700">of {totalPages}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPending;
