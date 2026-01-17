import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";

const PoPaymentDetails = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((request) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          request.poNumber?.toLowerCase().includes(searchLower) ||
          request.vendorName?.toLowerCase().includes(searchLower) ||
          request.companyName?.toLowerCase().includes(searchLower) ||
          request.paymentRequestId?.toLowerCase().includes(searchLower) ||
          request.requestedAmount?.toString().includes(searchTerm) ||
          request.currency?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const fetchPaymentRequests = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/purchase/purchase-orders/payments/show");
      setData(response?.data?.data || []);
      setFilteredData(response?.data?.data || []);
    } catch (err) {
      setError("Failed to connect to server");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (paymentRequestId) => {
    setExpandedRows(prev => ({
      ...prev,
      [paymentRequestId]: !prev[paymentRequestId]
    }));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
    return currencySymbols[currencyCode?.toUpperCase()] || currencyCode || "$";
  };

  const formatAmount = (amount, currencyCode) => {
    const symbol = getCurrencySymbol(currencyCode);
    
    // For USD, use standard US formatting
    if (currencyCode?.toUpperCase() === 'USD') {
      return `${symbol}${Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    
    // For INR, use Indian formatting
    if (currencyCode?.toUpperCase() === 'INR') {
      return `${symbol} ${Number(amount).toLocaleString("en-IN")}`;
    }
    
    // Default formatting for other currencies
    return `${symbol}${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getVerificationStatus = (verification) => {
    if (verification.status === true) return "Approved";
    if (verification.status === false) return "Rejected";
    return "Pending";
  };

  const getVerificationColor = (verification) => {
    if (verification.status === true) return "bg-green-100 text-green-800";
    if (verification.status === false) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getOverallStatus = (request) => {
    const docs = request.docsVerification?.status;
    const admin = request.adminVerification?.status;
    const accounts = request.accountsVerification?.status;
    
    if (accounts === true) return "Completed";
    if (accounts === false) return "Rejected by Accounts";
    if (admin === true) return "Admin Approved";
    if (admin === false) return "Rejected by Admin";
    if (docs === true) return "Docs Verified";
    if (docs === false) return "Rejected by Docs";
    return "Pending";
  };

  const getOverallStatusColor = (request) => {
    const status = getOverallStatus(request);
    if (status === "Completed") return "bg-green-100 text-green-800";
    if (status.includes("Rejected")) return "bg-red-100 text-red-800";
    if (status.includes("Approved") || status.includes("Verified")) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Payment Requests
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by PO, Vendor, Company, Amount, Currency..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filteredData.length} of {data.length} requests
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && filteredData.length === 0 && (
        <div className="text-center py-10">
          <div className="text-gray-400 text-5xl mb-4">💳</div>
          <p className="text-gray-500 text-lg">
            {searchTerm ? "No matching payment requests found" : "No payment requests found"}
          </p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {!loading && filteredData.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-3">PO Number</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3">Overall Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((request) => (
                <React.Fragment key={request.paymentRequestId}>
                  <tr className="border-t hover:bg-gray-50 text-sm transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {request.poNumber}
                    </td>
                    <td className="px-6 py-4">
                      {request.companyName}
                    </td>
                    <td className="px-6 py-4">
                      {request.vendorName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-blue-700">
                        {formatAmount(request.requestedAmount, request.currency)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {request.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getOverallStatusColor(request)}`}>
                        {getOverallStatus(request)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRowExpansion(request.paymentRequestId)}
                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span className="mr-2">
                          {expandedRows[request.paymentRequestId] ? 'Hide' : 'View'} Details
                        </span>
                        <span className={`transform transition-transform ${
                          expandedRows[request.paymentRequestId] ? 'rotate-180' : ''
                        }`}>
                          ▼
                        </span>
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRows[request.paymentRequestId] && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="px-6 py-4">
                        <div className="ml-4 pl-4 border-l-2 border-blue-200">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium text-gray-700">
                              Payment Request Details
                            </h4>
                            <div className="text-sm text-gray-500">
                              Requested by: <span className="font-medium">{request.requestedBy}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

                            {/* Docs Verification */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <h5 className="font-semibold text-gray-800 mb-3">Document Verification</h5>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Status:</span>
                                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getVerificationColor(request.docsVerification)}`}>
                                    {getVerificationStatus(request.docsVerification)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Approved By:</span>
                                  <span className="ml-2 font-medium">{request.docsVerification.approvedBy || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <span className="ml-2">{formatDate(request.docsVerification.approvedDate)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Remarks:</span>
                                  <span className="ml-2">{request.docsVerification.remarks || "No remarks"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Admin Verification */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <h5 className="font-semibold text-gray-800 mb-3">Admin Verification</h5>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Status:</span>
                                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getVerificationColor(request.adminVerification)}`}>
                                    {getVerificationStatus(request.adminVerification)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Approved By:</span>
                                  <span className="ml-2 font-medium">{request.adminVerification.approvedBy || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <span className="ml-2">{formatDate(request.adminVerification.approvedDate)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Remarks:</span>
                                  <span className="ml-2">{request.adminVerification.remarks || "No remarks"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Accounts Verification */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <h5 className="font-semibold text-gray-800 mb-3">Accounts Verification</h5>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Status:</span>
                                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getVerificationColor(request.accountsVerification)}`}>
                                    {getVerificationStatus(request.accountsVerification)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Approved By:</span>
                                  <span className="ml-2 font-medium">{request.accountsVerification.approvedBy || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <span className="ml-2">{formatDate(request.accountsVerification.approvedDate)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Remarks:</span>
                                  <span className="ml-2">{request.accountsVerification.remarks || "No remarks"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          <p>
            Showing {filteredData.length} of {data.length} payment requests
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PoPaymentDetails;