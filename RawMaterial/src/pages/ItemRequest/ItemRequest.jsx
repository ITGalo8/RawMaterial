import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './ItemRequest.css';
import Api from '../../auth/Api'

const ItemRequest = () => {
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

  // Custom styles for react-select to show colors based on stock status
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.isDisabled ? '#d32f2f' : '#388e3c',
      backgroundColor: state.isFocused ? '#f5f5f5' : 'white',
      cursor: state.data.isDisabled ? 'not-allowed' : 'pointer',
      opacity: state.data.isDisabled ? 0.7 : 1,
    }),
    multiValue: (provided, state) => {
      const material = rawMaterials.find(m => m.id === state.data.value);
      return {
        ...provided,
        backgroundColor: material?.outOfStock ? '#ffebee' : '#e8f5e8',
        color: material?.outOfStock ? '#d32f2f' : '#388e3c',
      };
    },
    multiValueLabel: (provided, state) => {
      const material = rawMaterials.find(m => m.id === state.data.value);
      return {
        ...provided,
        color: material?.outOfStock ? '#d32f2f' : '#388e3c',
      };
    },
    control: (provided) => ({
      ...provided,
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      minHeight: '52px',
      fontSize: '16px',
      backgroundColor: 'white',
      color: '#000',
      '&:hover': {
        borderColor: '#007bff',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#000',
    }),
    input: (provided) => ({
      ...provided,
      color: '#000',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#666',
    }),
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

      const requestData = {
        type: PRE,
        rawMaterialRequested: selectedMaterials.map(material => ({
          rawMaterialId: material.id,
          quantity: quantities[material.id].toString(),
          unit: material.unit
        })),
        requestedTo: selectedStorePerson.id
      };

      const response = await Api.post('/line-worker/createItemRequest', requestData);

      if (response.data.success) {
        setSubmitMessage('Request submitted successfully!');
        
        // Reset form
        setSelectedMaterials([]);
        setSelectedStorePerson(null);
        setQuantities({});
        
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
    <div className="item-request-container">
      <div className="request-header">
        <h1 className="request-title">Item Request</h1>
        <p className="request-subtitle">Request raw materials</p>
      </div>

      <div className="request-content">
        
        {/* Two Column Layout for Store Person and Materials Selection */}
        <div className="form-row">
          {/* Store Person Selection */}
          <div className="form-section store-person-section">
            <div className="section-header">
              <h2 className="section-title">Select Store Person</h2>
              <span className="required-asterisk">*</span>
            </div>
            <div className="form-field">
              <label className="field-label">Choose a store person:</label>
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
          <div className="form-section materials-section">
            <div className="section-header">
              <h2 className="section-title">Select Raw Materials</h2>
              <span className="required-asterisk">*</span>
            </div>
            <div className="form-field">
              <label className="field-label">Choose raw materials (select multiple):</label>
              <Select
                isMulti
                options={rawMaterials.map(mat => ({
                  value: mat.id,
                  label: `${mat.name} (${mat.stock} ${mat.unit})${mat.outOfStock ? ' - OUT OF STOCK' : ''}`,
                  isDisabled: mat.outOfStock
                }))}
                onChange={handleMaterialSelect}
                value={selectedMaterials.map(m => ({
                  value: m.id,
                  label: `${m.name} (${m.stock} ${m.unit})${m.outOfStock ? ' - OUT OF STOCK' : ''}`
                }))}
                className="multi-select"
                classNamePrefix="react-select"
                placeholder="Search and select materials..."
                noOptionsMessage={() => "No materials found"}
                styles={customStyles}
              />
              <div className="legend-container">
                <div className="legend-item">
                  <span className="legend-dot in-stock-dot"></span>
                  <span className="legend-text">In Stock</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot out-of-stock-dot"></span>
                  <span className="legend-text">Out of Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Materials List */}
        {selectedMaterials.length > 0 && (
          <div className="form-section selected-materials">
            <div className="section-header">
              <h2 className="section-title">
                Selected Materials 
                <span className="materials-count">({selectedMaterials.length})</span>
              </h2>
            </div>
            
            <div className="materials-grid">
              {selectedMaterials.map((material) => (
                <div key={material.id} className={`material-card ${material.outOfStock ? 'out-of-stock' : ''}`}>
                  <div className="material-main-info">
                    <div className="material-header">
                      <h3 className="material-name">{material.name}</h3>
                      <div className="material-status">
                        {material.outOfStock ? (
                          <span className="status-badge out-of-stock-badge">OUT OF STOCK</span>
                        ) : material.stock <= 10 ? (
                          <span className="status-badge low-stock-badge">LOW STOCK</span>
                        ) : (
                          <span className="status-badge in-stock-badge">IN STOCK</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="stock-info">
                      <span className="stock-label">Available:</span>
                      <span className="stock-quantity">{material.stock} {material.unit}</span>
                    </div>
                  </div>

                  <div className="material-controls">
                    <div className="quantity-section">
                      <label className="quantity-label">Quantity:</label>
                      <div className="quantity-input-container">
                        <input
                          type="number"
                          min="1"
                          max={material.stock}
                          value={quantities[material.id] || ''}
                          onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                          className="quantity-input"
                          placeholder="0"
                          disabled={material.outOfStock}
                        />
                        <span className="quantity-unit">{material.unit}</span>
                      </div>
                    </div>
                    
                    <button
                      className="remove-button"
                      onClick={() => removeSelectedMaterial(material.id)}
                      title="Remove material"
                      aria-label="Remove material"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="submit-section">
          <div className="submit-content">
            <button 
              className={`submit-button ${isSubmitDisabled ? 'button-disabled' : 'button-primary'}`}
              onClick={handleSubmitRequest}
              disabled={isSubmitDisabled}
            >
              {submitting ? (
                <>
                  <div className="button-spinner"></div>
                  Submitting Request...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
            
            {submitMessage && (
              <div className={`message-alert ${submitMessage.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {submitMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRequest;