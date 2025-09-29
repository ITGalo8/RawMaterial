// import React, { useState, useEffect } from 'react';
// import Api from '../../../../auth/Api'
// import './StockUpdate.css';

// const StockUpdate = () => {
//   const [rawMaterials, setRawMaterials] = useState([]);
//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [billPhoto, setBillPhoto] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch raw materials from API
//   useEffect(() => {
//     const fetchRawMaterials = async () => {
//       try {
//         setLoading(true);
//         const response = await Api.get('/store-keeper/getRawMaterialList');

//         if (response.data.success) {
//           setRawMaterials(response.data.data);
//         } else {
//           setError('Failed to fetch data');
//         }
//       } catch (err) {
//         setError('Error fetching raw materials: ' + err.message);
//         console.error('Error fetching raw materials:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRawMaterials();
//   }, []);

//   // Filter materials based on search term
//   const filteredMaterials = rawMaterials.filter(material =>
//     material.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle material selection
//   const handleMaterialSelect = (material) => {
//     const isAlreadySelected = selectedMaterials.find(
//       selected => selected.id === material.id
//     );

//     if (isAlreadySelected) {
//       // Remove if already selected
//       setSelectedMaterials(prev =>
//         prev.filter(selected => selected.id !== material.id)
//       );
//       // Remove quantity
//       setQuantities(prev => {
//         const newQuantities = { ...prev };
//         delete newQuantities[material.id];
//         return newQuantities;
//       });
//     } else {
//       // Add to selection
//       setSelectedMaterials(prev => [...prev, material]);
//       // Initialize quantity with 1
//       setQuantities(prev => ({
//         ...prev,
//         [material.id]: '1'
//       }));
//     }

//     // Close dropdown after selection
//     setIsDropdownOpen(false);
//   };

//   // Handle quantity change
//   const handleQuantityChange = (materialId, value) => {
//     // Only allow numbers and empty string
//     if (value === '' || /^\d*$/.test(value)) {
//       setQuantities(prev => ({
//         ...prev,
//         [materialId]: value
//       }));
//     }
//   };

//   // Remove selected material
//   const removeSelectedMaterial = (materialId) => {
//     setSelectedMaterials(prev =>
//       prev.filter(material => material.id !== materialId)
//     );
//     setQuantities(prev => {
//       const newQuantities = { ...prev };
//       delete newQuantities[materialId];
//       return newQuantities;
//     });
//   };

//   // Clear all selections
//   const clearAllSelections = () => {
//     setSelectedMaterials([]);
//     setQuantities({});
//     setBillPhoto(null);
//     setError(null);
//     setSuccess(null);
//     setSearchTerm('');
//   };

//   // Handle bill photo upload
//   const handleBillPhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         setError('Please select an image file');
//         return;
//       }
//       // Validate file size (5MB max)
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size should be less than 5MB');
//         return;
//       }
//       setBillPhoto(file);
//       setError(null);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (selectedMaterials.length === 0) {
//       setError('Please select at least one material');
//       return;
//     }

//     if (!billPhoto) {
//       setError('Please upload a bill photo');
//       return;
//     }

//     // Validate all quantities are filled and valid
//     const invalidQuantities = selectedMaterials.filter(
//       material => !quantities[material.id] || quantities[material.id] === '' || parseInt(quantities[material.id]) <= 0
//     );

//     if (invalidQuantities.length > 0) {
//       setError('Please enter valid quantities for all selected materials (minimum 1)');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setSuccess(null);

//       // Prepare the rawMaterialList
//       const rawMaterialList = selectedMaterials.map(material => ({
//         rawMaterialId: material.id,
//         quantity: quantities[material.id].toString(),
//         unit: material.unit
//       }));

//       // Create FormData for file upload
//       const formData = new FormData();
//       formData.append('billPhoto', billPhoto);
//       formData.append('rawMaterialList', JSON.stringify(rawMaterialList));

//       // Make API call
//       const response = await Api.post(
//         '/store-keeper/updateStock',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data.success) {
//         setSuccess('Stock updated successfully!');
//         clearAllSelections();
//       } else {
//         setError(response.data.message || 'Failed to update stock');
//       }
//     } catch (err) {
//       setError('Error updating stock: ' + (err.response?.data?.message || err.message));
//       console.error('Error updating stock:', err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Toggle dropdown
//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     setSearchTerm(''); // Clear search when opening dropdown
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.multi-select-dropdown')) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="stock-update-container">
//         <div className="loading-state">
//           <div className="spinner"></div>
//           <p>Loading raw materials...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="stock-update-container">
//       <div className="header-section">
//         <h1 className="page-title">Stock Update</h1>
//         <p className="page-subtitle">Manage your raw materials inventory</p>
//       </div>

//       {/* Success Message */}
//       {success && (
//         <div className="message success-message">
//           <span className="message-icon">✓</span>
//           {success}
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="message error-message">
//           <span className="message-icon">⚠</span>
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="stock-update-form">
//         {/* Multi-select Dropdown */}
//         <div className="form-section">
//           <label className="section-label">Select Raw Materials *</label>
//           <div className="multi-select-dropdown">
//             <div className="dropdown-header" onClick={toggleDropdown}>
//               <span className="dropdown-placeholder">
//                 {selectedMaterials.length > 0
//                   ? <strong>{selectedMaterials.length} material(s) selected</strong>
//                   : 'Choose materials from the list...'
//                 }
//               </span>
//               <span className="dropdown-arrow">
//                 {isDropdownOpen ? '▲' : '▼'}
//               </span>
//             </div>

//             {isDropdownOpen && (
//               <div className="dropdown-content">
//                 {/* Search Input */}
//                 <div className="search-container">
//                   <input
//                     type="text"
//                     placeholder="Search materials by name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="search-input"
//                   />
//                   <span className="search-icon">🔍</span>
//                 </div>

//                 {/* Materials Count */}
//                 <div className="materials-count">
//                   <strong>{filteredMaterials.length} materials found</strong>
//                 </div>

//                 {/* Materials List */}
//                 <div className="materials-list">
//                   {filteredMaterials.length === 0 ? (
//                     <div className="no-results">
//                       <div className="no-results-icon">📦</div>
//                       <p>No materials found</p>
//                       <span>Try adjusting your search terms</span>
//                     </div>
//                   ) : (
//                     filteredMaterials.map(material => (
//                       <div
//                         key={material.id}
//                         className={`material-item ${
//                           selectedMaterials.find(selected => selected.id === material.id)
//                             ? 'selected'
//                             : ''
//                         } ${material.outOfStock ? 'out-of-stock' : ''}`}
//                         onClick={() => handleMaterialSelect(material)}
//                       >
//                         <div className="material-checkbox">
//                           <div className={`custom-checkbox ${
//                             selectedMaterials.find(selected => selected.id === material.id)
//                               ? 'checked'
//                               : ''
//                           }`}>
//                             {selectedMaterials.find(selected => selected.id === material.id) && '✓'}
//                           </div>
//                         </div>
//                         <div className="material-info">
//                           <div className="material-name">
//                             <strong>{material.name}</strong>
//                           </div>
//                           <div className="material-details">
//                             <span className="stock-info">
//                               <strong>Stock: {material.stock} {material.unit}</strong>
//                             </span>
//                             {material.outOfStock && (
//                               <span className="out-of-stock-badge">
//                                 <strong>Out of Stock</strong>
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Selected Materials with Quantity Inputs */}
//         {selectedMaterials.length > 0 && (
//           <div className="form-section">
//             <div className="selected-materials">
//               <div className="selected-header">
//                 <h3 className="selected-title">
//                   <strong>Selected Materials</strong>
//                   <span className="selected-count">
//                     <strong>({selectedMaterials.length})</strong>
//                   </span>
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={clearAllSelections}
//                   className="clear-all-btn"
//                 >
//                   <strong>Clear All</strong>
//                 </button>
//               </div>
//               <div className="selected-list">
//                 {selectedMaterials.map(material => (
//                   <div key={material.id} className="selected-item">
//                     <div className="selected-material-info">
//                       <span className="material-name">
//                         <strong>{material.name}</strong>
//                       </span>
//                       <span className="material-stock">
//                         <strong>Current: {material.stock} {material.unit}</strong>
//                       </span>
//                     </div>
//                     <div className="quantity-controls">
//                       <label htmlFor={`quantity-${material.id}`} className="quantity-label">
//                         <strong>Quantity:</strong>
//                       </label>
//                       <input
//                         id={`quantity-${material.id}`}
//                         type="text"
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                         value={quantities[material.id] || '0'}
//                         onChange={(e) => handleQuantityChange(material.id, e.target.value)}
//                         className="quantity-input"
//                         placeholder="Enter quantity"
//                         min="1"
//                       />
//                       <span className="quantity-unit">
//                         <strong>{material.unit}</strong>
//                       </span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeSelectedMaterial(material.id)}
//                       className="remove-btn"
//                       title="Remove material"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bill Photo Upload */}
//         <div className="form-section">
//           <label className="section-label">
//             <strong>Bill Photo *</strong>
//           </label>
//           <div className="bill-photo-upload">
//             <div className="upload-area">
//               <input
//                 id="billPhoto"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleBillPhotoChange}
//                 className="file-input"
//               />
//               <label htmlFor="billPhoto" className="upload-label">
//                 <div className="upload-icon">📷</div>
//                 <div className="upload-text">
//                   <span className="upload-title">
//                     <strong>Click to upload bill photo</strong>
//                   </span>
//                   <span className="upload-hint">
//                     <strong>JPEG, PNG, JPG, GIF • Max 5MB</strong>
//                   </span>
//                 </div>
//               </label>
//             </div>
//             {billPhoto && (
//               <div className="file-preview">
//                 <div className="file-info">
//                   <span className="file-icon">📄</span>
//                   <div className="file-details">
//                     <span className="file-name">
//                       <strong>{billPhoto.name}</strong>
//                     </span>
//                     <span className="file-size">
//                       <strong>{(billPhoto.size / 1024 / 1024).toFixed(2)} MB</strong>
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setBillPhoto(null)}
//                   className="remove-file-btn"
//                   title="Remove file"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="action-buttons">
//           <button
//             type="submit"
//             className="btn btn-primary update-stock-btn"
//             disabled={selectedMaterials.length === 0 || !billPhoto || submitting}
//           >
//             {submitting ? (
//               <>
//                 <div className="button-spinner"></div>
//                 <strong>Updating Stock...</strong>
//               </>
//             ) : (
//               <strong>Update Stock</strong>
//             )}
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary reset-btn"
//             onClick={clearAllSelections}
//             disabled={submitting}
//           >
//             <strong>Reset Form</strong>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default StockUpdate;

import React, { useState, useEffect } from "react";
import Api from "../../../../auth/Api";
import "./StockUpdate.css";

const StockUpdate = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [billPhoto, setBillPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/store-keeper/getRawMaterialList");

        if (response.data.success) {
          // Remove the outOfStock property since we don't need it anymore
          setRawMaterials(response.data.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching raw materials: " + err?.response?.data?.message || err.message);
        // console.log("Error fetching raw materials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRawMaterials();
  }, []);

  const filteredMaterials = rawMaterials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMaterialSelect = (material) => {
    // REMOVED: No more out-of-stock check
    
    const isAlreadySelected = selectedMaterials.find(
      (selected) => selected.id === material.id
    );

    if (isAlreadySelected) {
      setSelectedMaterials((prev) =>
        prev.filter((selected) => selected.id !== material.id)
      );

      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[material.id];
        return newQuantities;
      });
    } else {
      setSelectedMaterials((prev) => [...prev, material]);
      setQuantities((prev) => ({
        ...prev,
        [material.id]: "1",
      }));
    }

    setIsDropdownOpen(false);
    setError(null);
  };

  const handleQuantityChange = (materialId, value) => {
    if (value === "" || /^\d*$/.test(value)) {
      setQuantities((prev) => ({
        ...prev,
        [materialId]: value,
      }));
    }
  };

  const removeSelectedMaterial = (materialId) => {
    setSelectedMaterials((prev) =>
      prev.filter((material) => material.id !== materialId)
    );
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[materialId];
      return newQuantities;
    });
  };

  const clearAllSelections = () => {
    setSelectedMaterials([]);
    setQuantities({});
    setBillPhoto(null);
    setError(null);
    setSuccess(null);
    setSearchTerm("");
  };

  const handleBillPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      setBillPhoto(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedMaterials.length === 0) {
      setError("Please select at least one material");
      return;
    }

    if (!billPhoto) {
      setError("Please upload a bill photo");
      return;
    }

    const invalidQuantities = selectedMaterials.filter(
      (material) =>
        !quantities[material.id] ||
        quantities[material.id] === "" ||
        parseInt(quantities[material.id]) <= 0
    );

    if (invalidQuantities.length > 0) {
      setError(
        "Please enter valid quantities for all selected materials (minimum 1)"
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const rawMaterialList = selectedMaterials.map((material) => ({
        rawMaterialId: material.id,
        quantity: quantities[material.id].toString(),
        unit: material.unit,
      }));

      const formData = new FormData();
      formData.append("billPhoto", billPhoto);
      formData.append("rawMaterialList", JSON.stringify(rawMaterialList));

      const response = await Api.post("/store-keeper/updateStock", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Update Response: ", response?.data?.message);

      if (response.data.success) {
        setSuccess("Stock updated successfully!");
        clearAllSelections();

        const refreshResponse = await Api.get(
          "/store-keeper/getRawMaterialList"
        );
        if (refreshResponse.data.success) {
          setRawMaterials(refreshResponse.data.data);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(
        "Error updating stock: " + (err.response?.data?.message || err.message)
      );
      // console.error("Error updating stock:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchTerm("");
    setError(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".multi-select-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="stock-update-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading raw materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-update-container">
      <div className="header-section">
        <h1 className="page-title">Stock Update</h1>
        <p className="page-subtitle">Manage your raw materials inventory</p>
      </div>

      {success && (
        <div className="message success-message">
          <span className="message-icon">✓</span>
          {success}
        </div>
      )}
      {error && (
        <div className="message error-message">
          <span className="message-icon">⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="stock-update-form">
        <div className="form-section">
          <label className="section-label">Select Raw Materials *</label>
          <div className="multi-select-dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
              <span className="dropdown-placeholder">
                {selectedMaterials.length > 0 ? (
                  <strong>
                    {selectedMaterials.length} material(s) selected
                  </strong>
                ) : (
                  "Choose materials from the list..."
                )}
              </span>
              <span className="dropdown-arrow">
                {isDropdownOpen ? "▲" : "▼"}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="dropdown-content">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search materials by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>

                <div className="materials-count">
                  <strong>{filteredMaterials.length} materials found</strong>
                </div>

                <div className="materials-list">
                  {filteredMaterials.length === 0 ? (
                    <div className="no-results">
                      <div className="no-results-icon">📦</div>
                      <p>No materials found</p>
                      <span>Try adjusting your search terms</span>
                    </div>
                  ) : (
                    filteredMaterials.map((material) => (
                      <div
                        key={material.id}
                        className={`material-item ${
                          selectedMaterials.find(
                            (selected) => selected.id === material.id
                          )
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleMaterialSelect(material)}
                      >
                        <div className="material-checkbox">
                          <div
                            className={`custom-checkbox ${
                              selectedMaterials.find(
                                (selected) => selected.id === material.id
                              )
                                ? "checked"
                                : ""
                            }`}
                          >
                            {selectedMaterials.find(
                              (selected) => selected.id === material.id
                            ) && "✓"}
                          </div>
                        </div>
                        <div className="material-info">
                          <div className="material-name">
                            <strong>{material.name}</strong>
                            {/* REMOVED: Out of stock badge */}
                          </div>
                          <div className="material-details">
                            <span className="stock-info">
                              Stock: {material.stock} {material.unit}
                            </span>
                          </div>
                        </div>
                        {/* REMOVED: Out of stock overlay */}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {selectedMaterials.length > 0 && (
          <div className="form-section">
            <div className="selected-materials">
              <div className="selected-header">
                <h3 className="selected-title">
                  Selected Materials
                  <span className="selected-count">
                    ({selectedMaterials.length})
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={clearAllSelections}
                  className="clear-all-btn"
                >
                  Clear All
                </button>
              </div>
              <div className="selected-list">
                {selectedMaterials.map((material) => (
                  <div key={material.id} className="selected-item">
                    <div className="selected-material-info">
                      <span className="material-name">
                        <strong>{material.name}</strong>
                      </span>
                      <span className="material-stock">
                        Current Stock: {material.stock} {material.unit}
                      </span>
                    </div>
                    <div className="quantity-controls">
                      <label
                        htmlFor={`quantity-${material.id}`}
                        className="quantity-label"
                      >
                        Quantity to Add:
                      </label>
                      <input
                        id={`quantity-${material.id}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quantities[material.id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(material.id, e.target.value)
                        }
                        className="quantity-input"
                        placeholder="Enter quantity"
                        min="1"
                      />
                      <span className="quantity-unit">{material.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelectedMaterial(material.id)}
                      className="remove-btn"
                      title="Remove material"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="form-section">
          <label className="section-label">Bill Photo *</label>
          <div className="bill-photo-upload">
            <div className="upload-area">
              <input
                id="billPhoto"
                type="file"
                accept="image/*"
                onChange={handleBillPhotoChange}
                className="file-input"
              />
              <label htmlFor="billPhoto" className="upload-label">
                <div className="upload-icon">📷</div>
                <div className="upload-text">
                  <span className="upload-title">
                    Click to upload bill photo
                  </span>
                  <span className="upload-hint">
                    JPEG, PNG, JPG, GIF • Max 5MB
                  </span>
                </div>
              </label>
            </div>
            {billPhoto && (
              <div className="file-preview">
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <div className="file-details">
                    <span className="file-name">{billPhoto.name}</span>
                    <span className="file-size">
                      {(billPhoto.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBillPhoto(null)}
                  className="remove-file-btn"
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button
            type="submit"
            className="btn btn-primary update-stock-btn"
            disabled={
              selectedMaterials.length === 0 || !billPhoto || submitting
            }
          >
            {submitting ? (
              <>
                <div className="button-spinner"></div>
                Updating Stock...
              </>
            ) : (
              "Update Stock"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary reset-btn"
            onClick={clearAllSelections}
            disabled={submitting}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockUpdate;
