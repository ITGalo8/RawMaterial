import React, { useState, useEffect } from 'react';
import Api from '../../auth/Api';
import './CSS/ShowPurchaseOrder.css';

const ShowPurchaseOrder = () => {
  const [companies, setCompanies] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');

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
      return;
    }
    
    setOrdersLoading(true);
    try {
      const response = await Api.get(`/purchase/purchase-orders/company/${companyId}`);
      setPurchaseOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      alert('Error loading purchase orders');
      setPurchaseOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Handle company selection change
  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    fetchPurchaseOrders(companyId);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="companies-page">
        
        {/* Centered Header Section */}
        <div className="centered-header">
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-subtitle">Select a company to view its purchase orders</p>
        </div>

        {/* Centered Dropdown Section */}
        <div className="centered-dropdown-section">
          <div className="dropdown-card">
            <div className="dropdown-container">
              <label className="dropdown-label">
                Choose a company:
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="company-dropdown"
              >
                <option value="">-- Select a Company --</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>      
        </div>

        {selectedCompany && (
          <div className="centered-orders-section">
            <div className="orders-card">
              <div className="orders-header">
                <h3 className="orders-title">
                  Purchase Orders for {companies.find(c => c.id === selectedCompany)?.companyName}
                </h3>
                <div className="orders-count">
                  {ordersLoading ? (
                    <span className="loading-text">Loading...</span>
                  ) : (
                    <span className="count-badge">
                      {purchaseOrders.length} order{purchaseOrders.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {ordersLoading ? (
                <div className="loading-orders">
                  <div className="small-spinner"></div>
                  <p>Loading purchase orders...</p>
                </div>
              ) : purchaseOrders.length === 0 ? (
                <div className="empty-orders">
                  <div className="empty-icon">📭</div>
                  <h4>No Purchase Orders Found</h4>
                  <p>This company doesn't have any purchase orders yet.</p>
                </div>
              ) : (
                <div className="orders-list">
                  <div className="orders-table-container">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>PO Number</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseOrders.map(order => (
                          <tr key={order.id} className="order-row">
                            <td className="po-number">
                              <strong>{order.poNumber}</strong>
                            </td>
                            <td className="order-actions">
                              <div className="action-buttons">
                                <button 
                                  className="btn-action view"
                                  title="View Details"
                                  onClick={() => console.log('View order:', order.id)}
                                >
                                  👁️ View
                                </button>
                                <button 
                                  className="btn-action edit"
                                  title="Edit"
                                  onClick={() => console.log('Edit order:', order.id)}
                                >
                                  ✏️ Edit
                                </button>
                                <button 
                                  className="btn-action print"
                                  title="Print"
                                  onClick={() => console.log('Print order:', order.id)}
                                >
                                  🖨️ Print
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      
      </div>
    </div>
  );
};

export default ShowPurchaseOrder;