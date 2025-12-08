import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '../../auth/Api';

const ReceivedPurchaseStock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [stockEntries, setStockEntries] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [billFile, setBillFile] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    warehouseId: '',
    items: []
  });

  // Fetch warehouses
  const fetchWarehouses = async () => {
    setWarehouseLoading(true);
    try {
      const response = await Api.get('/purchase/warehouses');
      setWarehouses(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      alert('Error loading warehouses');
    } finally {
      setWarehouseLoading(false);
    }
  };

  // Get order details from navigation state or fetch from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { orderId, orderDetails: locationOrderDetails } = location.state || {};
        
        // Fetch warehouses first
        await fetchWarehouses();
        
        if (locationOrderDetails) {
          // Use data passed from navigation
          setOrderDetails(locationOrderDetails);
          // Initialize form with items from order
          setFormData(prev => ({
            ...prev,
            items: locationOrderDetails.items?.map(item => ({
              purchaseOrderItemId: item.id || '',
              itemId: item.itemId || '',
              itemSource: item.itemSource || 'mysql',
              itemName: item.itemName || '',
              orderedQty: parseFloat(item.quantity || 0),
              receivedQty: 0,
              goodQty: 0,
              damagedQty: 0,
              remarks: ''
            })) || []
          }));
        } else if (orderId) {
          // Fetch order details if only ID is provided
          const response = await Api.get(`/purchase/purchase-orders/details/${orderId}`);
          setOrderDetails(response.data.data);
          setFormData(prev => ({
            ...prev,
            items: response.data.data.items?.map(item => ({
              purchaseOrderItemId: item.id || '',
              itemId: item.itemId || '',
              itemSource: item.itemSource || 'mysql',
              itemName: item.itemName || '',
              orderedQty: parseFloat(item.quantity || 0),
              receivedQty: 0,
              goodQty: 0,
              damagedQty: 0,
              remarks: ''
            })) || []
          }));
        }
        
        // Fetch existing stock entries for this order
        if (orderId) {
          const stockResponse = await Api.get(`/purchase/received-stock/order/${orderId}`);
          setStockEntries(stockResponse.data.data || []);
          
          // Calculate pending quantities based on previous receipts
          if (stockResponse.data.data && stockResponse.data.data.length > 0) {
            const previousReceipts = stockResponse.data.data;
            const totalReceivedByItem = {};
            
            previousReceipts.forEach(receipt => {
              receipt.items.forEach(item => {
                if (!totalReceivedByItem[item.purchaseOrderItemId]) {
                  totalReceivedByItem[item.purchaseOrderItemId] = 0;
                }
                totalReceivedByItem[item.purchaseOrderItemId] += parseFloat(item.receivedQty || 0);
              });
            });
            
            // Update pending quantities in form
            setFormData(prev => ({
              ...prev,
              items: prev.items.map(item => {
                const totalReceived = totalReceivedByItem[item.purchaseOrderItemId] || 0;
                const pending = Math.max(0, item.orderedQty - totalReceived);
                return {
                  ...item,
                  receivedQty: pending, // Default to pending quantity for new receipt
                  goodQty: pending, // Default all pending as good
                  damagedQty: 0
                };
              })
            }));
          } else {
            // No previous receipts, set receivedQty equal to orderedQty
            setFormData(prev => ({
              ...prev,
              items: prev.items.map(item => ({
                ...item,
                receivedQty: item.orderedQty,
                goodQty: item.orderedQty,
                damagedQty: 0
              }))
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading order details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setBillFile(e.target.files[0]);
  };

  // Handle item input changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    
    if (field === 'receivedQty') {
      const receivedQty = parseFloat(value) || 0;
      const orderedQty = updatedItems[index].orderedQty;
      const totalReceivedSoFar = stockEntries.reduce((total, entry) => {
        const itemEntry = entry.items.find(i => i.purchaseOrderItemId === updatedItems[index].purchaseOrderItemId);
        return total + (itemEntry ? parseFloat(itemEntry.receivedQty || 0) : 0);
      }, 0);
      
      const maxAllowed = orderedQty - totalReceivedSoFar;
      
      if (receivedQty > maxAllowed) {
        alert(`Received quantity cannot exceed pending quantity (${maxAllowed})`);
        updatedItems[index][field] = maxAllowed;
        updatedItems[index]['goodQty'] = Math.min(updatedItems[index].goodQty || 0, maxAllowed);
        if (updatedItems[index].damagedQty > 0) {
          updatedItems[index]['damagedQty'] = Math.max(0, receivedQty - (updatedItems[index].goodQty || 0));
        }
      } else {
        updatedItems[index][field] = receivedQty;
        // Adjust goodQty if needed
        if (updatedItems[index].goodQty > receivedQty) {
          updatedItems[index]['goodQty'] = receivedQty;
        }
      }
    } 
    else if (field === 'goodQty') {
      const goodQty = parseFloat(value) || 0;
      const receivedQty = updatedItems[index].receivedQty || 0;
      
      if (goodQty > receivedQty) {
        alert(`Good quantity cannot exceed received quantity (${receivedQty})`);
        updatedItems[index][field] = receivedQty;
      } else {
        updatedItems[index][field] = goodQty;
        // Calculate damagedQty automatically
        updatedItems[index]['damagedQty'] = receivedQty - goodQty;
      }
    }
    else if (field === 'damagedQty') {
      const damagedQty = parseFloat(value) || 0;
      const receivedQty = updatedItems[index].receivedQty || 0;
      
      if (damagedQty > receivedQty) {
        alert(`Damaged quantity cannot exceed received quantity (${receivedQty})`);
        updatedItems[index][field] = receivedQty;
      } else {
        updatedItems[index][field] = damagedQty;
        // Calculate goodQty automatically
        updatedItems[index]['goodQty'] = receivedQty - damagedQty;
      }
    }
    else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.warehouseId) {
      alert('Please select a warehouse');
      return;
    }
    
    // Validate at least one item has receivedQty > 0
    const hasItems = formData.items.some(item => parseFloat(item.receivedQty || 0) > 0);
    if (!hasItems) {
      alert('Please enter received quantity for at least one item');
      return;
    }
    
    // Validate goodQty + damagedQty = receivedQty for each item
    const invalidItems = formData.items.filter(item => {
      const receivedQty = parseFloat(item.receivedQty || 0);
      const goodQty = parseFloat(item.goodQty || 0);
      const damagedQty = parseFloat(item.damagedQty || 0);
      return receivedQty > 0 && (goodQty + damagedQty !== receivedQty);
    });
    
    if (invalidItems.length > 0) {
      alert('For each item, Good Quantity + Damaged Quantity must equal Received Quantity');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();
      
      // Add JSON data
      const stockData = {
        purchaseOrderId: location.state?.orderId,
        warehouseId: formData.warehouseId,
        items: formData.items.map(item => ({
          purchaseOrderItemId: item.purchaseOrderItemId,
          itemId: item.itemId,
          itemSource: item.itemSource,
          itemName: item.itemName,
          receivedQty: parseFloat(item.receivedQty || 0),
          goodQty: parseFloat(item.goodQty || 0),
          damagedQty: parseFloat(item.damagedQty || 0),
          remarks: item.remarks || ''
        })).filter(item => item.receivedQty > 0) // Only include items with received quantity
      };
      
      formDataToSend.append('data', JSON.stringify(stockData));
      
      // Add bill file if selected
      if (billFile) {
        formDataToSend.append('billFile', billFile);
      }
      
      // Send request
      const response = await Api.post(
        '/purchase/purchase-orders/receive',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        alert('Stock received successfully!');
        // Optionally navigate back or to stock list
        navigate(-1); // Go back to previous page
      } else {
        alert('Failed to submit stock receipt: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting stock:', error);
      
      if (error.response) {
        alert(`Error submitting stock: ${error.response.status} ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error submitting stock. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const totals = formData.items.reduce((acc, item) => {
      const receivedQty = parseFloat(item.receivedQty || 0);
      const goodQty = parseFloat(item.goodQty || 0);
      const damagedQty = parseFloat(item.damagedQty || 0);
      
      return {
        totalReceived: acc.totalReceived + receivedQty,
        totalGood: acc.totalGood + goodQty,
        totalDamaged: acc.totalDamaged + damagedQty
      };
    }, { totalReceived: 0, totalGood: 0, totalDamaged: 0 });
    
    return totals;
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">Unable to load order details.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Receive Stock</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    PO: {orderDetails.poNumber} | Date: {new Date(orderDetails.poDate).toLocaleDateString()}
                  </span>
                  <span className="text-sm px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-800">
                    {orderDetails.companyName}
                  </span>
                  <span className="text-sm text-gray-600">
                    Vendor: {orderDetails.vendorName}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Receipt
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Warehouse Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Warehouse <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <select
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="">-- Select Warehouse --</option>
                {warehouses?.map(warehouse => (
                  <option key={warehouse._id || warehouse.id} value={warehouse._id || warehouse.id}>
                    {warehouse.warehouseName}
                  </option>
                ))}
              </select>
              {warehouseLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Bill File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill/Invoice File (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {billFile && (
                <span className="text-sm text-green-600">
                  {billFile.name} ({(billFile.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">Upload bill/invoice (PDF, JPG, PNG, DOC)</p>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Ordered Items</div>
              <div className="text-2xl font-bold text-blue-900">{orderDetails.items?.length || 0}</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="text-sm font-medium text-green-800 mb-1">To Receive</div>
              <div className="text-2xl font-bold text-green-900">
                {formData.items.filter(item => parseFloat(item.receivedQty || 0) > 0).length}
              </div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="text-sm font-medium text-green-800 mb-1">Good Quantity</div>
              <div className="text-2xl font-bold text-green-900">{totals.totalGood}</div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="text-sm font-medium text-red-800 mb-1">Damaged</div>
              <div className="text-2xl font-bold text-red-900">{totals.totalDamaged}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Items to Receive
              </h3>
              
              <div className="space-y-4">
                {formData.items.map((item, index) => {
                  // Calculate pending quantity
                  const totalReceivedSoFar = stockEntries.reduce((total, entry) => {
                    const itemEntry = entry.items.find(i => i.purchaseOrderItemId === item.purchaseOrderItemId);
                    return total + (itemEntry ? parseFloat(itemEntry.receivedQty || 0) : 0);
                  }, 0);
                  
                  const pendingQty = Math.max(0, item.orderedQty - totalReceivedSoFar);
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                Source: {item.itemSource}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                Ordered: {item.orderedQty}
                              </span>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                Pending: {pendingQty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Item ID: {item.itemId.substring(0, 8)}...
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Received Qty <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={item.receivedQty}
                            onChange={(e) => handleItemChange(index, 'receivedQty', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max={pendingQty}
                            step="1"
                          />
                          <div className="text-xs text-gray-500 mt-1">Max: {pendingQty}</div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Good Qty
                          </label>
                          <input
                            type="number"
                            value={item.goodQty}
                            onChange={(e) => handleItemChange(index, 'goodQty', e.target.value)}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            min="0"
                            max={item.receivedQty}
                            step="1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Damaged Qty
                          </label>
                          <input
                            type="number"
                            value={item.damagedQty}
                            onChange={(e) => handleItemChange(index, 'damagedQty', e.target.value)}
                            className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            min="0"
                            max={item.receivedQty}
                            step="1"
                          />
                        </div>
                        
                        <div className="lg:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Status
                          </label>
                          <div className={`px-3 py-2 rounded-lg text-center font-medium ${
                            item.receivedQty === item.orderedQty 
                              ? 'bg-green-100 text-green-800'
                              : item.receivedQty > 0 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.receivedQty === item.orderedQty ? 'Complete' :
                             item.receivedQty > 0 ? 'Partial' : 'Pending'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Remarks (Optional)
                        </label>
                        <textarea
                          value={item.remarks}
                          onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows="2"
                          placeholder="Enter remarks for this item..."
                        />
                      </div>
                      
                      {/* Validation warning */}
                      {parseFloat(item.goodQty || 0) + parseFloat(item.damagedQty || 0) !== parseFloat(item.receivedQty || 0) && 
                       parseFloat(item.receivedQty || 0) > 0 && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center text-red-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.948-.833-2.678 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5" />
                            </svg>
                            <span className="text-sm">Good Qty + Damaged Qty must equal Received Qty</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-5 mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Receipt Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items to Receive:</span>
                    <span className="font-semibold">
                      {formData.items.filter(item => parseFloat(item.receivedQty || 0) > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Received Quantity:</span>
                    <span className="font-semibold">{totals.totalReceived}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Good Quantity:</span>
                    <span className="font-semibold text-green-600">{totals.totalGood}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Damaged Quantity:</span>
                    <span className="font-semibold text-red-600">{totals.totalDamaged}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Previous Receipts */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Previous Receipts
              </h3>
              
              {stockEntries.length > 0 ? (
                <div className="space-y-4">
                  {stockEntries.map((entry, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-900">
                          {new Date(entry.receivedDate || entry.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.items?.length || 0} items
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Warehouse: {entry.warehouseName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Total Received: {entry.items?.reduce((sum, item) => sum + parseFloat(item.receivedQty || 0), 0)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No previous receipts found</p>
                  <p className="text-sm text-gray-400 mt-1">This is the first receipt for this order</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PO Number:</span>
                    <span className="font-semibold">{orderDetails.poNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vendor:</span>
                    <span className="font-semibold">{orderDetails.vendorName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-semibold">
                      {new Date(orderDetails.poDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-semibold">{orderDetails.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Ordered Qty:</span>
                    <span className="font-semibold">
                      {orderDetails.items?.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Value:</span>
                    <span className="font-semibold text-green-600">
                      ₹{orderDetails.items?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedPurchaseStock;