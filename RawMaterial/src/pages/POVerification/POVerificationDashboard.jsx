import React, { useState, useEffect } from 'react';
import axios from 'axios';

const POVerificationDashboard = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCallCenter, setSelectedCallCenter] = useState('all');
  const [callCenters, setCallCenters] = useState([]);
  const [stats, setStats] = useState({
    totalVerification: 0,
    totalApprove: 0,
    totalDecline: 0,
    totalApproveMoney: 0,
  });

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
      const data = response.data.data || [];
      setPaymentRequests(data);
      
      // Extract unique call centers
      const uniqueCenters = [...new Set(data.map(req => req.callCenter || 'Unassigned'))];
      setCallCenters(uniqueCenters);
      
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      setPaymentRequests(mockData);
      const uniqueCenters = [...new Set(mockData.map(req => req.callCenter || 'Unassigned'))];
      setCallCenters(uniqueCenters);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalVerification = data.length;
    const totalApprove = data.filter(req => req.status === 'Approved').length;
    const totalDecline = data.filter(req => req.status === 'Rejected').length;
    const totalApproveMoney = data
      .filter(req => req.status === 'Approved')
      .reduce((sum, req) => sum + parseFloat(req.amount || 0), 0);
    
    setStats({
      totalVerification,
      totalApprove,
      totalDecline,
      totalApproveMoney,
    });
  };

  // Filter payment requests based on search term and call center
  const filteredRequests = paymentRequests.filter(request => {
    const matchesSearch = 
      request.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.vendorName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCallCenter = 
      selectedCallCenter === 'all' || 
      request.callCenter === selectedCallCenter ||
      (!request.callCenter && selectedCallCenter === 'Unassigned');
    
    return matchesSearch && matchesCallCenter;
  });

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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              PO Payment Verification Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track payment request verifications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchPaymentRequests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total PO Verification</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalVerification}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Approve</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalApprove}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Decline</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalDecline}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Approve Money</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalApproveMoney)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by PO, Vendor, or Requester..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Call Center Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Center
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCallCenter}
              onChange={(e) => setSelectedCallCenter(e.target.value)}
            >
              <option value="all">All Call Centers</option>
              {callCenters.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                if (e.target.value === 'all') {
                  setSearchTerm('');
                } else {
                  setSearchTerm(e.target.value);
                }
              }}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-500">Showing</p>
            <p className="text-lg font-semibold text-blue-600">{filteredRequests.length}</p>
            <p className="text-xs text-gray-500">Requests</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-lg font-semibold text-yellow-600">
              {filteredRequests.filter(r => r.status === 'Pending').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-lg font-semibold text-green-600">
              {filteredRequests.filter(r => r.status === 'Approved').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-lg font-semibold text-red-600">
              {filteredRequests.filter(r => r.status === 'Rejected').length}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">
            Payment Verification Requests
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredRequests.length} requests)
            </span>
          </h2>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <span className="text-sm text-gray-500">
              Call Center: <span className="font-medium">{selectedCallCenter === 'all' ? 'All' : selectedCallCenter}</span>
            </span>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">No payment requests found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Center
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
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
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.poNumber}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {request.poTitle || 'No title'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900">
                          {request.callCenter || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.vendorName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{request.vendorCode || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(request.amount)}
                      </div>
                      {request.paymentType && (
                        <div className="text-xs text-gray-500 capitalize">
                          {request.paymentType.replace('_', ' ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.requestedBy || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{request.department || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.requestDate).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.requestDate).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                      {request.verificationDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(request.verificationDate).toLocaleDateString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {/* Handle view */}}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-xs"
                        >
                          View
                        </button>
                        {request.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => {/* Handle approve */}}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {/* Handle decline */}}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs"
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

      {/* Call Center Summary */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Call Center Wise Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {callCenters.slice(0, 4).map((center) => {
            const centerRequests = paymentRequests.filter(req => 
              req.callCenter === center || (!req.callCenter && center === 'Unassigned')
            );
            const approvedAmount = centerRequests
              .filter(req => req.status === 'Approved')
              .reduce((sum, req) => sum + parseFloat(req.amount || 0), 0);
            
            return (
              <div key={center} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{center}</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {centerRequests.length} POs
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pending:</span>
                    <span className="font-medium text-yellow-600">
                      {centerRequests.filter(r => r.status === 'Pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Approved:</span>
                    <span className="font-medium text-green-600">
                      {centerRequests.filter(r => r.status === 'Approved').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rejected:</span>
                    <span className="font-medium text-red-600">
                      {centerRequests.filter(r => r.status === 'Rejected').length}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Approved Amount:</span>
                      <span className="font-medium text-purple-600">
                        {formatCurrency(approvedAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default POVerificationDashboard;