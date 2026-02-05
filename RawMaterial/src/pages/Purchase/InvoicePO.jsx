import React, { useState, useEffect } from "react";
import Api from "../../auth/Api";

const InvoicePO = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Invoice state
  const [invoices, setInvoices] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState(null);
  const [expandedPOs, setExpandedPOs] = useState({});

  // Fetch all vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/purchase/vendors");

        if (response.data.success) {
          setVendors(response?.data?.data);
        } else {
          setError("Failed to fetch vendors: " + response?.data?.message);
        }
      } catch (err) {
        setError(
          "Error fetching vendors: " + err?.response?.data?.message ||
            err?.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!selectedVendor) {
        setInvoices([]);
        return;
      }

      try {
        setInvoiceLoading(true);
        setInvoiceError(null);
        const response = await Api.get(
          `/common/vendors/invoices?vendorId=${selectedVendor}`,
        );

        if (response.data.success) {
          setInvoices(response.data.data);
        } else {
          setInvoiceError("Failed to fetch invoices");
        }
      } catch (err) {
        setInvoiceError("Error fetching invoices: " + err.message);
      } finally {
        setInvoiceLoading(false);
      }
    };

    fetchInvoices();
  }, [selectedVendor]);

  // Filter vendors based on search term
  const filteredVendors = vendors.filter((vendor) =>
    vendor.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle vendor selection
  const handleVendorSelect = (vendorId, displayName) => {
    setSelectedVendor(vendorId);
    setSelectedVendorName(displayName);
    setSearchTerm(displayName);
    setIsDropdownOpen(false);
    setExpandedPOs({}); // Reset expanded state
  };

  // Handle input change for search
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedVendor("");
    setSelectedVendorName("");
    setInvoices([]);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  // Toggle PO expansion
  const togglePOExpansion = (poId) => {
    setExpandedPOs((prev) => ({
      ...prev,
      [poId]: !prev[poId],
    }));
  };

  // Clear selection
  const handleClear = () => {
    setSelectedVendor("");
    setSelectedVendorName("");
    setSearchTerm("");
    setInvoices([]);
  };

  // Format the full URL for invoice file
  const getInvoiceUrl = (invoiceUrl) => {
    try {
      // If invoiceUrl is empty or null, return empty string
      if (!invoiceUrl) {
        console.warn("Invoice URL is empty");
        return "";
      }

      // Debug logging
      console.log("Original invoice URL from API:", invoiceUrl);
      console.log("Api object structure:", {
        hasDefaults: !!Api.defaults,
        baseURL: Api.defaults?.baseURL,
        isString: typeof Api === 'string'
      });

      // If invoiceUrl is already a full URL, return it
      if (invoiceUrl.startsWith('http://') || invoiceUrl.startsWith('https://')) {
        console.log("Returning full URL:", invoiceUrl);
        return invoiceUrl;
      }

      // Determine the base URL
      let baseURL = "";
      
      // Check if Api is a string (direct URL)
      if (typeof Api === 'string') {
        baseURL = Api;
      }
      // Check if Api has defaults with baseURL
      else if (Api.defaults && Api.defaults.baseURL) {
        baseURL = Api.defaults.baseURL;
      }
      // Fallback to environment variable
      else if (process.env.REACT_APP_API_URL) {
        baseURL = process.env.REACT_APP_API_URL;
      }
      // If no base URL found, use current origin
      else {
        baseURL = window.location.origin;
      }

      // Ensure invoiceUrl starts with a slash if needed
      let normalizedInvoiceUrl = invoiceUrl;
      if (!normalizedInvoiceUrl.startsWith('/') && !baseURL.endsWith('/')) {
        normalizedInvoiceUrl = '/' + normalizedInvoiceUrl;
      }
      if (baseURL.endsWith('/') && normalizedInvoiceUrl.startsWith('/')) {
        normalizedInvoiceUrl = normalizedInvoiceUrl.substring(1);
      }

      const fullUrl = `${baseURL}${normalizedInvoiceUrl}`;
      console.log("Constructed full URL:", fullUrl);
      
      return fullUrl;
    } catch (error) {
      console.error("Error constructing invoice URL:", error);
      return "";
    }
  };

  // Handle PDF view with error checking
  const handleViewPDF = (invoiceUrl, invoiceNumber, e) => {
    const url = getInvoiceUrl(invoiceUrl);
    
    if (!url) {
      e.preventDefault();
      alert(`Unable to load PDF for invoice ${invoiceNumber}. The file URL is not available.`);
      return false;
    }
    
    // Open in new tab
    window.open(url, '_blank');
    e.preventDefault();
    return false;
  };

  // Handle PDF download
  const handleDownloadPDF = (invoiceUrl, invoiceNumber, e) => {
    const url = getInvoiceUrl(invoiceUrl);
    
    if (!url) {
      e.preventDefault();
      alert(`Unable to download PDF for invoice ${invoiceNumber}. The file URL is not available.`);
      return false;
    }
    
    // Create a temporary anchor for download
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    e.preventDefault();
    return false;
  };

  // Get file name from URL
  const getFileName = (url) => {
    if (!url) return "Unknown file";
    const parts = url.split('/');
    return parts[parts.length - 1] || "invoice.pdf";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Invoice Purchase Order</h1>

      <div className="space-y-6">
        {/* Vendor Selection Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Select Vendor</h2>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading vendors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="relative">
              {/* Search Input and Dropdown */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search vendors..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {searchTerm && (
                  <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && filteredVendors.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      onClick={() =>
                        handleVendorSelect(vendor.id, vendor.displayName)
                      }
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        selectedVendor === vendor.id
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      <div className="font-medium">{vendor.displayName}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* No results message */}
              {isDropdownOpen && searchTerm && filteredVendors.length === 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No vendors found matching "{searchTerm}"
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected Vendor Display */}
          {selectedVendor && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-green-800 mb-2">
                    Selected Vendor:
                  </h3>
                  <p className="text-green-700">{selectedVendorName}</p>
                </div>
                <button
                  onClick={handleClear}
                  className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                >
                  Change Vendor
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invoices Section */}
        {selectedVendor && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">
                Purchase Orders & Invoices
              </h2>
              {invoices.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  {invoices.length} PO{invoices.length !== 1 ? "s" : ""} found
                </span>
              )}
            </div>

            {invoiceLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 text-gray-600">Loading invoices...</p>
              </div>
            ) : invoiceError ? (
              <div className="text-center py-8 text-red-500">
                <p>{invoiceError}</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No purchase orders found for this vendor</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((po) => (
                  <div
                    key={po.poId}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* PO Header */}
                    <div
                      className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                      onClick={() => togglePOExpansion(po.poId)}
                    >
                      <div>
                        <span className="font-medium text-gray-900">
                          {po.poNumber}
                        </span>
                        <span className="ml-3 text-sm text-gray-500">
                          {po.invoices.length} invoice
                          {po.invoices.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            po.invoices.length > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {po.invoices.length > 0
                            ? "Has Invoices"
                            : "No Invoices"}
                        </span>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedPOs[po.poId] ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* PO Details - Collapsible */}
                    {expandedPOs[po.poId] && (
                      <div className="p-4 bg-white">
                        {/* Vendor Info */}
                        <div className="mb-4 pb-4 border-b">
                          <div className="grid grid-cols-2 gap-4">
                            {/* <div>
                              <p className="text-sm text-gray-500">PO ID</p>
                              <p className="font-medium">{po.poId}</p>
                            </div> */}
                            <div>
                              <p className="text-sm text-gray-500">Vendor</p>
                              <p className="font-medium">{po.vendorName}</p>
                            </div>
                          </div>
                        </div>

                        {/* Invoices List */}
                        <div>
                          <h4 className="font-medium mb-3">Invoices</h4>
                          {po.invoices.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              No invoices attached to this PO
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {po.invoices.map((invoice, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {invoice.invoiceNumber}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      File: {getFileName(invoice.invoiceUrl)}
                                    </p>
                                    {/* <p className="text-xs text-gray-400 mt-1">
                                      URL: {invoice.invoiceUrl}
                                    </p> */}
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={(e) => handleViewPDF(invoice.invoiceUrl, invoice.invoiceNumber, e)}
                                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                                    >
                                      View PDF
                                    </button>
                                    <button
                                      onClick={(e) => handleDownloadPDF(invoice.invoiceUrl, invoice.invoiceNumber, e)}
                                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                                    >
                                      Download
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Invoice Statistics */}
            {invoices.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Total POs</p>
                    <p className="text-xl font-bold text-blue-600">
                      {invoices.length}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">Total Invoices</p>
                    <p className="text-xl font-bold text-green-600">
                      {invoices.reduce(
                        (total, po) => total + po.invoices.length,
                        0,
                      )}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">POs with Invoices</p>
                    <p className="text-xl font-bold text-purple-600">
                      {invoices.filter((po) => po.invoices.length > 0).length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePO;