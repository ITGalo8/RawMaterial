// import React, { useState, useEffect } from 'react';
// import Api from '../../../auth/Api'

// const AdminDashboard = () => {
//   const [paymentRequests, setPaymentRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateLoading, setUpdateLoading] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [actionType, setActionType] = useState(null);
//   const [remarks, setRemarks] = useState('');
//   const [notification, setNotification] = useState(null);
  
//   // Search and pagination states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchField, setSearchField] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Available search fields
//   const searchFields = [
//     { value: 'all', label: 'All Fields' },
//     { value: 'poNumber', label: 'PO Number' },
//     { value: 'companyName', label: 'Company' },
//     { value: 'vendorName', label: 'Vendor' },
//     { value: 'paymentRequestedBy', label: 'Requested By' },
//     { value: 'status', label: 'Status' }
//   ];

//   useEffect(() => {
//     fetchPaymentRequests();
//   }, []);

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   // Filter payment requests when search term changes
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredRequests(paymentRequests);
//       setCurrentPage(1);
//       return;
//     }

//     const filtered = paymentRequests.filter(request => {
//       const term = searchTerm.toLowerCase();
      
//       if (searchField === 'all') {
//         return (
//           request.poNumber?.toLowerCase().includes(term) ||
//           request.companyName?.toLowerCase().includes(term) ||
//           request.vendorName?.toLowerCase().includes(term) ||
//           request.paymentRequestedBy?.toLowerCase().includes(term) ||
//           request.status?.toLowerCase().includes(term)
//         );
//       }
      
//       return request[searchField]?.toString().toLowerCase().includes(term);
//     });

//     setFilteredRequests(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, searchField, paymentRequests]);

//   const fetchPaymentRequests = async () => {
//     try {
//       setLoading(true);
//       const response = await Api.get('/admin/showPaymentRequests');
      
//       if (response.data.success) {
//         setPaymentRequests(response.data.data);
//         setFilteredRequests(response.data.data);
//       } else {
//         setError('Failed to fetch payment requests');
//       }
//     } catch (err) {
//       setError('Error connecting to server');
//       console.error('Error fetching payment requests:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActionClick = (request, action) => {
//     setSelectedRequest(request);
//     setActionType(action);
//     setRemarks('');
//     setShowModal(true);
//   };

//   const handleUpdateStatus = async () => {
//     if (!selectedRequest || !actionType) return;

//     try {
//       setUpdateLoading(selectedRequest.paymentRequestId);
      
//       const updateData = {
//         paymentRequestId: selectedRequest.paymentRequestId,
//         status: actionType === 'APPROVE' ? 'APPROVED' : 'REJECTED',
//         remarks: remarks || (actionType === 'APPROVE' ? 'Payment Approved' : 'Payment Rejected')
//       };

//       const response = await Api.patch(
//         '/admin/updateApprovalStatus',
//         updateData,
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         setPaymentRequests(prev => 
//           prev.map(req => 
//             req.paymentRequestId === selectedRequest.paymentRequestId 
//               ? { ...req, status: updateData.status }
//               : req
//           )
//         );

//         setNotification({
//           type: 'success',
//           message: response.data.message || `Payment request ${actionType === 'APPROVE' ? 'approved' : 'rejected'} successfully!`
//         });

//         setShowModal(false);
//         setSelectedRequest(null);
//         setActionType(null);
//         setRemarks('');
//       } else {
//         throw new Error(response.data.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error('Error updating status:', err);
      
//       setNotification({
//         type: 'error',
//         message: err.response?.data?.message || err.message || 'Failed to update payment status'
//       });
//     } finally {
//       setUpdateLoading(null);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatCurrency = (amount, currency) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: currency || 'USD',
//       minimumFractionDigits: 2,
//     }).format(amount);
//   };

//   // Calculate pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

//   // Generate page numbers
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       // Always show first page
//       pageNumbers.push(1);
      
//       let start = Math.max(2, currentPage - 1);
//       let end = Math.min(totalPages - 1, currentPage + 1);
      
//       if (currentPage <= 3) {
//         start = 2;
//         end = 4;
//       } else if (currentPage >= totalPages - 2) {
//         start = totalPages - 3;
//         end = totalPages - 1;
//       }
      
//       if (start > 2) {
//         pageNumbers.push('...');
//       }
      
//       for (let i = start; i <= end; i++) {
//         pageNumbers.push(i);
//       }
      
//       if (end < totalPages - 1) {
//         pageNumbers.push('...');
//       }
      
//       // Always show last page
//       pageNumbers.push(totalPages);
//     }
    
//     return pageNumbers;
//   };

//   // Handle page change
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages || pageNumber === '...') return;
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Handle items per page change
//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm('');
//     setSearchField('all');
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {notification && (
//         <div className={`fixed top-4 right-4 z-50 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded shadow-lg transition-opacity duration-300`}>
//           <div className="flex items-center">
//             {notification.type === 'success' ? (
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             )}
//             <span>{notification.message}</span>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       {showModal && selectedRequest && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <h3 className="text-lg font-medium leading-6 text-gray-900">
//                 Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
//               </h3>
              
//               <div className="mt-4 bg-gray-50 p-4 rounded">
//                 <div className="text-sm text-gray-600">
//                   <p><strong>PO Number:</strong> {selectedRequest.poNumber}</p>
//                   <p><strong>Vendor:</strong> {selectedRequest.vendorName}</p>
//                   <p><strong>Amount:</strong> {formatCurrency(selectedRequest.requestedAmount, selectedRequest.currency)}</p>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Remarks
//                 </label>
//                 <textarea
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   rows={3}
//                   placeholder={actionType === 'APPROVE' ? 'Add remarks for approval...' : 'Add remarks for rejection...'}
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                 />
//               </div>

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   onClick={() => {
//                     setShowModal(false);
//                     setSelectedRequest(null);
//                     setActionType(null);
//                     setRemarks('');
//                   }}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdateStatus}
//                   disabled={updateLoading === selectedRequest.paymentRequestId}
//                   className={`px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                     actionType === 'APPROVE'
//                       ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
//                       : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
//                   } ${updateLoading === selectedRequest.paymentRequestId ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   {updateLoading === selectedRequest.paymentRequestId ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       Processing...
//                     </span>
//                   ) : (
//                     `Confirm ${actionType === 'APPROVE' ? 'Approval' : 'Rejection'}`
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Payment Approval Request</h1>
//       </div>

//       {/* Search Section */}
//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
//           <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search payment requests..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
//               />
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <select
//                 value={searchField}
//                 onChange={(e) => setSearchField(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {searchFields.map((field) => (
//                   <option key={field.value} value={field.value}>
//                     {field.label}
//                   </option>
//                 ))}
//               </select>
              
//               {searchTerm && (
//                 <button
//                   onClick={clearSearch}
//                   className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-gray-600">
//               Total: <span className="font-semibold">{filteredRequests.length}</span> request(s)
//               {searchTerm && (
//                 <span className="ml-2 text-gray-500">
//                   (filtered from {paymentRequests.length})
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {error ? (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//           <p>{error}</p>
//           <button 
//             onClick={fetchPaymentRequests}
//             className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
//           >
//             Retry
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//             {/* Table Header with Pagination Controls ABOVE */}
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-700">
//                     Payment Requests
//                   </h2>
//                   <div className="text-sm text-gray-500 mt-1">
//                     Showing {filteredRequests.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} entries
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-4">
//                   {/* Items per page selector */}
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-600">Show</span>
//                     <select
//                       value={itemsPerPage}
//                       onChange={handleItemsPerPageChange}
//                       className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value={5}>5</option>
//                       <option value={10}>10</option>
//                       <option value={25}>25</option>
//                       <option value={50}>50</option>
//                       <option value={100}>100</option>
//                     </select>
//                     <span className="text-sm text-gray-600">per page</span>
//                   </div>
                  
//                   {/* Pagination Controls */}
//                   {filteredRequests.length > 0 && (
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className={`p-2 rounded-md ${
//                           currentPage === 1
//                             ? 'text-gray-400 cursor-not-allowed'
//                             : 'text-gray-600 hover:bg-gray-100'
//                         }`}
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                         </svg>
//                       </button>
                      
//                       <div className="flex items-center space-x-1">
//                         {getPageNumbers().map((number, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handlePageChange(number)}
//                             disabled={number === '...'}
//                             className={`min-w-8 h-8 flex items-center justify-center rounded-md text-sm ${
//                               number === '...'
//                                 ? 'text-gray-500 cursor-default'
//                                 : currentPage === number
//                                 ? 'bg-blue-500 text-white'
//                                 : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                           >
//                             {number}
//                           </button>
//                         ))}
//                       </div>
                      
//                       <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className={`p-2 rounded-md ${
//                           currentPage === totalPages
//                             ? 'text-gray-400 cursor-not-allowed'
//                             : 'text-gray-600 hover:bg-gray-100'
//                         }`}
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       </button>
//                     </div>
//                   )}
                  
//                   {/* Refresh Button */}
//                   <button
//                     onClick={fetchPaymentRequests}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center"
//                   >
//                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       PO Number
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Company
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Vendor
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Bill Type
//                     </th>
//                     {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th> */}
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Requested By
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentItems.map((request) => (
//                     <tr key={request.paymentRequestId} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">
//                           {request.poNumber}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{request.companyName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{request.vendorName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-semibold text-gray-900">
//                           {formatCurrency(request.requestedAmount, request.currency)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           request.billpaymentType === 'Advance_Payment' 
//                             ? 'bg-blue-100 text-blue-800'
//                             : 'bg-green-100 text-green-800'
//                         }`}>
//                           {request.billpaymentType.replace('_', ' ')}
//                         </span>
//                       </td>
//                       {/* <td className="px-6 py-4 whitespace-nowrap">
//                         {getStatusBadge(request.status)}
//                       </td> */}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {request.paymentRequestedBy}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(request.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button 
//                           onClick={() => handleActionClick(request, 'APPROVE')}
//                           disabled={updateLoading === request.paymentRequestId || request.status === 'APPROVED'}
//                           className={`text-green-600 hover:text-green-900 mr-4 ${
//                             (updateLoading === request.paymentRequestId || request.status === 'APPROVED') 
//                               ? 'opacity-50 cursor-not-allowed' 
//                               : ''
//                           }`}
//                         >
//                           {request.status === 'APPROVED' ? 'Approved' : 'Approve'}
//                         </button>
//                         <button 
//                           onClick={() => handleActionClick(request, 'REJECT')}
//                           disabled={updateLoading === request.paymentRequestId || request.status === 'REJECTED'}
//                           className={`text-red-600 hover:text-red-900 ${
//                             (updateLoading === request.paymentRequestId || request.status === 'REJECTED') 
//                               ? 'opacity-50 cursor-not-allowed' 
//                               : ''
//                           }`}
//                         >
//                           {request.status === 'REJECTED' ? 'Rejected' : 'Reject'}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {filteredRequests.length === 0 && (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">
//                   {searchTerm ? 'No payment requests match your search' : 'No payment requests found'}
//                 </p>
//               </div>
//             )}

//             {/* Pagination Controls BELOW */}
//             {filteredRequests.length > 0 && (
//               <div className="px-6 py-4 border-t border-gray-200">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
//                   <div className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
//                     <span className="font-medium">{Math.min(indexOfLastItem, filteredRequests.length)}</span> of{' '}
//                     <span className="font-medium">{filteredRequests.length}</span> entries
//                     {searchTerm && (
//                       <span className="ml-2 text-gray-500">
//                         (filtered from {paymentRequests.length} total)
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="flex items-center space-x-4">
//                     {/* Items per page selector */}
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm text-gray-600">Show</span>
//                       <select
//                         value={itemsPerPage}
//                         onChange={handleItemsPerPageChange}
//                         className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       >
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                         <option value={25}>25</option>
//                         <option value={50}>50</option>
//                         <option value={100}>100</option>
//                       </select>
//                       <span className="text-sm text-gray-600">per page</span>
//                     </div>
                    
//                     {/* Pagination Controls */}
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className={`p-2 rounded-md ${
//                           currentPage === 1
//                             ? 'text-gray-400 cursor-not-allowed'
//                             : 'text-gray-600 hover:bg-gray-100'
//                         }`}
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                         </svg>
//                       </button>
                      
//                       <div className="flex items-center space-x-1">
//                         {getPageNumbers().map((number, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handlePageChange(number)}
//                             disabled={number === '...'}
//                             className={`min-w-8 h-8 flex items-center justify-center rounded-md text-sm ${
//                               number === '...'
//                                 ? 'text-gray-500 cursor-default'
//                                 : currentPage === number
//                                 ? 'bg-blue-500 text-white'
//                                 : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                           >
//                             {number}
//                           </button>
//                         ))}
//                       </div>
                      
//                       <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className={`p-2 rounded-md ${
//                           currentPage === totalPages
//                             ? 'text-gray-400 cursor-not-allowed'
//                             : 'text-gray-600 hover:bg-gray-100'
//                         }`}
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       </button>
//                     </div>
                    
//                     {/* Go to page */}
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm text-gray-600">Go to page:</span>
//                       <input
//                         type="number"
//                         min="1"
//                         max={totalPages}
//                         value={currentPage}
//                         onChange={(e) => {
//                           const page = parseInt(e.target.value);
//                           if (page >= 1 && page <= totalPages) {
//                             handlePageChange(page);
//                           }
//                         }}
//                         className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                       <span className="text-sm text-gray-600">of {totalPages}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import Api from '../../../auth/Api';

const AdminDashboard = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [notification, setNotification] = useState(null);
  
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Available search fields
  const searchFields = [
    { value: 'all', label: 'All Fields' },
    { value: 'poNumber', label: 'PO Number' },
    { value: 'companyName', label: 'Company' },
    { value: 'vendorName', label: 'Vendor' },
    { value: 'paymentRequestedBy', label: 'Requested By' },
    { value: 'status', label: 'Status' }
  ];

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter payment requests when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRequests(paymentRequests);
      setCurrentPage(1);
      return;
    }

    const filtered = paymentRequests.filter(request => {
      const term = searchTerm.toLowerCase();
      
      if (searchField === 'all') {
        return (
          request.poNumber?.toLowerCase().includes(term) ||
          request.companyName?.toLowerCase().includes(term) ||
          request.vendorName?.toLowerCase().includes(term) ||
          request.paymentRequestedBy?.toLowerCase().includes(term) ||
          request.status?.toLowerCase().includes(term)
        );
      }
      
      return request[searchField]?.toString().toLowerCase().includes(term);
    });

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, searchField, paymentRequests]);

  const fetchPaymentRequests = async () => {
    try {
      setLoading(true);
      const response = await Api.get('/admin/showPaymentRequests');
      
      if (response.data.success) {
        setPaymentRequests(response.data.data);
        setFilteredRequests(response.data.data);
      } else {
        setError('Failed to fetch payment requests');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching payment requests:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleActionClick = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setRemarks('');
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setUpdateLoading(selectedRequest.paymentRequestId);
      
      const updateData = {
        paymentRequestId: selectedRequest.paymentRequestId,
        status: actionType === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        remarks: remarks || (actionType === 'APPROVE' ? 'Payment Approved' : 'Payment Rejected')
      };

      const response = await Api.patch(
        '/admin/updateApprovalStatus',
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setNotification({
          type: 'success',
          message: response.data.message || `Payment request ${actionType === 'APPROVE' ? 'approved' : 'rejected'} successfully! Refreshing data...`
        });

        // Set refreshing state
        setRefreshing(true);
        
        // Close modal first
        setShowModal(false);
        setSelectedRequest(null);
        setActionType(null);
        setRemarks('');
        
        // Refresh data after a short delay
        setTimeout(() => {
          fetchPaymentRequests().finally(() => {
            setRefreshing(false);
          });
        }, 500);
        
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      
      setNotification({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to update payment status'
      });
    } finally {
      setUpdateLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }
      
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === '...') return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      'APPROVED': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      'REJECTED': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Search skeleton */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        
        {/* Table skeleton */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Global refreshing overlay */}
      {refreshing && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Updating data...</p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded shadow-lg transition-opacity duration-300 max-w-sm`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4">
          <div className="relative mt-8 mx-auto p-5 border w-full max-w-md md:max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setActionType(null);
                    setRemarks('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">PO Number:</span>
                    <span>{selectedRequest.poNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Vendor:</span>
                    <span>{selectedRequest.vendorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="font-semibold">{formatCurrency(selectedRequest.requestedAmount, selectedRequest.currency)}</span>
                  </div>
                </div>
              </div>

              {/* <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                  placeholder={actionType === 'APPROVE' ? 'Add remarks for approval...' : 'Add remarks for rejection...'}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div> */}

              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setActionType(null);
                    setRemarks('');
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updateLoading === selectedRequest.paymentRequestId}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${
                    actionType === 'APPROVE'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500 shadow-sm hover:shadow'
                      : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-sm hover:shadow'
                  } ${updateLoading === selectedRequest.paymentRequestId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updateLoading === selectedRequest.paymentRequestId ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Confirm ${actionType === 'APPROVE' ? 'Approval' : 'Rejection'}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Payment Approval Request</h1>
        <p className="text-gray-600 text-sm md:text-base mt-1">Approve or reject payment requests from vendors</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search payment requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full md:w-auto"
              >
                {searchFields.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
              
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 whitespace-nowrap hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{filteredRequests.length}</span> request(s)
              {searchTerm && (
                <span className="ml-2 text-gray-500">
                  (filtered from {paymentRequests.length})
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Use the search bar to filter by any field
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchPaymentRequests}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors duration-150"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Table Header with Pagination Controls */}
            <div className="px-4 md:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Payment Requests
                  </h2>
                  <div className="flex items-center space-x-2">
                    {/* Items per page selector */}
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <span className="text-xs md:text-sm text-gray-600">Show</span>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border border-gray-300 rounded-md px-1 md:px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-xs md:text-sm text-gray-600">per page</span>
                    </div>
                    
                    {/* Refresh Button */}
                    <button
                      onClick={fetchPaymentRequests}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded text-xs md:text-sm font-medium flex items-center shadow-sm hover:shadow transition-all duration-150"
                      title="Refresh data"
                    >
                      <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>
                </div>
                
                {/* Results info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500">
                  <div>
                    Total: <span className="font-semibold">{filteredRequests.length}</span> request(s)
                    {searchTerm && (
                      <span className="ml-2">
                        (filtered from {paymentRequests.length})
                      </span>
                    )}
                  </div>
                  <div>
                    Showing {filteredRequests.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} entries
                  </div>
                </div>
              </div>
            </div>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PO Details
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Company
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Vendor
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Type
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Requested By
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Date
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((request) => (
                    <tr key={request.paymentRequestId} className="hover:bg-gray-50 transition-colors duration-150">
                      {/* PO Details */}
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-col">
                          <div className="font-medium text-gray-900">
                            {request.poNumber}
                          </div>
                          <div className="md:hidden text-sm text-gray-500 mt-1">
                            {request.companyName}
                          </div>
                          <div className="lg:hidden text-sm text-gray-500">
                            {request.vendorName}
                          </div>
                        </div>
                      </td>
                      
                      {/* Company */}
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900">{request.companyName}</div>
                      </td>
                      
                      {/* Vendor */}
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-900">{request.vendorName}</div>
                      </td>
                      
                      {/* Amount */}
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(request.requestedAmount, request.currency)}
                        </div>
                      </td>
                      
                      {/* Bill Type */}
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.billpaymentType === 'Advance_Payment' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {request.billpaymentType.replace('_', ' ')}
                        </span>
                      </td>
                      
                      {/* Status */}
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      
                      {/* Requested By */}
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        {request.paymentRequestedBy}
                      </td>
                      
                      {/* Date */}
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                        <div className="flex flex-col">
                          <span>{formatDate(request.createdAt).split(',')[0]}</span>
                          <span className="text-xs text-gray-400">
                            {formatDate(request.createdAt).split(',')[1]}
                          </span>
                        </div>
                      </td>
                      
                      {/* Actions - Beautifully Designed Buttons */}
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                          {/* Approve Button */}
                          <button 
                            onClick={() => handleActionClick(request, 'APPROVE')}
                            disabled={updateLoading === request.paymentRequestId || request.status === 'APPROVED'}
                            className={`
                              relative inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium
                              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500
                              ${request.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800 border border-green-200 cursor-default shadow-inner' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 hover:shadow-sm active:scale-95'
                              }
                              ${(updateLoading === request.paymentRequestId) ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            {request.status === 'APPROVED' ? (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Approved
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </>
                            )}
                          </button>
                          
                          {/* Reject Button */}
                          <button 
                            onClick={() => handleActionClick(request, 'REJECT')}
                            disabled={updateLoading === request.paymentRequestId || request.status === 'REJECTED'}
                            className={`
                              relative inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium
                              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500
                              ${request.status === 'REJECTED' 
                                ? 'bg-red-100 text-red-800 border border-red-200 cursor-default shadow-inner' 
                                : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 hover:shadow-sm active:scale-95'
                              }
                              ${(updateLoading === request.paymentRequestId) ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            {request.status === 'REJECTED' ? (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Rejected
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No Results Message */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  {searchTerm ? 'No payment requests match your search' : 'No payment requests found'}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-800 text-sm hover:underline transition-colors duration-150"
                  >
                    Clear search to see all requests
                  </button>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredRequests.length > 0 && (
              <div className="px-4 md:px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col space-y-4">
                  {/* Top pagination row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    
                    {/* Pagination buttons */}
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md transition-colors duration-150 ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        aria-label="Previous page"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {/* Page numbers */}
                      <div className="hidden sm:flex items-center space-x-1">
                        {getPageNumbers().map((number, index) => (
                          <button
                            key={index}
                            onClick={() => handlePageChange(number)}
                            disabled={number === '...'}
                            className={`min-w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors duration-150 ${
                              number === '...'
                                ? 'text-gray-500 cursor-default'
                                : currentPage === number
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md transition-colors duration-150 ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        aria-label="Next page"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Bottom row with page selection */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-600">
                      Total: {filteredRequests.length} items
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-gray-600">Go to page:</span>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= totalPages) {
                            handlePageChange(page);
                          }
                        }}
                        className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-xs sm:text-sm text-gray-600">of {totalPages}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          

        </>
      )}
    </div>
  );
};

export default AdminDashboard;