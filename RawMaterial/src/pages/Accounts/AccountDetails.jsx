import React, {useState, useEffect, useMemo} from 'react';

// You'll need to import or define your API client
// For example, if using axios:
import axios from 'axios';

// Create an API instance if you don't have one
const Api = axios.create({
  baseURL: 'http://69.62.73.56:5050', // Base URL from your endpoint
  headers: {
    'Content-Type': 'application/json',
  }
});

// Custom components for responsive design
const CardView = ({ vendor }) => (
  <div style={{ 
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  }}
  >
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: '15px'
    }}>
      <h3 style={{ 
        margin: 0, 
        color: '#2c3e50',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {vendor.name || 'N/A'}
      </h3>
      {vendor.gstNumber && (
        <span style={{
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          GST: {vendor.gstNumber}
        </span>
      )}
    </div>
    
    <div style={{ display: 'grid', gap: '12px' }}>
      {vendor.contactPerson && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#666', minWidth: '100px' }}>Contact Person:</span>
          <span style={{ fontWeight: '500' }}>{vendor.contactPerson}</span>
        </div>
      )}
      
      {vendor.contactNumber && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#666', minWidth: '100px' }}>Contact:</span>
          <a 
            href={`tel:${vendor.contactNumber}`}
            style={{ 
              color: '#1976d2', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            {vendor.contactNumber}
          </a>
        </div>
      )}
      
      {vendor.bankName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#666', minWidth: '100px' }}>Bank:</span>
          <span style={{ fontWeight: '500' }}>{vendor.bankName}</span>
        </div>
      )}
      
      {vendor.accountHolder && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#666', minWidth: '100px' }}>Account Holder:</span>
          <span style={{ fontWeight: '500' }}>{vendor.accountHolder}</span>
        </div>
      )}
      
      {vendor.accountNumber && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#666', minWidth: '100px' }}>Account No:</span>
          <span style={{ 
            fontFamily: 'monospace',
            backgroundColor: '#f5f5f5',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {vendor.accountNumber}
          </span>
        </div>
      )}
      
      {vendor.ifscCode && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#666', minWidth: '100px' }}>IFSC Code:</span>
          <span style={{ 
            fontFamily: 'monospace',
            fontWeight: '500',
            color: '#d32f2f'
          }}>
            {vendor.ifscCode}
          </span>
        </div>
      )}
    </div>
    
    {/* Show N/A message for vendors with no bank details */}
    {!vendor.bankName && !vendor.accountNumber && !vendor.accountHolder && (
      <div style={{ 
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#fff8e1',
        borderRadius: '6px',
        color: '#ff8f00',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        No bank details available
      </div>
    )}
  </div>
);

const AccountDetails = () => {
  const [accountDetails, setAccountDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await Api.get('/accounts-dept/vendors');
        
        if (response.data && response.data.success) {
          setAccountDetails(response.data.data || []);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch(error) {
        console.error("Error fetching account details: ", error);
        setError(error?.response?.data?.message || error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountData();
  }, []);

  // Filter vendors based on search term
  const filteredVendors = useMemo(() => {
    if (!searchTerm.trim()) return accountDetails;
    
    const term = searchTerm.toLowerCase();
    return accountDetails.filter(vendor => 
      (vendor.name && vendor.name.toLowerCase().includes(term)) ||
      (vendor.contactPerson && vendor.contactPerson.toLowerCase().includes(term)) ||
      (vendor.contactNumber && vendor.contactNumber.includes(term)) ||
      (vendor.gstNumber && vendor.gstNumber.toLowerCase().includes(term)) ||
      (vendor.bankName && vendor.bankName.toLowerCase().includes(term)) ||
      (vendor.accountHolder && vendor.accountHolder.toLowerCase().includes(term))
    );
  }, [accountDetails, searchTerm]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Format empty values
  const formatValue = (value) => {
    return value || <span style={{ color: '#999', fontStyle: 'italic' }}>N/A</span>;
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Account Details</h1>
        <p style={{ color: '#7f8c8d' }}>Loading account details...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px 20px' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>Account Details</h1>
        <div style={{ 
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ef9a9a',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0 }}>Error Loading Data</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#c62828',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{ 
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
        }}>
          Account Details
        </h1>
        <p style={{ 
          color: '#7f8c8d',
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)'
        }}>
          Manage and view all vendor account information
        </p>
      </div>

      {/* Search and Controls Section */}
      <div style={{ 
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      }}>
        {/* Search Bar */}
        <div style={{ 
          position: 'relative',
          flex: '1',
          maxWidth: '600px'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search vendors by name, contact, GST, bank..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: '14px 50px 14px 20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            />
            <div style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: '10px'
            }}>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999',
                    fontSize: '20px',
                    padding: '0'
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <span style={{ color: '#999' }}>🔍</span>
            </div>
          </div>
          {searchTerm && (
            <div style={{
              marginTop: '8px',
              fontSize: '14px',
              color: '#666'
            }}>
              Found {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} 
              {filteredVendors.length !== accountDetails.length && 
                ` of ${accountDetails.length} total`}
            </div>
          )}
        </div>

        {/* View Mode Toggle and Stats */}
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: viewMode === 'table' ? '#3498db' : 'white',
                color: viewMode === 'table' ? 'white' : '#333',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              title="Table View"
            >
              📋
            </button>
            <button
              onClick={() => setViewMode('card')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: viewMode === 'card' ? '#3498db' : 'white',
                color: viewMode === 'card' ? 'white' : '#333',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              title="Card View"
            >
              🗂️
            </button>
          </div>
          
          <div style={{
            backgroundColor: '#e8f4fc',
            padding: '10px 15px',
            borderRadius: '8px',
            minWidth: '120px'
          }}>
            {/* <div style={{ fontSize: '12px', color: '#666' }}>Total Vendors</div> */}
            {/* <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
              {accountDetails.length}
            </div> */}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {filteredVendors.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>
            {searchTerm ? 'No vendors found' : 'No vendor data available'}
          </h3>
          {searchTerm ? (
            <p style={{ color: '#adb5bd' }}>
              No vendors match your search for "<strong>{searchTerm}</strong>"
            </p>
          ) : (
            <p style={{ color: '#adb5bd' }}>Add vendors to see their account details here</p>
          )}
        </div>
      ) : (
        <>
          {/* Card View for Mobile */}
          {viewMode === 'card' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {filteredVendors.map((vendor, index) => (
                <CardView key={index} vendor={vendor} />
              ))}
            </div>
          ) : (
            /* Table View */
            <div style={{ 
              overflowX: 'auto',
              marginTop: '20px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#2c3e50',
                    color: 'white'
                  }}>
                    <th style={{ 
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Vendor Name</th>
                    <th style={{ 
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Contact</th>
                    <th style={{ 
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>GST Number</th>
                    <th style={{ 
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Bank Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor, index) => (
                    <tr 
                      key={index} 
                      style={{ 
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                        borderBottom: '1px solid #e0e0e0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e3f2fd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f8f9fa';
                      }}
                    >
                      <td style={{ 
                        padding: '16px',
                        verticalAlign: 'top'
                      }}>
                        <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                          {formatValue(vendor.name)}
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#666',
                          marginTop: '4px'
                        }}>
                          {formatValue(vendor.contactPerson)}
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'top' }}>
                        <div style={{ marginBottom: '8px' }}>
                          {formatValue(vendor.contactNumber)}
                        </div>
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'top' }}>
                        {vendor.gstNumber ? (
                          <span style={{
                            fontFamily: 'monospace',
                            backgroundColor: '#e8f5e9',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: '#2e7d32'
                          }}>
                            {vendor.gstNumber}
                          </span>
                        ) : formatValue(vendor.gstNumber)}
                      </td>
                      <td style={{ padding: '16px', verticalAlign: 'top' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Bank:</strong> {formatValue(vendor.bankName)}
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Account:</strong> {formatValue(vendor.accountHolder)}
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Number:</strong> {formatValue(vendor.accountNumber)}
                        </div>
                        <div>
                          <strong>IFSC:</strong> {formatValue(vendor.ifscCode)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Responsive CSS Media Queries */}
      <style>{`
        @media (max-width: 768px) {
          .stats-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .view-toggle {
            order: -1;
            margin-bottom: 15px;
          }
          
          table {
            font-size: 14px;
          }
          
          th, td {
            padding: 12px 8px !important;
          }
          
          .card-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 480px) {
          .header-section h1 {
            font-size: 1.8rem !important;
          }
          
          .search-bar input {
            font-size: 14px !important;
            padding: 12px 40px 12px 15px !important;
          }
        }
        
        /* Print styles */
        @media print {
          .search-controls,
          .view-toggle {
            display: none !important;
          }
          
          table {
            box-shadow: none !important;
            border: 1px solid #000 !important;
          }
          
          th {
            background-color: #f0f0f0 !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountDetails;