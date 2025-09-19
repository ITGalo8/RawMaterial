import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Api from '../../Auth/Api'

const UpdateBom = () => {
  const navigate = useNavigate();
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [items, setItems] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemTypes = [
    { label: 'Motor', value: 'Motor' },
    { label: 'Pump', value: 'Pump' },
    { label: 'Controller', value: 'Controller' },
  ];

  useEffect(() => {
    if (selectedItemType) {
      fetchItems(selectedItemType.value);
    } else {
      setItems([]);
      setRawMaterials([]);
      setSelectedItem(null);
      setSelectedItemName('');
    }
  }, [selectedItemType]);

  const fetchItems = async (itemName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get(
        `/admin/getItemsByName?searchQuery=${itemName}`
      );
      setItems(
        response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
          fullItem: item,
        }))
      );
    } catch (err) {
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRawMaterials = async (itemId) => {
    if (!itemId) {
      setRawMaterials([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await Api.get(
        `/admin/getRawMaterialsByItemId?itemId=${itemId}`
      );

      const processedMaterials = (response.data.data || []).map((item) => ({
        id: item.rawMaterial?.id || 'no-id',
        name: item.rawMaterial?.name || 'Unknown Material',
        quantity: item.quantity || 0,
        unit: item.rawMaterial?.unit || 'Pcs/Nos',
      }));

      setRawMaterials(processedMaterials);
    } catch (err) {
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialClick = (material) => {
    if (!selectedItem) {
      alert('No parent item selected');
      return;
    }

    const confirmUpdate = window.confirm(
      `Update quantity for ${material.name} in ${selectedItemName}?`
    );

    if (confirmUpdate) {
      navigate('/update-bom', {
        state: {
          itemId: selectedItem.value,
          itemName: selectedItemName,
          rawMaterialId: material.id,
          rawMaterialName: material.name,
          currentQuantity: material.quantity,
          unit: material.unit,
        },
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>BOM (Bill of Materials)</h2>

      <div style={styles.dropdown}>
        <Select
          value={selectedItemType}
          onChange={setSelectedItemType}
          options={itemTypes}
          placeholder="Select an item type..."
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {items.length > 0 && (
        <div style={styles.dropdown}>
          <Select
            value={selectedItem}
            onChange={(selected) => {
              setSelectedItem(selected);
              setSelectedItemName(selected.label);
              fetchRawMaterials(selected.value);
            }}
            options={items}
            placeholder="Select a specific item..."
          />
        </div>
      )}

      {rawMaterials.length > 0 && (
        <div style={styles.tableContainer}>
          <h3 style={styles.subHeading}>Raw Materials for {selectedItemName}</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Material Name</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterials.map((material) => (
                <tr
                  key={material.id}
                  onClick={() => handleMaterialClick(material)}
                  style={styles.row}
                >
                  <td>{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  subHeading: {
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  dropdown: {
    marginBottom: '1rem',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
  },
  row: {
    cursor: 'pointer',
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
  },
};

export default UpdateBom;
