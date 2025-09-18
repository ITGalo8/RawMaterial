import React, { useState, useCallback } from 'react';
import './AddItem.css';
import Api from '../../Auth/Api';

const AddItem = () => {
  const [name, setName] = useState('');
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [loading, setLoading] = useState(false);

  const itemTypes = [
    {label: 'Motor', value: 'Motor'},
    {label: 'Pump', value: 'Pump'},
    {label: 'Controller', value: 'Controller'},
  ];

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      alert('Error: Item Name cannot be empty or just spaces.');
      return;
    }

    if (!selectedItemType) {
      alert('Error: Please select an item type.');
      return;
    }

    setLoading(true);
    try {
      const response = await Api.post('/admin/addItem', {
        name: name.trim(),
        type: selectedItemType
      });

      alert('Success: Item added successfully!');
      console.log('Item added:', response.data);
      setName('');
      setSelectedItemType(null);
    } catch (error) {
      console.log('Error adding item:', error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      alert('Error: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [name, selectedItemType]);

  return (
    <div className="add-item-container">
      <div className="add-item-section">
        <label className="add-item-label">Item Type*</label>
        <div className="add-item-select-container">
          <select
            value={selectedItemType || ''}
            onChange={(e) => setSelectedItemType(e.target.value || null)}
            className="add-item-select"
          >
            <option value="">Select item type</option>
            {itemTypes.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <label className="add-item-label">Item Name*:</label>
      <input
        type="text"
        className="add-item-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter item name"
        autoCapitalize="characters"
      />
      <button
        className={`add-item-button ${(loading || !name.trim() || !selectedItemType) ? 'disabled' : ''}`}
        onClick={handleSubmit}
        disabled={loading || !name.trim() || !selectedItemType}
      >
        {loading ? (
          <span className="add-item-spinner"></span>
        ) : (
          'Add Item'
        )}
      </button>
    </div>
  );
};

export default AddItem;