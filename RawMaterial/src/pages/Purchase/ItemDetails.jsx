// import React, { useEffect, useState } from "react";
// import Api from "../../auth/Api";
// import AddRawMaterial from "./AddRawMaterial";

// const ItemDetails = () => {
//   const [items, setItems] = useState([]);
//   const [selectedItemId, setSelectedItemId] = useState("");
//   const [itemDetails, setItemDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editItemData, setEditItemData] = useState(null);

//   // Fetch items
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setLoading(true);
//         const res = await Api.get("/purchase/items");
//         setItems(res?.data?.items || []);
//       } catch (err) {
//         setError("Failed to fetch items");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, []);

//   // Fetch item details
//   useEffect(() => {
//     const fetchItemDetails = async () => {
//       if (!selectedItemId) {
//         setItemDetails(null);
//         return;
//       }
//       try {
//         setLoading(true);
//         const res = await Api.get(
//           `/common/item/details/${selectedItemId}`
//         );
//         setItemDetails({
//           ...res?.data?.data,
//           source: res?.data?.source
//         });
//       } catch (err) {
//         setError("Failed to fetch item details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchItemDetails();
//   }, [selectedItemId]);

//   const handleUpdateClick = () => {
//     if (itemDetails) {
//       setEditItemData({
//         id: itemDetails?.id || "",
//         name: itemDetails?.name || "",
//         description: itemDetails.description || "",
//         unit: itemDetails.unit || "",
//         source: itemDetails.source || "",
//         conversionUnit: itemDetails.conversionUnit || "",
//         conversionFactor: itemDetails.conversionFactor || "",
//         hsnCode: itemDetails.hsnCode || ""
//       });
//       setIsEditMode(true);
//       setShowEditModal(true);
//     }
//   };

//   const handleEditSuccess = (updatedItem) => {
//     // Update the local state with new data
//     setItemDetails(prev => ({
//       ...prev,
//       ...updatedItem
//     }));
    
//     // Also update the items list
//     setItems(prev => prev.map(item => 
//       item.id === selectedItemId 
//         ? { ...item, name: updatedItem?.name, source: updatedItem?.source }
//         : item
//     ));
    
//     setShowEditModal(false);
//     setIsEditMode(false);
//     setEditItemData(null);
//   };

//   const handleEditCancel = () => {
//     setShowEditModal(false);
//     setIsEditMode(false);
//     setEditItemData(null);
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4">
//       <h2 className="text-xl font-semibold mb-4">Item Details</h2>

//       {error && (
//         <p className="text-red-600 mb-4">{error}</p>
//       )}

//       {/* Dropdown */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-1">
//           Select Item
//         </label>
//         <select
//           className="w-full md:w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//           value={selectedItemId}
//           onChange={(e) => setSelectedItemId(e.target.value)}
//           disabled={loading}
//         >
//           <option value="">-- Select an item --</option>
//           {items.map((item) => (
//             <option key={item.id} value={item.id}>
//               {item.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading && (
//         <p className="text-gray-500">Loading...</p>
//       )}

//       {/* Item Details Card with Update Button */}
//       {itemDetails && (
//         <div className="bg-white border rounded-xl shadow-sm p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">
//               Item Information
//             </h3>
//             <button
//               onClick={handleUpdateClick}
//               className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
//             >
//               Edit Details
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Name */}
//             <div>
//               <label className="text-sm text-gray-500">Item Name</label>
//               <input
//                 type="text"
//                 value={itemDetails.name}
//                 readOnly
//                 className="w-full border rounded-lg px-3 py-2 bg-gray-100"
//               />
//             </div>

//             {/* Source */}
//             <div>
//               <label className="text-sm text-gray-500">Source</label>
//               <input
//                 type="text"
//                 value={itemDetails.source || "N/A"}
//                 readOnly
//                 className="w-full border rounded-lg px-3 py-2 bg-gray-100"
//               />
//             </div>

//             {/* Unit */}
//             <div>
//               <label className="text-sm text-gray-500">Unit</label>
//               <input
//                 type="text"
//                 value={itemDetails.unit || "N/A"}
//                 readOnly
//                 className="w-full border rounded-lg px-3 py-2 bg-gray-100"
//               />
//             </div>

//             {/* Conversion Unit */}
//             <div>
//               <label className="text-sm text-gray-500">
//                 Conversion Unit
//               </label>
//               <input
//                 type="text"
//                 value={itemDetails.conversionUnit || "N/A"}
//                 readOnly
//                 className="w-full border rounded-lg px-3 py-2 bg-gray-100"
//               />
//             </div>

//             {/* Conversion Factor */}
//             <div>
//               <label className="text-sm text-gray-500">
//                 Conversion Factor
//               </label>
//               <input
//                 type="text"
//                 value={itemDetails.conversionFactor || "N/A"}
//                 readOnly
//                 className="w-full border rounded-lg px-3 py-2 bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-500">
//                 HSN Code
//               </label>
//               <input
//                 type="text"
//                 value={itemDetails.hsnCode || "N/A"}
//                 readOnly
//                 className="w-full border rounded-lg px-3 py-2 bg-gray-100"
//               />
//             </div>

//             {/* Description (Full Width) */}
//             <div className="md:col-span-2">
//               <label className="text-sm text-gray-500">
//                 Description
//               </label>
//               <textarea
//                 rows={3}
//                 value={itemDetails.description || "No description available"}
//                 readOnly
//                 className="w-full border rounded-lg px-3 py-2 bg-gray-100 resize-none"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {!selectedItemId && !loading && (
//         <p className="text-gray-500 italic mt-4">
//           Please select an item to view details
//         </p>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 h-full ">
//           <div className="bg-white shadow-lg w-10/12 h-8/12 relative">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
                
//                 <button
//                   onClick={handleEditCancel}
//                   className="text-gray-500 hover:text-gray-700 text-2xl absolute top-2 right-4 bg-red-500 text-white px-3 pb-1 rounded-md"
//                 >
//                   ×
//                 </button>
//               </div>
//               <AddRawMaterial
//                 isEditMode={isEditMode}
//                 editData={editItemData}
//                 onSuccess={handleEditSuccess}
//                 onCancel={handleEditCancel}
//                 closeModal={setShowEditModal}
                
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ItemDetails;


import React, { useEffect, useState, useMemo, useRef } from "react";
import Api from "../../auth/Api";
import AddRawMaterial from "./AddRawMaterial";

const ItemDetails = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemData, setEditItemData] = useState(null);
  
  // Search and dropdown state
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

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

  // Filter items based on search query (exclude currently selected item from dropdown)
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      // Show all items except currently selected one
      return items.filter(item => item.id !== selectedItemId);
    }
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => 
      item.id !== selectedItemId && (
        item.name?.toLowerCase().includes(query) ||
        item.source?.toLowerCase().includes(query) ||
        item.hsnCode?.toLowerCase().includes(query)
      )
    );
  }, [items, searchQuery, selectedItemId]);

  // Get selected item details
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return items.find(item => item.id === selectedItemId);
  }, [items, selectedItemId]);

  // Fetch item details
  const fetchItemDetails = async (itemId) => {
    if (!itemId) {
      setItemDetails(null);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await Api.get(`/common/item/details/${itemId}`);
      setItemDetails({
        ...res?.data?.data,
        source: res?.data?.source
      });
    } catch (err) {
      setError("Failed to fetch item details");
      setItemDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedItemId) {
      fetchItemDetails(selectedItemId);
    }
  }, [selectedItemId]);

  const handleUpdateClick = () => {
    if (itemDetails) {
      setEditItemData({
        id: itemDetails?.id || "",
        name: itemDetails?.name || "",
        description: itemDetails.description || "",
        unit: itemDetails.unit || "",
        source: itemDetails.source || "",
        conversionUnit: itemDetails.conversionUnit || "",
        conversionFactor: itemDetails.conversionFactor || "",
        hsnCode: itemDetails.hsnCode || ""
      });
      setIsEditMode(true);
      setShowEditModal(true);
    }
  };

  const handleEditSuccess = async (updatedItemData) => {
    try {
      console.log("Update successful, refreshing data...");
      
      if (updatedItemData) {
        setItemDetails(prev => ({
          ...prev,
          ...updatedItemData
        }));
        
        setItems(prev => prev.map(item => 
          item.id === selectedItemId 
            ? { ...item, name: updatedItemData?.name, source: updatedItemData?.source }
            : item
        ));
      }
      
    } catch (err) {
      console.error("Error handling edit success:", err);
      setError("Failed to refresh updated data");
    } finally {
      setShowEditModal(false);
      setIsEditMode(false);
      setEditItemData(null);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setIsEditMode(false);
    setEditItemData(null);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  const clearSelection = () => {
    setSelectedItemId("");
    setSearchQuery("");
    setItemDetails(null);
    setIsDropdownOpen(true);
    // Focus on input after clearing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const toggleDropdown = () => {
    if (!selectedItemId) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      // If item is selected, open dropdown for changing selection
      setIsDropdownOpen(true);
      setSearchQuery("");
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Item Details</h2>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {/* Search and Select Item */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Item <span className="text-gray-400 text-xs">(Search or select from dropdown)</span>
        </label>
        
        <div className="relative" ref={dropdownRef}>
          {/* Combined Input with Selected Item Display */}
          <div className="flex items-stretch border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-300">
            {/* Selected Item Display or Search Input */}
            <div className="flex-1 flex items-center">
              {selectedItemId && selectedItem ? (
                <div className="flex items-center justify-between w-full px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedItem.name}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      Selected
                    </span>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="text-gray-400 hover:text-red-500 text-lg p-1"
                    title="Clear selection"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="pl-3 text-gray-400">
                    🔍
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search items by name, source, or HSN code..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full px-3 py-2 outline-none"
                    disabled={loading}
                  />
                </>
              )}
            </div>

            {/* Dropdown Toggle Button */}
            <button
              type="button"
              onClick={toggleDropdown}
              className="px-4 border-l bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
              disabled={loading}
            >
              {isDropdownOpen ? "▲" : "▼"}
            </button>
          </div>

          {/* Dropdown Results */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
              {/* Currently Selected Item (if any) */}
              {selectedItemId && selectedItem && (
                <div className="p-3 border-b bg-blue-50">
                  <div className="text-sm text-gray-500 mb-1">Currently Selected:</div>
                  <div className="font-medium">{selectedItem.name}</div>
                  {/* <div className="text-xs text-gray-500 mt-1">
                    Source: {selectedItem.source || "N/A"} • HSN: {selectedItem.hsnCode || "N/A"}
                  </div> */}
                </div>
              )}

              {/* Available Items */}
              <div className="p-2">
                <div className="text-xs text-gray-500 px-2 py-1">
                  {selectedItemId 
                    ? "Select a different item:" 
                    : "Select an item:"}
                </div>
                
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading items...
                  </div>
                ) : filteredItems.length > 0 ? (
                  <ul>
                    {filteredItems.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleItemSelect(item.id)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded transition-colors flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {/* <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                              <span>Source: {item.source || "N/A"}</span>
                              <span>•</span>
                              <span>HSN: {item.hsnCode || "N/A"}</span>
                            </div> */}
                          </div>
                          <div className="text-blue-500 text-lg">→</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery 
                      ? "No other items found matching your search" 
                      : "No other items available"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Item Count Info */}
        <div className="mt-2 text-xs text-gray-500">
          {selectedItemId ? (
            <div className="flex items-center gap-4">
              <span>
                Showing: <span className="font-medium">{selectedItem?.name}</span>
              </span>
              <span>•</span>
              <span>
                {filteredItems.length} other item{filteredItems.length !== 1 ? 's' : ''} available
              </span>
              <span>•</span>
              <button
                onClick={() => {
                  setSelectedItemId("");
                  setIsDropdownOpen(true);
                  setSearchQuery("");
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Change selection
              </button>
            </div>
          ) : (
            <span>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && !itemDetails && selectedItemId && (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading item details...</div>
        </div>
      )}

      {/* Item Details Card with Update Button */}
      {itemDetails && (
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Item Details
              </h3>
              {/* <p className="text-sm text-gray-500 mt-1">
                ID: {itemDetails.id} • Last updated: {new Date().toLocaleDateString()}
              </p> */}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedItemId("");
                  setIsDropdownOpen(true);
                  setSearchQuery("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Select Different Item
              </button>
              <button
                onClick={handleUpdateClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>✏️</span>
                <span>Edit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-500">Item Name</label>
              <div className="w-full border rounded-lg px-3 py-2 bg-gray-50 font-medium">
                {itemDetails.name}
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="text-sm text-gray-500">Source</label>
              <div className="w-full border rounded-lg px-3 py-2 bg-gray-50">
                {itemDetails.source || "N/A"}
              </div>
            </div>

            {/* Unit */}
            <div>
              <label className="text-sm text-gray-500">Unit</label>
              <div className="w-full border rounded-lg px-3 py-2 bg-gray-50">
                {itemDetails.unit || "N/A"}
              </div>
            </div>

            {/* Conversion Unit */}
            <div>
              <label className="text-sm text-gray-500">
                Conversion Unit
              </label>
              <div className="w-full border rounded-lg px-3 py-2 bg-gray-50">
                {itemDetails.conversionUnit || "N/A"}
              </div>
            </div>

            {/* Conversion Factor */}
            <div>
              <label className="text-sm text-gray-500">
                Conversion Factor
              </label>
              <div className="w-full border rounded-lg px-3 py-2 bg-gray-50">
                {itemDetails.conversionFactor || "N/A"}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                HSN Code
              </label>
              <div className="w-full border rounded-lg px-3 py-2 bg-gray-50">
                {itemDetails.hsnCode || "N/A"}
              </div>
            </div>

            {/* Description (Full Width) */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500">
                Description
              </label>
              <div className="w-full border rounded-lg px-3 py-2 bg-gray-50 min-h-[80px]">
                {itemDetails.description || "No description available"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty States */}
      {!selectedItemId && !loading && items.length > 0 && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg mt-4">
          <div className="text-gray-400 mb-2 text-4xl">📦</div>
          <p className="text-gray-500 italic">
            Select an item to view details
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Click the dropdown arrow or search to select an item
          </p>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg mt-4">
          <div className="text-gray-400 mb-2 text-4xl">📝</div>
          <p className="text-gray-500 italic">
            No items found
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Add items to get started
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 h-full">
          <div className="bg-white shadow-lg w-10/12 h-8/12 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handleEditCancel}
                  className="text-gray-500 hover:text-gray-700 text-2xl absolute top-2 right-4 bg-red-500 text-white px-3 pb-1 rounded-md"
                >
                  ×
                </button>
              </div>
              <AddRawMaterial
                isEditMode={isEditMode}
                editData={editItemData}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
                closeModal={setShowEditModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;