import React, { useState, useEffect } from "react";
import Api from "../../../auth/Api";
import InputField from '../../../components/InputField/InputField'
import Button from "../../../components/Button/Button";

const ServiceProcessRequest = () => {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [defectiveItems, setDefectiveItems] = useState([]);
  const [loading, setLoading] = useState({
    products: true,
    items: false,
    defectiveItems: false,
    submit: false,
  });
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedDefectiveItem, setSelectedDefectiveItem] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [isDefectiveDropdownOpen, setIsDefectiveDropdownOpen] = useState(false);

  const [serialNumber, setSerialNumber] = useState("");
  const [quantity, setQuantity] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading((prev) => ({ ...prev, products: true }));
      const response = await Api.get("/common/getProduct");
      setProducts(response?.data?.data || []);
    } catch (err) {
      setError("Error to fetch products: ", err?.response?.data?.message || err.message);
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const fetchItemsByProductId = async (productId) => {
    try {
      setLoading((prev) => ({ ...prev, items: true }));
      const response = await Api.get(
        `/common/getItemsByProductId?productId=${productId}`
      );
      setItems(response?.data?.data || []);
      setSelectedItem("");
      setSelectedDefectiveItem("");
      setDefectiveItems([]);
    } catch (err) {
      setError("Failed to fetch items", err?.response?.data?.message || err.message);
    } finally {
      setLoading((prev) => ({ ...prev, items: false }));
    }
  };

  // Fetch defective items - Updated to handle the new response format
  const fetchDefectiveItems = async (itemName) => {
    try {
      setLoading((prev) => ({ ...prev, defectiveItems: true }));
      const response = await Api.get(
        `/common/showDefectiveItemsList?itemName=${itemName}`
      );

      const transformedData = (response?.data?.data || []).map(item => ({
        id: item._id,
        itemName: item.name,
        defective: item.defective,
        name: item.name
      }));
      
      setDefectiveItems(transformedData);
      setSelectedDefectiveItem("");
    } catch (err) {
      setError("Error fetch defective items: ", err?.response?.data?.message || err.message);
    } finally {
      setLoading((prev) => ({ ...prev, defectiveItems: false }));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !selectedItem || !selectedDefectiveItem || !serialNumber || !quantity) {
      setError("Please fill all required fields");
      return;
    }

    if (parseInt(quantity) > selectedDefectiveItem.defective) {
      setError(`Quantity cannot exceed available defective items (${selectedDefectiveItem.defective})`);
      return;
    }

    if (parseInt(quantity) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      setError(null);
      const requestData = {
        productName: selectedProduct.name,
        itemName: selectedItem.name,
        subItemName: selectedDefectiveItem.itemName,
        serialNumber: serialNumber,
        quantity: parseInt(quantity)
      };

      console.log("Submitting data:", requestData);

      const response = await Api.post("/line-worker/createServiceProcess", requestData);

      console.log("Response:", response?.data);

      setSelectedProduct("");
      setSelectedItem("");
      setSelectedDefectiveItem("");
      setSerialNumber("");
      setQuantity("");
      setItems([]);
      setDefectiveItems([]);

      alert("Service process request submitted successfully!");
      
    } catch (err) {
      console.log("Submission error:", err?.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to submit service process request");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const isFormValid = () => {
    return (
      selectedProduct &&
      selectedItem &&
      selectedDefectiveItem &&
      serialNumber.trim() &&
      quantity &&
      parseInt(quantity) > 0 &&
      parseInt(quantity) <= selectedDefectiveItem.defective
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Service Process Request
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Product Selection */}
        <div>
          <label className="text-gray-700 font-semibold mb-1 block">Select Product *</label>
          <div className="relative">
            <button
              type="button"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
              disabled={loading.products}
            >
              {selectedProduct ? (
                <span>{selectedProduct.name}</span>
              ) : (
                <span className="text-gray-400">
                  {loading.products ? "Loading..." : "Select Product"}
                </span>
              )}
            </button>

            {isProductDropdownOpen && products.length > 0 && (
              <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-1 border max-h-60 overflow-y-auto z-10">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                      selectedProduct?.id === product.id
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsProductDropdownOpen(false);
                      fetchItemsByProductId(product.id);
                    }}
                  >
                    {product.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">Item *</label>
          <div className="relative">
            <button
              type="button"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              onClick={() => setIsItemDropdownOpen(!isItemDropdownOpen)}
              disabled={!selectedProduct || loading.items}
            >
              {selectedItem ? (
                <span>{selectedItem.name}</span>
              ) : (
                <span className="text-gray-400">
                  {loading.items ? "Loading..." : "Select Item"}
                </span>
              )}
            </button>

            {isItemDropdownOpen && items.length > 0 && (
              <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-1 border max-h-60 overflow-y-auto z-10">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                      selectedItem?.id === item.id
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedItem(item);
                      setIsItemDropdownOpen(false);
                      fetchDefectiveItems(item.name);
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="text-gray-700 font-semibold mb-1 block">
            Defective Item *
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              onClick={() => setIsDefectiveDropdownOpen(!isDefectiveDropdownOpen)}
              disabled={!selectedItem || loading.defectiveItems}
            >
              {selectedDefectiveItem ? (
                <div className="flex justify-between items-center w-full">
                  <span>{selectedDefectiveItem.name}</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      selectedDefectiveItem.defective > 0
                        ? "bg-red-100 text-red-600 border border-red-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    Defective: {selectedDefectiveItem.defective}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">
                  {loading.defectiveItems ? "Loading..." : "Select Defective Item"}
                </span>
              )}
            </button>
            {isDefectiveDropdownOpen && defectiveItems.length > 0 && (
              <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-1 border max-h-60 overflow-y-auto z-10">
                {defectiveItems.map((def) => (
                  <div
                    key={def.id}
                    className={`flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                      selectedDefectiveItem?.id === def.id
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedDefectiveItem(def);
                      setIsDefectiveDropdownOpen(false);
                    }}
                  >
                    <span className="flex-1">{def.name}</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium min-w-20 text-center ${
                        def.defective > 0
                          ? "bg-red-100 text-red-600 border border-red-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      Defective: {def.defective}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedDefectiveItem && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-semibold">{selectedDefectiveItem.name}</span> 
              {" "}with{" "}
              <span className={`font-semibold ${selectedDefectiveItem.defective > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {selectedDefectiveItem.defective} defective items
              </span>
              {" "}available
            </div>
          )}
        </div>
      </div>
      {selectedDefectiveItem && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end mt-6">
          <InputField
            label="Serial Number *"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Enter Serial Number"
            required
          />
          <InputField
            label="Quantity *"
            value={quantity}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setQuantity(e.target.value);
            }}
            placeholder="Enter Quantity"
            type="number"
            min="1"
            max={selectedDefectiveItem?.defective || 1}
            required
            infoText={
              <>
                Available defective:{" "}
                <span className="font-semibold text-red-600">
                  {selectedDefectiveItem.defective}
                </span>
              </>
            }
          />
          <Button
            title={loading.submit ? "Submitting..." : "Submit Request"}
            onClick={handleSubmit}
            disabled={loading.submit || !isFormValid()}
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              loading.submit || !isFormValid()
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          />
        </div>
      )}

      {selectedItem && defectiveItems.length === 0 && !loading.defectiveItems && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
          No defective items found for "{selectedItem.name}"
        </div>
      )}
      {selectedItem && defectiveItems.length > 0 && defectiveItems.every(item => item.defective === 0) && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mt-4">
          Defective items found for "{selectedItem.name}" but all have zero quantity available
        </div>
      )}
    </div>
  );
};

export default ServiceProcessRequest;