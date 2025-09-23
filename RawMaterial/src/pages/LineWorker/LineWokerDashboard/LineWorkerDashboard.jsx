import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './LineWorkerDashboard.css';
import Api from '../../../auth/Api';

const LineWorkerDashboard = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [storePersons, setStorePersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedStorePerson, setSelectedStorePerson] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [PRE] = useState("PRE");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setSubmitMessage('');

      const [materialsResponse, storePersonsResponse] = await Promise.all([
        Api.get('/line-worker/rawMaterialForItemRequest'),
        Api.get('/line-worker/showStorePersons')
      ]);

      setRawMaterials(materialsResponse?.data?.data || []);
      setStorePersons(storePersonsResponse?.data?.data || []);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialSelect = (selectedOptions) => {
    const selected = selectedOptions || [];
    const newSelectedMaterials = selected.map(opt => 
      rawMaterials.find(m => m.id === opt.value)
    );
    setSelectedMaterials(newSelectedMaterials);

    const newQuantities = { ...quantities };
    selected.forEach(opt => {
      if (!newQuantities[opt.value]) {
        newQuantities[opt.value] = 1;
      }
    });
    
    // Remove quantities for deselected materials
    Object.keys(newQuantities).forEach(key => {
      if (!selected.find(opt => opt.value === key)) {
        delete newQuantities[key];
      }
    });
    
    setQuantities(newQuantities);
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
    const material = rawMaterials.find(m => m.id === materialId);
    
    if (numValue >= 0 && numValue <= material.stock) {
      setQuantities(prev => ({
        ...prev,
        [materialId]: numValue
      }));
    } else if (numValue > material.stock) {
      setQuantities(prev => ({
        ...prev,
        [materialId]: material.stock
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

  const handleSubmitRequest = async () => {
  // Validation (keep your existing validation code)
  if (!selectedStorePerson) {
    setSubmitMessage('Please select a store person');
    return;
  }

  if (selectedMaterials.length === 0) {
    setSubmitMessage('Please select at least one material');
    return;
  }

  const materialsWithInvalidQuantities = selectedMaterials.filter(material => {
    const quantity = quantities[material.id] || 0;
    return quantity <= 0;
  });

  if (materialsWithInvalidQuantities.length > 0) {
    setSubmitMessage('Please enter valid quantities for all materials (minimum 1)');
    return;
  }

  try {
    setSubmitting(true);
    setSubmitMessage('');

    // Prepare request data in the exact required format
    const requestData = {
      type: PRE, // Move type to top level
      rawMaterialRequested: selectedMaterials.map(material => ({
        rawMaterialId: material.id,
        quantity: quantities[material.id].toString(), // Ensure it's a string
        unit: material.unit
      })),
      requestedTo: selectedStorePerson.id
    };

    console.log('Submitting request:', JSON.stringify(requestData, null, 2));

    // Send request to API
    const response = await Api.post('/line-worker/createItemRequest', requestData);

    // Handle success
    if (response.data.success) {
      setSubmitMessage('Request submitted successfully!');
      
      console.log('Request successful:', response.data);
      // Reset form
      setSelectedMaterials([]);
      setSelectedStorePerson(null);
      setQuantities({});
      
      // Refresh data to get updated stock levels
      setTimeout(() => {
        fetchData();
      }, 1000);
    } else {
      setSubmitMessage('Failed to submit request: ' + (response.data.message || 'Unknown error'));
    }

  } catch (err) {
    console.error('Error submitting request:', err);
    setSubmitMessage('Error submitting request: ' + (err.response?.data?.message || err.message));
  } finally {
    setSubmitting(false);
  }
};

  const isSubmitDisabled = submitting || !selectedStorePerson || selectedMaterials.length === 0;

  if (loading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="line-worker-dashboard">
      <div className="dashboard-header">
        <h1>Line Worker Dashboard</h1>
        <p>Request raw materials from store personnel</p>
      </div>

      <div className="dashboard-content">
        
        {/* Store Person Selection */}
        <div className="form-card">
          <div className="card-header">
            <h2 className="card-title">Select Store Person</h2>
            <span className="required">*</span>
          </div>
          <div className="form-group">
            <label className="form-label">Choose a store person:</label>
            <select
              onChange={(e) => handleStorePersonSelect(e.target.value)}
              value={selectedStorePerson?.id || ''}
              className="form-select"
            >
              <option value="">Select a store person...</option>
              {storePersons.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name} ({person.role?.name || 'No role'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Raw Materials Selection */}
        <div className="form-card">
          <div className="card-header">
            <h2 className="card-title">Select Raw Materials</h2>
            <span className="required">*</span>
          </div>
          <div className="form-group">
            <label className="form-label">Choose raw materials (select multiple):</label>
            <Select
              isMulti
              options={rawMaterials.map(mat => ({
                value: mat.id,
                label: `${mat.name} (${mat.stock} ${mat.unit})`,
                isDisabled: mat.stock <= 0
              }))}
              onChange={handleMaterialSelect}
              value={selectedMaterials.map(m => ({
                value: m.id,
                label: `${m.name} (${m.stock} ${m.unit})`
              }))}
              className="multi-select"
              classNamePrefix="react-select"
              placeholder="Search and select materials..."
              noOptionsMessage={() => "No materials found"}
            />
          </div>
        </div>

        {/* Selected Materials List */}
        {selectedMaterials.length > 0 && (
          <div className="form-card selected-materials-section">
            <div className="card-header">
              <h2 className="card-title">
                Selected Materials 
                <span className="material-count">({selectedMaterials.length})</span>
              </h2>
            </div>
            
            <div className="materials-list">
              {selectedMaterials.map((material) => (
                <div key={material.id} className="material-item">
                  <div className="material-info">
                    <span className="material-name">{material.name}</span>
                    <div className="material-details">
                      <span className="available-stock">
                        Available: {material.stock} {material.unit}
                      </span>
                      {material.stock <= 10 && (
                        <span className="low-stock-warning">Low stock!</span>
                      )}
                    </div>
                  </div>

                  <div className="quantity-controls">
                    <label className="quantity-label">Quantity:</label>
                    <div className="quantity-input-group">
                      <input
                        type="number"
                        min="1"
                        max={material.stock}
                        value={quantities[material.id] || ''}
                        onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                        className="quantity-input"
                        placeholder="0"
                      />
                      <span className="quantity-unit">{material.unit}</span>
                    </div>
                    <button
                      className="remove-material-btn"
                      onClick={() => removeSelectedMaterial(material.id)}
                      title="Remove material"
                      aria-label="Remove material"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="form-card submit-section">
          <div className="card-header">
            <h2 className="card-title">Submit Request</h2>
          </div>
          
          <div className="submit-content">
            <button 
              className={`submit-btn ${isSubmitDisabled ? 'disabled' : ''}`}
              onClick={handleSubmitRequest}
              disabled={isSubmitDisabled}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
            
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineWorkerDashboard;