import React, { useState, useEffect } from 'react';
import Api from '../../../../auth/Api';

const UserStockData = () => {
  const [lineWorkers, setLineWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [selectedWorkerName, setSelectedWorkerName] = useState('');
  const [stockData, setStockData] = useState({
    balanceSummary: [],
    directItemsIssued: [],
    itemsRequested: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('currentStock');

  const fetchLineWorkers = async () => {
    try {
      setLoading(true);
      const response = await Api.get(`/store-keeper/getLineWorkerList`);
      if (response.data.success) {
        setLineWorkers(response.data.data);
      }
    } catch (err) {
      setError('Error fetching line workers');
      console.error('Error fetching line workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStock = async (empId, workerName) => {
    if (!empId) {
      setStockData({
        balanceSummary: [],
        directItemsIssued: [],
        itemsRequested: []
      });
      setSelectedWorkerName('');
      return;
    }
    
    try {
      setTableLoading(true);
      setSelectedWorkerName(workerName);
      const response = await Api.get(`/store-keeper/getUserItemStock?empId=${empId}`);
      
      if (response.data.success) {
        setStockData(response.data.data || {
          balanceSummary: [],
          directItemsIssued: [],
          itemsRequested: []
        });
        setError('');
      } else {
        setStockData({
          balanceSummary: [],
          directItemsIssued: [],
          itemsRequested: []
        });
        setError('Failed to fetch stock data');
      }
    } catch (err) {
      setError('Error fetching stock data');
      setStockData({
        balanceSummary: [],
        directItemsIssued: [],
        itemsRequested: []
      });
      console.error('Error fetching stock data:', err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleWorkerChange = (e) => {
    const workerId = e.target.value;
    const selected = lineWorkers.find(worker => worker.id === workerId);
    setSelectedWorker(workerId);
    setActiveTab('currentStock'); // Reset to default tab
    fetchUserStock(workerId, selected ? `${selected.name} - ${selected.role.name}` : '');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchLineWorkers();
  }, []);

  const renderCurrentStockTable = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-800 px-6 py-4 sm:px-8 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">
            Current Stock Balance
          </h3>
          <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
            Total items: {stockData.balanceSummary.length}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockData.balanceSummary.map((item, index) => (
              <tr key={item.rawMaterialId || index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.rawMaterialName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {item.quantity || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.unit || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDirectIssuedTable = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-800 px-6 py-4 sm:px-8 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">
            Direct Items Issued
          </h3>
          <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
            Total transactions: {stockData.directItemsIssued.length}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issued Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issued By
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockData.directItemsIssued.map((issue, index) => (
              <tr key={issue.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(issue.issuedDate)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <ul className="list-disc pl-4">
                    {issue.items.map((item, idx) => (
                      <li key={idx}>
                        {item.rawMaterialName}: {item.quantity} {item.unit}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {issue.issuedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {issue.remarks || 'No remarks'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRequestedItemsTable = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-800 px-6 py-4 sm:px-8 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">
            Item Requests History
          </h3>
          <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
            Total requests: {stockData.itemsRequested.length}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approved By
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material Given
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockData.itemsRequested.map((request, index) => (
              <tr key={request.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(request.requestedDate)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <ul className="list-disc pl-4">
                    {request.items.map((item, idx) => (
                      <li key={idx}>
                        {item.rawMaterialName}: {item.quantity} {item.unit}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'APPROVED' 
                      ? 'bg-green-100 text-green-800' 
                      : request.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.approvedBy || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.materialGiven 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {request.materialGiven ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            User Stock Data
          </h1>
          {selectedWorkerName && (
            <div className="mt-4 text-lg text-gray-600">
              Currently viewing: <strong className="text-gray-800">{selectedWorkerName}</strong>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Control Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Line Worker:
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={selectedWorker} 
                  onChange={handleWorkerChange}
                  disabled={loading}
                >
                  <option value="">Select a worker</option>
                  {lineWorkers.map(worker => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} - {worker.role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading States */}
        {(loading || tableLoading) && (
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <span className="text-gray-600 text-lg">
              {loading ? 'Loading workers...' : 'Loading stock data...'}
            </span>
          </div>
        )}

        {/* Tabs and Content */}
        {selectedWorker && !tableLoading && (
          <div className="max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('currentStock')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'currentStock'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Current Stock
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {stockData.balanceSummary.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('directIssued')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'directIssued'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Direct Issued
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {stockData.directItemsIssued.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'requests'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Item Requests
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {stockData.itemsRequested.length}
                    </span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'currentStock' && (
                <>
                  {stockData.balanceSummary.length > 0 ? (
                    renderCurrentStockTable()
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center gap-3 text-yellow-800">
                        <span className="text-xl">⚠️</span>
                        <span className="text-lg font-medium">
                          No current stock available for the selected worker.
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'directIssued' && (
                <>
                  {stockData.directItemsIssued.length > 0 ? (
                    renderDirectIssuedTable()
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center gap-3 text-yellow-800">
                        <span className="text-xl">⚠️</span>
                        <span className="text-lg font-medium">
                          No direct items issued records found.
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'requests' && (
                <>
                  {stockData.itemsRequested.length > 0 ? (
                    renderRequestedItemsTable()
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center gap-3 text-yellow-800">
                        <span className="text-xl">⚠️</span>
                        <span className="text-lg font-medium">
                          No item request history found.
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Initial State */}
        {!selectedWorker && !loading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 text-blue-800">
                <span className="text-xl">ℹ️</span>
                <span className="text-lg font-medium">
                  Please select a line worker to view their stock data.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStockData;