import React, { useState, useEffect } from 'react';
import Api from '../../../../auth/Api'
import './StockUpdateHistory.css';

const StockUpdateHistory = () => {
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockHistory();
  }, []);

  const fetchStockHistory = async () => {
    try {
      const response = await Api.get('/store-keeper/getStockMovementHistory');
      console.log('API Response:', response);
      
      if (response.data && response.data.success) {
        setStockHistory(response.data.data || []);
      } else {
        setError(response.data?.message);
      }
    } catch (err) {
      setError('Failed to fetch stock history');
      console.log('Error fetching stock history:', err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `bill-photo-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading image:', err);
      alert('Failed to download image');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementTypeClass = (type) => {
    return type === 'IN' ? 'movement-in' : 'movement-out';
  };

  if (loading) {
    return (
      <div className="stock-history-container">
        <div className="loading">Loading stock history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-history-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="stock-history-container">
      <div className="stock-history-header">
        <h1>Stock Update History</h1>
        <p>Track all stock movements and updates</p>
      </div>

      <div className="stock-history-list">
        {!stockHistory || stockHistory.length === 0 ? (
          <div className="no-data">No stock history available</div>
        ) : (
          stockHistory.map((historyItem) => (
            <div key={historyItem.id} className="history-card">
              <div className="card-left">
                
                <div className="stock-movements">
                  <h4>Stock Movements</h4>
                  {historyItem.stockMovement && historyItem.stockMovement.map((movement, index) => (
                    <div key={index} className="movement-item">
                      <div className="movement-details">
                        <span className="material-name">
                          {movement.rawMaterial?.name || 'Unknown Material'}
                        </span>
                        <span className="movement-quantity">
                          <span className={`movement-type ${getMovementTypeClass(movement.type)}`}>
                            {movement.type}
                          </span>
                          {movement.quantity} {movement.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Bill photos */}
              <div className="card-right">
                <div className="bill-photos-section">
                  <h4>Bill Photos</h4>
                  <div className="bill-photos-grid">
                    {historyItem.billPhotos && historyItem.billPhotos.map((photoUrl, index) => (
                      <div key={index} className="bill-photo-item">
                        <img 
                          src={photoUrl} 
                          alt={`Bill ${index + 1}`}
                          className="bill-photo"
                          onError={(e) => {
                            e.target.src = '/placeholder-bill.jpg';
                          }}
                        />
                        <button
                          className="download-btn"
                          onClick={() => downloadImage(photoUrl, `bill-${historyItem.id}-${index + 1}.jpg`)}
                          title="Download Bill Photo"
                        >
                          📥 Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockUpdateHistory;