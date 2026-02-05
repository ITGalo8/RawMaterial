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
} from "lucide-react";

const PoOrderDetails = () => {
  const [stockReceived, setStockReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/purchase/purchase-orders/receiving");
        if (response.data.success) {
          setStockReceived(response.data.data);
          setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
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

  const filteredData = useMemo(() => {
    const filtered = stockReceived.filter((po) => {
      if (statusFilter !== "all" && po.status !== statusFilter) return false;
      if (approvalFilter !== "all" && po.approvalStatus !== approvalFilter)
        return false;
      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase();
      switch (searchFilter) {
        case "poNumber":
          return po.poNumber.toLowerCase().includes(term);
        // case "company":
        //   return po.companyName.toLowerCase().includes(term);
        case "vendor":
          return po.vendorName.toLowerCase().includes(term);
        case "status":
          return po.status.toLowerCase().includes(term);
        case "all":
        default:
          return (
            po.poNumber.toLowerCase().includes(term) ||
            po.companyName.toLowerCase().includes(term) ||
            po.vendorName.toLowerCase().includes(term) ||
            po.warehouseName?.toLowerCase().includes(term) ||
            po.status.toLowerCase().includes(term) ||
            po.items.some(
              (item) =>
                item.itemName.toLowerCase().includes(term) ||
                item.modelNumber?.toLowerCase().includes(term) ||
                item.hsnCode?.toLowerCase().includes(term),
            )
          );
      }
    });

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
      setCurrentPage(1);
    }
    return filtered;
  }, [
    stockReceived,
    searchTerm,
    searchFilter,
    statusFilter,
    approvalFilter,
    itemsPerPage,
  ]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, currentPage, itemsPerPage]);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    setExpandedRows(new Set());
  };

  const nextPage = () =>
    currentPage < totalPages &&
    (setCurrentPage(currentPage + 1), setExpandedRows(new Set()));
  const prevPage = () =>
    currentPage > 1 &&
    (setCurrentPage(currentPage - 1), setExpandedRows(new Set()));

  const toggleRowExpand = (id) => {
    const newExpandedRows = new Set(expandedRows);
    newExpandedRows.has(id)
      ? newExpandedRows.delete(id)
      : newExpandedRows.add(id);
    setExpandedRows(newExpandedRows);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "PartiallyReceived":
        return "bg-yellow-100 text-yellow-800";
      case "FullyReceived":
        return "bg-green-100 text-green-800";
      case "Received":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "PartiallyReceived":
        return "Partially Received";
      case "FullyReceived":
        return "Fully Received";
      case "Received":
        return "Received";
      default:
        return status;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSearchFilter("all");
    setStatusFilter("all");
    setApprovalFilter("all");
    setCurrentPage(1);
  };

  const getStatusCounts = () => {
    const counts = {
      Draft: 0,
      PartiallyReceived: 0,
      FullyReceived: 0,
      Received: 0,
    };
    stockReceived.forEach((po) => {
      if (counts[po.status] !== undefined) {
        counts[po.status]++;
      }
    });
    return counts;
  };

  const getApprovalCounts = () => {
    const counts = { Pending: 0, Approved: 0, Rejected: 0 };
    stockReceived.forEach((po) => {
      if (counts[po.approvalStatus] !== undefined) {
        counts[po.approvalStatus]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const approvalCounts = getApprovalCounts();

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

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
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            PO Stock Receiving
          </h1>
         
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded shadow p-3 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Search ${searchFilter === "all" ? "all fields" : searchFilter}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Search Filter Dropdown */}
            <div className="w-full md:w-40">
              <select
                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="poNumber">PO Number</option>
                {/* <option value="company">Company</option> */}
                <option value="vendor">Vendor</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <select
                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Draft">Draft ({statusCounts.Draft})</option>
                <option value="PartiallyReceived">
                  Partially Received ({statusCounts.PartiallyReceived})
                </option>
                <option value="FullyReceived">
                  Fully Received ({statusCounts.FullyReceived})
                </option>
                <option value="Received">
                  Received ({statusCounts.Received})
                </option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="w-full md:w-32">
              <select
                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
                <option value="250">250 per page</option>
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-1" />
              {showAdvancedFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {/* Clear Filters */}
            {(searchTerm ||
              statusFilter !== "all" ||
              approvalFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  PO Date Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="To"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Warehouse
                </label>
                <select className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Warehouses</option>
                  <option value="Main">Main Warehouse</option>
                  <option value="East">East Warehouse</option>
                  <option value="West">West Warehouse</option>
                </select>
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-between items-center">
            <p className="text-xs text-gray-600">
              Showing <span className="font-medium">{currentItems.length}</span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              filtered POs (Total: {stockReceived.length} POs)
              {(searchTerm ||
                statusFilter !== "all" ||
                approvalFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="ml-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </p>
            <div className="text-xs text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
          </div>
        </div>

        {/* POs Table */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded shadow p-6 text-center">
            <Search className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No POs found matching your criteria</p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            )}
            {(statusFilter !== "all" || approvalFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded shadow overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "PO Details",
                        // "Company",
                        "Vendor",
                        "Warehouse Name",
                        "Status",
                        "Items",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((po) => (
                      <React.Fragment key={po.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
                            <div>{po.poNumber}</div>
                            <div className="text-xs text-gray-500">
                              {po.poDate
                                ? new Date(po.poDate).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </td>
                          {/* <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                            {po.companyName}
                          </td> */}
                          <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                            {po.vendorName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                            {po.warehouseName || "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClass(po.status)}`}
                            >
                              {getStatusDisplay(po.status)}
                            </span>
                            {po.approvalStatus &&
                              po.approvalStatus !== "Pending" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {po.approvalStatus}
                                </div>
                              )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                            {po.items.length} item(s)
                            {/* <div className="text-xs text-gray-500">
                              Total: {po.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} units
                            </div> */}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleRowExpand(po.id)}
                                className="text-blue-600 hover:text-blue-900 text-sm"
                              >
                                {expandedRows.has(po.id)
                                  ? "Hide Items"
                                  : "View Items"}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedRows.has(po.id) && (
                          <tr>
                            <td colSpan="7" className="px-4 py-2 bg-gray-50">
                              <div className="border border-gray-200 rounded overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      {[
                                        "Item Name",
                                        "HSN Code",
                                        "Model",
                                        "Unit",
                                        "Ordered",
                                        "Received",
                                        "Pending",
                                        "Status",
                                      ].map((header) => (
                                        <th
                                          key={header}
                                          className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {po.items.map((item) => {
                                      const isFullyReceived =
                                        item.receivedQty >= item.quantity;
                                      const isPartiallyReceived =
                                        item.receivedQty > 0 &&
                                        item.receivedQty < item.quantity;
                                      const isNotReceived =
                                        item.receivedQty === 0;

                                      return (
                                        <tr
                                          key={item.id}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="px-3 py-1.5 text-gray-900">
                                            {item.itemName}
                                          </td>
                                          <td className="px-3 py-1.5 text-gray-500">
                                            {item.hsnCode || "N/A"}
                                          </td>
                                          <td className="px-3 py-1.5 text-gray-500">
                                            {item.modelNumber || "N/A"}
                                          </td>
                                          <td className="px-3 py-1.5 text-gray-500">
                                            {item.unit}
                                          </td>
                                          <td className="px-3 py-1.5 text-gray-900 font-medium">
                                            {item.quantity.toLocaleString()}
                                          </td>
                                          <td
                                            className={`px-3 py-1.5 ${isFullyReceived ? "text-green-600" : isPartiallyReceived ? "text-yellow-600" : "text-gray-500"} font-medium`}
                                          >
                                            {item.receivedQty.toLocaleString()}
                                          </td>
                                          <td
                                            className={`px-3 py-1.5 ${item.pendingQty > 0 ? "text-orange-600" : "text-green-600"} font-medium`}
                                          >
                                            {item.pendingQty.toLocaleString()}
                                          </td>
                                          <td className="px-3 py-1.5">
                                            <span
                                              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                                isFullyReceived
                                                  ? "bg-green-100 text-green-800"
                                                  : isPartiallyReceived
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-gray-100 text-gray-800"
                                              }`}
                                            >
                                              {isFullyReceived
                                                ? "Fully Received"
                                                : isPartiallyReceived
                                                  ? "Partially Received"
                                                  : "Not Received"}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
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
            <div className="bg-white rounded shadow px-3 py-2 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border border-gray-300 text-sm rounded ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`ml-2 px-3 py-1 border border-gray-300 text-sm rounded ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredData.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredData.length}</span>{" "}
                    results
                  </p>
                </div>
                <nav className="relative z-0 inline-flex rounded shadow-sm -space-x-px">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className={`px-1.5 py-1 rounded-l border border-gray-300 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-1.5 py-1 border border-gray-300 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-2.5 py-1 border text-sm ${currentPage === pageNum ? "bg-blue-50 border-blue-500 text-blue-600" : "border-gray-300 text-gray-500 hover:bg-gray-50"}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-1.5 py-1 border border-gray-300 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-1.5 py-1 rounded-r border border-gray-300 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>

            {/* Page Jump */}
            <div className="mt-3 flex justify-center">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm text-gray-700">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) goToPage(page);
                  }}
                  className="w-16 px-2 py-0.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

export default PoOrderDetails;
