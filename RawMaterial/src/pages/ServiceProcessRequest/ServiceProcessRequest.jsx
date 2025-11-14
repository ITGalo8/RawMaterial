import React, { useState, useEffect, useCallback } from "react";
import Api from "../../auth/Api";
import "./ServiceProcessRequest.css";

const ServiceProcessRequest = () => {
  const [productList, setProductList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [items, setItems] = useState([]);

  // Fetch Product Types
  const fetchProductType = useCallback(async () => {
    try {
      const response = await Api.get(`/common/getProduct`);

      setProductList(response?.data?.data || []);

    } catch (error) {
      alert("Error: " + (error?.response?.data?.message || "API Error"));
      console.log("Error:", error);
    }
  }, []);

  // Fetch Items Based on Product ID
  const fetchItemsByProductId = useCallback(async (productId) => {
    try {
      const response = await Api.get(
        `/common/getItemsByProductId?productId=${productId}`
      );

      setItems(response?.data?.data || []);

    } catch (error) {
      alert("Error: " + (error?.response?.data?.message || "API Error"));
      console.log("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchProductType();
  }, [fetchProductType]);

  // When user selects a product → fetch items
  const handleProductChange = (e) => {
    const id = e.target.value;
    setSelectedProductId(id);

    if (id) {
      fetchItemsByProductId(id);
    } else {
      setItems([]);
    }
  };

  return (
    <div className="request-form">

      {/* Product Type Dropdown */}
      <select onChange={handleProductChange}>
        <option value="">Select Product Type</option>

        {productList.length > 0 ? (
          productList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.productName}
            </option>
          ))
        ) : (
          <option disabled>No product found</option>
        )}
      </select>

      {/* Items Dropdown */}
      <select disabled={!selectedProductId}>
        <option value="">Select Item</option>

        {items.length > 0 ? (
          items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))
        ) : (
          <option disabled>No items found</option>
        )}
      </select>

    </div>
  );
};

export default ServiceProcessRequest;
