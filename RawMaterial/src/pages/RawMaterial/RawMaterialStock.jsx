import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import {
  FiSearch,
  FiChevronRight,
  FiX,
  FiAlertCircle,
  FiPackage,
  FiCheckCircle,
} from "react-icons/fi";
import "./RawMaterialStock.css";
import Api from "../../auth/Api"

const RawMaterialStock = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const itemTypes = [
    { label: "Motor", value: "Motor" },
    { label: "Pump", value: "Pump" },
    { label: "Controller", value: "Controller" },
  ];

  const fetchItemsByType = async (itemType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await Api.get(
        `/admin/getItemsByName?searchQuery=${itemType}`
      );

      if (response.data?.data) {
        setItems(response.data.data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      console.log("Error fetching items:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch items"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRawMaterialsByItemId = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);

      const response = await Api.get(
        `/admin/showRawMaterials?itemId=${itemId}`
      );

      if (response.data?.data) {
        const sortedData = response.data.data
          .sort((a, b) => a.name.localeCompare(b.name))
        setData(sortedData);
        setFilteredData(sortedData);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      console.log("Error fetching raw materials:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch raw materials"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItemType) {
      fetchItemsByType(selectedItemType);
    } else {
      setItems([]);
      setSelectedItem(null);
    }
  }, [selectedItemType]);

  useEffect(() => {
    if (selectedItem) {
      fetchRawMaterialsByItemId(selectedItem.id);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [selectedItem]);

  const handleSearch = debounce((query) => {
    if (query) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, 300);

  const handleItemPress = (item) => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      alert("Error: User ID not found. Please login again.");
      return;
    }

    navigate("/UpdateStockMaterial", {
      state: {
        rawMaterialId: item.id,
        itemName: item.name,
        currentStock: item.stock,
        userId: currentUserId,
        unit: item.unit,
        threshold: item.threshold,
        quantityUsedInThisItem: item.quantityUsedInThisItem,
      },
    });
  };

  const renderItem = (item) => (
    <div
      key={item.id}
      className={`bom-card ${
        item.stockIsLow ? "low-stock-card" : "high-stock-card"
      }`}
      onClick={() => handleItemPress(item)}
    >
      <div className="card-header">
        <div className="name-container">
          <div className="stock-status-indicator">
            {item.stockIsLow ? (
              <div className="low-stock-pulse" />
            ) : (
              <FiCheckCircle className="high-stock-check" />
            )}
          </div>
          <span className="name">{item.name}</span>
        </div>
        <div className="stock-info">
          <span className={`stock ${item.stockIsLow ? "low-stock-text" : "high-stock-text"}`}>
            {item.stock} {item.unit || ""}
          </span>
          <FiChevronRight size={20} color={item.stockIsLow ? "#e74c3c" : "#2ecc71"} />
        </div>
      </div>
      {item.threshold != null && (
        <div className="threshold-container">
          <span className="threshold-label">Threshold:</span>
          <span className={`threshold-value ${item.stockIsLow ? "threshold-warning" : ""}`}>
            {item.threshold}
          </span>
        </div>
      )}
      {item.quantityUsedInThisItem && (
        <div className="quantity-used-container">
          <span className="quantity-used-label">Used in this item:</span>
          <span className="quantity-used-value">
            {item.quantityUsedInThisItem} {item.unit || ""}
          </span>
        </div>
      )}
      {item.stockIsLow && (
        <div className="low-stock-warning">
          <FiAlertCircle size={16} />
          <span>Low Stock Warning</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bom-stock-container">
      <h1 className="bom-header">Raw Materials</h1>

      <div className="filters-container">
        <div className="item-type-filter">
          <select
            className="type-select"
            value={selectedItemType}
            onChange={(e) => {
              setSelectedItemType(e.target.value);
              setSelectedItem(null);
            }}
            disabled={loading}
          >
            <option value="">Select Item Type</option>
            {itemTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {selectedItemType && (
          <div className="item-filter">
            <select
              className="item-select"
              value={selectedItem?.id || ""}
              onChange={(e) => {
                const item = items.find((i) => i.id === e.target.value);
                setSelectedItem(item || null);
              }}
              disabled={loading || !items.length}
            >
              <option value="">Select {selectedItemType}</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {!loading && !selectedItemType && (
        <div className="empty-container">
          <FiPackage size={50} color="#95a5a6" />
          <p className="empty-text">
            Please select an item type to view raw materials
          </p>
        </div>
      )}

      {!loading && selectedItemType && !selectedItem && items.length > 0 && (
        <div className="empty-container">
          <FiPackage size={50} color="#95a5a6" />
          <p className="empty-text">
            Please select a {selectedItemType.toLowerCase()} to view raw materials
          </p>
        </div>
      )}

      {!loading && selectedItemType && items.length === 0 && (
        <div className="empty-container">
          <FiPackage size={50} color="#95a5a6" />
          <p className="empty-text">
            No {selectedItemType.toLowerCase()} items found
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="error-container">
          <FiAlertCircle size={40} color="#e74c3c" />
          <p className="error-text">{error}</p>
          <button
            className="retry-button"
            onClick={() =>
              selectedItem
                ? fetchRawMaterialsByItemId(selectedItem.id)
                : fetchItemsByType(selectedItemType)
            }
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && selectedItem && (
        <>
          <div className="search-container">
            <FiSearch size={20} color="#7f8c8d" className="search-icon" />
            <input
              className="search-input"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              disabled={filteredData.length === 0}
            />
            {searchQuery && (
              <button
                className="clear-search-button"
                onClick={() => {
                  setSearchQuery("");
                  setFilteredData(data);
                }}
              >
                <FiX size={20} color="#e74c3c" />
              </button>
            )}
          </div>

          <div className="card-grid-container">
            <div className="card-grid">
              {filteredData.length > 0 ? (
                filteredData.map(renderItem)
              ) : data.length > 0 ? (
                <div className="empty-container">
                  <FiPackage size={50} color="#95a5a6" />
                  <p className="empty-text">No materials match your search</p>
                </div>
              ) : (
                <div className="empty-container">
                  <FiPackage size={50} color="#95a5a6" />
                  <p className="empty-text">No materials found for this item</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RawMaterialStock;