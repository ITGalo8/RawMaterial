import React, { useState, useEffect } from 'react';
import Api from '../../auth/Api';
import './CSS/ShowPurchaseOrder.css';

const ShowPurchaseOrder = () => {
  const [companies, setCompanies] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await Api.get('/purchase/companies');
      setCompanies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      alert('Error loading companies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch purchase orders for selected company
  const fetchPurchaseOrders = async (companyId) => {
    if (!companyId) {
      setPurchaseOrders([]);
      setSelectedOrder('');
      setSelectedOrderDetails(null);
      return;
    }
    
    setOrdersLoading(true);
    try {
      const response = await Api.get(`/purchase/purchase-orders/company/${companyId}`);
      setPurchaseOrders(response.data.data || []);
      setSelectedOrder('');
      setSelectedOrderDetails(null);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      alert('Error loading purchase orders');
      setPurchaseOrders([]);
      setSelectedOrder('');
      setSelectedOrderDetails(null);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch detailed purchase order information - VIEW API
  const fetchOrderDetails = async (orderId) => {
    if (!orderId) {
      setSelectedOrderDetails(null);
      return;
    }
    
    setDetailsLoading(true);
    try {
      const response = await Api.get(`/purchase/purchase-orders/details/${orderId}`);
      setSelectedOrderDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Error loading order details');
      setSelectedOrderDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Download as PDF - POST request
  const handleDownload = async () => {
    if (!selectedOrderDetails || !selectedOrder) return;
    
    setDownloadLoading(true);
    try {
      console.log('Making POST request to download PDF for order:', selectedOrder);
      
      const response = await Api.post(
        `/purchase/purchase-orders/download/${selectedOrder}`,
        {
          // Send the complete order details that the PDF generator might need
          orderId: selectedOrder,
          poNumber: selectedOrderDetails.poNumber,
          poDate: selectedOrderDetails.poDate,
          companyName: selectedOrderDetails.companyName,
          vendorName: selectedOrderDetails.vendorName,
          items: selectedOrderDetails.items,
          otherCharges: selectedOrderDetails.otherCharges,
          gstRate: selectedOrderDetails.gstRate,
          gstType: selectedOrderDetails.gstType,
          currency: selectedOrderDetails.currency,
          paymentTerms: selectedOrderDetails.paymentTerms,
          deliveryTerms: selectedOrderDetails.deliveryTerms,
          contactPerson: selectedOrderDetails.contactPerson,
          cellNo: selectedOrderDetails.cellNo,
          warranty: selectedOrderDetails.warranty,
          status: selectedOrderDetails.status,
          remarks: selectedOrderDetails.remarks
        },
        {
          responseType: 'blob' // Important for file downloads
        }
      );

      console.log('PDF response received:', response);

      // Create a blob from the PDF stream
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set the filename
      const fileName = `PurchaseOrder_${selectedOrderDetails.poNumber}.pdf`;
      link.setAttribute('download', fileName);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('PDF download completed successfully');
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Enhanced error handling
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        if (error.response.status === 404) {
          alert('PDF file not found for this purchase order');
        } else if (error.response.status === 500) {
          alert('Server error while generating PDF. Please try again.');
        } else {
          alert(`Error downloading PDF: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error downloading PDF. Please try again.');
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  // Alternative download method - minimal data
  const handleDownloadMinimal = async () => {
    if (!selectedOrderDetails || !selectedOrder) return;
    
    setDownloadLoading(true);
    try {
      const response = await Api.post(
        `/purchase/purchase-orders/download/${selectedOrder}`,
        {
          // Minimal data - just the essential fields
          orderId: selectedOrder,
          poNumber: selectedOrderDetails.poNumber
        },
        {
          responseType: 'blob'
        }
      );

      // Handle the blob response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PO_${selectedOrderDetails.poNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = (orderDetails) => {
    if (!orderDetails) return {};
    
    const itemsTotal = orderDetails.items?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) || 0;
    const otherChargesTotal = orderDetails.otherCharges?.reduce((sum, charge) => sum + parseFloat(charge.amount || 0), 0) || 0;
    const subtotal = itemsTotal + otherChargesTotal;
    const gstAmount = (subtotal * parseFloat(orderDetails.gstRate || 0)) / 100;
    const grandTotal = subtotal + gstAmount;
    
    return {
      itemsTotal,
      otherChargesTotal,
      subtotal,
      gstAmount,
      grandTotal
    };
  };

  // Handle company selection change
  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    fetchPurchaseOrders(companyId);
  };

  // Handle order selection change
  const handleOrderChange = (orderId) => {
    setSelectedOrder(orderId);
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setSelectedOrderDetails(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return parseFloat(amount).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Print form
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="container">
  //       <div className="loading-spinner">
  //         <div className="spinner"></div>
  //         <p>Loading companies...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const totals = selectedOrderDetails ? calculateTotals(selectedOrderDetails) : {};

  return (
    <div className="container">
      <div className="companies-page">
        
        {/* Centered Header Section */}
        <div className="centered-hero-section">
          <div className="hero-content">
            <h1 className="hero-title">View Purchase Order</h1>
            <p className="hero-subtitle">Select a company and purchase order to view details</p>
            <div className="hero-divider"></div>
          </div>
        </div>

        {/* Selection Section */}
        <div className="selection-card">
          <div className="selection-content">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Select Company *</label>
                <select
                  value={selectedCompany}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Select Company --</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCompany && (
                <div className="form-group">
                  <label className="form-label">Select Purchase Order *</label>
                  <select
                    value={selectedOrder}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    className="form-select"
                    disabled={ordersLoading || purchaseOrders.length === 0}
                  >
                    <option value="">-- Select Purchase Order --</option>
                    {purchaseOrders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.poNumber}
                      </option>
                    ))}
                  </select>
                  {ordersLoading && (
                    <div className="loading-small">Loading orders...</div>
                  )}
                  {!ordersLoading && purchaseOrders.length === 0 && (
                    <div className="no-data-message">No purchase orders found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Purchase Order Details Form */}
        {selectedOrder && selectedOrderDetails && (
          <div className="purchase-order-details">
            <div className="details-header">
              <div className="header-content">
                <h2 className="details-title">Purchase Order Details</h2>
                <div className="header-actions">
                  <button className="btn btn-outline" onClick={handlePrint}>
                    <span className="btn-icon">🖨️</span>
                    Print
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleDownload}
                    disabled={downloadLoading}
                  >
                    <span className="btn-icon">
                      {downloadLoading ? '⏳' : '📥'}
                    </span>
                    {downloadLoading ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            </div>

            {detailsLoading ? (
              <div className="loading-details">
                <div className="spinner"></div>
                <p>Loading order details...</p>
              </div>
            ) : (
              <div className="details-content">
                {/* Basic Information Section */}
                <div className="details-section">
                  <h3 className="section-title">Basic Information</h3>
                  <div className="info-grid">
                    <div className="info-group">
                      <label className="info-label">PO Number *</label>
                      <div className="info-value">{selectedOrderDetails.poNumber || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">PO Date *</label>
                      <div className="info-value">{formatDate(selectedOrderDetails.poDate)}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Select Company *</label>
                      <div className="info-value">{selectedOrderDetails.companyName || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Select Vendor *</label>
                      <div className="info-value">{selectedOrderDetails.vendorName || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Payment Terms *</label>
                      <div className="info-value">{selectedOrderDetails.paymentTerms || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Delivery Terms *</label>
                      <div className="info-value">{selectedOrderDetails.deliveryTerms || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Contact Person *</label>
                      <div className="info-value">{selectedOrderDetails.contactPerson || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Contact Number *</label>
                      <div className="info-value">{selectedOrderDetails.cellNo || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Select GST Type *</label>
                      <div className="info-value">{selectedOrderDetails.gstType || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">GST Rate *</label>
                      <div className="info-value">{selectedOrderDetails.gstRate || '0'}%</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Currency *</label>
                      <div className="info-value">{selectedOrderDetails.currency || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Warranty *</label>
                      <div className="info-value">{selectedOrderDetails.warranty || 'N/A'}</div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Status *</label>
                      <div className="info-value status-badge">{selectedOrderDetails.status || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="details-section">
                  <div className="section-header">
                    <h3 className="section-title">Item Details</h3>
                    <div className="items-badge">
                      {selectedOrderDetails.items?.length || 0} Item{(selectedOrderDetails.items?.length || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="items-container">
                    {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                      selectedOrderDetails.items.map((item, index) => (
                        <div key={item.id || index} className="item-card">
                          <div className="item-header">
                            <div className="item-badge">
                              <span className="item-icon">📦</span>
                              Item {index + 1}
                            </div>
                          </div>
                          
                          <div className="item-grid">
                            <div className="info-group">
                              <label className="info-label">Select Item *</label>
                              <div className="info-value">{item.itemName || 'N/A'}</div>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">Select Unit *</label>
                              <div className="info-value">{item.unit || 'N/A'}</div>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">Rate (₹) *</label>
                              <div className="info-value amount">₹{formatCurrency(item.rate)}</div>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">Quantity *</label>
                              <div className="info-value">{item.quantity || '0'}</div>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">HSN Code *</label>
                              <div className="info-value">{item.hsnCode || 'N/A'}</div>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">Model Number *</label>
                              <div className="info-value">{item.modelNumber || 'N/A'}</div>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">Total Amount *</label>
                              <div className="info-value amount total">₹{formatCurrency(item.total)}</div>
                            </div>
                            
                            <div className="info-group full-width">
                              <label className="info-label">Item Description *</label>
                              <div className="info-value description">
                                {item.itemDetail || "No description provided"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-items-message">
                        No items found in this purchase order
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Charges Section */}
                {selectedOrderDetails.otherCharges && selectedOrderDetails.otherCharges.length > 0 && (
                  <div className="details-section">
                    <div className="section-header">
                      <h3 className="section-title">Other Charges</h3>
                      <div className="items-badge">
                        {selectedOrderDetails.otherCharges.length} Charge{selectedOrderDetails.otherCharges.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="other-charges-container">
                      {selectedOrderDetails.otherCharges.map((charge, index) => (
                        <div key={index} className="charge-card">
                          <div className="charge-header">
                            <div className="charge-badge">
                              <span className="charge-icon">💰</span>
                              Charge {index + 1}
                            </div>
                          </div>
                          
                          <div className="charge-grid">
                            <div className="info-group">
                              <label className="info-label">Charge Name</label>
                              <div className="info-value">{charge.name || 'N/A'}</div>
                            </div>
                            
                            <div className="info-group">
                              <label className="info-label">Amount (₹)</label>
                              <div className="info-value amount">
                                ₹{formatCurrency(charge.amount)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Section - Items Total, Other Charges, GST, Grand Total */}
                <div className="details-section">
                  <h3 className="section-title">Order Summary</h3>
                  
                  <div className="summary-container">
                    {/* Items Total */}
                    <div className="summary-row">
                      <div className="summary-label">Items Total:
                     ₹{formatCurrency(totals.itemsTotal)}
                     </div>
                    </div>

                    {/* Other Charges Total */}
                    {totals.otherChargesTotal > 0 && (
                      <div className="summary-row">
                        <div className="summary-label">Other Charges:
                        ₹{formatCurrency(totals.otherChargesTotal)}
                        </div>
                      </div>
                    )}

                    {/* Subtotal */}
                    <div className="summary-row subtotal">
                      <div className="summary-label">Subtotal:
                      ₹{formatCurrency(totals.subtotal)}
                      </div>
                    </div>

                    {/* GST */}
                    <div className="summary-row">
                      <div className="summary-label">
                        GST ({selectedOrderDetails.gstRate || '0'}%): {formatCurrency(totals.gstAmount)}
                      </div>
                      
                    </div>

                    {/* Grand Total */}
                    <div className="summary-row grand-total">
                      <div className="summary-label">Grand Total:</div>
                      <div className="summary-value">₹{formatCurrency(totals.grandTotal)}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedOrderDetails.remarks && (
                  <div className="details-section">
                    <h3 className="section-title">Additional Information</h3>
                    <div className="info-grid">
                      <div className="info-group full-width">
                        <label className="info-label">Remarks</label>
                        <div className="info-value remarks">{selectedOrderDetails.remarks}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* No Selection States */}
        {!selectedCompany && (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <h3 className="empty-title">Select a Company</h3>
            <p className="empty-description">Please select a company from the dropdown above to view its purchase orders.</p>
          </div>
        )}

        {selectedCompany && !selectedOrder && purchaseOrders.length > 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">Select a Purchase Order</h3>
            <p className="empty-description">Choose a purchase order from the dropdown above to view its details.</p>
          </div>
        )}

        {selectedCompany && !selectedOrder && purchaseOrders.length === 0 && !ordersLoading && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3 className="empty-title">No Purchase Orders</h3>
            <p className="empty-description">This company doesn't have any purchase orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPurchaseOrder;