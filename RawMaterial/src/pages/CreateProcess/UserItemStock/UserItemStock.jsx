import React, { useEffect, useState } from "react";
import "./UserItemStock.css";
import Api from "../../../auth/Api";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const UserItemStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceProcessId } = location?.state || {};

  const [userItemStock, setUserItemStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [extraRawMaterialRequired, setExtraRawMaterialRequired] = useState(false);
  const [requestItems, setRequestItems] = useState([{ material: "", quantity: "" }]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchUserItemStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Api.get("/line-worker/showUserItemStock");
      setUserItemStock(response?.data?.data || []);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItemStock();
  }, []);

  const toggleMaterialSelection = (material) => {
    setSelectedMaterials((prev) => {
      const isSelected = prev.find(
        (m) => m.rawMaterialId === material.rawMaterialId
      );
      if (isSelected) {
        const newSelected = prev.filter(
          (m) => m.rawMaterialId !== material.rawMaterialId
        );
        const newQuantities = { ...quantities };
        delete newQuantities[material.rawMaterialId];
        setQuantities(newQuantities);
        return newSelected;
      } else {
        return [...prev, material];
      }
    });
  };

  const handleQuantityChange = (materialId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [materialId]: value,
    }));
  };

  const handleExtraMaterialToggle = (e) => {
    const value = e.target.value === "yes";
    setExtraRawMaterialRequired(value);

    // 🚀 If Yes → go to ItemRequest page
    if (value) {
      navigate("/item-request", {
        state: {
          serviceProcessId: serviceProcessId,
          Type: (serviceProcessId) ? "IN" : "PRE",
        },
      });
    }
  };

  const isMaterialSelected = (materialId) => {
    return selectedMaterials.some((m) => m.rawMaterialId === materialId);
  };

  const getSelectedMaterialQuantity = (materialId) => {
    return quantities[materialId] || "";
  };

  const handleSubmit = async () => {
    // Validate if serviceProcessId exists
    if (!serviceProcessId) {
      alert("Service Process ID is required");
      return;
    }

    // Validate if materials are selected
    if (selectedMaterials.length === 0) {
      alert("Please select at least one material");
      return;
    }

    // Validate quantities
    const rawMaterialList = selectedMaterials.map(material => {
      const quantity = quantities[material.rawMaterialId];
      if (!quantity || quantity <= 0) {
        alert(`Please enter a valid quantity for ${material.rawMaterialName}`);
        return null;
      }
      if (parseFloat(quantity) > parseFloat(material.itemStock)) {
        alert(`Quantity for ${material.rawMaterialName} exceeds available stock`);
        return null;
      }
      return {
        rawMaterialId: material.rawMaterialId,
        quantity: quantity.toString(),
        unit: material.unit
      };
    });

    // Check if any validation failed
    if (rawMaterialList.some(item => item === null)) {
      return;
    }

    // Prepare the request data
    const requestData = {
      serviceProcessId: serviceProcessId,
      rawMaterialList: rawMaterialList
    };

    try {
      setSubmitting(true);
      const response = await Api.post("/line-worker/createItemUsageLog", requestData);
      
      if (response.status === 200 || response.status === 201) {
        alert("Item usage log created successfully!");
        // Reset form or navigate as needed
        setSelectedMaterials([]);
        setQuantities({});
        // Optionally refresh the stock data
        fetchUserItemStock();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      alert(`Failed to create item usage log: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading stock data...</div>;
  if (error)
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={fetchUserItemStock}>Retry</button>
      </div>
    );

  return (
    <div className="user-item-stock">
      <h2>User Item Stock</h2>

      <div className="stock-cards-container">
        <h3>Available Stock</h3>
        <div className="stock-cards">
          {userItemStock.map((item) => (
            <div key={item.rawMaterialId} className="stock-card">
              <div className="card-header">
                <h4>{item.rawMaterialName}</h4>
                <span
                  className={`stock-badge ${
                    item.itemStock > 50
                      ? "high"
                      : item.itemStock > 20
                      ? "medium"
                      : "low"
                  }`}
                >
                  {item.itemStock} {item.unit}
                </span>
              </div>
              <div className="card-details">
                <p>
                  <strong>Current Quantity:</strong> {item.quantity} {item.unit}
                </p>
                <p>
                  <strong>Available Stock:</strong> {item.itemStock} {item.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="material-selection">
        <label>Select Materials (Multiple Selection):</label>
        <div className="dropdown-container">
          <div
            className="dropdown-header"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>
              {selectedMaterials.length === 0
                ? "Select materials"
                : `${selectedMaterials.length} material(s) selected`}
            </span>
            <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
              ▼
            </span>
          </div>

          {isDropdownOpen && (
            <div className="dropdown-list">
              {userItemStock.map((item) => (
                <div
                  key={item.rawMaterialId}
                  className={`dropdown-item ${
                    isMaterialSelected(item.rawMaterialId) ? "selected" : ""
                  }`}
                  onClick={() => toggleMaterialSelection(item)}
                >
                  <div className="material-info">
                    <span className="material-name">
                      {item.rawMaterialName}
                    </span>
                    <span className="material-stock">
                      Stock: {item.itemStock} {item.unit}
                    </span>
                  </div>
                  <div className="checkbox">
                    {isMaterialSelected(item.rawMaterialId) && "✓"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMaterials.length > 0 && (
          <div className="selected-materials">
            <h4>Selected Materials & Quantities:</h4>
            {selectedMaterials.map((material) => (
              <div
                key={material.rawMaterialId}
                className="selected-material-item"
              >
                <div className="material-details">
                  <span className="material-name">
                    {material.rawMaterialName}
                  </span>
                  <span className="available-stock">
                    Available: {material.itemStock} {material.unit}
                  </span>
                </div>

                <div className="quantity-input-container">
                  <input
                    type="number"
                    value={getSelectedMaterialQuantity(material.rawMaterialId)}
                    onChange={(e) =>
                      handleQuantityChange(
                        material.rawMaterialId,
                        e.target.value
                      )
                    }
                    placeholder="Enter quantity"
                    min="0"
                    max={material.itemStock}
                    className="quantity-input"
                  />
                  <span className="quantity-unit">{material.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="extra-raw-material-section">
        <div className="extra-material-toggle">
          <label>Extra Raw Material Requirement:</label>
          <div className="toggle-options">
            <label>
              <input
                type="radio"
                value="yes"
                checked={extraRawMaterialRequired === true}
                onChange={handleExtraMaterialToggle}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={extraRawMaterialRequired === false}
                onChange={handleExtraMaterialToggle}
              />
              No
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="submit-section">
        <button 
          onClick={handleSubmit} 
          disabled={submitting || selectedMaterials.length === 0}
          className="submit-button"
        >
          {submitting ? "Submitting..." : "Submit Item Usage"}
        </button>
      </div>
    </div>
  );
};

export default UserItemStock;