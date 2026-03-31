import React, { useEffect, useState, useMemo } from "react";
import Api from "../../auth/Api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";

const PoOrderDetails = () => {
  const [stockReceived, setStockReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState(""); // "" means "All"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [flowUps, setFlowUps] = useState({});

  // Follow-up modal state
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedPo, setSelectedPo] = useState(null); // { id, vendorId }
  const [followUpData, setFollowUpData] = useState({
    expectedDeliveryDate: "",
    remark: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/purchase/purchase-orders/receiving");
        if (response.data.success) {
          const receivedData = response.data.data || [];
          setStockReceived(receivedData);
          setTotalPages(
            Math.max(1, Math.ceil(receivedData.length / itemsPerPage)),
          );
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

  const fetchFlowUp = async (poId, forceRefresh = false) => {
    if (!forceRefresh && flowUps[poId]) {
      setFlowUps((prev) => {
        const updated = { ...prev };
        delete updated[poId];
        return updated;
      });
      return;
    }

    try {
      const response = await Api.get(
        `/common/purchase-orders/${poId}/follow-ups`,
      );

      if (response.data.success) {
        setFlowUps((prev) => ({
          ...prev,
          [poId]: response.data.data || [],
        }));
      }
    } catch (err) {
      console.error("Error fetching follow-ups:", err);
    }
  };

  // Extract unique warehouses from the data (handle null/empty)
  const warehouseOptions = useMemo(() => {
    const warehouses = new Set();
    stockReceived.forEach((po) => {
      const name = po.warehouseName?.trim();
      if (name) {
        warehouses.add(name);
      } else {
        warehouses.add("__none__"); // special marker for no warehouse
      }
    });
    return Array.from(warehouses).map((w) => ({
      value: w,
      label: w === "__none__" ? "No Warehouse" : w,
    }));
  }, [stockReceived]);

  // Filter data based on search term and warehouse filter
  const filteredData = useMemo(() => {
    const filtered = stockReceived.filter((po) => {
      // Warehouse filter
      if (warehouseFilter) {
        const poWarehouse = po.warehouseName?.trim();
        if (warehouseFilter === "__none__") {
          if (poWarehouse) return false; // has warehouse, exclude
        } else {
          if (poWarehouse !== warehouseFilter) return false;
        }
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
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
    });

    const calculatedTotalPages = Math.max(
      1,
      Math.ceil(filtered.length / itemsPerPage),
    );
    setTotalPages(calculatedTotalPages);
    if (currentPage > calculatedTotalPages) {
      setCurrentPage(1);
    }
    return filtered;
  }, [stockReceived, searchTerm, warehouseFilter, itemsPerPage, currentPage]);

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

  // Follow-up handlers
  const flowUpData = (poId, vendorId) => {
    setSelectedPo({ id: poId, vendorId });
    setFollowUpData({ expectedDeliveryDate: "", remark: "" });
    setModalMessage({ type: "", text: "" });
    setShowFollowUpModal(true);
  };

  const handleFollowUpChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if (!followUpData.expectedDeliveryDate) {
      setModalMessage({
        type: "error",
        text: "Expected delivery date is required.",
      });
      return;
    }
    if (!followUpData.remark.trim()) {
      setModalMessage({ type: "error", text: "Remark is required." });
      return;
    }

    setSubmitting(true);
    setModalMessage({ type: "", text: "" });

    try {
      const payload = {
        purchaseOrderId: selectedPo.id,
        vendorId: selectedPo.vendorId,
        expectedDeliveryDate: new Date(
          followUpData.expectedDeliveryDate,
        ).toISOString(),
        remark: followUpData.remark.trim(),
      };
      const response = await Api.post(
        "/common/purchase-orders/follow-up",
        payload,
      );
      if (response.data.success) {
        await fetchFlowUp(selectedPo.id, true);
        setModalMessage({
          type: "success",
          text: "Follow-up submitted successfully!",
        });
        setTimeout(() => {
          setShowFollowUpModal(false);
          setSelectedPo(null);
          setFollowUpData({ expectedDeliveryDate: "", remark: "" });
        }, 1500);
      } else {
        setModalMessage({
          type: "error",
          text: response.data.message || "Failed to submit follow-up.",
        });
      }
    } catch (err) {
      console.error("Error submitting follow-up:", err);
      setModalMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    if (!submitting) {
      setShowFollowUpModal(false);
      setSelectedPo(null);
      setModalMessage({ type: "", text: "" });
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
    setWarehouseFilter("");
    setCurrentPage(1);
  };

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

        {/* Search, Warehouse Filter, and Items Per Page */}
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
                  placeholder="Search all fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Warehouse Filter */}
            <div className="w-full md:w-48">
              <select
                className="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={warehouseFilter}
                onChange={(e) => {
                  setWarehouseFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Warehouses</option>
                {warehouseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
          </div>

          {/* Filter summary and clear button */}
          <div className="mt-3 flex justify-between items-center">
            <p className="text-xs text-gray-600">
              Showing <span className="font-medium">{currentItems.length}</span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              filtered POs (Total: {stockReceived.length} POs)
              {(searchTerm || warehouseFilter) && (
                <button
                  onClick={clearFilters}
                  className="ml-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
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
            {(searchTerm || warehouseFilter) && (
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters
              </p>
            )}
            {(searchTerm || warehouseFilter) && (
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                        PO Details
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warehouse Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Follow Up
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Follow Up History
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((po) => (
                      <React.Fragment key={po.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 sticky left-0 bg-white z-10">
                            <div>{po.poNumber}</div>
                            <div className="text-xs text-gray-500">
                              {po.poDate
                                ? new Date(po.poDate).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </td>
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
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {po.status !== "Received" && (
                                <button
                                  onClick={() => flowUpData(po.id, po.vendorId)}
                                  className="text-red-600 text-sm"
                                >
                                  Fill Form
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-2 whitespace-nowrap">
                            <button
                              onClick={() => fetchFlowUp(po.id)}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              {flowUps[po.id] ? "Hide History" : "View History"}
                            </button>
                          </td>
                        </tr>
                        {flowUps[po.id] && (
                          <tr>
                            <td colSpan="8" className="px-4 py-2 bg-gray-100">
                              <div className="border rounded p-3">
                                <h4 className="font-semibold mb-2 text-sm">
                                  Follow-up History
                                </h4>

                                {flowUps[po.id].length === 0 ? (
                                  <p className="text-gray-500 text-sm">
                                    No follow-ups found
                                  </p>
                                ) : (
                                  <ul className="space-y-2">
                                    {flowUps[po.id].map((f) => (
                                      <li
                                        key={f.id}
                                        className="text-sm border-b pb-1"
                                      >
                                        <div>
                                          📅{" "}
                                          {new Date(
                                            f.expectedDeliveryDate,
                                          ).toLocaleDateString()}
                                        </div>
                                        <div>📝 {f.remark}</div>
                                        <div className="text-xs text-gray-500">
                                          By: {f.createdBy} |{" "}
                                          {new Date(
                                            f.createdAt,
                                          ).toLocaleString()}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                        {expandedRows.has(po.id) && (
                          <tr>
                            <td colSpan="8" className="px-4 py-2 bg-gray-50">
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
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`ml-2 px-3 py-1 border border-gray-300 text-sm rounded ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  aria-label="Next page"
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
                    aria-label="First page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-1.5 py-1 border border-gray-300 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-2.5 py-1 border text-sm ${currentPage === pageNum ? "bg-blue-50 border-blue-500 text-blue-600" : "border-gray-300 text-gray-500 hover:bg-gray-50"}`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={
                        currentPage === pageNum ? "page" : undefined
                      }
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-1.5 py-1 border border-gray-300 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-1.5 py-1 rounded-r border border-gray-300 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`}
                    aria-label="Last page"
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
                  type="text"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) goToPage(page);
                  }}
                  className="w-16 px-2 py-0.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Jump to page"
                />
                <span className="text-sm text-gray-700">of {totalPages}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Purchase Order Follow-up
                  </h3>
                  <button
                    onClick={closeModal}
                    disabled={submitting}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {modalMessage.text && (
                  <div
                    className={`mb-4 p-2 rounded text-sm ${
                      modalMessage.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {modalMessage.text}
                  </div>
                )}

                <form onSubmit={handleFollowUpSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="expectedDeliveryDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expected Delivery Date *
                    </label>
                    <input
                      type="date"
                      id="expectedDeliveryDate"
                      name="expectedDeliveryDate"
                      value={followUpData.expectedDeliveryDate}
                      onChange={handleFollowUpChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="remark"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Remark *
                    </label>
                    <textarea
                      id="remark"
                      name="remark"
                      rows="3"
                      value={followUpData.remark}
                      onChange={handleFollowUpChange}
                      required
                      placeholder="Add any remarks or notes..."
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    ></textarea>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                        submitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }`}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={submitting}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoOrderDetails;
