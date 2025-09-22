import React, { useState, useEffect } from 'react';
import './LineWorkerDashboard.css';
import Api from '../../../auth/Api'

const LineWorkerDashboard = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [storePersons, setStorePersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedStorePerson, setSelectedStorePerson] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const materialsResponse = await Api.get('http://69.62.73.56:5050/line-worker/rawMaterialForItemRequest');
      const storePersonsResponse = await Api.get('http://69.62.73.56:5050/line-worker/showStorePersons');

      setRawMaterials(materialsResponse?.data?.data || []);
      setStorePersons(storePersonsResponse?.data?.data || []);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialSelect = (materialId) => {
    if (!materialId) return;
    
    const material = rawMaterials.find(mat => mat.id === materialId);
    
    if (material && !selectedMaterials.find(m => m.id === materialId)) {
      setSelectedMaterials(prev => [...prev, material]);
      setQuantities(prev => ({
        ...prev,
        [materialId]: 1
      }));
    }
  };

  const removeSelectedMaterial = (materialId) => {
    setSelectedMaterials(prev => prev.filter(m => m.id !== materialId));
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[materialId];
      return newQuantities;
    });
  };

  const handleQuantityChange = (materialId, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0) {
      setQuantities(prev => ({
        ...prev,
        [materialId]: numValue
      }));
    }
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
      <div className="line-worker-dashboard">
        <div className="loading">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="line-worker-dashboard">
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
    <div className="line-worker-dashboard">
      <div className="dashboard-header">
        <h1>Line Worker Dashboard</h1>
      </div>

      <div className="dashboard-content">
        <div className="top-section">
          {/* Store Person Card */}
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
                  <option key={person.id} value={person.id}>
                    {person.name} ({person.role?.name || 'No role'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Materials Selection Card */}
          <div className="card">
            <div className="card-title">Select Raw Materials</div>
            <div className="dropdown-container">
              <label htmlFor="rawMaterialSelect">Choose raw materials:</label>
              <select
                id="rawMaterialSelect"
                onChange={(e) => handleMaterialSelect(e.target.value)}
                value=""
              >
                <option value="">Select materials...</option>
                {rawMaterials.map((material) => (
                  <option 
                    key={material.id} 
                    value={material.id}
                    disabled={selectedMaterials.find(m => m.id === material.id) || material.outOfStock}
                  >
                    {material.name} {material.outOfStock ? '(Out of Stock)' : `(${material.stock} ${material.unit} available)`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Materials Section */}
        <div className="card">
          <div className="card-title">Selected Materials ({selectedMaterials.length})</div>
          
          {selectedMaterials.length > 0 ? (
            <div className="materials-list">
              {selectedMaterials.map((material) => (
                <div key={material.id} className="material-item">
                  <div className="material-info">
                    <span className="material-name">{material.name}</span>
                    <div className="available-stock">
                      Available: {material.stock} {material.unit}
                    </div>
                  </div>
                  
                  <div className="quantity-controls">
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <label htmlFor={`quantity-${material.id}`}>Qty:</label>
                      <input
                        id={`quantity-${material.id}`}
                        type="number"
                        min="0"
                        max={material.stock}
                        value={quantities[material.id] || 0}
                        onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                        className="quantity-input"
                      />
                      <span className="quantity-unit">{material.unit}</span>
                    </div>
                    
                    <button 
                      className="remove-material-btn"
                      onClick={() => removeSelectedMaterial(material.id)}
                      title="Remove material"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-materials">
              No materials selected yet. Choose from the dropdown above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineWorkerDashboard;