import React, { useState, useEffect } from "react";
import Api from "../../../auth/Api";
import InputField from "../../../components/inputField/InputField";
import Button from "../../../components/Button/Button";
import SingleSelect from "../../../components/dropdown/SingleSelect";

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
      setError("Failed to fetch products");
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  // Fetch items by product
  const fetchItemsByProductId = async (productId) => {
    try {
      setLoading((prev) => ({ ...prev, items: true }));
      const response = await Api.get(
        `/common/getItemsByProductId?productId=${productId}`
      );
      setItems(response?.data?.data || []);
    } catch (err) {
      setError("Failed to fetch items");
    } finally {
      setLoading((prev) => ({ ...prev, items: false }));
    }
  };

  // Fetch defective items
  const fetchDefectiveItems = async (itemName) => {
    try {
      setLoading((prev) => ({ ...prev, defectiveItems: true }));
      const response = await Api.get(
        `/common/showDefectiveItemsList?itemName=${itemName}`
      );
      setDefectiveItems(response?.data?.data || []);
    } catch (err) {
      setError("Failed to fetch defective items");
    } finally {
      setLoading((prev) => ({ ...prev, defectiveItems: false }));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Service Process Request
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <SingleSelect
          lists={products}
          selectedValue={selectedProduct?.id || ""}
          setSelectedValue={(value) => {
            const product = products.find((p) => p.id === value);
            setSelectedProduct(product || "");
            fetchItemsByProductId(value);
          }}
          label="Select Product"
          placeholder={loading.products ? "Loading..." : "Select Product"}
        />

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">Item</label>

          <div className="relative">
            <SingleSelect
              lists={items}
              selectedValue={selectedItem?.id || ""}
              setSelectedValue={(value) => {
                const item = items.find((i) => i.id === value);
                setSelectedItem(item || "");
                fetchDefectiveItems(item.name);
              }}
              label=""
              placeholder={loading.items ? "Loading..." : "Select Item"}
            />

            {isItemDropdownOpen && (
              <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-1 border max-h-60 overflow-y-auto">
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
            Defective Item
          </label>

          <div className="relative">
            <SingleSelect
              lists={defectiveItems}
              selectedValue={selectedDefectiveItem?.id || ""}
              setSelectedValue={(value) => {
                const defItem = defectiveItems.find((d) => d.id === value);
                setSelectedDefectiveItem(defItem || "");
              }}
              label=""
              placeholder={
                loading.defectiveItems ? "Loading..." : "Select Defective Item"
              }
            />

            {isDefectiveDropdownOpen && (
              <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-1 border max-h-60 overflow-y-auto">
                {defectiveItems.map((def, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedDefectiveItem(def);
                      setIsDefectiveDropdownOpen(false);
                    }}
                  >
                    <span>{def.itemName}</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        def.defective > 0
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {def.defective}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedDefectiveItem && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end mt-6">
          <InputField
            label="Serial Number *"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Enter Serial Number"
          />
          <InputField
            label="Quantity *"
            value={quantity}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setQuantity(e.target.value);
            }}
            placeholder="Enter Quantity"
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
            disabled={loading.submit}
          />
        </div>
      )}
    </div>
  );
};

export default ServiceProcessRequest;
