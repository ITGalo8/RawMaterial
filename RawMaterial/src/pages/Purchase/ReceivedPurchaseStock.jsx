// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Api from "../../auth/Api";
// import SingleSelect from "../../components/dropdown/SingleSelect";

// const ReceivedPurchaseStock = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { selectedOrderDetails } = location?.state || {};

//   const [warehouseList, setWarehouseList] = useState([]);
//   const [selectedWarehouse, setSelectedWarehouse] = useState("");

//   const [itemInputs, setItemInputs] = useState([]);

//   useEffect(() => {
//     fetchWarehouses();

//     if (selectedOrderDetails?.items) {
//       const initial = selectedOrderDetails.items.map(() => ({
//         receivedQty: "",
//         goodQty: "",
//         damagedQty: "",
//         remarks: "",
//         billFile: null,
//       }));
//       setItemInputs(initial);
//     }
//   }, []);

//   const fetchWarehouses = async () => {
//     try {
//       const res = await Api.get(`/purchase/warehouses`);
//       const formatted = res?.data?.data?.map((w) => ({
//         label: w.warehouseName,
//         value: w._id,
//       }));
//       setWarehouseList(formatted);
//     } catch (err) {
//       alert("Error loading warehouses");
//     }
//   };

//   const handleInputChange = (index, field, value) => {
//     const updated = [...itemInputs];
//     updated[index][field] = value;
//     setItemInputs(updated);
//   };

//   const handleFileUpload = (index, file) => {
//     const updated = [...itemInputs];
//     updated[index].billFile = file;
//     setItemInputs(updated);
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!selectedWarehouse) {
//         alert("Please select a warehouse");
//         return;
//       }

//       const itemsToSend = selectedOrderDetails.items.map((item, idx) => ({
//         purchaseOrderItemId: item.id,
//         itemId: item.itemId,
//         itemSource: item.itemSource,
//         itemName: item.itemName,
//         receivedQty: Number(itemInputs[idx].receivedQty),
//         goodQty: Number(itemInputs[idx].goodQty),
//         damagedQty: Number(itemInputs[idx].damagedQty),
//         remarks: itemInputs[idx].remarks,
//       }));

//       const formData = new FormData();
//       formData.append("purchaseOrderId", selectedOrderDetails.id);
//       formData.append("warehouseId", selectedWarehouse);
//       formData.append("items", JSON.stringify(itemsToSend));

//       // billFile (Only one allowed)
//       const firstFile = itemInputs.find((i) => i.billFile)?.billFile;
//       if (firstFile) {
//         formData.append("billFile", firstFile);
//       }

//       console.log("Form Data: ", formData)

//       const response = await Api.post(
//         "/purchase/purchase-orders/receive",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

      

//       alert("Purchase stock received successfully!");
//       navigate(-1);
//     } catch (error) {
//       console.log(error);
//       alert(error?.response?.data?.message || "Submission failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-5">
//       <h1 className="text-center text-2xl font-bold mb-6">
//         Received Purchase Stock
//       </h1>

//       {/* Warehouse Select */}
//       <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mb-6">
//         <SingleSelect
//           label="Select Warehouse"
//           lists={warehouseList}
//           selectedValue={selectedWarehouse}
//           setSelectedValue={setSelectedWarehouse}
//         />
//       </div>

//       <div className="max-w-4xl mx-auto">
//         {selectedOrderDetails?.items?.map((item, index) => (
//           <div
//             key={item.id}
//             className="bg-white p-5 shadow rounded-lg mb-6 border"
//           >
//             <h2 className="text-lg font-semibold mb-3">{item.itemName}</h2>


//             {/* Item Static Info */}
//             <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
//               <p><strong>Ordered Qty:</strong> {item.quantity}</p>
//             </div>

//              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
//               <p><strong>Received Quantity:</strong> {item.receivedQty}</p>
//             </div>

//             {/* Inputs */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label>Received Qty</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={itemInputs[index]?.receivedQty || ""}
//                   onChange={(e) =>
//                     handleInputChange(index, "receivedQty", e.target.value)
//                   }
//                 />
//               </div>

//               <div>
//                 <label>Good Qty</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={itemInputs[index]?.goodQty || ""}
//                   onChange={(e) =>
//                     handleInputChange(index, "goodQty", e.target.value)
//                   }
//                 />
//               </div>

//               <div>
//                 <label>Damaged Qty</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={itemInputs[index]?.damagedQty || ""}
//                   onChange={(e) =>
//                     handleInputChange(index, "damagedQty", e.target.value)
//                   }
//                 />
//               </div>

//               <div>
//                 <label>Remarks</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded"
//                   value={itemInputs[index]?.remarks || ""}
//                   onChange={(e) =>
//                     handleInputChange(index, "remarks", e.target.value)
//                   }
//                 />
//               </div>
//             </div>

//             {/* Bill File */}
//             <div className="mt-4">
//               <label>Upload Bill File (PDF/Image)</label>
//               <input
//                 type="file"
//                 accept="application/pdf,image/*"
//                 className="w-full"
//                 onChange={(e) =>
//                   handleFileUpload(index, e.target.files[0])
//                 }
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Submit Button */}
//       <div className="text-center mt-8">
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg shadow"
//         >
//           Submit Received Stock
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ReceivedPurchaseStock;



import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
import SingleSelect from "../../components/dropdown/SingleSelect";

const ReceivedPurchaseStock = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedOrderDetails } = location?.state || {};

  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const [itemInputs, setItemInputs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWarehouses();

    if (selectedOrderDetails?.items) {
      const initial = selectedOrderDetails.items.map(() => ({
        receivedQty: "",
        goodQty: "",
        damagedQty: "",
        remarks: "",
        billFile: null,
      }));
      setItemInputs(initial);
    }
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await Api.get(`/purchase/warehouses`);
      const formatted = res?.data?.data?.map((w) => ({
        label: w.warehouseName,
        value: w._id,
      }));
      setWarehouseList(formatted);
    } catch (err) {
      alert("Error loading warehouses");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...itemInputs];
    updated[index][field] = value;
    setItemInputs(updated);
  };

  const handleFileUpload = (index, file) => {
    const updated = [...itemInputs];
    updated[index].billFile = file;
    setItemInputs(updated);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (!selectedWarehouse) {
        alert("Please select a warehouse");
        return;
      }

      const itemsToSend = selectedOrderDetails.items.map((item, idx) => ({
        purchaseOrderItemId: item.id,
        itemId: item.itemId,
        itemSource: item.itemSource,
        itemName: item.itemName,
        receivedQty: Number(itemInputs[idx].receivedQty),
        goodQty: Number(itemInputs[idx].goodQty),
        damagedQty: Number(itemInputs[idx].damagedQty),
        remarks: itemInputs[idx].remarks,
      }));

      const formData = new FormData();
      formData.append("purchaseOrderId", selectedOrderDetails.id);
      formData.append("warehouseId", selectedWarehouse);
      formData.append("items", JSON.stringify(itemsToSend));

      const firstFile = itemInputs.find((i) => i.billFile)?.billFile;
      if (firstFile) {
        formData.append("billFile", firstFile);
      }

      const response = await Api.post(
        "/purchase/purchase-orders/receive",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Purchase stock received successfully!");
      navigate(-1);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 px-3 sm:py-8 sm:px-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Receive Purchase Stock
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Purchase Order: #{selectedOrderDetails?.poNumber || "N/A"}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>

          {/* Warehouse Select */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <SingleSelect
              label="Select Destination Warehouse"
              lists={warehouseList}
              selectedValue={selectedWarehouse}
              setSelectedValue={setSelectedWarehouse}
              required={true}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {selectedOrderDetails?.items?.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              {/* Item Header */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {item.itemName}
                  </h2>
                  {/* <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    SKU: {item.itemCode || "N/A"}
                  </span> */}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Ordered Qty</p>
                    <p className="text-lg font-semibold text-blue-700">
                      {item.quantity}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Already Received</p>
                    <p className="text-lg font-semibold text-green-700">
                      {item.receivedQty || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Received Qty *
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={itemInputs[index]?.receivedQty || ""}
                      onChange={(e) =>
                        handleInputChange(index, "receivedQty", e.target.value)
                      }
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Good Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      value={itemInputs[index]?.goodQty || ""}
                      onChange={(e) =>
                        handleInputChange(index, "goodQty", e.target.value)
                      }
                      placeholder="Good condition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Damaged Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                      value={itemInputs[index]?.damagedQty || ""}
                      onChange={(e) =>
                        handleInputChange(index, "damagedQty", e.target.value)
                      }
                      placeholder="Damaged items"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    rows="2"
                    value={itemInputs[index]?.remarks || ""}
                    onChange={(e) =>
                      handleInputChange(index, "remarks", e.target.value)
                    }
                    placeholder="Any notes or comments..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bill/Invoice Document
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(index, e.target.files[0])
                          }
                        />
                        <div className="text-gray-500">
                          <svg
                            className="mx-auto h-8 w-8 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-sm">
                            {itemInputs[index]?.billFile
                              ? itemInputs[index].billFile.name
                              : "Click to upload PDF or image"}
                          </p>
                          <p className="text-xs mt-1">Max 5MB</p>
                        </div>
                      </div>
                    </label>
                    {itemInputs[index]?.billFile && (
                      <button
                        type="button"
                        onClick={() => handleFileUpload(index, null)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-8 -mx-3 sm:mx-0 sm:rounded-xl sm:border sm:shadow-lg">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedWarehouse}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Received Stock"
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-3">
              Please verify all quantities before submission
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedPurchaseStock;