// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import Api from "../../auth/Api";
// import {
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   Download,
//   ExternalLink,
//   Search,
//   Filter,
//   Building,
//   User,
//   Calendar,
//   DollarSign,
//   Percent,
//   FileSpreadsheet,
//   AlertCircle,
// } from "lucide-react";
// import { useDebounce } from "../../hooks/UseDebounce";

// const PoInvoice = () => {
//   const [purchaseOrders, setPurchaseOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [expandedItems, setExpandedItems] = useState({});
//   const [filters, setFilters] = useState({
//     search: "",
//     hasBill: "all",
//     company: "all",
//     vendor: "all",
//     currency: "all",
//   });
//   const [searchInput, setSearchInput] = useState("");
//   const [stats, setStats] = useState({
//     totalAmount: 0,
//     totalPaid: 0,
//     totalRemaining: 0,
//     totalPOs: 0,
//     withBill: 0,
//     withoutBill: 0,
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [activeFilters, setActiveFilters] = useState([]);
//   const [pdfError, setPdfError] = useState(null);
//   const [downloadingPdf, setDownloadingPdf] = useState({});
//   const [mobileView, setMobileView] = useState(false);

//   // Debounce search input
//   const debouncedSearch = useDebounce(searchInput, 300);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchPurchaseOrders = async () => {
//       try {
//         setInitialLoading(true);
//         const response = await Api.get(
//           "/verification-dept/purchase-orders/invoices",
//         );

//         if (response.data.success) {
//           const data = response.data.data;
//           setPurchaseOrders(data);
//           setFilteredOrders(data);

//           // Calculate statistics
//           const stats = {
//             totalAmount: data.reduce(
//               (sum, po) => sum + (po.grandTotal || 0),
//               0,
//             ),
//             totalPaid: data.reduce((sum, po) => sum + (po.totalPaid || 0), 0),
//             totalRemaining: data.reduce(
//               (sum, po) => sum + (po.remainingAmount || 0),
//               0,
//             ),
//             totalPOs: data.length,
//             withBill: data.filter((po) => po.hasBill).length,
//             withoutBill: data.filter((po) => !po.hasBill).length,
//           };
//           setStats(stats);
//         }
//       } catch (err) {
//         setError("Failed to fetch purchase orders. Please try again later.");
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//         setInitialLoading(false);
//       }
//     };

//     fetchPurchaseOrders();
//   }, []);

//   // Update search filter with debounced value
//   useEffect(() => {
//     setFilters((prev) => ({ ...prev, search: debouncedSearch }));
//   }, [debouncedSearch]);

//   // Track active filters
//   useEffect(() => {
//     const active = [];
//     if (filters.search) active.push(`Search: "${filters.search}"`);
//     if (filters.hasBill !== "all")
//       active.push(
//         `Bill Status: ${
//           filters.hasBill === "with" ? "With Bills" : "Without Bills"
//         }`,
//       );
//     if (filters.company !== "all") active.push(`Company: ${filters.company}`);
//     if (filters.vendor !== "all") active.push(`Vendor: ${filters.vendor}`);
//     if (filters.currency !== "all")
//       active.push(`Currency: ${filters.currency}`);
//     setActiveFilters(active);
//   }, [filters]);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...purchaseOrders];

//     // Search filter
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(
//         (po) =>
//           po.poNumber?.toLowerCase().includes(searchLower) ||
//           po.companyName?.toLowerCase().includes(searchLower) ||
//           po.vendorName?.toLowerCase().includes(searchLower) ||
//           po.currency?.toLowerCase().includes(searchLower) ||
//           po.items?.some((item) =>
//             item.itemName?.toLowerCase().includes(searchLower),
//           ),
//       );
//     }

//     // Bill status filter
//     if (filters.hasBill !== "all") {
//       filtered = filtered.filter((po) =>
//         filters.hasBill === "with" ? po.hasBill : !po.hasBill,
//       );
//     }

//     // Company filter
//     if (filters.company !== "all") {
//       filtered = filtered.filter((po) => po.companyName === filters.company);
//     }

//     // Vendor filter
//     if (filters.vendor !== "all") {
//       filtered = filtered.filter((po) => po.vendorName === filters.vendor);
//     }

//     // Currency filter
//     if (filters.currency !== "all") {
//       filtered = filtered.filter((po) => po.currency === filters.currency);
//     }

//     setFilteredOrders(filtered);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [filters, purchaseOrders]);

//   // Get unique companies, vendors, and currencies for filters
//   const companies = useMemo(
//     () => [
//       ...new Set(purchaseOrders.map((po) => po.companyName).filter(Boolean)),
//     ],
//     [purchaseOrders],
//   );

//   const vendors = useMemo(
//     () => [
//       ...new Set(purchaseOrders.map((po) => po.vendorName).filter(Boolean)),
//     ],
//     [purchaseOrders],
//   );

//   const currencies = useMemo(
//     () => [...new Set(purchaseOrders.map((po) => po.currency).filter(Boolean))],
//     [purchaseOrders],
//   );

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedOrders = useMemo(
//     () => filteredOrders.slice(startIndex, endIndex),
//     [filteredOrders, startIndex, endIndex],
//   );

//   // Toggle row expansion
//   const toggleRowExpansion = useCallback((poId) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [poId]: !prev[poId],
//     }));
//   }, []);

//   // Toggle items expansion
//   const toggleItemsExpansion = useCallback((poId) => {
//     setExpandedItems((prev) => ({
//       ...prev,
//       [poId]: !prev[poId],
//     }));
//   }, []);

//   // Handle PDF with better error handling and progress indication
//   const handlePdfAction = async (fileUrl, invoiceNumber, action = "view") => {
//     const poId = fileUrl.split("/").pop(); // Extract PO ID for tracking
//     setDownloadingPdf((prev) => ({ ...prev, [poId]: true }));
//     setPdfError(null);

//     try {
//       const fullUrl = `${import.meta.env.VITE_API_URL}${fileUrl}`;

//       if (action === "download") {
//         const response = await fetch(fullUrl);
//         if (!response.ok) throw new Error("Failed to fetch PDF");

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `${invoiceNumber || "invoice"}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//       } else {
//         window.open(fullUrl, "_blank", "noopener,noreferrer");
//       }
//     } catch (error) {
//       console.error("Error handling PDF:", error);
//       setPdfError(
//         `Failed to ${action} PDF. Please check the file URL or try again.`,
//       );
//     } finally {
//       setDownloadingPdf((prev) => ({ ...prev, [poId]: false }));
//     }
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     setFilters({
//       search: "",
//       hasBill: "all",
//       company: "all",
//       vendor: "all",
//       currency: "all",
//     });
//     setSearchInput("");
//   };

//   // Remove specific filter
//   const removeFilter = (filterToRemove) => {
//     if (filterToRemove.startsWith("Search:")) {
//       setFilters((prev) => ({ ...prev, search: "" }));
//       setSearchInput("");
//     } else if (filterToRemove.startsWith("Bill Status:")) {
//       setFilters((prev) => ({ ...prev, hasBill: "all" }));
//     } else if (filterToRemove.startsWith("Company:")) {
//       setFilters((prev) => ({ ...prev, company: "all" }));
//     } else if (filterToRemove.startsWith("Vendor:")) {
//       setFilters((prev) => ({ ...prev, vendor: "all" }));
//     } else if (filterToRemove.startsWith("Currency:")) {
//       setFilters((prev) => ({ ...prev, currency: "all" }));
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Get currency symbol
//   const getCurrencySymbol = (currencyCode) => {
//     const currencySymbols = {
//       USD: "$",
//       INR: "₹",
//       EUR: "€",
//       GBP: "£",
//       JPY: "¥",
//       CAD: "C$",
//       AUD: "A$",
//       CNY: "¥",
//       // Add more currency codes as needed
//     };
//     return currencySymbols[currencyCode?.toUpperCase()] || currencyCode || "₹";
//   };

//   // Format currency with appropriate symbol and formatting
//   const formatCurrency = (amount, currencyCode = "INR") => {
//     const symbol = getCurrencySymbol(currencyCode);

//     // For USD, use US formatting
//     if (currencyCode?.toUpperCase() === "USD") {
//       return `${symbol}${Number(amount).toLocaleString("en-US", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       })}`;
//     }

//     // For INR, use Indian formatting
//     if (currencyCode?.toUpperCase() === "INR") {
//       return `${symbol} ${Number(amount).toLocaleString("en-IN", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       })}`;
//     }

//     // For CNY (Chinese Yuan), use Chinese formatting
//     if (currencyCode?.toUpperCase() === "CNY") {
//       return `${symbol}${Number(amount).toLocaleString("zh-CN", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       })}`;
//     }

//     // Default formatting for other currencies
//     return `${symbol}${Number(amount).toLocaleString("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;
//   };

//   // Check screen size for mobile view
//   useEffect(() => {
//     const handleResize = () => {
//       setMobileView(window.innerWidth < 768);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Skeleton loading component
//   const SkeletonRow = () => (
//     <tr className="animate-pulse">
//       <td className="px-6 py-4">
//         <div className="flex items-center">
//           <div className="h-4 bg-gray-200 rounded w-24"></div>
//         </div>
//       </td>
//       <td className="px-6 py-4">
//         <div className="space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-32"></div>
//           <div className="h-3 bg-gray-200 rounded w-24"></div>
//         </div>
//       </td>
//       <td className="px-6 py-4">
//         <div className="h-4 bg-gray-200 rounded w-40"></div>
//       </td>
//       <td className="px-6 py-4">
//         <div className="space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-20"></div>
//           <div className="h-3 bg-gray-200 rounded w-16"></div>
//         </div>
//       </td>
//       <td className="px-6 py-4">
//         <div className="h-6 bg-gray-200 rounded w-24"></div>
//       </td>
//       <td className="px-6 py-4">
//         <div className="h-6 bg-gray-200 rounded w-28"></div>
//       </td>
//       <td className="px-6 py-4">
//         <div className="h-8 bg-gray-200 rounded w-24"></div>
//       </td>
//     </tr>
//   );

//   if (initialLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
//         <p className="mt-4 text-gray-600">Loading purchase orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <div className="flex items-center">
//             <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
//             <div>
//               <h3 className="text-lg font-medium text-red-800">
//                 Error Loading Data
//               </h3>
//               <p className="text-red-700 mt-1">{error}</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* PDF Error Alert */}
//       {pdfError && (
//         <div className="fixed top-4 right-4 z-50 max-w-sm">
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
//             <div className="flex items-center">
//               <AlertCircle className="h-5 w-5 mr-2" />
//               <span>{pdfError}</span>
//               <button
//                 onClick={() => setPdfError(null)}
//                 className="ml-auto text-red-500 hover:text-red-700"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow p-6 mb-8">
//         <div className="flex items-center mb-4">
//           <Filter className="h-5 w-5 text-gray-500 mr-2" />
//           <h3 className="text-lg font-medium text-gray-800">Filters</h3>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           {/* Search */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Search
//             </label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search PO, Company, Vendor, Currency..."
//                 className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 aria-label="Search purchase orders"
//               />
//             </div>
//           </div>

//           {/* Bill Status Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Bill Status
//             </label>
//             <select
//               className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filters.hasBill}
//               onChange={(e) =>
//                 setFilters({ ...filters, hasBill: e.target.value })
//               }
//               aria-label="Filter by bill status"
//             >
//               <option value="all">All Status</option>
//               <option value="with">With Bills</option>
//               <option value="without">Without Bills</option>
//             </select>
//           </div>

//           {/* Company Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Company
//             </label>
//             <div className="relative">
//               <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <select
//                 className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.company}
//                 onChange={(e) =>
//                   setFilters({ ...filters, company: e.target.value })
//                 }
//                 aria-label="Filter by company"
//               >
//                 <option value="all">All Companies</option>
//                 {companies.map((company, index) => (
//                   <option key={index} value={company}>
//                     {company}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Vendor Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Vendor
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <select
//                 className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.vendor}
//                 onChange={(e) =>
//                   setFilters({ ...filters, vendor: e.target.value })
//                 }
//                 aria-label="Filter by vendor"
//               >
//                 <option value="all">All Vendors</option>
//                 {vendors.map((vendor, index) => (
//                   <option key={index} value={vendor}>
//                     {vendor}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Currency Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Currency
//             </label>
//             <div className="relative">
//               <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <select
//                 className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.currency}
//                 onChange={(e) =>
//                   setFilters({ ...filters, currency: e.target.value })
//                 }
//                 aria-label="Filter by currency"
//               >
//                 <option value="all">All Currencies</option>
//                 {currencies.map((currency, index) => (
//                   <option key={index} value={currency}>
//                     {currency} ({getCurrencySymbol(currency)})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Active Filters */}
//         {activeFilters.length > 0 && (
//           <div className="mt-6">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-sm text-gray-600">Active filters:</span>
//               {activeFilters.map((filter, index) => (
//                 <span
//                   key={index}
//                   className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//                 >
//                   {filter}
//                   <button
//                     onClick={() => removeFilter(filter)}
//                     className="ml-2 text-blue-600 hover:text-blue-800"
//                     aria-label={`Remove filter ${filter}`}
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//               <button
//                 onClick={clearAllFilters}
//                 className="text-sm text-red-600 hover:text-red-800 ml-2"
//               >
//                 Clear all
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Results and Pagination Controls */}
//       <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between">
//         <div className="text-gray-600 mb-2 md:mb-0">
//           Showing {filteredOrders.length > 0 ? startIndex + 1 : 0} to{" "}
//           {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}{" "}
//           results
//           {filters.search && ` for "${filters.search}"`}
//         </div>

//         {/* Pagination Controls */}
//         {filteredOrders.length > itemsPerPage && (
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-600">Show:</span>
//               <select
//                 className="px-2 py-1 border border-gray-300 rounded text-sm"
//                 value={itemsPerPage}
//                 onChange={(e) => setItemsPerPage(Number(e.target.value))}
//               >
//                 <option value="10">10</option>
//                 <option value="25">25</option>
//                 <option value="50">50</option>
//                 <option value="100">100</option>
//               </select>
//               <span className="text-sm text-gray-600">per page</span>
//             </div>

//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
//               <span className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Purchase Orders Table/Cards */}
//       {mobileView ? (
//         /* Mobile Card View */
//         <div className="space-y-4">
//           {loading ? (
//             Array.from({ length: 3 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg shadow p-4 animate-pulse"
//               >
//                 <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
//                 <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-2/3"></div>
//               </div>
//             ))
//           ) : paginatedOrders.length === 0 ? (
//             <div className="bg-white rounded-lg shadow p-8 text-center">
//               <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No purchase orders found
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Try adjusting your filters or search term
//               </p>
//               <button
//                 onClick={clearAllFilters}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 Clear all filters
//               </button>
//             </div>
//           ) : (
//             paginatedOrders.map((po) => (
//               <div
//                 key={po.poId}
//                 className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
//               >
//                 <div className="p-4">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <h3 className="font-bold text-gray-900">{po.poNumber}</h3>
//                       <div className="flex items-center text-sm text-gray-500 mt-1">
//                         <Calendar className="h-3 w-3 mr-1" />
//                         {formatDate(po.poDate)}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => toggleRowExpansion(po.poId)}
//                       className="text-gray-500 hover:text-gray-700"
//                       aria-label={
//                         expandedRows[po.poId]
//                           ? "Collapse details"
//                           : "Expand details"
//                       }
//                       aria-expanded={expandedRows[po.poId]}
//                     >
//                       {expandedRows[po.poId] ? (
//                         <ChevronUp size={20} />
//                       ) : (
//                         <ChevronDown size={20} />
//                       )}
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 mb-3">
//                     <div>
//                       <div className="text-xs text-gray-500">Company</div>
//                       <div className="font-medium">{po.companyName}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Vendor</div>
//                       <div className="font-medium">{po.vendorName}</div>
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <div className="text-xs text-gray-500">Amount</div>
//                     <div className="font-bold text-lg">
//                       {formatCurrency(po.grandTotal, po.currency)}
//                     </div>
//                     <div className="text-sm">
//                       <span className="text-green-600">
//                         Paid: {formatCurrency(po.totalPaid, po.currency)}
//                       </span>
//                       <span className="mx-2">•</span>
//                       <span className="text-orange-600">
//                         Due: {formatCurrency(po.remainingAmount, po.currency)}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       Currency: {po.currency} ({getCurrencySymbol(po.currency)})
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <div>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           po.hasBill
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {po.hasBill ? "Invoice Attached" : "Pending Invoice"}
//                       </span>
//                       {po.bills.length > 0 && (
//                         <div className="text-xs text-gray-500 mt-1">
//                           {po.bills.length} bill{po.bills.length > 1 ? "s" : ""}
//                         </div>
//                       )}
//                     </div>

//                     <div className="text-right">
//                       <div className="text-xs text-gray-500 mb-1">
//                         {((po.totalPaid / po.grandTotal) * 100).toFixed(1)}%
//                         Paid
//                       </div>
//                       <div className="w-24 bg-gray-200 rounded-full h-2">
//                         <div
//                           className="bg-green-600 h-2 rounded-full"
//                           style={{
//                             width: `${Math.min(
//                               (po.totalPaid / po.grandTotal) * 100,
//                               100,
//                             )}%`,
//                             maxWidth: "100%",
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {expandedRows[po.poId] && (
//                   <div className="border-t border-gray-200 p-4 bg-gray-50">
//                     <div className="mb-4">
//                       <h4 className="font-medium text-gray-900 mb-2">Items</h4>
//                       {po.items.slice(0, 2).map((item, index) => (
//                         <div key={index} className="text-sm text-gray-700 mb-1">
//                           {item.itemName}
//                           <span className="text-gray-500 ml-2">
//                             ({item.quantity} {item.unit})
//                           </span>
//                         </div>
//                       ))}
//                       {po.items.length > 2 && (
//                         <button
//                           onClick={() => toggleItemsExpansion(po.poId)}
//                           className="text-sm text-blue-600 hover:text-blue-800 mt-1"
//                         >
//                           {expandedItems[po.poId]
//                             ? "Show less"
//                             : `Show ${po.items.length - 2} more items`}
//                         </button>
//                       )}
//                       {expandedItems[po.poId] &&
//                         po.items.slice(2).map((item, index) => (
//                           <div
//                             key={index}
//                             className="text-sm text-gray-700 mb-1"
//                           >
//                             {item.itemName}
//                             <span className="text-gray-500 ml-2">
//                               ({item.quantity} {item.unit})
//                             </span>
//                           </div>
//                         ))}
//                     </div>

//                     {po.bills.length > 0 && (
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-2">
//                           Invoices
//                         </h4>
//                         {po.bills.map((bill, index) => (
//                           <div
//                             key={index}
//                             className="bg-white rounded border border-gray-200 p-3 mb-2"
//                           >
//                             <div className="text-sm font-medium text-gray-900">
//                               {bill.invoiceNumber || "No Invoice#"}
//                             </div>
//                             <div className="text-xs text-gray-500 mb-2">
//                               {formatDate(bill.createdAt)}
//                             </div>
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() =>
//                                   handlePdfAction(
//                                     bill.fileUrl,
//                                     bill.invoiceNumber,
//                                     "download",
//                                   )
//                                 }
//                                 disabled={downloadingPdf[bill.id]}
//                                 className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
//                               >
//                                 {downloadingPdf[bill.id] ? (
//                                   <>
//                                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
//                                     Downloading...
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Download className="h-3 w-3 mr-1" />
//                                     Download
//                                   </>
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handlePdfAction(
//                                     bill.fileUrl,
//                                     bill.invoiceNumber,
//                                     "view",
//                                   )
//                                 }
//                                 className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
//                               >
//                                 <ExternalLink className="h-3 w-3 mr-1" />
//                                 View
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       ) : (
//         /* Desktop Table View */
//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-black-500">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-4 text-left text-xs font-medium text-dark uppercase tracking-wider"
//                   >
//                     PO Details
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-4 text-left text-xs font-medium text-dark uppercase tracking-wider"
//                   >
//                     Company & Vendor
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-4 text-left text-xs font-medium text-dark uppercase tracking-wider"
//                   >
//                     Amount
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-4 text-left text-xs font-medium text-dark uppercase tracking-wider"
//                   >
//                     Bills
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-4 text-left text-xs font-medium text-dark uppercase tracking-wider"
//                   >
//                     Status
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-4 text-left text-xs font-medium text-dark uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   Array.from({ length: 5 }).map((_, index) => (
//                     <SkeletonRow key={index} />
//                   ))
//                 ) : paginatedOrders.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-12 text-center">
//                       <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">
//                         No purchase orders found
//                       </h3>
//                       <p className="text-gray-600 mb-4">
//                         Try adjusting your filters or search term
//                       </p>
//                       <button
//                         onClick={clearAllFilters}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                       >
//                         Clear all filters
//                       </button>
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedOrders.map((po) => (
//                     <React.Fragment key={po.poId}>
//                       {/* Main Row */}
//                       <tr className="hover:bg-gray-50 transition-colors duration-150">
//                         {/* PO Details */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center">
//                             <button
//                               onClick={() => toggleRowExpansion(po.poId)}
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter" || e.key === " ") {
//                                   e.preventDefault();
//                                   toggleRowExpansion(po.poId);
//                                 }
//                               }}
//                               className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
//                               aria-label={
//                                 expandedRows[po.poId]
//                                   ? "Collapse details"
//                                   : "Expand details"
//                               }
//                               aria-expanded={expandedRows[po.poId]}
//                             >
//                               {expandedRows[po.poId] ? (
//                                 <ChevronUp size={16} />
//                               ) : (
//                                 <ChevronDown size={16} />
//                               )}
//                             </button>
//                             <div>
//                               <div className="text-sm font-semibold text-gray-900">
//                                 {po.poNumber}
//                               </div>
//                               <div className="text-sm text-gray-500 flex items-center">
//                                 <Calendar className="h-3 w-3 mr-1" />
//                                 {formatDate(po.poDate)}
//                               </div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Company & Vendor */}
//                         <td className="px-6 py-4">
//                           <div>
//                             <div className="flex items-center text-sm font-medium text-gray-900">
//                               <Building className="h-3 w-3 mr-1 text-gray-400" />
//                               {po.companyName}
//                             </div>
//                             <div className="flex items-center text-sm text-gray-600 mt-1">
//                               <User className="h-3 w-3 mr-1 text-gray-400" />
//                               {po.vendorName}
//                             </div>
//                           </div>
//                         </td>

//                         {/* Amount */}
//                         <td className="px-6 py-4">
//                           <div>
//                             <div className="text-sm font-semibold text-gray-900">
//                               {formatCurrency(po.grandTotal, po.currency)}
//                             </div>
//                             <div className="text-sm text-green-600">
//                               Paid: {formatCurrency(po.totalPaid, po.currency)}
//                             </div>
//                             <div className="text-sm text-orange-600">
//                               Due:{" "}
//                               {formatCurrency(po.remainingAmount, po.currency)}
//                             </div>
//                             <div className="text-xs text-gray-500 mt-1">
//                               Currency: {po.currency} (
//                               {getCurrencySymbol(po.currency)})
//                             </div>
//                           </div>
//                         </td>

//                         {/* Bills */}
//                         <td className="px-6 py-4">
//                           <div className="space-y-2">
//                             {po.bills.length > 0 ? (
//                               <div>
//                                 <div className="flex items-center space-x-2 mb-1">
//                                   <FileText
//                                     size={14}
//                                     className="text-blue-500"
//                                   />
//                                   <span className="text-sm font-medium text-gray-900">
//                                     {po.bills.length} bill
//                                     {po.bills.length > 1 ? "s" : ""}
//                                   </span>
//                                 </div>
//                                 <div className="text-xs text-gray-500">
//                                   Latest:{" "}
//                                   {po.bills[0].invoiceNumber || "No Invoice#"}
//                                 </div>
//                               </div>
//                             ) : (
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                 No Bills
//                               </span>
//                             )}
//                           </div>
//                         </td>

//                         {/* Status */}
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col space-y-2">
//                             <span
//                               className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                                 po.hasBill
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-yellow-100 text-yellow-800"
//                               }`}
//                             >
//                               {po.hasBill
//                                 ? "Invoice Attached"
//                                 : "Pending Invoice"}
//                             </span>
//                           </div>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-6 py-4">
//                           <button
//                             onClick={() => toggleRowExpansion(po.poId)}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" || e.key === " ") {
//                                 e.preventDefault();
//                                 toggleRowExpansion(po.poId);
//                               }
//                             }}
//                             className="inline-flex items-center px-3 py-1.5 border 
//                             border-gray-300 text-sm font-medium rounded-md 
//                             text-white bg-green-500  focus:outline-none 
//                             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                             aria-expanded={expandedRows[po.poId]}
//                           >
//                             {expandedRows[po.poId] ? (
//                               <>
//                                 <ChevronUp size={14} className="mr-1" />
//                                 Hide Details
//                               </>
//                             ) : (
//                               <>
//                                 <ChevronDown size={14} className="mr-1" />
//                                 View Details
//                               </>
//                             )}
//                           </button>
//                         </td>
//                       </tr>

//                       {/* Expanded Details Row */}
//                       {expandedRows[po.poId] && (
//                         <tr className="bg-gray-50">
//                           <td colSpan="7" className="px-6 py-4">
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                               {/* Items Details */}
//                               <div>
//                                 <h3 className="text-lg font-medium text-dark mb-3 flex items-center">
//                                   <FileText size={18} className="mr-2" />
//                                   PO Items Details
//                                   <span
//                                     className="ml-2 inline-flex items-center px-2.5 
//                                   py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//                                   >
//                                     {po.items.length} items
//                                   </span>
//                                 </h3>
//                                 <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                                   <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//                                     <div className="grid grid-cols-12 text-sm font-medium text-gray-700">
//                                       <div className="col-span-7">
//                                         Item Name
//                                       </div>

//                                       <div className="col-span-2 text-right">
//                                         Quantity
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
//                                     {po.items.map((item, index) => (
//                                       <div
//                                         key={index}
//                                         className="px-4 py-3 grid grid-cols-12 items-center hover:bg-gray-50"
//                                       >
//                                         <div className="col-span-7">
//                                           <div className="text-sm font-medium text-gray-900">
//                                             {item.itemName}
//                                           </div>
//                                         </div>

//                                         <div className="col-span-2 text-right text-sm text-gray-700">
//                                           {item.quantity} {item.unit}
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Bills Details */}
//                               <div>
//                                 <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
//                                   <FileText size={18} className="mr-2" />
//                                   Invoice Details
//                                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                     {po.bills.length} invoices
//                                   </span>
//                                 </h3>
//                                 {po.bills.length > 0 ? (
//                                   <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
//                                     {po.bills.map((bill, index) => (
//                                       <div
//                                         key={bill.id}
//                                         className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors"
//                                       >
//                                         <div className="flex space-x-3">
//                                           <button
//                                             onClick={() =>
//                                               handlePdfAction(
//                                                 bill.fileUrl,
//                                                 bill.invoiceNumber,
//                                                 "download",
//                                               )
//                                             }
//                                             disabled={downloadingPdf[bill.id]}
//                                             className="inline-flex items-center px-3 py-2 border border-transparent
//                                              text-sm font-medium rounded-md shadow-sm text-dark 
//                                              bg-yellow-400  focus:outline-none 
//                                              focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 
//                                              disabled:opacity-50 transition-colors"
//                                           >
//                                             {downloadingPdf[bill.id] ? (
//                                               <>
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                                 Downloading...
//                                               </>
//                                             ) : (
//                                               <>
//                                                 <Download
//                                                   size={16}
//                                                   className="mr-2"
//                                                 />
//                                                 Download PDF
//                                               </>
//                                             )}
//                                           </button>
//                                           <button
//                                             onClick={() =>
//                                               handlePdfAction(
//                                                 bill.fileUrl,
//                                                 bill.invoiceNumber,
//                                                 "view",
//                                               )
//                                             }
//                                             className="inline-flex items-center px-3 py-2 border 
//                                             border-gray-300 text-sm font-medium rounded-md 
//                                             text-dark bg-yellow-400 focus:outline-none 
//                                             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                                           >
//                                             <ExternalLink
//                                               size={16}
//                                               className="mr-2"
//                                             />
//                                             View in Browser
//                                           </button>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 ) : (
//                                   <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
//                                     <FileText
//                                       size={48}
//                                       className="mx-auto text-gray-400 mb-3"
//                                     />
//                                     <h4 className="text-lg font-medium text-gray-900 mb-2">
//                                       No Invoices Attached
//                                     </h4>
//                                     <p className="text-gray-600">
//                                       No bills or invoices have been uploaded
//                                       for this purchase order.
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Bottom Pagination */}
//       {filteredOrders.length > itemsPerPage && (
//         <div className="mt-6 flex flex-col md:flex-row items-center justify-between">
//           <div className="text-sm text-gray-600 mb-4 md:mb-0">
//             Showing {startIndex + 1} to{" "}
//             {Math.min(endIndex, filteredOrders.length)} of{" "}
//             {filteredOrders.length} entries
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setCurrentPage(1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               aria-label="First page"
//             >
//               «
//             </button>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               aria-label="Previous page"
//             >
//               ‹
//             </button>

//             {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
//               let pageNum;
//               if (totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (currentPage >= totalPages - 2) {
//                 pageNum = totalPages - 4 + i;
//               } else {
//                 pageNum = currentPage - 2 + i;
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   className={`px-3 py-1.5 border text-sm rounded ${
//                     currentPage === pageNum
//                       ? "bg-blue-600 text-white border-blue-600"
//                       : "border-gray-300 hover:bg-gray-50"
//                   }`}
//                   aria-label={`Page ${pageNum}`}
//                   aria-current={currentPage === pageNum ? "page" : undefined}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}

//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//               }
//               disabled={currentPage === totalPages}
//               className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               aria-label="Next page"
//             >
//               ›
//             </button>
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               aria-label="Last page"
//             >
//               »
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PoInvoice;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Api from "../../auth/Api";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  ExternalLink,
  Search,
  Filter,
  Building,
  User,
  Calendar,
  DollarSign,
  Percent,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import { useDebounce } from "../../hooks/UseDebounce";

const PoInvoice = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    hasBill: "all",
    company: "all",
    vendor: "all",
    currency: "all",
  });
  const [searchInput, setSearchInput] = useState("");
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalPaid: 0,
    totalRemaining: 0,
    totalPOs: 0,
    withBill: 0,
    withoutBill: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState([]);
  const [pdfError, setPdfError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState({});
  const [mobileView, setMobileView] = useState(false);

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  // Fetch data from both APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        
        // Fetch data from both APIs in parallel
        const [poResponse, vendorInvoicesResponse] = await Promise.all([
          Api.get("/verification-dept/purchase-orders/invoices"),
          Api.get("/common/vendors/invoices")
        ]);

        if (poResponse.data.success && vendorInvoicesResponse.data.success) {
          const poData = poResponse.data.data;
          const vendorInvoiceData = vendorInvoicesResponse.data.data;
          
          // Create a map of PO ID to vendor invoices for quick lookup
          const vendorInvoiceMap = new Map();
          vendorInvoiceData.forEach(item => {
            vendorInvoiceMap.set(item.poId, {
              vendorId: item.vendorId,
              vendorName: item.vendorName,
              invoices: item.invoices || []
            });
          });

          // Merge the data
          const mergedData = poData.map(po => {
            const vendorInvoiceInfo = vendorInvoiceMap.get(po.poId);
            
            // If we have vendor invoice data, merge it with existing bills
            if (vendorInvoiceInfo) {
              const existingBills = po.bills || [];
              const vendorInvoices = vendorInvoiceInfo.invoices.map(invoice => ({
                ...invoice,
                // Add any additional fields to match your existing bill structure
                id: invoice.invoiceUrl?.split('/').pop() || `vendor-${Date.now()}`,
                fileUrl: invoice.invoiceUrl,
                invoiceNumber: invoice.invoiceNumber || 'No Invoice#',
                // Mark these as coming from vendor invoices
                source: 'vendor',
                createdAt: new Date().toISOString() // You might want to add actual dates if available
              }));

              // Merge and deduplicate based on invoiceUrl
              const allBills = [...existingBills, ...vendorInvoices];
              const uniqueBills = Array.from(
                new Map(allBills.map(bill => [bill.fileUrl, bill])).values()
              );

              return {
                ...po,
                bills: uniqueBills,
                // Update hasBill flag if there are any bills
                hasBill: uniqueBills.length > 0
              };
            }
            
            return po;
          });

          setPurchaseOrders(mergedData);
          setFilteredOrders(mergedData);

          // Calculate statistics
          const stats = {
            totalAmount: mergedData.reduce(
              (sum, po) => sum + (po.grandTotal || 0),
              0
            ),
            totalPaid: mergedData.reduce((sum, po) => sum + (po.totalPaid || 0), 0),
            totalRemaining: mergedData.reduce(
              (sum, po) => sum + (po.remainingAmount || 0),
              0
            ),
            totalPOs: mergedData.length,
            withBill: mergedData.filter((po) => po.hasBill).length,
            withoutBill: mergedData.filter((po) => !po.hasBill).length,
          };
          setStats(stats);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message || 
          "Failed to fetch purchase orders. Please try again later."
        );
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update search filter with debounced value
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // Track active filters
  useEffect(() => {
    const active = [];
    if (filters.search) active.push(`Search: "${filters.search}"`);
    if (filters.hasBill !== "all")
      active.push(
        `Bill Status: ${
          filters.hasBill === "with" ? "With Bills" : "Without Bills"
        }`
      );
    if (filters.company !== "all") active.push(`Company: ${filters.company}`);
    if (filters.vendor !== "all") active.push(`Vendor: ${filters.vendor}`);
    if (filters.currency !== "all")
      active.push(`Currency: ${filters.currency}`);
    setActiveFilters(active);
  }, [filters]);

  // Apply filters
  useEffect(() => {
    let filtered = [...purchaseOrders];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (po) =>
          po.poNumber?.toLowerCase().includes(searchLower) ||
          po.companyName?.toLowerCase().includes(searchLower) ||
          po.vendorName?.toLowerCase().includes(searchLower) ||
          po.currency?.toLowerCase().includes(searchLower) ||
          po.items?.some((item) =>
            item.itemName?.toLowerCase().includes(searchLower)
          ) ||
          po.bills?.some((bill) =>
            bill.invoiceNumber?.toLowerCase().includes(searchLower)
          )
      );
    }

    // Bill status filter
    if (filters.hasBill !== "all") {
      filtered = filtered.filter((po) =>
        filters.hasBill === "with" ? po.hasBill : !po.hasBill
      );
    }

    // Company filter
    if (filters.company !== "all") {
      filtered = filtered.filter((po) => po.companyName === filters.company);
    }

    // Vendor filter
    if (filters.vendor !== "all") {
      filtered = filtered.filter((po) => po.vendorName === filters.vendor);
    }

    // Currency filter
    if (filters.currency !== "all") {
      filtered = filtered.filter((po) => po.currency === filters.currency);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, purchaseOrders]);

  // Get unique companies, vendors, and currencies for filters
  const companies = useMemo(
    () => [
      ...new Set(purchaseOrders.map((po) => po.companyName).filter(Boolean)),
    ],
    [purchaseOrders]
  );

  const vendors = useMemo(
    () => [
      ...new Set(purchaseOrders.map((po) => po.vendorName).filter(Boolean)),
    ],
    [purchaseOrders]
  );

  const currencies = useMemo(
    () => [...new Set(purchaseOrders.map((po) => po.currency).filter(Boolean))],
    [purchaseOrders]
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = useMemo(
    () => filteredOrders.slice(startIndex, endIndex),
    [filteredOrders, startIndex, endIndex]
  );

  // Toggle row expansion
  const toggleRowExpansion = useCallback((poId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [poId]: !prev[poId],
    }));
  }, []);

  // Toggle items expansion
  const toggleItemsExpansion = useCallback((poId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [poId]: !prev[poId],
    }));
  }, []);

  // Handle PDF with better error handling and progress indication
  const handlePdfAction = async (fileUrl, invoiceNumber, action = "view") => {
    const poId = fileUrl.split("/").pop(); // Extract PO ID for tracking
    setDownloadingPdf((prev) => ({ ...prev, [poId]: true }));
    setPdfError(null);

    try {
      const fullUrl = `${import.meta.env.VITE_API_URL}${fileUrl}`;

      if (action === "download") {
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Failed to fetch PDF");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${invoiceNumber || "invoice"}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        window.open(fullUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error handling PDF:", error);
      setPdfError(
        `Failed to ${action} PDF. Please check the file URL or try again.`
      );
    } finally {
      setDownloadingPdf((prev) => ({ ...prev, [poId]: false }));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: "",
      hasBill: "all",
      company: "all",
      vendor: "all",
      currency: "all",
    });
    setSearchInput("");
  };

  // Remove specific filter
  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith("Search:")) {
      setFilters((prev) => ({ ...prev, search: "" }));
      setSearchInput("");
    } else if (filterToRemove.startsWith("Bill Status:")) {
      setFilters((prev) => ({ ...prev, hasBill: "all" }));
    } else if (filterToRemove.startsWith("Company:")) {
      setFilters((prev) => ({ ...prev, company: "all" }));
    } else if (filterToRemove.startsWith("Vendor:")) {
      setFilters((prev) => ({ ...prev, vendor: "all" }));
    } else if (filterToRemove.startsWith("Currency:")) {
      setFilters((prev) => ({ ...prev, currency: "all" }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    const currencySymbols = {
      USD: "$",
      INR: "₹",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
      CNY: "¥",
      // Add more currency codes as needed
    };
    return currencySymbols[currencyCode?.toUpperCase()] || currencyCode || "₹";
  };

  // Format currency with appropriate symbol and formatting
  const formatCurrency = (amount, currencyCode = "INR") => {
    const symbol = getCurrencySymbol(currencyCode);

    // For USD, use US formatting
    if (currencyCode?.toUpperCase() === "USD") {
      return `${symbol}${Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    // For INR, use Indian formatting
    if (currencyCode?.toUpperCase() === "INR") {
      return `${symbol} ${Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }

    // For CNY (Chinese Yuan), use Chinese formatting
    if (currencyCode?.toUpperCase() === "CNY") {
      return `${symbol}${Number(amount).toLocaleString("zh-CN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    // Default formatting for other currencies
    return `${symbol}${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Check screen size for mobile view
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded w-28"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </td>
    </tr>
  );

  if (initialLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading purchase orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Error Loading Data
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* PDF Error Alert */}
      {pdfError && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{pdfError}</span>
              <button
                onClick={() => setPdfError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search PO, Company, Vendor, Invoice#..."
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search purchase orders"
              />
            </div>
          </div>

          {/* Bill Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill Status
            </label>
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.hasBill}
              onChange={(e) =>
                setFilters({ ...filters, hasBill: e.target.value })
              }
              aria-label="Filter by bill status"
            >
              <option value="all">All Status</option>
              <option value="with">With Bills</option>
              <option value="without">Without Bills</option>
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.company}
                onChange={(e) =>
                  setFilters({ ...filters, company: e.target.value })
                }
                aria-label="Filter by company"
              >
                <option value="all">All Companies</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vendor Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.vendor}
                onChange={(e) =>
                  setFilters({ ...filters, vendor: e.target.value })
                }
                aria-label="Filter by vendor"
              >
                <option value="all">All Vendors</option>
                {vendors.map((vendor, index) => (
                  <option key={index} value={vendor}>
                    {vendor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Currency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.currency}
                onChange={(e) =>
                  setFilters({ ...filters, currency: e.target.value })
                }
                aria-label="Filter by currency"
              >
                <option value="all">All Currencies</option>
                {currencies.map((currency, index) => (
                  <option key={index} value={currency}>
                    {currency} ({getCurrencySymbol(currency)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    aria-label={`Remove filter ${filter}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-800 ml-2"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results and Pagination Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between">
        <div className="text-gray-600 mb-2 md:mb-0">
          Showing {filteredOrders.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}{" "}
          results
          {filters.search && ` for "${filters.search}"`}
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > itemsPerPage && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Purchase Orders Table/Cards */}
      {mobileView ? (
        /* Mobile Card View */
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))
          ) : paginatedOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No purchase orders found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search term
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            paginatedOrders.map((po) => (
              <div
                key={po.poId}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{po.poNumber}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(po.poDate)}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRowExpansion(po.poId)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={
                        expandedRows[po.poId]
                          ? "Collapse details"
                          : "Expand details"
                      }
                      aria-expanded={expandedRows[po.poId]}
                    >
                      {expandedRows[po.poId] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Company</div>
                      <div className="font-medium">{po.companyName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Vendor</div>
                      <div className="font-medium">{po.vendorName}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-gray-500">Amount</div>
                    <div className="font-bold text-lg">
                      {formatCurrency(po.grandTotal, po.currency)}
                    </div>
                    <div className="text-sm">
                      <span className="text-green-600">
                        Paid: {formatCurrency(po.totalPaid, po.currency)}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-orange-600">
                        Due: {formatCurrency(po.remainingAmount, po.currency)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Currency: {po.currency} ({getCurrencySymbol(po.currency)})
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          po.hasBill
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {po.hasBill ? "Invoice Attached" : "Pending Invoice"}
                      </span>
                      {po.bills.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {po.bills.length} bill{po.bills.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        {((po.totalPaid / po.grandTotal) * 100).toFixed(1)}%
                        Paid
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (po.totalPaid / po.grandTotal) * 100,
                              100
                            )}%`,
                            maxWidth: "100%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedRows[po.poId] && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                      {po.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-sm text-gray-700 mb-1">
                          {item.itemName}
                          <span className="text-gray-500 ml-2">
                            ({item.quantity} {item.unit})
                          </span>
                        </div>
                      ))}
                      {po.items.length > 2 && (
                        <button
                          onClick={() => toggleItemsExpansion(po.poId)}
                          className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                        >
                          {expandedItems[po.poId]
                            ? "Show less"
                            : `Show ${po.items.length - 2} more items`}
                        </button>
                      )}
                      {expandedItems[po.poId] &&
                        po.items.slice(2).map((item, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-700 mb-1"
                          >
                            {item.itemName}
                            <span className="text-gray-500 ml-2">
                              ({item.quantity} {item.unit})
                            </span>
                          </div>
                        ))}
                    </div>

                    {po.bills.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Invoices
                        </h4>
                        {po.bills.map((bill, index) => (
                          <div
                            key={bill.id || index}
                            className="bg-white rounded border border-gray-200 p-3 mb-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {bill.invoiceNumber || "No Invoice#"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(bill.createdAt)}
                                </div>
                                {bill.source === 'vendor' && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                    Vendor Invoice
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() =>
                                  handlePdfAction(
                                    bill.fileUrl,
                                    bill.invoiceNumber,
                                    "download"
                                  )
                                }
                                disabled={downloadingPdf[bill.id]}
                                className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                              >
                                {downloadingPdf[bill.id] ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handlePdfAction(
                                    bill.fileUrl,
                                    bill.invoiceNumber,
                                    "view"
                                  )
                                }
                                className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    PO Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Company & Vendor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bills
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No purchase orders found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your filters or search term
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Clear all filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((po) => (
                    <React.Fragment key={po.poId}>
                      {/* Main Row */}
                      <tr className="hover:bg-gray-50 transition-colors duration-150">
                        {/* PO Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleRowExpansion(po.poId)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggleRowExpansion(po.poId);
                                }
                              }}
                              className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                              aria-label={
                                expandedRows[po.poId]
                                  ? "Collapse details"
                                  : "Expand details"
                              }
                              aria-expanded={expandedRows[po.poId]}
                            >
                              {expandedRows[po.poId] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {po.poNumber}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(po.poDate)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Company & Vendor */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <Building className="h-3 w-3 mr-1 text-gray-400" />
                              {po.companyName}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <User className="h-3 w-3 mr-1 text-gray-400" />
                              {po.vendorName}
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(po.grandTotal, po.currency)}
                            </div>
                            <div className="text-sm text-green-600">
                              Paid: {formatCurrency(po.totalPaid, po.currency)}
                            </div>
                            <div className="text-sm text-orange-600">
                              Due:{" "}
                              {formatCurrency(po.remainingAmount, po.currency)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Currency: {po.currency} (
                              {getCurrencySymbol(po.currency)})
                            </div>
                          </div>
                        </td>

                        {/* Bills */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {po.bills.length > 0 ? (
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <FileText
                                    size={14}
                                    className="text-blue-500"
                                  />
                                  <span className="text-sm font-medium text-gray-900">
                                    {po.bills.length} bill
                                    {po.bills.length > 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Latest:{" "}
                                  {po.bills[0].invoiceNumber || "No Invoice#"}
                                </div>
                                {po.bills.some(bill => bill.source === 'vendor') && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                    Includes vendor invoices
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                No Bills
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                po.hasBill
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {po.hasBill
                                ? "Invoice Attached"
                                : "Pending Invoice"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleRowExpansion(po.poId)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleRowExpansion(po.poId);
                              }
                            }}
                            className="inline-flex items-center px-3 py-1.5 border 
                            border-gray-300 text-sm font-medium rounded-md 
                            text-white bg-green-500 hover:bg-green-600 focus:outline-none 
                            focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            aria-expanded={expandedRows[po.poId]}
                          >
                            {expandedRows[po.poId] ? (
                              <>
                                <ChevronUp size={14} className="mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} className="mr-1" />
                                View Details
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {expandedRows[po.poId] && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Items Details */}
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                  <FileText size={18} className="mr-2" />
                                  PO Items Details
                                  <span
                                    className="ml-2 inline-flex items-center px-2.5 
                                  py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {po.items.length} items
                                  </span>
                                </h3>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="grid grid-cols-12 text-sm font-medium text-gray-700">
                                      <div className="col-span-7">
                                        Item Name
                                      </div>
                                      <div className="col-span-2 text-right">
                                        Quantity
                                      </div>
                                    </div>
                                  </div>
                                  <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                                    {po.items.map((item, index) => (
                                      <div
                                        key={index}
                                        className="px-4 py-3 grid grid-cols-12 items-center hover:bg-gray-50"
                                      >
                                        <div className="col-span-7">
                                          <div className="text-sm font-medium text-gray-900">
                                            {item.itemName}
                                          </div>
                                        </div>
                                        <div className="col-span-2 text-right text-sm text-gray-700">
                                          {item.quantity} {item.unit}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Bills Details */}
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                  <FileText size={18} className="mr-2" />
                                  Invoice Details
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {po.bills.length} invoices
                                  </span>
                                </h3>
                                {po.bills.length > 0 ? (
                                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                                    {po.bills.map((bill, index) => (
                                      <div
                                        key={bill.id || index}
                                        className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors"
                                      >
                                        <div className="flex justify-between items-start mb-3">
                                          <div>
                                            <div className="text-sm font-medium text-gray-900">
                                              {bill.invoiceNumber || "No Invoice#"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {formatDate(bill.createdAt)}
                                            </div>
                                            {bill.source === 'vendor' && (
                                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                                Vendor Invoice
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex space-x-3">
                                          <button
                                            onClick={() =>
                                              handlePdfAction(
                                                bill.fileUrl,
                                                bill.invoiceNumber,
                                                "download"
                                              )
                                            }
                                            disabled={downloadingPdf[bill.id]}
                                            className="inline-flex items-center px-3 py-2 border border-transparent
                                             text-sm font-medium rounded-md shadow-sm text-white 
                                             bg-blue-600 hover:bg-blue-700 focus:outline-none 
                                             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                             disabled:opacity-50 transition-colors"
                                          >
                                            {downloadingPdf[bill.id] ? (
                                              <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Downloading...
                                              </>
                                            ) : (
                                              <>
                                                <Download
                                                  size={16}
                                                  className="mr-2"
                                                />
                                                Download PDF
                                              </>
                                            )}
                                          </button>
                                          <button
                                            onClick={() =>
                                              handlePdfAction(
                                                bill.fileUrl,
                                                bill.invoiceNumber,
                                                "view"
                                              )
                                            }
                                            className="inline-flex items-center px-3 py-2 border 
                                            border-gray-300 text-sm font-medium rounded-md 
                                            text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                                            focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                          >
                                            <ExternalLink
                                              size={16}
                                              className="mr-2"
                                            />
                                            View in Browser
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                    <FileText
                                      size={48}
                                      className="mx-auto text-gray-400 mb-3"
                                    />
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                      No Invoices Attached
                                    </h4>
                                    <p className="text-gray-600">
                                      No bills or invoices have been uploaded
                                      for this purchase order.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Pagination */}
      {filteredOrders.length > itemsPerPage && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredOrders.length)} of{" "}
            {filteredOrders.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              aria-label="First page"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              aria-label="Previous page"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 border text-sm rounded ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              aria-label="Next page"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              aria-label="Last page"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoInvoice;