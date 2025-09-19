import React, { useState, useEffect } from 'react';
import './LineWorkerDashboard.css';
import Api from '../../../auth/Api'

const LineWorkerDashboard = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [storePersons, setStorePersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedStorePerson, setSelectedStorePerson] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    outOfStock: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch raw materials
      const materialsResponse = await Api.get('http://69.62.73.56:5050/line-worker/rawMaterialForItemRequest');
      
        setRawMaterials(materialsResponse.data);
        calculateStats(materialsResponse.data);
      

      // Fetch store persons
      const storePersonsResponse = await Api.get('http://69.62.73.56:5050/line-worker/showStorePersons');
      
      if (!storePersonsResponse.ok) {
        throw new Error(`HTTP error! status: ${storePersonsResponse.status}`);
      }
      
      const storePersonsData = await storePersonsResponse.json();
      
      if (storePersonsData.success) {
        setStorePersons(storePersonsData.data);
      } else {
        throw new Error(storePersonsData.message || 'Failed to fetch store persons data');
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (materials) => {
    const total = materials.length;
    const inStock = materials.filter(material => !material.outOfStock).length;
    const outOfStock = materials.filter(material => material.outOfStock).length;
    
    setStats({ total, inStock, outOfStock });
  };

  const handleMaterialSelect = (materialId) => {
    if (!materialId) {
      setSelectedMaterial(null);
      return;
    }
    
    const material = rawMaterials.find(mat => mat.id === materialId);
    setSelectedMaterial(material);
  };

  const handleStorePersonSelect = (personId) => {
    if (!personId) {
      setSelectedStorePerson(null);
      return;
    }
    
    const person = storePersons.find(p => p.id === personId);
    setSelectedStorePerson(person);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">
          Error: {error}
          <button className="retry-button" onClick={fetchData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Line Worker Dashboard</h1>
        <div className="last-updated">
          Last updated: <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-label">Total Materials</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Stock</div>
          <div className="stat-value in-stock">{stats.inStock}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value out-of-stock">{stats.outOfStock}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <div className="card-title">Select Store Person</div>
          <div className="dropdown-container">
            <label htmlFor="storePersonSelect">Choose a store person:</label>
            <select
              id="storePersonSelect"
              onChange={(e) => handleStorePersonSelect(e.target.value)}
              value={selectedStorePerson?.id || ''}
            >
              <option value="">Select a store person...</option>
              {storePersons.map((person) => (
                <option 
                  key={person.id} 
                  value={person.id}
                >
                  {person.name} ({person.role.name})
                </option>
              ))}
            </select>
          </div>

          {selectedStorePerson && (
            <div className="material-details">
              <div className="card-title">Store Person Details</div>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span>{selectedStorePerson.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span>{selectedStorePerson.role.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span>{selectedStorePerson.id}</span>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Select Raw Material</div>
          <div className="dropdown-container">
            <label htmlFor="rawMaterialSelect">Choose a raw material:</label>
            <select
              id="rawMaterialSelect"
              onChange={(e) => handleMaterialSelect(e.target.value)}
              value={selectedMaterial?.id || ''}
            >
              <option value="">Select a material...</option>
              {rawMaterials.map((material) => (
                <option 
                  key={material.id} 
                  value={material.id}
                  className={material.outOfStock ? 'out-of-stock-option' : 'in-stock-option'}
                >
                  {material.name} {material.outOfStock ? '(Out of Stock)' : `(${material.stock} ${material.unit} available)`}
                </option>
              ))}
            </select>
          </div>

          {selectedMaterial && (
            <div className="material-details">
              <div className="card-title">Material Details</div>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span>{selectedMaterial.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stock:</span>
                <span>{selectedMaterial.stock}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Unit:</span>
                <span>{selectedMaterial.unit}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status ${selectedMaterial.outOfStock ? 'status-out-of-stock' : 'status-in-stock'}`}>
                  {selectedMaterial.outOfStock ? 'Out of Stock' : 'In Stock'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineWorkerDashboard;