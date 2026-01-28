import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../../auth/Api";
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

const PoStockReceiving = () => {
  const [stockReceived, setStockReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  // Navigation hook
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Api.get(
          "/store-keeper/getPendingPOsForReceiving"
        );
        if (response.data.success) {
          setStockReceived(response.data.data);
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

  // Filter data based on search criteria
  const filteredData = useMemo(() => {
    const filtered = stockReceived.filter((po) => {
      // Apply status filter
      if (statusFilter !== "all" && po.status !== statusFilter) {
        return false;
      }

      // Apply approval filter
      if (approvalFilter !== "all" && po.approvalStatus !== approvalFilter) {
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
          return po.status.toLowerCase().includes(term);
        case "all":
        default:
          return (
            po.poNumber.toLowerCase().includes(term) ||
            po.companyName.toLowerCase().includes(term) ||
            po.vendorName.toLowerCase().includes(term) ||
            po.status.toLowerCase().includes(term) ||
            po.items.some(
              (item) =>
                item.itemName.toLowerCase().includes(term) ||
                item.modelNumber?.toLowerCase().includes(term) ||
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
  }, [
    stockReceived,
    searchTerm,
    searchFilter,
    statusFilter,
    approvalFilter,
    itemsPerPage,
  ]);

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

  const handleReceiveStock = (po) => {
    try {
      navigate('../received-purchase-stock', {
        state: { 
          poData: po,
          poId: po.id 
        }
      });
      
      console.log('Navigating with PO:', po.id, po.poNumber);
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Failed to navigate to receive stock page');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "PartiallyReceived":
        return "bg-yellow-100 text-yellow-800";
      case "FullyReceived":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    };
    stockReceived.forEach((po) => {
      if (counts[po.status] !== undefined) {
        counts[po.status]++;
      }
    });
    return counts;
  };

  const getApprovalCounts = () => {
    const counts = {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
    };
    stockReceived.forEach((po) => {
      if (counts[po.approvalStatus] !== undefined) {
        counts[po.approvalStatus]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const approvalCounts = getApprovalCounts();

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            PO Stock Receiving Data
          </h1>
          <p className="text-gray-600 mt-2">
            Manage pending purchase orders for stock receiving
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pending POs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stockReceived.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Filter className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Draft POs</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {statusCounts.Draft}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Partially Received</p>
                <p className="text-2xl font-bold text-orange-600">
                  {statusCounts.PartiallyReceived}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Showing</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {currentItems.length}
                  </p>
                  <span className="text-gray-400">/</span>
                  <p className="text-lg font-medium text-gray-600">
                    {filteredData.length}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="poNumber">PO Number</option>
                <option value="company">Company</option>
                <option value="vendor">Vendor</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="w-full md:w-32">
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            {(searchTerm ||
              statusFilter !== "all" ||
              approvalFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusFilter === "all"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      All ({stockReceived.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter("Draft")}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusFilter === "Draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Draft ({statusCounts.Draft})
                    </button>
                    <button
                      onClick={() => setStatusFilter("PartiallyReceived")}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusFilter === "PartiallyReceived"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Partial ({statusCounts.PartiallyReceived})
                    </button>
                  </div>
                </div>

                {/* Approval Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setApprovalFilter("all")}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        approvalFilter === "all"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      All ({stockReceived.length})
                    </button>
                    <button
                      onClick={() => setApprovalFilter("Pending")}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        approvalFilter === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Pending ({approvalCounts.Pending})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{currentItems.length}</span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              filtered POs (Total: {stockReceived.length} POs)
              {(searchTerm ||
                statusFilter !== "all" ||
                approvalFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </p>
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
          </div>
        </div>

        {/* POs Table */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No POs found matching your criteria
            </p>
            {searchTerm && (
              <p className="text-gray-400 mt-2">
                Try adjusting your search or filters
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        PO Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Company
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vendor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((po) => (
                      <React.Fragment key={po.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {po.poNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {po.companyName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {po.vendorName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                po.status
                              )}`}
                            >
                              {po.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {po.items.length} item(s)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleRowExpand(po.id)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              {expandedRows.has(po.id)
                                ? "Hide Items"
                                : "View Items"}
                            </button>
                            <button 
                              onClick={() => handleReceiveStock(po)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Receive Stock
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(po.id) && (
                          <tr>
                            <td colSpan="9" className="px-6 py-4 bg-gray-50">
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Item Name
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        HSN Code
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Model
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Unit
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Ordered
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Received
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Pending
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {po.items.map((item) => (
                                      <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-4 py-2 text-sm text-gray-900">
                                          {item.itemName}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                          {item.hsnCode}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                          {item.modelNumber || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                          {item.unit}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                                          {item.quantity}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-green-600 font-medium">
                                          {item.receivedQty}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-orange-600 font-medium">
                                          {item.pendingQty}
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
            <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
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
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
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
                        filteredData.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredData.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    {/* First Page Button */}
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">First</span>
                      <ChevronsLeft className="h-5 w-5" />
                    </button>

                    {/* Previous Page Button */}
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Page Button */}
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Last Page Button */}
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Last</span>
                      <ChevronsRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
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
                  className="w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

export default PoStockReceiving;