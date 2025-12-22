import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";
import AddRawMaterial from "./AddRawMaterial"; // Adjust the import path as needed

const ItemDetails = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemData, setEditItemData] = useState(null);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await Api.get("/purchase/items");
        setItems(res?.data?.items || []);
      } catch (err) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!selectedItemId) {
        setItemDetails(null);
        return;
      }
      try {
        setLoading(true);
        const res = await Api.get(
          `/common/item/details/${selectedItemId}`
        );
        // Combine data from response - source is at top level
        setItemDetails({
          ...res?.data?.data,
          source: res?.data?.source
        });
      } catch (err) {
        setError("Failed to fetch item details");
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [selectedItemId]);

  const handleUpdateClick = () => {
    if (itemDetails) {
      setEditItemData({
        id: itemDetails.id,
        name: itemDetails.name,
        description: itemDetails.description || "",
        unit: itemDetails.unit || "",
        source: itemDetails.source || "",
        conversionUnit: itemDetails.conversionUnit || "",
        conversionFactor: itemDetails.conversionFactor || ""
      });
      setIsEditMode(true);
      setShowEditModal(true);
    }
  };

  const handleEditSuccess = (updatedItem) => {
    // Update the local state with new data
    setItemDetails(prev => ({
      ...prev,
      ...updatedItem
    }));
    
    // Also update the items list
    setItems(prev => prev.map(item => 
      item.id === selectedItemId 
        ? { ...item, name: updatedItem.name, source: updatedItem.source }
        : item
    ));
    
    setShowEditModal(false);
    setIsEditMode(false);
    setEditItemData(null);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setIsEditMode(false);
    setEditItemData(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Item Details</h2>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {/* Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Select Item
        </label>
        <select
          className="w-full md:w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Select an item --</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {/* Item Details Card with Update Button */}
      {itemDetails && (
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Item Information
            </h3>
            <button
              onClick={handleUpdateClick}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Update Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-500">Item Name</label>
              <input
                type="text"
                value={itemDetails.name}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Source */}
            <div>
              <label className="text-sm text-gray-500">Source</label>
              <input
                type="text"
                value={itemDetails.source || "N/A"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="text-sm text-gray-500">Unit</label>
              <input
                type="text"
                value={itemDetails.unit || "N/A"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Conversion Unit */}
            <div>
              <label className="text-sm text-gray-500">
                Conversion Unit
              </label>
              <input
                type="text"
                value={itemDetails.conversionUnit || "N/A"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Conversion Factor */}
            <div>
              <label className="text-sm text-gray-500">
                Conversion Factor
              </label>
              <input
                type="text"
                value={itemDetails.conversionFactor || "N/A"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Description (Full Width) */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500">
                Description
              </label>
              <textarea
                rows={3}
                value={itemDetails.description || "No description available"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {!selectedItemId && !loading && (
        <p className="text-gray-500 italic mt-4">
          Please select an item to view details
        </p>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Item
                </h2>
                <button
                  onClick={handleEditCancel}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <AddRawMaterial
                isEditMode={isEditMode}
                editData={editItemData}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;