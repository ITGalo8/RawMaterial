import React, { useState, useEffect } from 'react';
import Api from '../../../../auth/Api';

const UserStockData = () => {
  const [lineWorkers, setLineWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [selectedWorkerName, setSelectedWorkerName] = useState('');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tableLoading, setTableLoading] = useState(false);

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
      setStockData([]);
      setSelectedWorkerName('');
      return;
    }
    
    try {
      setTableLoading(true);
      setSelectedWorkerName(workerName);
      const response = await Api.get(`/store-keeper/getUserItemStock?empId=${empId}`);
      
      if (response.data.success) {
        setStockData(response.data.data || []);
        setError('');
      } else {
        setStockData([]);
        setError('Failed to fetch stock data');
      }
    } catch (err) {
      setError('Error fetching stock data');
      setStockData([]);
      console.error('Error fetching stock data:', err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleWorkerChange = (e) => {
    const workerId = e.target.value;
    const selected = lineWorkers.find(worker => worker.id === workerId);
    setSelectedWorker(workerId);
    fetchUserStock(workerId, selected ? `${selected.name} - ${selected.role.name}` : '');
  };

  useEffect(() => {
    fetchLineWorkers();
  }, []);

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

        {/* Stock Table */}
        {selectedWorker && stockData.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-800 px-6 py-4 sm:px-8 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-semibold text-white">
                    Stock Items for {selectedWorkerName}
                  </h3>
                  <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Total items: {stockData.length}
                  </span>
                </div>
              </div>

              {/* Table */}
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
                    {stockData.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item?.rawMaterial?.name || 'N/A'}
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
          </div>
        )}

        {/* Empty State */}
        {selectedWorker && !tableLoading && stockData.length === 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 text-yellow-800">
                <span className="text-xl">⚠️</span>
                <span className="text-lg font-medium">
                  No stock data available for the selected worker.
                </span>
              </div>
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