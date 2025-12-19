// import React, { useState, useEffect } from 'react';
// import Api from '../../auth/Api';
// import { useNavigate } from 'react-router-dom';

// const ShowPurchaseOrder = () => {

//   const [companies, setCompanies] = useState([]);
//   const [purchaseOrders, setPurchaseOrders] = useState([]);
//   const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [downloadLoading, setDownloadLoading] = useState(false);
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [selectedOrder, setSelectedOrder] = useState('');
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [items, setItems] = useState([]);
//   const [itemsLoading, setItemsLoading] = useState(false);
//   const [showItemsDropdown, setShowItemsDropdown] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   // Form data state
//   const [formData, setFormData] = useState({
//     companyId: '',
//     vendorId: '',
//     gstType: '',
//     items: [],
//     otherCharges: [],
//     poNumber: '',
//     poDate: '',
//     paymentTerms: '',
//     deliveryTerms: '',
//     contactPerson: '',
//     cellNo: '',
//     gstRate: '',
//     currency: '',
//     warranty: '',
//     status: '',
//     remarks: ''
//   });

//   const handleReceivedStock = () => {
//     if (!selectedOrderDetails || !selectedOrder) {
//       alert('Please select a purchase order first');
//       return;
//     }
    
//     navigate('/receive-purchase-stock', {
//       state: {
//         purchaseOrderId: selectedOrder,
//         selectedOrderDetails
//       }
//     });
//   };

//   // Handle ReOrder - Navigate to CreatePurchaseOrder with pre-filled data
//   const handleReOrder = () => {
//     if (!selectedOrderDetails) {
//       alert('Please select a purchase order first');
//       return;
//     }
    
//     // Check if order is in foreign currency
//     const isForeignCurrency = selectedOrderDetails.currency === 'USD' || selectedOrderDetails.currency === 'EUR' || selectedOrderDetails.currency === 'GBP';
    
//     // Calculate item totals properly based on currency
//     const reorderItems = selectedOrderDetails.items?.map(item => {
//       // Use rateInForeign if available and currency is foreign
//       let rate, itemTotal, itemAmount;
      
//       if (isForeignCurrency && item.rateInForeign) {
//         // For foreign currency orders
//         rate = parseFloat(item.rateInForeign) || 0;
//         itemAmount = parseFloat(item.amountInForeign) || 0;
//         itemTotal = parseFloat(item.total) || 0; // This is in INR including GST
//       } else {
//         // For INR orders
//         rate = parseFloat(item.rate) || 0;
//         const quantity = parseFloat(item.quantity) || 1;
//         itemAmount = rate * quantity;
//         itemTotal = itemAmount; // Will be updated with GST
//       }
      
//       const quantity = parseFloat(item.quantity) || 1;
//       const itemGstRate = parseFloat(item.gstRate) || parseFloat(selectedOrderDetails.gstRate) || 0;
      
//       // Calculate GST and totals
//       const taxableAmount = itemAmount;
//       const gstAmount = (taxableAmount * itemGstRate) / 100;
//       const totalAmount = taxableAmount + gstAmount;
      
//       return {
//         id: item.id || item.itemId || '',
//         itemId: item.itemId || item.id || '',
//         itemName: item.itemName || item.name || '',
//         hsnCode: item.hsnCode || '',
//         modelNumber: item.modelNumber || '',
//         unit: item.unit || 'Nos',
//         rate: rate.toString(), // Use the appropriate rate
//         rateInForeign: item.rateInForeign ? item.rateInForeign.toString() : '',
//         amountInForeign: item.amountInForeign ? item.amountInForeign.toString() : '',
//         quantity: item.quantity || '1',
//         gstRate: itemGstRate,
//         itemDetail: item.itemDetail || '',
//         total: itemTotal.toString(),
//         amount: taxableAmount.toString(),
//         taxableAmount: taxableAmount.toString(),
//         gstAmount: gstAmount.toString(),
//         totalAmount: totalAmount.toString()
//       };
//     }) || [];
    
//     // Prepare data for reorder
//     const reorderData = {
//       companyId: selectedOrderDetails.companyId,
//       vendorId: selectedOrderDetails.vendorId,
//       companyName: selectedOrderDetails.companyName,
//       vendorName: selectedOrderDetails.vendorName,
//       gstType: selectedOrderDetails.gstType,
//       gstRate: selectedOrderDetails.gstRate || "",
//       currency: selectedOrderDetails.currency || 'INR',
//       exchangeRate: selectedOrderDetails.exchangeRate || "1",
//       paymentTerms: selectedOrderDetails.paymentTerms || "",
//       deliveryTerms: selectedOrderDetails.deliveryTerms || "",
//       warranty: selectedOrderDetails.warranty || "",
//       contactPerson: selectedOrderDetails.contactPerson || "",
//       cellNo: selectedOrderDetails.cellNo || "",
//       poNumber: selectedOrderDetails.poNumber,
//       poDate: selectedOrderDetails.poDate,
//       items: reorderItems,
//       otherCharges: selectedOrderDetails.otherCharges || []
//     };
    
//     console.log('ReOrder Data being sent:', reorderData);
    
//     navigate('/create-purchase-order', {
//       state: { 
//         reorderData,
//         source: 'reorder'
//       }
//     });
//   };

//   // Unit types array
//   const unitTypes = [
//     { value: "Nos", label: "Nos" },
//     { value: "Pcs", label: "Pcs" },
//     { value: "Mtr", label: "Mtr" },
//     { value: "Kg", label: "Kg" },
//     { value: "Box", label: "Box" },
//     { value: "Set", label: "Set" },
//     { value: "Roll", label: "Roll" },
//     { value: "Ltr", label: "Ltr" },
//   ];

//   // Status options with colors
//   const statusOptions = [
//     { value: "Draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
//     { value: "Sent", label: "Sent", color: "bg-blue-100 text-blue-800" },
//     { value: "Approved", label: "Approved", color: "bg-green-100 text-green-800" },
//     { value: "Completed", label: "Completed", color: "bg-purple-100 text-purple-800" },
//     { value: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
//     { value: "Received", label: "Received", color: "bg-emerald-100 text-emerald-800" },
//     { value: "Update Order", label: "Update Order", color: "bg-amber-100 text-amber-800" },
//   ];

//   // GST Types
//   const gstTypes = [
//     { value: "IGST_5", label: "IGST 5%" },
//     { value: "IGST_12", label: "IGST 12%" },
//     { value: "IGST_18", label: "IGST 18%" },
//     { value: "IGST_28", label: "IGST 28%" },
//     { value: "IGST_EXEMPTED", label: "IGST Exempted" },
//     { value: "LGST_5", label: "LGST 5%" },
//     { value: "LGST_12", label: "LGST 12%" },
//     { value: "LGST_18", label: "LGST 18%" },
//     { value: "LGST_28", label: "LGST 28%" },
//     { value: "LGST_EXEMPTED", label: "LGST Exempted" },
//     { value: "IGST_ITEMWISE", label: "IGST Itemwise" },
//     { value: "LGST_ITEMWISE", label: "LGST Itemwise" },
//   ];

//   // Filtered items based on search
//   const filteredItems = items.filter(item =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.hsnCode?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Fetch companies
//   const fetchCompanies = async () => {
//     setLoading(true);
//     try {
//       const response = await Api.get('/purchase/companies');
//       setCompanies(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       alert('Error loading companies');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch purchase orders for selected company
//   const fetchPurchaseOrders = async (companyId) => {
//     if (!companyId) {
//       setPurchaseOrders([]);
//       setSelectedOrder('');
//       setSelectedOrderDetails(null);
//       return;
//     }
    
//     setOrdersLoading(true);
//     try {
//       const response = await Api.get(`/purchase/purchase-orders/company/${companyId}`);
//       setPurchaseOrders(response.data.data || []);
//       setSelectedOrder('');
//       setSelectedOrderDetails(null);
//     } catch (error) {
//       console.error('Error fetching purchase orders:', error);
//       alert('Error loading purchase orders');
//       setPurchaseOrders([]);
//       setSelectedOrder('');
//       setSelectedOrderDetails(null);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   // Fetch detailed purchase order information
//   const fetchOrderDetails = async (orderId) => {
//     if (!orderId) {
//       setSelectedOrderDetails(null);
//       return;
//     }
    
//     setDetailsLoading(true);
//     try {
//       const response = await Api.get(`/purchase/purchase-orders/details/${orderId}`);
//       setSelectedOrderDetails(response.data.data);
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//       alert('Error loading order details');
//       setSelectedOrderDetails(null);
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   // Fetch items from API
//   const fetchItems = async () => {
//     setItemsLoading(true);
//     try {
//       const response = await Api.get('/purchase/items');
//       setItems(response.data.items || []);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//       alert('Error loading items');
//       setItems([]);
//     } finally {
//       setItemsLoading(false);
//     }
//   };

//   // Prepare update form data
//   const prepareUpdateForm = (orderDetails) => {
//     if (!orderDetails) return;
    
//     setFormData({
//       companyId: orderDetails.companyId || '',
//       vendorId: orderDetails.vendorId || '',
//       gstType: orderDetails.gstType || '',
//       items: orderDetails.items ? orderDetails.items.map(item => ({
//         id: item.id || '',
//         name: item.itemName || '',
//         source: 'mysql',
//         hsnCode: item.hsnCode || '',
//         modelNumber: item.modelNumber || '',
//         itemDetail: item.itemDetail || '',
//         unit: item.unit || '',
//         quantity: item.quantity || '1',
//         rate: item.rate || '',
//         gstRate: item.gstRate || '',
//         total: item.total || ''
//       })) : [],
//       otherCharges: orderDetails.otherCharges ? orderDetails.otherCharges.map(charge => ({
//         id: charge.id || '',
//         name: charge.name || '',
//         amount: charge.amount || ''
//       })) : [],
//       poNumber: orderDetails.poNumber || '',
//       poDate: orderDetails.poDate || '',
//       paymentTerms: orderDetails.paymentTerms || '',
//       deliveryTerms: orderDetails.deliveryTerms || '',
//       contactPerson: orderDetails.contactPerson || '',
//       cellNo: orderDetails.cellNo || '',
//       gstRate: orderDetails.gstRate || '',
//       currency: orderDetails.currency || '',
//       warranty: orderDetails.warranty || '',
//       status: orderDetails.status || '',
//       remarks: orderDetails.remarks || ''
//     });
    
//     setShowUpdateForm(true);
//     fetchItems();
//   };

//   // Handle update form submission
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!selectedOrder) {
//       alert('No purchase order selected');
//       return;
//     }

//     setUpdateLoading(true);
//     try {
//       const response = await Api.put(
//         `/purchase/purchase-orders/update2/${selectedOrder}`,
//         formData
//       );
      
//       if (response.data.success) {
//         alert('Purchase order updated successfully!');
//         setShowUpdateForm(false);
//         fetchOrderDetails(selectedOrder);
//       } else {
//         alert('Failed to update purchase order: ' + (response.data.message || 'Unknown error'));
//       }
//     } catch (error) {
//       console.error('Error updating purchase order:', error);
      
//       if (error.response) {
//         alert(`Error updating purchase order: ${error.response.status} ${error.response.data.message || 'Unknown error'}`);
//       } else if (error.request) {
//         alert('Network error. Please check your connection and try again.');
//       } else {
//         alert('Error updating purchase order. Please try again.');
//       }
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle item input changes
//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...formData.items];
//     updatedItems[index] = {
//       ...updatedItems[index],
//       [field]: value
//     };
    
//     // Calculate total if rate or quantity changes
//     if (field === 'rate' || field === 'quantity') {
//       const rate = parseFloat(updatedItems[index].rate) || 0;
//       const quantity = parseFloat(updatedItems[index].quantity) || 0;
//       updatedItems[index].total = (rate * quantity).toString();
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       items: updatedItems
//     }));
//   };

//   // Handle item selection from dropdown
//   const handleItemSelect = (index, selectedItem) => {
//     const updatedItems = [...formData.items];
//     updatedItems[index] = {
//       ...updatedItems[index],
//       name: selectedItem.name,
//       id: selectedItem.id,
//       source: selectedItem.source,
//       hsnCode: selectedItem.hsnCode || '',
//       modelNumber: selectedItem.modelNumber || '',
//       unit: selectedItem.unit || 'Nos',
//       rate: selectedItem.rate || '',
//       itemDetail: selectedItem.itemDetail || ''
//     };
    
//     // Calculate total after item selection
//     const rate = parseFloat(updatedItems[index].rate) || 0;
//     const quantity = parseFloat(updatedItems[index].quantity) || 1;
//     updatedItems[index].total = (rate * quantity).toString();
    
//     setFormData(prev => ({
//       ...prev,
//       items: updatedItems
//     }));
    
//     setShowItemsDropdown(null);
//     setSearchQuery('');
//   };

//   // Handle charge input changes
//   const handleChargeChange = (index, field, value) => {
//     const updatedCharges = [...formData.otherCharges];
//     updatedCharges[index] = {
//       ...updatedCharges[index],
//       [field]: value
//     };
    
//     setFormData(prev => ({
//       ...prev,
//       otherCharges: updatedCharges
//     }));
//   };

//   // Add new item
//   const addNewItem = () => {
//     setFormData(prev => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           id: '',
//           name: '',
//           source: 'mysql',
//           hsnCode: '',
//           modelNumber: '',
//           itemDetail: '',
//           unit: 'Nos',
//           quantity: '1',
//           rate: '',
//           gstRate: '',
//           total: ''
//         }
//       ]
//     }));
//   };

//   // Remove item
//   const removeItem = (index) => {
//     const updatedItems = formData.items.filter((_, i) => i !== index);
//     setFormData(prev => ({
//       ...prev,
//       items: updatedItems
//     }));
//   };

//   // Add new charge
//   const addNewCharge = () => {
//     setFormData(prev => ({
//       ...prev,
//       otherCharges: [
//         ...prev.otherCharges,
//         {
//           id: '',
//           name: '',
//           amount: ''
//         }
//       ]
//     }));
//   };

//   // Remove charge
//   const removeCharge = (index) => {
//     const updatedCharges = formData.otherCharges.filter((_, i) => i !== index);
//     setFormData(prev => ({
//       ...prev,
//       otherCharges: updatedCharges
//     }));
//   };

//   // Download as PDF
//   const handleDownload = async () => {
//     if (!selectedOrderDetails || !selectedOrder) return;
    
//     setDownloadLoading(true);
//     try {
//       const response = await Api.post(
//         `/purchase/purchase-orders/download2/${selectedOrder}`,
//         {
//           orderId: selectedOrder,
//           poNumber: selectedOrderDetails.poNumber,
//           poDate: selectedOrderDetails.poDate,
//           companyName: selectedOrderDetails.companyName,
//           vendorName: selectedOrderDetails.vendorName,
//           items: selectedOrderDetails.items,
//           otherCharges: selectedOrderDetails.otherCharges,
//           gstRate: selectedOrderDetails.gstRate,
//           gstType: selectedOrderDetails.gstType,
//           currency: selectedOrderDetails.currency,
//           paymentTerms: selectedOrderDetails.paymentTerms,
//           deliveryTerms: selectedOrderDetails.deliveryTerms,
//           contactPerson: selectedOrderDetails.contactPerson,
//           cellNo: selectedOrderDetails.cellNo,
//           warranty: selectedOrderDetails.warranty,
//           remarks: selectedOrderDetails.remarks
//         },
//         {
//           responseType: 'blob'
//         }
//       );

//       const blob = new Blob([response.data], { 
//         type: response.headers['content-type'] || 'application/pdf' 
//       });
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       const fileName = `PurchaseOrder_${selectedOrderDetails.poNumber}.pdf`;
//       link.setAttribute('download', fileName);
      
//       document.body.appendChild(link);
//       link.click();
      
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
      
//       if (error.response) {
//         if (error.response.status === 404) {
//           alert('PDF file not found for this purchase order');
//         } else if (error.response.status === 500) {
//           alert('Server error while generating PDF. Please try again.');
//         } else {
//           alert(`Error downloading PDF: ${error.response.status} ${error.response.statusText}`);
//         }
//       } else if (error.request) {
//         alert('Network error. Please check your connection and try again.');
//       } else {
//         alert('Error downloading PDF. Please try again.');
//       }
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   // Calculate totals
//   const calculateTotals = (orderDetails) => {
//     if (!orderDetails) return {};
    
//     const itemsTotal = orderDetails.items?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) || 0;
//     const otherChargesTotal = orderDetails.otherCharges?.reduce((sum, charge) => sum + parseFloat(charge.amount || 0), 0) || 0;
//     const subtotal = itemsTotal + otherChargesTotal;
//     const gstAmount = (subtotal * parseFloat(orderDetails.gstRate || 0)) / 100;
//     const grandTotal = subtotal + gstAmount;
    
//     return {
//       itemsTotal,
//       otherChargesTotal,
//       subtotal,
//       gstAmount,
//       grandTotal
//     };
//   };

//   // Handle company selection change
//   const handleCompanyChange = (companyId) => {
//     setSelectedCompany(companyId);
//     fetchPurchaseOrders(companyId);
//   };

//   // Handle order selection change
//   const handleOrderChange = (orderId) => {
//     setSelectedOrder(orderId);
//     if (orderId) {
//       fetchOrderDetails(orderId);
//     } else {
//       setSelectedOrderDetails(null);
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     if (!amount) return '0.00';
//     return parseFloat(amount).toLocaleString('en-IN', { 
//       minimumFractionDigits: 2, 
//       maximumFractionDigits: 2 
//     });
//   };

//   // Format foreign currency
//   const formatForeignCurrency = (amount, currency) => {
//     if (!amount) return '0.00';
//     const formattedAmount = parseFloat(amount).toLocaleString('en-IN', { 
//       minimumFractionDigits: 2, 
//       maximumFractionDigits: 2 
//     });
    
//     if (currency === 'USD') {
//       return `$${formattedAmount}`;
//     } else if (currency === 'EUR') {
//       return `€${formattedAmount}`;
//     } else if (currency === 'GBP') {
//       return `£${formattedAmount}`;
//     } else {
//       return `${currency} ${formattedAmount}`;
//     }
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     const statusOption = statusOptions.find(s => s.value === status);
//     return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
//   };

//   // Get status label
//   const getStatusLabel = (status) => {
//     const statusOption = statusOptions.find(s => s.value === status);
//     return statusOption ? statusOption.label : status;
//   };

//   // Initialize component
//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   // Calculate totals for selected order
//   const totals = selectedOrderDetails ? calculateTotals(selectedOrderDetails) : {};

//   // Check if currency is foreign
//   const isForeignCurrency = selectedOrderDetails && 
//     (selectedOrderDetails.currency === 'USD' || 
//      selectedOrderDetails.currency === 'EUR' || 
//      selectedOrderDetails.currency === 'GBP');

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Hero Section */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
//             <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">View Purchase Order</h1>
//           <p className="text-gray-600">Select a company and purchase order to view details</p>
//         </div>

//         {/* Selection Card */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-800 mb-3">
//                 Select Company <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                 </div>
//                 <select
//                   value={selectedCompany}
//                   onChange={(e) => handleCompanyChange(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
//                   disabled={loading}
//                 >
//                   <option value="">-- Select Company --</option>
//                   {companies.map(company => (
//                     <option key={company.id} value={company.id}>
//                       {company.companyName}
//                     </option>
//                   ))}
//                 </select>
//                 {loading && (
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {selectedCompany && (
//               <div>
//                 <label className="block text-sm font-semibold text-gray-800 mb-3">
//                   Select Purchase Order <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                   </div>
//                   <select
//                     value={selectedOrder}
//                     onChange={(e) => handleOrderChange(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
//                     disabled={ordersLoading || purchaseOrders.length === 0}
//                   >
//                     <option value="">-- Select Purchase Order --</option>
//                     {purchaseOrders.map(order => (
//                       <option key={order.id} value={order.id}>
//                         {order.poNumber}
//                       </option>
//                     ))}
//                   </select>
//                   {ordersLoading && (
//                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
//                     </div>
//                   )}
//                 </div>
//                 {!ordersLoading && purchaseOrders.length === 0 && (
//                   <div className="mt-2 text-sm text-amber-600 flex items-center">
//                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.948-.833-2.678 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5" />
//                     </svg>
//                     No purchase orders found for this company
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <>
//           {selectedOrder && selectedOrderDetails && (
//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-900">Purchase Order: {selectedOrderDetails.poNumber}</h2>
//                       <div className="flex flex-wrap items-center gap-2 mt-1">
//                         <span className="text-sm text-gray-600">
//                           Date: {formatDate(selectedOrderDetails.poDate)}
//                         </span>
//                         <span className="text-sm px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-800">
//                           {selectedOrderDetails.companyName}
//                         </span>
//                         <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(selectedOrderDetails.status)}`}>
//                           {getStatusLabel(selectedOrderDetails.status)}
//                         </span>
//                         <span className="text-sm text-gray-600">
//                           Vendor: {selectedOrderDetails.vendorName}
//                         </span>
//                         {isForeignCurrency && (
//                           <span className="text-sm px-3 py-1 rounded-full font-medium bg-indigo-100 text-indigo-800">
//                             Currency: {selectedOrderDetails.currency}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     {/* Conditionally show "Receive Stock" button only if status is not "Fully Received" or "Update Order" */}
//                     {selectedOrderDetails.status !== 'Received' && selectedOrderDetails.status !== 'Update Order' && (
//                       <button 
//                         className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                         onClick={handleReceivedStock}
//                         disabled={detailsLoading}
//                       >
//                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         Receive Stock
//                       </button>
//                     )}
                    
//                     {/* Conditionally show "Update Order" button only if status is not "Update Order" AND not "Received" */}
//                     {selectedOrderDetails.status !== 'Update Order' && selectedOrderDetails.status !== 'Received' && (
//                       <button 
//                         className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center"
//                         onClick={() => prepareUpdateForm(selectedOrderDetails)}
//                       >
//                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                         </svg>
//                         Update Order
//                       </button>
//                     )}

//                     {/* ReOrder Button - Always visible for all statuses except maybe "Update Order" */}
//                     {selectedOrderDetails.status !== 'Update Order' && (
//                       <button 
//                         className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium flex items-center justify-center"
//                         onClick={handleReOrder}
//                       >
//                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                         </svg>
//                         ReOrder
//                       </button>
//                     )}
                    
//                     <button 
//                       className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                       onClick={handleDownload}
//                       disabled={downloadLoading}
//                     >
//                       {downloadLoading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                           Downloading...
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                           Download PDF
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {detailsLoading ? (
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//                   <p className="text-gray-600">Loading order details...</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Basic Information */}
//                   <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200 flex items-center">
//                       <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       Basic Information
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Vendor Name</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.vendorName || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Contact Person</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.contactPerson || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Contact Number</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.cellNo || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">GST Type</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.gstType || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">GST Rate</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.gstRate || '0'}%</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Currency</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.currency || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Exchange Rate</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.exchangeRate || '1'}</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Payment Terms</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.paymentTerms || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Delivery Terms</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.deliveryTerms || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-2">Warranty</label>
//                         <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.warranty || 'N/A'}</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Items Section */}
//                   <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                     <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
//                       <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                         <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                         </svg>
//                         Item Details
//                       </h3>
//                       <div className="flex items-center gap-4">
//                         {isForeignCurrency && (
//                           <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
//                             {selectedOrderDetails.currency} Currency
//                           </span>
//                         )}
//                         <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
//                           {selectedOrderDetails.items?.length || 0} Items
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-4">
//                       {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
//                         selectedOrderDetails.items.map((item, index) => (
//                           <div key={item.id || index} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all duration-200">
//                             <div className="flex items-center justify-between mb-4">
//                               <div className="flex items-center">
//                                 <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
//                                   {index + 1}
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">{item.itemName || 'Unnamed Item'}</h4>
//                                   <p className="text-sm text-gray-600">HSN: {item.hsnCode || 'N/A'}</p>
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-lg font-bold text-blue-600">
//                                   ₹{formatCurrency(item.total)}
//                                 </div>
//                                 {isForeignCurrency && item.amountInForeign && (
//                                   <div className="text-sm font-semibold text-indigo-600">
//                                     {formatForeignCurrency(item.amountInForeign, selectedOrderDetails.currency)}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                               <div>
//                                 <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</label>
//                                 <div className="font-medium text-gray-900">{item.unit || 'N/A'}</div>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</label>
//                                 <div className="font-medium text-gray-900">{item.quantity || '0'}</div>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                   Rate {isForeignCurrency ? `(${selectedOrderDetails.currency})` : '(₹)'}
//                                 </label>
//                                 <div className="font-medium text-gray-900">
//                                   {isForeignCurrency 
//                                     ? formatForeignCurrency(item.rateInForeign || item.rate, selectedOrderDetails.currency)
//                                     : `₹${formatCurrency(item.rate)}`
//                                   }
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Model</label>
//                                 <div className="font-medium text-gray-900">{item.modelNumber || 'N/A'}</div>
//                               </div>
//                             </div>
                            
//                             {/* Show amountInForeign for foreign currency */}
//                             {isForeignCurrency && item.amountInForeign && (
//                               <div className="mb-3 p-3 bg-indigo-50 rounded-lg">
//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount in {selectedOrderDetails.currency}</label>
//                                     <div className="font-semibold text-indigo-700">
//                                       {formatForeignCurrency(item.amountInForeign, selectedOrderDetails.currency)}
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount in INR</label>
//                                     <div className="font-semibold text-gray-900">
//                                       ₹{formatCurrency((parseFloat(item.amountInForeign) || 0) * (parseFloat(selectedOrderDetails.exchangeRate) || 1))}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
                            
//                             {item.itemDetail && (
//                               <div className="mt-3 pt-3 border-t border-gray-100">
//                                 <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
//                                 <div className="text-sm text-gray-700">{item.itemDetail}</div>
//                               </div>
//                             )}
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center py-8">
//                           <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                           </svg>
//                           <p className="text-gray-500">No items found in this purchase order</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Other Charges Section */}
//                   {selectedOrderDetails.otherCharges && selectedOrderDetails.otherCharges.length > 0 && (
//                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                       <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                           <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           Other Charges
//                         </h3>
//                         <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
//                           {selectedOrderDetails.otherCharges.length} Charges
//                         </span>
//                       </div>
                      
//                       <div className="space-y-3">
//                         {selectedOrderDetails.otherCharges.map((charge, index) => (
//                           <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center">
//                               <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-xs font-semibold mr-3">
//                                 {index + 1}
//                               </div>
//                               <div className="font-medium text-gray-900">{charge.name || 'Unnamed Charge'}</div>
//                             </div>
//                             <div className="font-semibold text-blue-600">₹{formatCurrency(charge.amount)}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Remarks Section */}
//                   {selectedOrderDetails.remarks && (
//                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                         <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
//                         </svg>
//                         Additional Information
//                       </h3>
//                       <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                         <div className="text-sm text-gray-600 mb-1">Remarks</div>
//                         <div className="text-gray-900">{selectedOrderDetails.remarks}</div>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* Empty States */}
//           {!selectedCompany && (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//               <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Company</h3>
//               <p className="text-gray-600 max-w-md mx-auto">
//                 Please select a company from the dropdown above to view its purchase orders.
//               </p>
//             </div>
//           )}

//           {selectedCompany && !selectedOrder && purchaseOrders.length > 0 && (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//               <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Purchase Order</h3>
//               <p className="text-gray-600 max-w-md mx-auto">
//                 Choose a purchase order from the dropdown above to view its details.
//               </p>
//             </div>
//           )}

//           {selectedCompany && !selectedOrder && purchaseOrders.length === 0 && !ordersLoading && (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//               <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No Purchase Orders</h3>
//               <p className="text-gray-600 max-w-md mx-auto">
//                 This company doesn't have any purchase orders yet.
//               </p>
//             </div>
//           )}
//         </>

//         {/* Update Form Modal */}
//         {showUpdateForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
//               {/* Modal Header */}
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
//                       <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-900">Update Purchase Order</h2>
//                       <p className="text-sm text-gray-600">PO Number: {formData.poNumber}</p>
//                     </div>
//                   </div>
//                   <button 
//                     className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
//                     onClick={() => setShowUpdateForm(false)}
//                   >
//                     <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Modal Content */}
//               <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//                 <form onSubmit={handleUpdateSubmit} className="space-y-8">
//                   {/* Basic Information */}
//                   <div className="bg-gray-50 rounded-xl p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
//                       <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       Basic Information
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           PO Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           name="poNumber"
//                           value={formData.poNumber}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                           required
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           PO Date <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="date"
//                           name="poDate"
//                           value={formData.poDate ? formData.poDate.split('T')[0] : ''}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           GST Type <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                           name="gstType"
//                           value={formData.gstType}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                           required
//                         >
//                           <option value="">Select GST Type</option>
//                           {gstTypes.map(gst => (
//                             <option key={gst.value} value={gst.value}>
//                               {gst.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           GST Rate (%) <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="number"
//                           name="gstRate"
//                           value={formData.gstRate}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                           step="0.01"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Payment Terms
//                         </label>
//                         <input
//                           type="text"
//                           name="paymentTerms"
//                           value={formData.paymentTerms}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Delivery Terms
//                         </label>
//                         <input
//                           type="text"
//                           name="deliveryTerms"
//                           value={formData.deliveryTerms}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Contact Person
//                         </label>
//                         <input
//                           type="text"
//                           name="contactPerson"
//                           value={formData.contactPerson}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Contact Number
//                         </label>
//                         <input
//                           type="text"
//                           name="cellNo"
//                           value={formData.cellNo}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Warranty
//                         </label>
//                         <input
//                           type="text"
//                           name="warranty"
//                           value={formData.warranty}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="mt-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
//                       <textarea
//                         name="remarks"
//                         value={formData.remarks}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                         rows="3"
//                       />
//                     </div>
//                   </div>

//                   {/* Items Section */}
//                   <div className="bg-gray-50 rounded-xl p-6">
//                     <div className="flex items-center justify-between mb-6">
//                       <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                         <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                         </svg>
//                         Items
//                       </h3>
//                       <button 
//                         type="button" 
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center"
//                         onClick={addNewItem}
//                       >
//                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                         </svg>
//                         Add Item
//                       </button>
//                     </div>
                    
//                     <div className="space-y-6">
//                       {formData.items.map((item, index) => (
//                         <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
//                           <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                               <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
//                                 {index + 1}
//                               </div>
//                               <h4 className="font-semibold text-gray-900">Item {index + 1}</h4>
//                             </div>
//                             <button 
//                               type="button" 
//                               className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium flex items-center"
//                               onClick={() => removeItem(index)}
//                             >
//                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                               </svg>
//                               Remove
//                             </button>
//                           </div>
                          
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Item Name <span className="text-red-500">*</span>
//                               </label>
//                               <div className="relative">
//                                 <input
//                                   type="text"
//                                   value={item.name}
//                                   onChange={(e) => handleItemChange(index, 'name', e.target.value)}
//                                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                   required
//                                   onFocus={() => setShowItemsDropdown(index)}
//                                   placeholder="Click to select item"
//                                 />
//                                 {showItemsDropdown === index && (
//                                   <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                                     <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2">
//                                       <div className="flex items-center justify-between">
//                                         <span className="text-sm font-medium text-gray-700">Select Item</span>
//                                         <button 
//                                           type="button"
//                                           className="text-gray-400 hover:text-gray-600"
//                                           onClick={() => setShowItemsDropdown(null)}
//                                         >
//                                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                           </svg>
//                                         </button>
//                                       </div>
//                                     </div>
//                                     <div className="px-4 py-2 border-b border-gray-200">
//                                       <input
//                                         type="text"
//                                         placeholder="Search items..."
//                                         className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                       />
//                                     </div>
//                                     <div className="py-1">
//                                       {itemsLoading ? (
//                                         <div className="px-4 py-8 text-center text-gray-500">
//                                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
//                                           Loading items...
//                                         </div>
//                                       ) : filteredItems.length > 0 ? (
//                                         filteredItems.map((apiItem) => (
//                                           <div
//                                             key={apiItem.id}
//                                             className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                                             onClick={() => handleItemSelect(index, apiItem)}
//                                           >
//                                             <div className="font-medium text-gray-900">{apiItem.name}</div>
//                                             <div className="text-sm text-gray-500 mt-1">HSN: {apiItem.hsnCode || 'N/A'}</div>
//                                           </div>
//                                         ))
//                                       ) : (
//                                         <div className="px-4 py-8 text-center text-gray-500">No items found</div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 HSN Code <span className="text-red-500">*</span>
//                               </label>
//                               <input
//                                 type="text"
//                                 value={item.hsnCode}
//                                 onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
//                                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                 required
//                               />
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Model Number
//                               </label>
//                               <input
//                                 type="text"
//                                 value={item.modelNumber}
//                                 onChange={(e) => handleItemChange(index, 'modelNumber', e.target.value)}
//                                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                               />
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Unit <span className="text-red-500">*</span>
//                               </label>
//                               <select
//                                 value={item.unit}
//                                 onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
//                                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                 required
//                               >
//                                 <option value="">Select Unit</option>
//                                 {unitTypes.map(unit => (
//                                   <option key={unit.value} value={unit.value}>
//                                     {unit.label}
//                                   </option>
//                                 ))}
//                               </select>
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Quantity <span className="text-red-500">*</span>
//                               </label>
//                               <input
//                                 type="number"
//                                 value={item.quantity}
//                                 onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
//                                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                 min="1"
//                                 required
//                               />
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Rate <span className="text-red-500">*</span>
//                               </label>
//                               <input
//                                 type="number"
//                                 value={item.rate}
//                                 onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
//                                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                 step="0.01"
//                                 min="0"
//                                 required
//                               />
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Total
//                               </label>
//                               <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 font-semibold">
//                                 ₹{formatCurrency(item.total || (parseFloat(item.rate || 0) * parseFloat(item.quantity || 0)))}
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Item Description
//                             </label>
//                             <textarea
//                               value={item.itemDetail}
//                               onChange={(e) => handleItemChange(index, 'itemDetail', e.target.value)}
//                               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                               rows="3"
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Other Charges Section */}
//                   <div className="bg-gray-50 rounded-xl p-6">
//                     <div className="flex items-center justify-between mb-6">
//                       <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                         <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         Other Charges
//                       </h3>
//                       <button 
//                         type="button" 
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center"
//                         onClick={addNewCharge}
//                       >
//                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                         </svg>
//                         Add Charge
//                       </button>
//                     </div>
                    
//                     <div className="space-y-4">
//                       {formData.otherCharges.map((charge, index) => (
//                         <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
//                           <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                               <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
//                                 {index + 1}
//                               </div>
//                               <h4 className="font-semibold text-gray-900">Charge {index + 1}</h4>
//                             </div>
//                             <button 
//                               type="button" 
//                               className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium flex items-center"
//                               onClick={() => removeCharge(index)}
//                             >
//                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                               </svg>
//                               Remove
//                             </button>
//                           </div>
                          
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">Charge Name</label>
//                               <input
//                                 type="text"
//                                 value={charge.name}
//                                 onChange={(e) => handleChargeChange(index, 'name', e.target.value)}
//                                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                               />
//                             </div>
                            
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
//                               <input
//                                 type="number"
//                                 value={charge.amount}
//                                 onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
//                                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                 step="0.01"
//                                 min="0"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Form Actions */}
//                   <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//                     <button
//                       type="button"
//                       className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
//                       onClick={() => setShowUpdateForm(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                       disabled={updateLoading}
//                     >
//                       {updateLoading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                           Updating...
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                           Update Order
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShowPurchaseOrder;

import React, { useState, useEffect } from 'react';
import Api from '../../auth/Api';
import { useNavigate } from 'react-router-dom';

const ShowPurchaseOrder = () => {
  const [companies, setCompanies] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [showItemsDropdown, setShowItemsDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Form data state
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

  // Handle Cancel Purchase Order
  const handleCancelOrder = async () => {
    if (!selectedOrderDetails || !selectedOrder) {
      alert('Please select a purchase order first');
      return;
    }

    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to cancel Purchase Order ${selectedOrderDetails.poNumber}?\n\n` +
      `This action cannot be undone.`
    );

    if (!isConfirmed) return;

    setCancelLoading(true);
    try {
      const response = await Api.put(
        `/purchase/purchase-orders/cancel/${selectedOrder}`
      );
      
      if (response.data.success) {
        alert('Purchase order cancelled successfully!');
        
        // Update local state to reflect cancellation
        if (selectedOrderDetails) {
          setSelectedOrderDetails({
            ...selectedOrderDetails,
            status: 'Cancelled'
          });
        }
        
        // Refresh the orders list
        if (selectedCompany) {
          fetchPurchaseOrders(selectedCompany);
        }
      } else {
        alert('Failed to cancel purchase order: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error cancelling purchase order:', error);
      
      if (error.response) {
        if (error.response.status === 400) {
          alert(`Cannot cancel purchase order: ${error.response.data.message || 'Order may be in a state that cannot be cancelled.'}`);
        } else if (error.response.status === 404) {
          alert('Purchase order not found');
        } else {
          alert(`Error cancelling purchase order: ${error.response.status} ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error cancelling purchase order. Please try again.');
      }
    } finally {
      setCancelLoading(false);
    }
  };

  // Check if order can be cancelled (based on status)
  const canCancelOrder = (orderDetails) => {
    if (!orderDetails) return false;
    
    const cancelableStatuses = ['Draft', 'Sent', 'Approved', 'Update Order'];
    return cancelableStatuses.includes(orderDetails.status);
  };

  const handleReceivedStock = () => {
    if (!selectedOrderDetails || !selectedOrder) {
      alert('Please select a purchase order first');
      return;
    }
    
    navigate('/receive-purchase-stock', {
      state: {
        purchaseOrderId: selectedOrder,
        selectedOrderDetails
      }
    });
  };

  // Handle ReOrder - Navigate to CreatePurchaseOrder with pre-filled data
  const handleReOrder = () => {
    if (!selectedOrderDetails) {
      alert('Please select a purchase order first');
      return;
    }
    
    // Check if order is in foreign currency
    const isForeignCurrency = selectedOrderDetails.currency === 'USD' || selectedOrderDetails.currency === 'EUR' || selectedOrderDetails.currency === 'GBP';
    
    // Calculate item totals properly based on currency
    const reorderItems = selectedOrderDetails.items?.map(item => {
      // Use rateInForeign if available and currency is foreign
      let rate, itemTotal, itemAmount;
      
      if (isForeignCurrency && item.rateInForeign) {
        // For foreign currency orders
        rate = parseFloat(item.rateInForeign) || 0;
        itemAmount = parseFloat(item.amountInForeign) || 0;
        itemTotal = parseFloat(item.total) || 0; // This is in INR including GST
      } else {
        // For INR orders
        rate = parseFloat(item.rate) || 0;
        const quantity = parseFloat(item.quantity) || 1;
        itemAmount = rate * quantity;
        itemTotal = itemAmount; // Will be updated with GST
      }
      
      const quantity = parseFloat(item.quantity) || 1;
      const itemGstRate = parseFloat(item.gstRate) || parseFloat(selectedOrderDetails.gstRate) || 0;
      
      // Calculate GST and totals
      const taxableAmount = itemAmount;
      const gstAmount = (taxableAmount * itemGstRate) / 100;
      const totalAmount = taxableAmount + gstAmount;
      
      return {
        id: item.id || item.itemId || '',
        itemId: item.itemId || item.id || '',
        itemName: item.itemName || item.name || '',
        hsnCode: item.hsnCode || '',
        modelNumber: item.modelNumber || '',
        unit: item.unit || 'Nos',
        rate: rate.toString(), // Use the appropriate rate
        rateInForeign: item.rateInForeign ? item.rateInForeign.toString() : '',
        amountInForeign: item.amountInForeign ? item.amountInForeign.toString() : '',
        quantity: item.quantity || '1',
        gstRate: itemGstRate,
        itemDetail: item.itemDetail || '',
        total: itemTotal.toString(),
        amount: taxableAmount.toString(),
        taxableAmount: taxableAmount.toString(),
        gstAmount: gstAmount.toString(),
        totalAmount: totalAmount.toString()
      };
    }) || [];
    
    // Prepare data for reorder
    const reorderData = {
      companyId: selectedOrderDetails.companyId,
      vendorId: selectedOrderDetails.vendorId,
      companyName: selectedOrderDetails.companyName,
      vendorName: selectedOrderDetails.vendorName,
      gstType: selectedOrderDetails.gstType,
      gstRate: selectedOrderDetails.gstRate || "",
      currency: selectedOrderDetails.currency || 'INR',
      exchangeRate: selectedOrderDetails.exchangeRate || "1",
      paymentTerms: selectedOrderDetails.paymentTerms || "",
      deliveryTerms: selectedOrderDetails.deliveryTerms || "",
      warranty: selectedOrderDetails.warranty || "",
      contactPerson: selectedOrderDetails.contactPerson || "",
      cellNo: selectedOrderDetails.cellNo || "",
      poNumber: selectedOrderDetails.poNumber,
      poDate: selectedOrderDetails.poDate,
      items: reorderItems,
      otherCharges: selectedOrderDetails.otherCharges || []
    };
    
    console.log('ReOrder Data being sent:', reorderData);
    
    navigate('/create-purchase-order', {
      state: { 
        reorderData,
        source: 'reorder'
      }
    });
  };

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

  // Status options with colors
  const statusOptions = [
    { value: "Draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
    { value: "Sent", label: "Sent", color: "bg-blue-100 text-blue-800" },
    { value: "Approved", label: "Approved", color: "bg-green-100 text-green-800" },
    { value: "Completed", label: "Completed", color: "bg-purple-100 text-purple-800" },
    { value: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
    { value: "Received", label: "Received", color: "bg-emerald-100 text-emerald-800" },
    { value: "Update Order", label: "Update Order", color: "bg-amber-100 text-amber-800" },
  ];

  // GST Types
  const gstTypes = [
    { value: "IGST_5", label: "IGST 5%" },
    { value: "IGST_12", label: "IGST 12%" },
    { value: "IGST_18", label: "IGST 18%" },
    { value: "IGST_28", label: "IGST 28%" },
    { value: "IGST_EXEMPTED", label: "IGST Exempted" },
    { value: "LGST_5", label: "LGST 5%" },
    { value: "LGST_12", label: "LGST 12%" },
    { value: "LGST_18", label: "LGST 18%" },
    { value: "LGST_28", label: "LGST 28%" },
    { value: "LGST_EXEMPTED", label: "LGST Exempted" },
    { value: "IGST_ITEMWISE", label: "IGST Itemwise" },
    { value: "LGST_ITEMWISE", label: "LGST Itemwise" },
  ];

  // Filtered items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.hsnCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Fetch detailed purchase order information
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
        quantity: item.quantity || '1',
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
    fetchItems();
  };

  // Handle item input changes with automatic calculation
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    const currentItem = { ...updatedItems[index] };
    
    // Update the changed field
    currentItem[field] = value;
    
    // Get numeric values
    const quantity = parseFloat(currentItem.quantity) || 0;
    const rate = parseFloat(currentItem.rate) || 0;
    const total = parseFloat(currentItem.total) || 0;
    
    // Calculate the missing field based on which two fields are provided
    if (field === 'quantity') {
      // If quantity changed, calculate total if rate is available
      if (rate > 0 && quantity > 0) {
        currentItem.total = (rate * quantity).toFixed(4);
      } else if (total > 0 && quantity > 0) {
        // If total and quantity are available, calculate rate
        currentItem.rate = (total / quantity).toFixed(4);
      }
    } else if (field === 'rate') {
      // If rate changed, calculate total if quantity is available
      if (quantity > 0 && rate > 0) {
        currentItem.total = (rate * quantity).toFixed(4);
      } else if (total > 0 && rate > 0) {
        // If total and rate are available, calculate quantity
        currentItem.quantity = Math.round(total / rate).toString();
      }
    } else if (field === 'total') {
      // If total changed, calculate rate if quantity is available
      if (quantity > 0 && total > 0) {
        currentItem.rate = (total / quantity).toFixed(4);
      } else if (rate > 0 && total > 0) {
        // If total and rate are available, calculate quantity
        currentItem.quantity = Math.round(total / rate).toString();
      }
    }
    
    // Update the item in the array
    updatedItems[index] = currentItem;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
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
      const response = await Api.put(
        `/purchase/purchase-orders/update2/${selectedOrder}`,
        formData
      );
      
      if (response.data.success) {
        alert('Purchase order updated successfully!');
        setShowUpdateForm(false);
        fetchOrderDetails(selectedOrder);
      } else {
        alert('Failed to update purchase order: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating purchase order:', error);
      
      if (error.response) {
        alert(`Error updating purchase order: ${error.response.status} ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
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

  // Handle item selection from dropdown
  const handleItemSelect = (index, selectedItem) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      name: selectedItem.name,
      id: selectedItem.id,
      source: selectedItem.source,
      hsnCode: selectedItem.hsnCode || '',
      modelNumber: selectedItem.modelNumber || '',
      unit: selectedItem.unit || 'Nos',
      rate: selectedItem.rate || '',
      itemDetail: selectedItem.itemDetail || ''
    };
    
    // Calculate total after item selection
    const rate = parseFloat(updatedItems[index].rate) || 0;
    const quantity = parseFloat(updatedItems[index].quantity) || 1;
    updatedItems[index].total = (rate * quantity).toFixed(4);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    setShowItemsDropdown(null);
    setSearchQuery('');
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
          unit: 'Nos',
          quantity: '1',
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

  // Download as PDF
  const handleDownload = async () => {
    if (!selectedOrderDetails || !selectedOrder) return;
    
    setDownloadLoading(true);
    try {
      const response = await Api.post(
        `/purchase/purchase-orders/download2/${selectedOrder}`,
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
          remarks: selectedOrderDetails.remarks
        },
        {
          responseType: 'blob'
        }
      );

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
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          alert('PDF file not found for this purchase order');
        } else if (error.response.status === 500) {
          alert('Server error while generating PDF. Please try again.');
        } else {
          alert(`Error downloading PDF: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.request) {
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

  // Format foreign currency
  const formatForeignCurrency = (amount, currency) => {
    if (!amount) return '0.00';
    const formattedAmount = parseFloat(amount).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    if (currency === 'USD') {
      return `$${formattedAmount}`;
    } else if (currency === 'EUR') {
      return `€${formattedAmount}`;
    } else if (currency === 'GBP') {
      return `£${formattedAmount}`;
    } else {
      return `${currency} ${formattedAmount}`;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  // Initialize component
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Calculate totals for selected order
  const totals = selectedOrderDetails ? calculateTotals(selectedOrderDetails) : {};

  // Check if currency is foreign
  const isForeignCurrency = selectedOrderDetails && 
    (selectedOrderDetails.currency === 'USD' || 
     selectedOrderDetails.currency === 'EUR' || 
     selectedOrderDetails.currency === 'GBP');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">View Purchase Order</h1>
          <p className="text-gray-600">Select a company and purchase order to view details</p>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Select Company <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <select
                  value={selectedCompany}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                  disabled={loading}
                >
                  <option value="">-- Select Company --</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
                {loading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {selectedCompany && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Select Purchase Order <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <select
                    value={selectedOrder}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {!ordersLoading && purchaseOrders.length === 0 && (
                  <div className="mt-2 text-sm text-amber-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.948-.833-2.678 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5" />
                    </svg>
                    No purchase orders found for this company
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <>
          {selectedOrder && selectedOrderDetails && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Purchase Order: {selectedOrderDetails.poNumber}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          Date: {formatDate(selectedOrderDetails.poDate)}
                        </span>
                        <span className="text-sm px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-800">
                          {selectedOrderDetails.companyName}
                        </span>
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(selectedOrderDetails.status)}`}>
                          {getStatusLabel(selectedOrderDetails.status)}
                        </span>
                        <span className="text-sm text-gray-600">
                          Vendor: {selectedOrderDetails.vendorName}
                        </span>
                        {isForeignCurrency && (
                          <span className="text-sm px-3 py-1 rounded-full font-medium bg-indigo-100 text-indigo-800">
                            Currency: {selectedOrderDetails.currency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Show only Download button when status is Cancelled */}
                    {selectedOrderDetails.status === 'Cancelled' ? (
                      <button 
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDownload}
                        disabled={downloadLoading}
                      >
                        {downloadLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </>
                        )}
                      </button>
                    ) : (
                      <>
                        {/* Conditionally show "Receive Stock" button only if status is not "Fully Received" or "Update Order" */}
                        {selectedOrderDetails.status !== 'Received' && selectedOrderDetails.status !== 'Update Order' && (
                          <button 
                            className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleReceivedStock}
                            disabled={detailsLoading}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Receive
                          </button>
                        )}
                        
                        {/* Conditionally show "Update Order" button only if status is not "Update Order" AND not "Received" */}
                        {selectedOrderDetails.status !== 'Update Order' && selectedOrderDetails.status !== 'Received' && (
                          <button 
                            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center"
                            onClick={() => prepareUpdateForm(selectedOrderDetails)}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Update Order
                          </button>
                        )}

                        {/* ReOrder Button - Always visible for all statuses except maybe "Update Order" */}
                        {selectedOrderDetails.status !== 'Update Order' && (
                          <button 
                            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium flex items-center justify-center"
                            onClick={handleReOrder}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            ReOrder
                          </button>
                        )}

                        {/* Cancel Order Button - Only show if order can be cancelled */}
                        {canCancelOrder(selectedOrderDetails) && (
                          <button 
                            className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCancelOrder}
                            disabled={cancelLoading}
                          >
                            {cancelLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                              </>
                            )}
                          </button>
                        )}
                        
                        <button 
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleDownload}
                          disabled={downloadLoading}
                        >
                          {downloadLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {detailsLoading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading order details...</p>
                </div>
              ) : (
                <>
                  {/* Basic Information */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Vendor Name</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.vendorName || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Contact Person</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.contactPerson || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Contact Number</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.cellNo || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">GST Type</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.gstType || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">GST Rate</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.gstRate || '0'}%</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Currency</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.currency || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Exchange Rate</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.exchangeRate || '1'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Payment Terms</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.paymentTerms || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Delivery Terms</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.deliveryTerms || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Warranty</label>
                        <div className="text-base font-semibold text-gray-900">{selectedOrderDetails.warranty || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        Item Details
                      </h3>
                      <div className="flex items-center gap-4">
                        {isForeignCurrency && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                            {selectedOrderDetails.currency} Currency
                          </span>
                        )}
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {selectedOrderDetails.items?.length || 0} Items
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                        selectedOrderDetails.items.map((item, index) => (
                          <div key={item.id || index} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all duration-200">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{item.itemName || 'Unnamed Item'}</h4>
                                  <p className="text-sm text-gray-600">HSN: {item.hsnCode || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">
                                  ₹{formatCurrency(item.total)}
                                </div>
                                {isForeignCurrency && item.amountInForeign && (
                                  <div className="text-sm font-semibold text-indigo-600">
                                    {formatForeignCurrency(item.amountInForeign, selectedOrderDetails.currency)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</label>
                                <div className="font-medium text-gray-900">{item.unit || 'N/A'}</div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</label>
                                <div className="font-medium text-gray-900">{item.quantity || '0'}</div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Rate {isForeignCurrency ? `(${selectedOrderDetails.currency})` : '(₹)'}
                                </label>
                                <div className="font-medium text-gray-900">
                                  {isForeignCurrency 
                                    ? formatForeignCurrency(item.rateInForeign || item.rate, selectedOrderDetails.currency)
                                    : `₹${formatCurrency(item.rate)}`
                                  }
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Model</label>
                                <div className="font-medium text-gray-900">{item.modelNumber || 'N/A'}</div>
                              </div>
                            </div>
                            
                            {/* Show amountInForeign for foreign currency */}
                            {isForeignCurrency && item.amountInForeign && (
                              <div className="mb-3 p-3 bg-indigo-50 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount in {selectedOrderDetails.currency}</label>
                                    <div className="font-semibold text-indigo-700">
                                      {formatForeignCurrency(item.amountInForeign, selectedOrderDetails.currency)}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount in INR</label>
                                    <div className="font-semibold text-gray-900">
                                      ₹{formatCurrency((parseFloat(item.amountInForeign) || 0) * (parseFloat(selectedOrderDetails.exchangeRate) || 1))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {item.itemDetail && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
                                <div className="text-sm text-gray-700">{item.itemDetail}</div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-gray-500">No items found in this purchase order</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Other Charges Section */}
                  {selectedOrderDetails.otherCharges && selectedOrderDetails.otherCharges.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Other Charges
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {selectedOrderDetails.otherCharges.length} Charges
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {selectedOrderDetails.otherCharges.map((charge, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-xs font-semibold mr-3">
                                {index + 1}
                              </div>
                              <div className="font-medium text-gray-900">{charge.name || 'Unnamed Charge'}</div>
                            </div>
                            <div className="font-semibold text-blue-600">₹{formatCurrency(charge.amount)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Remarks Section */}
                  {selectedOrderDetails.remarks && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Additional Information
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Remarks</div>
                        <div className="text-gray-900">{selectedOrderDetails.remarks}</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Empty States */}
          {!selectedCompany && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Company</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Please select a company from the dropdown above to view its purchase orders.
              </p>
            </div>
          )}

          {selectedCompany && !selectedOrder && purchaseOrders.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Purchase Order</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Choose a purchase order from the dropdown above to view its details.
              </p>
            </div>
          )}

          {selectedCompany && !selectedOrder && purchaseOrders.length === 0 && !ordersLoading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Purchase Orders</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                This company doesn't have any purchase orders yet.
              </p>
            </div>
          )}
        </>

        {/* Update Form Modal */}
        {showUpdateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Update Purchase Order</h2>
                      <p className="text-sm text-gray-600">PO Number: {formData.poNumber}</p>
                    </div>
                  </div>
                  <button 
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <form onSubmit={handleUpdateSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PO Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="poNumber"
                          value={formData.poNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PO Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="poDate"
                          value={formData.poDate ? formData.poDate.split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="gstType"
                          value={formData.gstType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        >
                          <option value="">Select GST Type</option>
                          {gstTypes.map(gst => (
                            <option key={gst.value} value={gst.value}>
                              {gst.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Rate (%) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="gstRate"
                          value={formData.gstRate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Terms
                        </label>
                        <input
                          type="text"
                          name="paymentTerms"
                          value={formData.paymentTerms}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Terms
                        </label>
                        <input
                          type="text"
                          name="deliveryTerms"
                          value={formData.deliveryTerms}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          name="cellNo"
                          value={formData.cellNo}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty
                        </label>
                        <input
                          type="text"
                          name="warranty"
                          value={formData.warranty}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        rows="3"
                      />
                    </div>
                  </div>

                  {/* Items Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        Items
                      </h3>
                      <button 
                        type="button" 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center"
                        onClick={addNewItem}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {formData.items.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
                                {index + 1}
                              </div>
                              <h4 className="font-semibold text-gray-900">Item {index + 1}</h4>
                            </div>
                            <button 
                              type="button" 
                              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium flex items-center"
                              onClick={() => removeItem(index)}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Item Name <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  required
                                  onFocus={() => setShowItemsDropdown(index)}
                                  placeholder="Click to select item"
                                />
                                {showItemsDropdown === index && (
                                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Select Item</span>
                                        <button 
                                          type="button"
                                          className="text-gray-400 hover:text-gray-600"
                                          onClick={() => setShowItemsDropdown(null)}
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="px-4 py-2 border-b border-gray-200">
                                      <input
                                        type="text"
                                        placeholder="Search items..."
                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                      />
                                    </div>
                                    <div className="py-1">
                                      {itemsLoading ? (
                                        <div className="px-4 py-8 text-center text-gray-500">
                                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                          Loading items...
                                        </div>
                                      ) : filteredItems.length > 0 ? (
                                        filteredItems.map((apiItem) => (
                                          <div
                                            key={apiItem.id}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            onClick={() => handleItemSelect(index, apiItem)}
                                          >
                                            <div className="font-medium text-gray-900">{apiItem.name}</div>
                                            <div className="text-sm text-gray-500 mt-1">HSN: {apiItem.hsnCode || 'N/A'}</div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="px-4 py-8 text-center text-gray-500">No items found</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                HSN Code <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={item.hsnCode}
                                onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Model Number
                              </label>
                              <input
                                type="text"
                                value={item.modelNumber}
                                onChange={(e) => handleItemChange(index, 'modelNumber', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={item.unit}
                                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                min="1"
                                step="0.01"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rate <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                step="0.01"
                                min="0"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Total <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={item.total}
                                onChange={(e) => handleItemChange(index, 'total', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                step="0.01"
                                min="0"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Item Description
                            </label>
                            <textarea
                              value={item.itemDetail}
                              onChange={(e) => handleItemChange(index, 'itemDetail', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              rows="3"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Charges Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Other Charges
                      </h3>
                      <button 
                        type="button" 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center"
                        onClick={addNewCharge}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Charge
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.otherCharges.map((charge, index) => (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
                                {index + 1}
                              </div>
                              <h4 className="font-semibold text-gray-900">Charge {index + 1}</h4>
                            </div>
                            <button 
                              type="button" 
                              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium flex items-center"
                              onClick={() => removeCharge(index)}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Charge Name</label>
                              <input
                                type="text"
                                value={charge.name}
                                onChange={(e) => handleChargeChange(index, 'name', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                              <input
                                type="number"
                                value={charge.amount}
                                onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                step="0.01"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                      onClick={() => setShowUpdateForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Update Order
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPurchaseOrder;