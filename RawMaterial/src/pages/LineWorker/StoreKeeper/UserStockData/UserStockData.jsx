import React, { useState, useEffect } from 'react';
import Api from '../../../../auth/Api';
import './UserStockData.css';

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
    <div className="user-stock-container">
      <div className="user-stock-header-section">
        <h1 className="user-stock-header">User Stock Data</h1>
        {selectedWorkerName && (
          <div className="selected-worker-info">
            Currently viewing: <strong>{selectedWorkerName}</strong>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="control-section">
        <div className="dropdown-section">
          <label className="dropdown-label">Select Line Worker:</label>
          <select 
            className="worker-select"
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

        {selectedWorker && (
          <button 
            className="refresh-btn"
            onClick={() => fetchUserStock(selectedWorker, selectedWorkerName)}
            disabled={tableLoading}
          >
            🔄 Refresh
          </button>
        )}
      </div>

      {(loading || tableLoading) && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">
            {loading ? 'Loading workers...' : 'Loading stock data...'}
          </span>
        </div>
      )}

      {selectedWorker && stockData.length > 0 && (
        <div className="stock-table-container">
          <div className="table-header">
            <h3>Stock Items for {selectedWorkerName}</h3>
            <span className="item-count">Total items: {stockData.length}</span>
          </div>
          <div className="table-wrapper">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  
                </tr>
              </thead>
              <tbody>
                {stockData.map((item,rawMaterial, index) => (
                  <tr key={item.id || index}>
                    <td className="item-name">{item?.rawMaterial?.name || 'N/A'}</td>
                    <td className="item-quantity">{item.quantity || 0}</td>
                    <td className="item-unit">{item.unit || 'N/A'}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedWorker && !tableLoading && stockData.length === 0 && (
        <div className="status-message warning-message">
          <span className="status-icon">⚠️</span>
          No stock data available for the selected worker.
        </div>
      )}

      {!selectedWorker && !loading && (
        <div className="status-message info-message">
          <span className="status-icon">ℹ️</span>
          Please select a line worker to view their stock data.
        </div>
      )}
    </div>
  );
};

export default UserStockData;