import React, { useState, useEffect } from 'react';

const PrePoRequestHistory = () => {
  const [prepoHistory, setPrepoHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrePoHistory = async () => {
      try {
        const response = await fetch('http://69.62.73.56:5000/pre-po/pre-po-request');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setPrepoHistory(data.data);
        } else {
          setError('API returned success: false');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrePoHistory();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading Pre-PO requests...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pre-PO Request History</h2>
      {prepoHistory.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor ID</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {prepoHistory.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.vendorId}</td>
                <td>{request.status}</td>
                <td>{new Date(request.createdAt).toLocaleString()}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {request.prePoItems.map((item) => (
                      <li key={item.id}>
                        {item.itemName} – Qty: {item.quantity} {item.unit} @ {item.rate} (Source: {item.itemSource})
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PrePoRequestHistory;