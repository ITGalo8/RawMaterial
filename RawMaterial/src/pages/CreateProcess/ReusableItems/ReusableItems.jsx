import React, { useState, useEffect } from 'react';
import Api from '../../../auth/Api';
import './ReusableItems.css';
import { useLocation } from "react-router-dom";

const ReusableItems = () => {
  const location = useLocation();
  const { serviceProcessId, disassembleSessionId } = location?.state || {};
  const [assembleUsers, setAssembleUsers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [tempSelectedMaterials, setTempSelectedMaterials] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch assemble users from API
  const fetchAssembleUsers = async () => {
    try {
      setLoading(true);
      const response = await Api.get('/line-worker/getAssembleUsers');
      
      if (response.data.success) {
        setAssembleUsers(response.data.data);
      } else {
        setError('Failed to fetch assemble users');
      }
    } catch (err) {
      console.error('Error fetching assemble users:', err);
      setError('Unable to load assemble users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch raw materials from API
  const fetchRawMaterials = async () => {
    try {
      setMaterialsLoading(true);
      const response = await Api.get('/line-worker/rawMaterialForItemRequest');
      
      if (response.data.success) {
        setRawMaterials(response.data.data);
      } else {
        setError('Failed to fetch raw materials');
      }
    } catch (err) {
      console.error('Error fetching raw materials:', err);
      setError('Unable to load raw materials. Please try again.');
    } finally {
      setMaterialsLoading(false);
    }
  };

  // Handle material selection from multi-select
  const handleMaterialSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => option.value).filter(id => id);
    setTempSelectedMaterials(selectedIds);
  };

  // Add selected materials with default quantity
  const addSelectedMaterials = () => {
    if (tempSelectedMaterials.length === 0) {
      alert('Please select at least one material');
      return;
    }

    const newMaterials = tempSelectedMaterials.map(materialId => {
      const material = rawMaterials.find(m => m.id === materialId);
      return {
        id: materialId,

        name: material.name,
        quantity: 1, // Default quantity
        unit: material.unit,
        stock: material.stock,
        outOfStock: material.outOfStock
      };
    });

    // Filter out duplicates and add new materials
    setSelectedMaterials(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const uniqueNewMaterials = newMaterials.filter(material => !existingIds.has(material.id));
      return [...prev, ...uniqueNewMaterials];
    });

    // Clear temporary selection
    setTempSelectedMaterials([]);
  };

  // Remove selected material
  const removeMaterial = (materialId) => {
    setSelectedMaterials(prev => prev.filter(item => item.id !== materialId));
  };

  // Update quantity of existing material
  const updateMaterialQuantity = (materialId, newQuantity) => {
    if (newQuantity === '' || parseInt(newQuantity) === 0) {
      removeMaterial(materialId);
      return;
    }

    if (isNaN(newQuantity) || parseInt(newQuantity) < 0) {
      return;
    }

    const material = rawMaterials.find(m => m.id === materialId);
    if (material && parseInt(newQuantity) > material.stock) {
      alert(`Quantity cannot exceed available stock (${material.stock} ${material.unit})`);
      return;
    }

    setSelectedMaterials(prev =>
      prev.map(item =>
        item.id === materialId
          ? { ...item, quantity: parseInt(newQuantity) }
          : item
      )
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert('Please select an assemble user');
      return;
    }

    if (selectedMaterials.length === 0) {
      alert('Please select at least one raw material');
      return;
    }

    // Validate all quantities
    const invalidMaterials = selectedMaterials.filter(material => 
      !material.quantity || material.quantity <= 0
    );

    if (invalidMaterials.length > 0) {
      alert('Please enter valid quantities for all selected materials');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        serviceProcessId,
        disassembleSessionId,
        assembleEmpId: selectedUser,
        reusableItems: selectedMaterials.map(material => ({
          rawMaterialId: material.id,
          quantity: material.quantity.toString(),
          unit: material.unit
        })),
        remarks: remarks || "Reusable Items Form Filled & Process Is Closed."
      };

      console.log("Playload Data: ", payload)

      const response = await Api.post('/line-worker/disassembleItemsForm', payload);
      
      if (response.data.success) {
        alert(`Assemble user assigned successfully with ${selectedMaterials.length} materials!`);
        setSelectedUser('');
        setSelectedMaterials([]);
        setTempSelectedMaterials([]);
        setRemarks('');
      } else {
        throw new Error(response.data.message || 'Failed to submit form');
      }
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const getAvailableMaterials = () => {
    return rawMaterials.filter(material => 
      !selectedMaterials.some(selected => selected.id === material.id)
    );
  };

  const getTotalSummary = () => {
    const totalItems = selectedMaterials.length;
    const totalQuantities = selectedMaterials.reduce((sum, material) => sum + material.quantity, 0);
    return { totalItems, totalQuantities };
  };

  useEffect(() => {
    fetchAssembleUsers();
    fetchRawMaterials();
  }, []);

  if (loading) {
    return (
      <div className="reusable-items-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading assemble users...</p>
        </div>
      </div>
    );
  }

  const { totalItems, totalQuantities } = getTotalSummary();
  const availableMaterials = getAvailableMaterials();

  return (
    <div className="reusable-items-container">
      <div className="reusable-items-card">
        <div className="card-header">
          <h2>Assign Assemble User</h2>
          <p className="subtitle">Select an assemble user and required raw materials with quantities</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="assemble-user-form">
          {/* Assemble User Selection */}
          <div className="form-group">
            <label htmlFor="assembleUser" className="form-label">
              Assemble User *
            </label>
            <select
              id="assembleUser"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="form-dropdown"
              disabled={submitting}
              required
            >
              <option value="">Select an assemble user</option>
              {assembleUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Raw Materials Multi-select */}
          <div className="form-group">
            <label className="form-label">
             Reusable Raw Materials *
            </label>
            
            <div className="multi-select-container">
              <div className="multi-select-header">
                <span className="selection-count">
                  Select Materials ({tempSelectedMaterials.length} selected)
                </span>
                {tempSelectedMaterials.length > 0 && (
                  <button
                    type="button"
                    onClick={addSelectedMaterials}
                    className="add-materials-btn"
                    disabled={submitting}
                  >
                    Add Selected Materials
                  </button>
                )}
              </div>
              
              <select
                multiple
                size="6"
                value={tempSelectedMaterials}
                onChange={handleMaterialSelection}
                className="multi-select-dropdown"
                disabled={materialsLoading || submitting || availableMaterials.length === 0}
              >
                {availableMaterials.length === 0 ? (
                  <option value="" disabled>All materials have been selected</option>
                ) : (
                  availableMaterials.map((material) => (
                    <option 
                      key={material.id} 
                      value={material.id}
                      disabled={material.outOfStock}
                    >
                      {material.name} - Stock: {material.stock} {material.unit}
                      {material.outOfStock && ' (Out of Stock)'}
                    </option>
                  ))
                )}
              </select>
              
              <div className="multi-select-hint">
                Hold Ctrl/Cmd to select multiple materials • {availableMaterials.length} materials available
              </div>
            </div>

            {materialsLoading && (
              <div className="materials-loading">
                <div className="small-spinner"></div>
                <span>Loading materials...</span>
              </div>
            )}

            {/* Selected Materials with Quantity Inputs */}
            {selectedMaterials.length > 0 && (
              <div className="selected-materials-container">
                <div className="selected-materials-header">
                  <span>Selected Materials ({selectedMaterials.length}):</span>
                </div>
                <div className="materials-quantity-list">
                  {selectedMaterials.map(material => (
                    <div key={material.id} className="material-quantity-item">
                      <div className="material-info">
                        <span className="material-name">{material.name}</span>
                        {/* <span className="material-stock">
                          Available Stock: <strong>{material.stock} {material.unit}</strong>
                        </span> */}
                      </div>
                      <div className="quantity-controls">
                        <div className="quantity-input-group">
                          <label className="quantity-label">Reusable Items Quantity:</label>
                          <input
                            type="number"
                            value={material.quantity}
                            onChange={(e) => updateMaterialQuantity(material.id, e.target.value)}
                            className="quantity-input"
                            min="1"
                            max={material.stock}
                            disabled={submitting || material.outOfStock}
                          />
                          <span className="quantity-unit">{material.unit}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMaterial(material.id)}
                          className="remove-material-btn"
                          disabled={submitting}
                          title="Remove material"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Remarks Field */}
          <div className="form-group">
            <label htmlFor="remarks" className="form-label">
              Remarks
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="remarks-textarea"
              placeholder="Enter any remarks or comments..."
              rows="3"
              disabled={submitting}
            />
          </div>

          {/* Summary Section */}
          {selectedMaterials.length > 0 && (
            <div className="summary-section">
              <div className="summary-item">
                <strong>Total Materials:</strong> {totalItems} item(s)
              </div>
              <div className="summary-item">
                <strong>Total Quantities:</strong> {totalQuantities} units
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={!selectedUser || selectedMaterials.length === 0 || submitting}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner"></span>
                  Submitting...
                </>
              ) : (
                `Submit Request (${selectedMaterials.length} materials)`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReusableItems;