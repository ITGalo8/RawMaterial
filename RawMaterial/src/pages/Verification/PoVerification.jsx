import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PoVerification = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'decline'
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'all'

  // Fetch payment requests
  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/purchase/purchase-orders/payments/verification-list'
      );
      setPaymentRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      // Use mock data for testing
      
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedRequest(null);
    setRemarks('');
    setActionType('');
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType('approve');
    setShowDialog(true);
  };

  const handleDecline = (request) => {
    setSelectedRequest(request);
    setActionType('decline');
    setShowDialog(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest) return;

    const endpoint = actionType === 'approve' 
      ? 'http://localhost:5000/purchase/purchase-orders/payments/approve'
      : 'http://localhost:5000/purchase/purchase-orders/payments/reject';

    try {
      await axios.post(endpoint, {
        paymentRequestId: selectedRequest.id,
        remarks: remarks.trim(),
      });

      // Update local state
      setPaymentRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === selectedRequest.id
            ? { ...req, status: actionType === 'approve' ? 'Approved' : 'Rejected' }
            : req
        )
      );

      alert(`Payment request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`);
      handleCloseDialog();
    } catch (error) {
      console.error(`Error ${actionType}ing payment request:`, error);
      alert(`Failed to ${actionType} payment request`);
    }
  };

  // Get filtered requests based on active tab
  const getFilteredRequests = () => {
    if (activeTab === 'pending') {
      return paymentRequests.filter(req => 
        req.status === 'Pending' || req.status === 'Under Verification'
      );
    }
    return paymentRequests;
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusClasses = () => {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'Approved':
          return 'bg-green-100 text-green-800';
        case 'Rejected':
          return 'bg-red-100 text-red-800';
        case 'Under Verification':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses()}`}>
        {status}
      </span>
    );
  };

  // Payment type badge component
  const PaymentTypeBadge = ({ type }) => {
    const getTypeClasses = () => {
      switch (type) {
        case 'Advance_Payment':
          return 'border-blue-500 text-blue-600';
        case 'Partial_Payment':
          return 'border-purple-500 text-purple-600';
        case 'Full_Payment':
          return 'border-green-500 text-green-600';
        default:
          return 'border-gray-500 text-gray-600';
      }
    };

    const getTypeLabel = () => {
      switch (type) {
        case 'Advance_Payment':
          return 'Advance Payment';
        case 'Partial_Payment':
          return 'Partial Payment';
        case 'Full_Payment':
          return 'Full Payment';
        default:
          return type;
      }
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded ${getTypeClasses()}`}>
        {getTypeLabel()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading payment requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              PO Payment Verification Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Review and approve/reject payment requests
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              {getFilteredRequests().length} Pending
            </span>
            <button
              onClick={fetchPaymentRequests}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{paymentRequests.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {paymentRequests.filter(req => req.status === 'Pending' || req.status === 'Under Verification').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Approved</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {paymentRequests.filter(req => req.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Rejected</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {paymentRequests.filter(req => req.status === 'Rejected').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Verification
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {paymentRequests.filter(req => req.status === 'Pending' || req.status === 'Under Verification').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Requests
            </button>
          </nav>
        </div>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            {activeTab === 'pending' ? 'Payment Requests Pending Verification' : 'All Payment Requests'}
          </h2>
        </div>

        {getFilteredRequests().length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p className="text-gray-500">No payment requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredRequests().map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.poNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentTypeBadge type={request.paymentType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{parseFloat(request.amount).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.requestedBy || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                        >
                          View
                        </button>
                        {request.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecline(request)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      {showDialog && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handleCloseDialog}
            ></div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Payment Request Details
                  </h3>
                  <div className="mt-1">
                    <StatusBadge status={selectedRequest.status} />
                  </div>
                </div>
                <button
                  onClick={handleCloseDialog}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                {/* Basic Information */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">PO Number</label>
                      <p className="text-sm font-medium text-gray-900">{selectedRequest.poNumber}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Payment Type</label>
                      <div className="mt-1">
                        <PaymentTypeBadge type={selectedRequest.paymentType} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Amount</label>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{parseFloat(selectedRequest.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Requested By</label>
                      <p className="text-sm text-gray-900">{selectedRequest.requestedBy || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Request Date</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedRequest.requestDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {selectedRequest.poTotal && (
                      <div>
                        <label className="text-xs text-gray-500">PO Total Amount</label>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{parseFloat(selectedRequest.poTotal).toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Item Details */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Item Details</h4>
                  {selectedRequest.items && selectedRequest.items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Received Qty
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit Price
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedRequest.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-4 py-2">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${
                                    item.receivedQuantity === item.quantity
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {item.receivedQuantity || 0}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                ₹{parseFloat(item.unitPrice).toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                ₹{parseFloat(item.total).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No item details available</p>
                  )}
                </div>

                {/* Remarks Section */}
                {actionType && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      {actionType === 'approve' ? 'Approval Remarks' : 'Rejection Remarks'}
                    </h4>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter remarks for ${actionType === 'approve' ? 'approval' : 'rejection'}...`}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                {actionType && (
                  <button
                    onClick={handleSubmitAction}
                    className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                      actionType === 'approve'
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {actionType === 'approve' ? 'Approve Payment' : 'Reject Payment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PoVerification;