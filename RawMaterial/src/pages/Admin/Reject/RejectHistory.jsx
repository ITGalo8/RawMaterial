import React, { useState, useEffect } from "react";
import Api from "../../../Auth/Api";
import "./RejectHistory.css";

const RejectHistory = () => {
  const [rejectData, setRejectData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRejectData = async () => {
      try {
        const response = await Api.get(`/admin/getRejectedServiceRecords`, {
          withCredentials: true,
        });
        console.log("Reject Data", response?.data?.data);
        setRejectData(response?.data?.data || []);
      } catch (error) {
        console.log(
          "Error fetching Reject Data",
          error?.response?.data?.message
        );
        setError(
          error?.response?.data?.message || "Failed to fetch reject history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRejectData();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredData = rejectData.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.item?.toLowerCase().includes(query)) ||
      (item.serialNumber?.toLowerCase().includes(query)) ||
      (item.repairedRejectedBy?.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return <div className="repair-history-container">Loading reject history...</div>;
  }

  if (error) {
    return <div className="repair-history-container">Error: {error}</div>;
  }

  if (filteredData.length === 0) {
    return (
      <div className="repair-history-container">
        {searchQuery ? (
          <div>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by item, serial, or technician"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-button" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>
            <p>No rejected items found matching your search.</p>
          </div>
        ) : (
          <p>No reject history found</p>
        )}
      </div>
    );
  }

  return (
    <div className="repair-history-container">
      <div className="repair-history-header">
        <h1>Reject History</h1>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by item, serial, or technician"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-button" onClick={() => setSearchQuery('')}>
            ×
          </button>
        )}
      </div>

      {filteredData.map((item, index) => (
        <div key={item._id || index} className="repair-history-card">
          <div className="repair-history-card-header">
            <h3>Reject Record #{index + 1}</h3>
            <span className="repair-history-date">
              Serviced on: {formatDate(item.servicedAt)}
            </span>
          </div>

          <div className="repair-history-details">
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Item Name:</span>
              <span className="repair-history-detail-value">{item?.item || "N/A"}</span>
            </div>
            {item.subItem && (
              <div className="repair-history-detail-row">
                <span className="repair-history-detail-label">Sub Item:</span>
                <span className="repair-history-detail-value">{item.subItem}</span>
              </div>
            )}

             <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Initial RCA:</span>
              <span className="repair-history-detail-value">{item?.initialRCA || "N/A"}</span>
            </div>

            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Quantity:</span>
              <span className="repair-history-detail-value">{item?.quantity || "N/A"}</span>
            </div>
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Serial Number:</span>
              <span className="repair-history-detail-value">
                {item?.serialNumber || "N/A"}
              </span>
            </div>
            {item.faultAnalysis && (
              <div className="repair-history-detail-row">
                <span className="repair-history-detail-label">Fault Analysis:</span>
                <span className="repair-history-detail-value">
                  {item.faultAnalysis}
                </span>
              </div>
            )}
            <div className="repair-history-detail-row">
              <span className="repair-history-detail-label">Rejected By:</span>
              <span className="repair-history-detail-value">
                {item?.repairedRejectedBy || "N/A"}
              </span>
            </div>
            {item.remarks && (
              <div className="repair-history-detail-row">
                <span className="repair-history-detail-label">Remarks:</span>
                <span className="repair-history-detail-value">{item.remarks}</span>
              </div>
            )}
          </div>

          {item.repairedParts && item.repairedParts.length > 0 && (
            <div className="repair-history-parts-section">
              <h4>Repaired Parts Used:</h4>
              <table className="repair-history-parts-table">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {item.repairedParts.map((part, partIndex) => (
                    <tr key={`${item._id}-${partIndex}`}>
                      <td>{part.rawMaterialName}</td>
                      <td>{part.quantity}</td>
                      <td>{part.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RejectHistory;