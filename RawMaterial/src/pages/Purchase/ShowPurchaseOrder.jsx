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
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [showItemsDropdown, setShowItemsDropdown] = useState(null);
  const [formData, setFormData] = useState({
    companyId: '',
    vendorId: '',
    gstType: '',
    items: [],
    otherCharges: [],
    poNumber: '',
    poDate: '',
    paymentTerms: '',
    deliveryTerms: '',
    contactPerson: '',
    cellNo: '',
    gstRate: '',
    currency: '',
    warranty: '',
    status: '',
    remarks: ''
  });

  // Unit types array
  const unitTypes = [
    { value: "Nos", label: "Nos" },
    { value: "Pcs", label: "Pcs" },
    { value: "Mtr", label: "Mtr" },
    { value: "Kg", label: "Kg" },
    { value: "Box", label: "Box" },
    { value: "Set", label: "Set" },
    { value: "Roll", label: "Roll" },
    { value: "Ltr", label: "Ltr" },
  ];

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

  // Fetch items from API
  const fetchItems = async () => {
    setItemsLoading(true);
    try {
      const response = await Api.get('/purchase/items');
      console.log('Items API response:', response.data);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Error loading items');
      setItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  // Prepare update form data
  const prepareUpdateForm = (orderDetails) => {
    if (!orderDetails) return;
    
    setFormData({
      companyId: orderDetails.companyId || '',
      vendorId: orderDetails.vendorId || '',
      gstType: orderDetails.gstType || '',
      items: orderDetails.items ? orderDetails.items.map(item => ({
        id: item.id || '',
        name: item.itemName || '',
        source: 'mysql',
        hsnCode: item.hsnCode || '',
        modelNumber: item.modelNumber || '',
        itemDetail: item.itemDetail || '',
        unit: item.unit || '',
        quantity: item.quantity || '',
        rate: item.rate || '',
        gstRate: item.gstRate || '',
        total: item.total || ''
      })) : [],
      otherCharges: orderDetails.otherCharges ? orderDetails.otherCharges.map(charge => ({
        id: charge.id || '',
        name: charge.name || '',
        amount: charge.amount || ''
      })) : [],
      poNumber: orderDetails.poNumber || '',
      poDate: orderDetails.poDate || '',
      paymentTerms: orderDetails.paymentTerms || '',
      deliveryTerms: orderDetails.deliveryTerms || '',
      contactPerson: orderDetails.contactPerson || '',
      cellNo: orderDetails.cellNo || '',
      gstRate: orderDetails.gstRate || '',
      currency: orderDetails.currency || '',
      warranty: orderDetails.warranty || '',
      status: orderDetails.status || '',
      remarks: orderDetails.remarks || ''
    });
    
    setShowUpdateForm(true);
    // Fetch items when opening update form
    fetchItems();
  };

  // Handle update form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOrder) {
      alert('No purchase order selected');
      return;
    }

    setUpdateLoading(true);
    try {
      console.log('Updating purchase order:', selectedOrder);
      console.log('Update data:', formData);

      const response = await Api.put(
        `/purchase/purchase-orders/update/${selectedOrder}`,
        formData
      );

      console.log('Update response:', response);
      
      if (response.data.success) {
        alert('Purchase order updated successfully!');
        setShowUpdateForm(false);
        // Refresh the order details
        fetchOrderDetails(selectedOrder);
      } else {
        alert('Failed to update purchase order: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating purchase order:', error);
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        alert(`Error updating purchase order: ${error.response.status} ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error updating purchase order. Please try again.');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle item input changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Calculate total if rate or quantity changes
    if (field === 'rate' || field === 'quantity') {
      const rate = parseFloat(updatedItems[index].rate) || 0;
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      updatedItems[index].total = (rate * quantity).toString();
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Handle item selection from dropdown
  const handleItemSelect = (index, selectedItem) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      name: selectedItem.name,
      id: selectedItem.id,
      source: selectedItem.source
    };
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    setShowItemsDropdown(null);
  };

  // Handle charge input changes
  const handleChargeChange = (index, field, value) => {
    const updatedCharges = [...formData.otherCharges];
    updatedCharges[index] = {
      ...updatedCharges[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      otherCharges: updatedCharges
    }));
  };

  // Add new item
  const addNewItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: '',
          name: '',
          source: 'mysql',
          hsnCode: '',
          modelNumber: '',
          itemDetail: '',
          unit: '',
          quantity: '',
          rate: '',
          gstRate: '',
          total: ''
        }
      ]
    }));
  };

  // Remove item
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Add new charge
  const addNewCharge = () => {
    setFormData(prev => ({
      ...prev,
      otherCharges: [
        ...prev.otherCharges,
        {
          id: '',
          name: '',
          amount: ''
        }
      ]
    }));
  };

  // Remove charge
  const removeCharge = (index) => {
    const updatedCharges = formData.otherCharges.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      otherCharges: updatedCharges
    }));
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
          responseType: 'blob'
        }
      );

      console.log('PDF response received:', response);

      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `PurchaseOrder_${selectedOrderDetails.poNumber}.pdf`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('PDF download completed successfully');
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
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

  useEffect(() => {
    fetchCompanies();
  }, []);

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
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => prepareUpdateForm(selectedOrderDetails)}
                  >
                    <span className="btn-icon">✏️</span>
                    Update Order
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

                {/* Summary Section */}
                <div className="details-section">
                  <h3 className="section-title">Order Summary</h3>
                  
                  <div className="summary-container">
                    <div className="summary-row">
                      <div className="summary-label">Items Total:</div>
                      <div className="summary-value">₹{formatCurrency(totals.itemsTotal)}</div>
                    </div>

                    {totals.otherChargesTotal > 0 && (
                      <div className="summary-row">
                        <div className="summary-label">Other Charges:</div>
                        <div className="summary-value">₹{formatCurrency(totals.otherChargesTotal)}</div>
                      </div>
                    )}

                    <div className="summary-row subtotal">
                      <div className="summary-label">Subtotal:</div>
                      <div className="summary-value">₹{formatCurrency(totals.subtotal)}</div>
                    </div>

                    <div className="summary-row">
                      <div className="summary-label">GST ({selectedOrderDetails.gstRate || '0'}%):</div>
                      <div className="summary-value">₹{formatCurrency(totals.gstAmount)}</div>
                    </div>

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

        {/* Update Form Modal */}
        {showUpdateForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Update Purchase Order</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowUpdateForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleUpdateSubmit} className="update-form">
                <div className="form-section">
                  <h3 className="section-title">Basic Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">PO Number *</label>
                      <input
                        type="text"
                        name="poNumber"
                        value={formData.poNumber}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">PO Date *</label>
                      <input
                        type="date"
                        name="poDate"
                        value={formData.poDate ? formData.poDate.split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Payment Terms *</label>
                      <input
                        type="text"
                        name="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Delivery Terms *</label>
                      <input
                        type="text"
                        name="deliveryTerms"
                        value={formData.deliveryTerms}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Person *</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Number *</label>
                      <input
                        type="text"
                        name="cellNo"
                        value={formData.cellNo}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">GST Type *</label>
                      <select
                        name="gstType"
                        value={formData.gstType}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select GST Type</option>
                        <option value="LGST_5">LGST 5%</option>
                        <option value="LGST_12">LGST 12%</option>
                        <option value="LGST_18">LGST 18%</option>
                        <option value="LGST_28">LGST 28%</option>
                        <option value="IGST_5">IGST 5%</option>
                        <option value="IGST_12">IGST 12%</option>
                        <option value="IGST_18">IGST 18%</option>
                        <option value="IGST_28">IGST 28%</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">GST Rate *</label>
                      <input
                        type="number"
                        name="gstRate"
                        value={formData.gstRate}
                        onChange={handleInputChange}
                        className="form-input"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Currency *</label>
                      <input
                        type="text"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Warranty *</label>
                      <input
                        type="text"
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Remarks</label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title">Items</h3>
                    <button type="button" className="btn btn-outline" onClick={addNewItem}>
                      + Add Item
                    </button>
                  </div>
                  
                  {formData.items.map((item, index) => (
                    <div key={index} className="item-card">
                      <div className="item-header">
                        <h4>Item {index + 1}</h4>
                        <button 
                          type="button" 
                          className="btn btn-danger"
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Item Name *</label>
                          <div className="dropdown-container">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                              className="form-input"
                              required
                              onFocus={() => setShowItemsDropdown(index)}
                              placeholder="Click to select item"
                            />
                            {showItemsDropdown === index && (
                              <div className="dropdown-menu">
                                <div className="dropdown-header">
                                  <span>Select Item</span>
                                  <button 
                                    type="button"
                                    className="dropdown-close"
                                    onClick={() => setShowItemsDropdown(null)}
                                  >
                                    ×
                                  </button>
                                </div>
                                <div className="dropdown-search">
                                  <input
                                    type="text"
                                    placeholder="Search items..."
                                    className="search-input"
                                    onChange={(e) => {
                                      // You can implement search functionality here
                                    }}
                                  />
                                </div>
                                <div className="dropdown-list">
                                  {itemsLoading ? (
                                    <div className="dropdown-loading">Loading items...</div>
                                  ) : items.length > 0 ? (
                                    items.map((apiItem) => (
                                      <div
                                        key={apiItem.id}
                                        className="dropdown-item"
                                        onClick={() => handleItemSelect(index, apiItem)}
                                      >
                                        <div className="item-name">{apiItem.name}</div>
                                        <div className="item-source">{apiItem.source}</div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="dropdown-empty">No items found</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">HSN Code *</label>
                          <input
                            type="text"
                            value={item.hsnCode}
                            onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Model Number *</label>
                          <input
                            type="text"
                            value={item.modelNumber}
                            onChange={(e) => handleItemChange(index, 'modelNumber', e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>

                        {/* Unit Dropdown */}
                        <div className="form-group">
                          <label className="form-label">Unit *</label>
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            className="form-select"
                            required
                          >
                            <option value="">Select Unit</option>
                            {unitTypes.map(unit => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Quantity *</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Rate *</label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                            className="form-input"
                            step="0.01"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Total</label>
                          <input
                            type="text"
                            value={formatCurrency(item.total || (parseFloat(item.rate || 0) * parseFloat(item.quantity || 0)))}
                            className="form-input"
                            disabled
                          />
                        </div>

                        <div className="form-group full-width">
                          <label className="form-label">Item Description *</label>
                          <textarea
                            value={item.itemDetail}
                            onChange={(e) => handleItemChange(index, 'itemDetail', e.target.value)}
                            className="form-textarea"
                            rows="3"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Other Charges Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title">Other Charges</h3>
                    <button type="button" className="btn btn-outline" onClick={addNewCharge}>
                      + Add Charge
                    </button>
                  </div>
                  
                  {formData.otherCharges.map((charge, index) => (
                    <div key={index} className="charge-card">
                      <div className="charge-header">
                        <h4>Charge {index + 1}</h4>
                        <button 
                          type="button" 
                          className="btn btn-danger"
                          onClick={() => removeCharge(index)}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Charge Name</label>
                          <input
                            type="text"
                            value={charge.name}
                            onChange={(e) => handleChargeChange(index, 'name', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Amount</label>
                          <input
                            type="number"
                            value={charge.amount}
                            onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                            className="form-input"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Updating...' : 'Update Order'}
                  </button>
                </div>
              </form>
            </div>
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