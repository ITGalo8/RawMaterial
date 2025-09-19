import React, { useState, useCallback, useEffect } from 'react';
import './AddRawMaterial.css';
import Api from '../../../auth/Api';

const AddRawMaterial = () => {
  const [rawMaterialName, setRawMaterialName] = useState('');
  const [selectedUnitName, setSelectedUnitName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(
          '/admin/showUnit',
        );
        setUnit(response.data.data);
      } catch (error) {
        console.log('Error fetching data:', error);
        alert('Error: Failed to fetch unit');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!rawMaterialName.trim()) {
      alert('Error: Item name cannot be empty or just spaces.');
      return;
    }

    if (!selectedUnitName) {
      alert('Error: Please select a unit.');
      return;
    }

    setLoading(true);
    try {
      const response = await Api.post(
        '/admin/addRawMaterial',
        {
          rawMaterialName: rawMaterialName.trim(),
          unit: selectedUnitName,
        },
      );

      alert('Success: Item added successfully!');
      setRawMaterialName('');
      setSelectedUnitName(null);
    } catch (error) {
      console.log('Error adding item:', error);
      const errorMessage =
        error.response?.data?.message ||
        'An unexpected error occurred. Please try again.';
      alert('Error: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [rawMaterialName, selectedUnitName]);

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Add Raw Material</h2>
        
        <div className="form-group">
          <label className="form-label">New Item Name*</label>
          <input
            type="text"
            className="form-input"
            value={rawMaterialName}
            onChange={(e) => setRawMaterialName(e.target.value)}
            placeholder="Enter new item name"
            autoCapitalize="characters"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Select Unit*</label>
          {fetching ? (
            <div className="form-select-loading">Loading units...</div>
          ) : (
            <select
              className="form-select"
              value={selectedUnitName || ''}
              onChange={(e) => setSelectedUnitName(e.target.value || null)}
            >
              <option value="">Select a unit...</option>
              {unit.map((unit) => (
                <option key={unit.id} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          className={`form-button ${loading || !rawMaterialName.trim() || !selectedUnitName ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={loading || !rawMaterialName.trim() || !selectedUnitName}
        >
          {loading ? (
            <span className="button-spinner"></span>
          ) : (
            'Add Item'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddRawMaterial;