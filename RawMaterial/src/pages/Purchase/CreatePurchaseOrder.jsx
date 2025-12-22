// import React, { useState, useEffect } from "react";
// import Api from "../../auth/Api";
// import { useLocation } from "react-router-dom";

// const CreatePurchaseOrder = () => {
//   const location = useLocation();

//   const [companies, setCompanies] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState("");

//   const [vendorsList, setVendorsList] = useState([]);
//   const [selectedVendor, setSelectedVendor] = useState("");

//   const [selectedGstType, setSelectedGstType] = useState("");
//   const [paymentTerms, setPaymentTerms] = useState("");
//   const [deliveryTerms, setDeliveryTerms] = useState("");
//   const [warranty, setWarranty] = useState("");
//   const [contactPerson, setContactPerson] = useState("");
//   const [cellNo, setCellNo] = useState("");
//   const [currency, setCurrency] = useState("INR");
//   const [gstRate, setGstRate] = useState("");

//   const [itemList, setItemList] = useState([]);
//   const [itemDetails, setItemDetails] = useState([
//     {
//       id: 1,
//       selectedItem: "",
//       hsnCode: "",
//       modelNumber: "",
//       selectedUnit: "",
//       rate: "",
//       quantity: "",
//       gstRate: "",
//       amount: 0,
//       taxableAmount: 0,
//       gstAmount: 0,
//       totalAmount: 0,
//       itemDetail: ""
//     }
//   ]);

//   const [otherCharges, setOtherCharges] = useState([
//     {
//       id: 1,
//       name: "",
//       amount: ""
//     }
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [processingReorder, setProcessingReorder] = useState(false);
//   const [pendingReorderItems, setPendingReorderItems] = useState([]);
//   const [isItemListLoaded, setIsItemListLoaded] = useState(false);

//   const gstTypes = [
//     { value: "IGST_5", label: "IGST 5%" },
//     { value: "IGST_12", label: "IGST 12%" },
//     { value: "IGST_18", label: "IGST 18%" },
//     { value: "IGST_28", label: "IGST 28%" },
//     { value: "IGST_EXEMPTED", label: "IGST Exempted" },
//     { value: "LGST_5", label: "LGST 5%" },
//     { value: "LGST_12", label: "LGST 12%" },
//     { value: "LGST_18", label: "LGST 18%" },
//     { value: "LGST_28", label: "LGST 28%" },
//     { value: "LGST_EXEMPTED", label: "LGST Exempted" },
//     { value: "IGST_ITEMWISE", label: "IGST Itemwise" },
//     { value: "LGST_ITEMWISE", label: "LGST Itemwise" },
//   ];

//   const unitTypes = [
//     { value: "Nos", label: "Nos" },
//     { value: "Pcs", label: "Pcs" },
//     { value: "Mtr", label: "Mtr" },
//     { value: "Kg", label: "Kg" },
//     { value: "Box", label: "Box" },
//     { value: "Set", label: "Set" },
//     { value: "Roll", label: "Roll" },
//     { value: "Ltr", label: "Ltr" },
//   ];

//   const isItemWiseGST = selectedGstType === "IGST_ITEMWISE" || selectedGstType === "LGST_ITEMWISE";

//   // Extract GST rate from GST type (e.g., IGST_5 -> 5)
//   const getFixedGSTRate = () => {
//     if (selectedGstType.includes("EXEMPTED")) return 0;
//     const rateMatch = selectedGstType.match(/(\d+)/);
//     return rateMatch ? parseFloat(rateMatch[1]) : 0;
//   };

//   const fetchCompanies = async () => {
//     setLoading(true);
//     try {
//       const response = await Api.get("/purchase/companies");
//       setCompanies(response?.data?.data || []);
//     } catch (error) {
//       alert("Error: " + (error?.response?.data?.message || error?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const response = await Api.get("/purchase/vendors");
//       setVendorsList(response?.data?.data || []);
//     } catch (error) {
//       alert("Error: " + (error?.response?.data?.message || error?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchItemList = async () => {
//     setLoading(true);
//     try {
//       const response = await Api.get("/purchase/items");
//       setItemList(response?.data?.items || []);
//       setIsItemListLoaded(true);
//     } catch (error) {
//       alert("Error: " + (error?.response?.data?.message || error?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle reorder data from ShowPurchaseOrder
//   useEffect(() => {
//     if (location.state?.reorderData) {
//       const reorderData = location.state.reorderData;
//       console.log('Received reorder data:', reorderData);

//       // Set basic information
//       setSelectedCompany(reorderData.companyId);
//       setSelectedVendor(reorderData.vendorId);
//       setSelectedGstType(reorderData.gstType);
//       setCurrency(reorderData.currency || "INR");
//       setPaymentTerms(reorderData.paymentTerms || "");
//       setDeliveryTerms(reorderData.deliveryTerms || "");
//       setWarranty(reorderData.warranty || "");
//       setContactPerson(reorderData.contactPerson || "");
//       setCellNo(reorderData.cellNo || "");

//       // Store items for processing after itemList is loaded
//       if (reorderData.items && reorderData.items.length > 0) {
//         setPendingReorderItems(reorderData.items);
//       }

//       // Set other charges
//       if (reorderData.otherCharges && reorderData.otherCharges.length > 0) {
//         const mappedCharges = reorderData.otherCharges.map((charge, index) => ({
//           id: index + 1,
//           name: charge.name || "",
//           amount: charge.amount || ""
//         }));
//         setOtherCharges(mappedCharges);
//       }
//     }
//   }, [location.state]);

//   // Process reorder items when itemList is loaded
//   useEffect(() => {
//     if (pendingReorderItems.length > 0 && isItemListLoaded) {
//       setProcessingReorder(true);

//       const mappedItems = pendingReorderItems.map((item, index) => {
//         // Try to find the item in itemList
//         let foundItem = null;

//         // First try by ID
//         if (item.itemId || item.id) {
//           foundItem = itemList.find(i =>
//             String(i.id) === String(item.itemId || item.id)
//           );
//         }

//         // If not found by ID, try by name
//         if (!foundItem && item.itemName) {
//           foundItem = itemList.find(i =>
//             i.name.toLowerCase().includes(item.itemName.toLowerCase()) ||
//             (item.itemName && i.name.toLowerCase() === item.itemName.toLowerCase())
//           );
//         }

//         // Calculate amounts
//         const rate = parseFloat(item.rate) || 0;
//         const quantity = parseFloat(item.quantity) || 1;
//         const total = rate * quantity;

//         // For itemwise GST, use item's gstRate, otherwise use fixed rate from GST type
//         let itemGstRate = 0;
//         if (isItemWiseGST) {
//           itemGstRate = parseFloat(item.gstRate) || 0;
//         } else {
//           itemGstRate = getFixedGSTRate();
//         }

//         const gstAmount = (total * itemGstRate) / 100;

//         return {
//           id: index + 1,
//           selectedItem: foundItem?.id || "",
//           hsnCode: foundItem?.hsnCode || item.hsnCode || "",
//           modelNumber: foundItem?.modelNumber || item.modelNumber || "",
//           selectedUnit: foundItem?.unit || item.unit || "Nos",
//           rate: rate.toString(),
//           quantity: quantity.toString(),
//           gstRate: itemGstRate.toString(),
//           amount: total,
//           taxableAmount: total,
//           gstAmount: gstAmount,
//           totalAmount: total + gstAmount,
//           itemDetail: foundItem?.itemDetail || item.itemDetail || ""
//         };
//       });

//       setItemDetails(mappedItems);
//       setPendingReorderItems([]);

//       // Show success message
//       setTimeout(() => {
//         setProcessingReorder(false);
//         console.log('Reorder items processed:', mappedItems);
//       }, 500);
//     }
//   }, [isItemListLoaded, pendingReorderItems, selectedGstType, itemList]);

//   const addItemDetail = () => {
//     const newId = itemDetails.length + 1;
//     setItemDetails([
//       ...itemDetails,
//       {
//         id: newId,
//         selectedItem: "",
//         hsnCode: "",
//         modelNumber: "",
//         selectedUnit: "",
//         rate: "",
//         quantity: "",
//         gstRate: "",
//         amount: 0,
//         taxableAmount: 0,
//         gstAmount: 0,
//         totalAmount: 0,
//         itemDetail: ""
//       }
//     ]);
//   };

//   const removeItemDetail = (id) => {
//     if (itemDetails.length > 1) {
//       setItemDetails(itemDetails.filter(item => item.id !== id));
//     }
//   };

//   const addOtherCharge = () => {
//     const newId = otherCharges.length + 1;
//     setOtherCharges([
//       ...otherCharges,
//       {
//         id: newId,
//         name: "",
//         amount: ""
//       }
//     ]);
//   };

//   const removeOtherCharge = (id) => {
//     if (otherCharges.length > 1) {
//       setOtherCharges(otherCharges.filter(charge => charge.id !== id));
//     }
//   };

//   const updateOtherCharge = (id, field, value) => {
//     setOtherCharges(otherCharges.map(charge => {
//       if (charge.id === id) {
//         return { ...charge, [field]: value };
//       }
//       return charge;
//     }));
//   };

//   const calculateItemAmounts = (item) => {
//     const rate = parseFloat(item.rate) || 0;
//     const quantity = parseFloat(item.quantity) || 0;
//     const total = rate * quantity;

//     let gstRate = 0;

//     if (isItemWiseGST) {
//       gstRate = parseFloat(item.gstRate) || 0;
//     } else {
//       gstRate = getFixedGSTRate();
//     }

//     const taxableAmount = total;
//     const gstAmount = (taxableAmount * gstRate) / 100;
//     const finalTotalAmount = taxableAmount + gstAmount;

//     return {
//       amount: total,
//       taxableAmount,
//       gstAmount,
//       totalAmount: total,
//       gstRate: gstRate.toString()
//     };
//   };

//   const updateItemDetail = (id, field, value) => {
//     setItemDetails(itemDetails.map(item => {
//       if (item.id === id) {
//         const updatedItem = { ...item, [field]: value };

//         if (field === 'rate' || field === 'quantity' || (isItemWiseGST && field === 'gstRate')) {
//           const calculatedAmounts = calculateItemAmounts(updatedItem);
//           return { ...updatedItem, ...calculatedAmounts };
//         }

//         return updatedItem;
//       }
//       return item;
//     }));
//   };

//   const handleItemSelect = (id, itemId) => {
//     const selectedItemData = itemList.find(item => item.id === itemId);
//     if (selectedItemData) {
//       setItemDetails(itemDetails.map(item => {
//         if (item.id === id) {
//           const updatedItem = {
//             ...item,
//             selectedItem: itemId,
//             hsnCode: selectedItemData.hsnCode || item.hsnCode,
//             modelNumber: selectedItemData.modelNumber || item.modelNumber,
//             selectedUnit: selectedItemData.unit || item.selectedUnit,
//             rate: selectedItemData.rate || item.rate,
//             itemDetail: selectedItemData.itemDetail || item.itemDetail
//           };
//           const calculatedAmounts = calculateItemAmounts(updatedItem);
//           return { ...updatedItem, ...calculatedAmounts };
//         }
//         return item;
//       }));
//     }
//   };

//   // Recalculate item amounts when GST type changes
//   useEffect(() => {
//     if (selectedGstType) {
//       setItemDetails(itemDetails.map(item => {
//         const calculatedAmounts = calculateItemAmounts(item);
//         return { ...item, ...calculatedAmounts };
//       }));
//     }
//   }, [selectedGstType]);

//   const itemTotals = itemDetails.reduce((acc, item) => {
//     return {
//       amount: acc.amount + (parseFloat(item.amount) || 0),
//       taxableAmount: acc.taxableAmount + (parseFloat(item.taxableAmount) || 0),
//       gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
//       totalAmount: acc.totalAmount + (parseFloat(item.totalAmount) || 0)
//     };
//   }, { amount: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 });

//   const otherChargesTotal = otherCharges.reduce((total, charge) => {
//     return total + (parseFloat(charge.amount) || 0);
//   }, 0);

//   const finalTotals = {
//     amount: itemTotals.amount,
//     taxableAmount: itemTotals.taxableAmount,
//     gstAmount: itemTotals.gstAmount,
//     otherCharges: otherChargesTotal,
//     totalAmount: itemTotals.taxableAmount + itemTotals.gstAmount + otherChargesTotal
//   };

//   const handleSubmit = async () => {
//     if (!selectedCompany) {
//       alert("Please select a company");
//       return;
//     }
//     if (!selectedVendor) {
//       alert("Please select a vendor");
//       return;
//     }
//     if (!selectedGstType) {
//       alert("Please select a GST type");
//       return;
//     }

//     const invalidItems = itemDetails.filter(item =>
//       !item.selectedItem || !item.hsnCode || !item.rate || !item.quantity
//     );

//     if (invalidItems.length > 0) {
//       alert("Please fill all required fields for all items");
//       return;
//     }

//     try {
//       const purchaseOrderData = {
//         companyId: selectedCompany,
//         vendorId: selectedVendor,
//         gstType: selectedGstType,
//         currency: currency,
//         paymentTerms,
//         deliveryTerms,
//         warranty,
//         contactPerson,
//         cellNo,
//         items: itemDetails.map(item => {
//           const selectedItemData = itemList.find(i => i.id === item.selectedItem);
//           const itemData = {
//             id: item.selectedItem,
//             name: selectedItemData?.name || "",
//             source: selectedItemData?.source || "",
//             hsnCode: item.hsnCode,
//             modelNumber: item.modelNumber,
//             itemDetail: item.itemDetail,
//             unit: item.selectedUnit,
//             quantity: item.quantity.toString(),
//             rate: item.rate.toString(),
//           };

//           // Only add gstRate for itemwise GST types
//           if (isItemWiseGST) {
//             itemData.gstRate = item.gstRate.toString();
//           }

//           return itemData;
//         }),
//         otherCharges: otherCharges.map(charge => ({
//           name: charge.name,
//           amount: charge.amount.toString()
//         }))
//       };

//       console.log('Purchase Order Data:', purchaseOrderData);

//       const response = await Api.post('/purchase/purchase-orders/create2', purchaseOrderData);

//       if (response.data.success) {
//         alert('Purchase Order created successfully!');
//         handleReset();
//       } else {
//         alert('Error creating purchase order: ' + response.data.message);
//       }

//     } catch (error) {
//       console.error('Error creating purchase order:', error);
//       alert("Error creating purchase order: " + (error?.response?.data?.message || error?.message));
//     }
//   };

//   const handleReset = () => {
//     setSelectedCompany("");
//     setSelectedVendor("");
//     setSelectedGstType("");
//     setGstRate("");
//     setCurrency("INR");
//     setPaymentTerms("");
//     setDeliveryTerms("");
//     setWarranty("");
//     setContactPerson("");
//     setCellNo("");
//     setItemDetails([{
//       id: 1,
//       selectedItem: "",
//       hsnCode: "",
//       modelNumber: "",
//       selectedUnit: "",
//       rate: "",
//       quantity: "",
//       gstRate: "",
//       amount: 0,
//       taxableAmount: 0,
//       gstAmount: 0,
//       totalAmount: 0,
//       itemDetail: ""
//     }]);
//     setOtherCharges([{
//       id: 1,
//       name: "",
//       amount: ""
//     }]);
//     setPendingReorderItems([]);
//   };

//   useEffect(() => {
//     fetchCompanies();
//     fetchVendors();
//     fetchItemList();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Loading Overlay for Reorder Processing */}
//         {processingReorder && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-700">Loading reorder data...</p>
//             </div>
//           </div>
//         )}

//         {/* Centered Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
//             {location.state?.reorderData ? "ReOrder Purchase Order" : "Create Purchase Order"}
//           </h1>
//           <p className="text-gray-600">
//             {location.state?.reorderData
//               ? "Review and modify the reorder details below"
//               : "Fill in the details below to create a new purchase order"}
//           </p>

//           {location.state?.reorderData && (
//             <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Reorder Mode - All fields are editable
//             </div>
//           )}
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
//             Basic Information
//           </h2>

//           <div className="space-y-6">
//             {/* FIRST ROW */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Company *
//                 </label>
//                 <select
//                   value={selectedCompany}
//                   onChange={(e) => setSelectedCompany(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 >
//                   <option value="">-- Select Company --</option>
//                   {companies.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.companyName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Vendor *
//                 </label>
//                 <select
//                   value={selectedVendor}
//                   onChange={(e) => setSelectedVendor(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 >
//                   <option value="">-- Select Vendor --</option>
//                   {vendorsList.map((v) => (
//                     <option key={v.id} value={v.id}>
//                       {v.displayName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select GST Type *
//                 </label>
//                 <select
//                   value={selectedGstType}
//                   onChange={(e) => setSelectedGstType(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 >
//                   <option value="">-- Select GST Type --</option>
//                   {gstTypes.map((gst) => (
//                     <option key={gst.value} value={gst.value}>
//                       {gst.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* SECOND ROW */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Payment Terms
//                 </label>
//                 <input
//                   type="text"
//                   value={paymentTerms}
//                   onChange={(e) => setPaymentTerms(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="e.g., 60 Days Credit"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Delivery Terms
//                 </label>
//                 <input
//                   type="text"
//                   value={deliveryTerms}
//                   onChange={(e) => setDeliveryTerms(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="e.g., Immediate"
//                 />
//               </div>

//               {/* {location.state?.reorderData && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Original PO Number
//                   </label>
//                   <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700">
//                     {location.state.reorderData.poNumber}
//                   </div>
//                 </div>
//               )} */}
//             </div>

//             {/* THIRD ROW */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Warranty
//                 </label>
//                 <input
//                   type="text"
//                   value={warranty}
//                   onChange={(e) => setWarranty(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="Enter warranty details"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Contact Person
//                 </label>
//                 <input
//                   type="text"
//                   value={contactPerson}
//                   onChange={(e) => setContactPerson(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="Enter contact person name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Contact Number
//                 </label>
//                 <input
//                   type="text"
//                   value={cellNo}
//                   onChange={(e) => setCellNo(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="Enter contact number"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ITEM SECTION */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
//               Item Details
//             </h2>
//             <button
//               type="button"
//               className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
//               onClick={addItemDetail}
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Item
//             </button>
//           </div>

//           {/* GST Type Info */}
//           {selectedGstType && (
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 <span className="font-medium text-blue-800">Selected GST Type:</span>
//                 <span className="ml-2 text-blue-700">
//                   {gstTypes.find(gst => gst.value === selectedGstType)?.label}
//                   {!isItemWiseGST && (
//                     <span className="ml-2 font-medium">(Rate: {getFixedGSTRate()}%)</span>
//                   )}
//                   {isItemWiseGST && (
//                     <span className="ml-2 font-medium">(Itemwise GST - Enter rate for each item)</span>
//                   )}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Item Details Cards */}
//           <div className="space-y-6">
//             {itemDetails.map((item, index) => (
//               <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
//                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     Item {index + 1}
//                   </h3>
//                   {itemDetails.length > 1 && (
//                     <button
//                       type="button"
//                       className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
//                       onClick={() => removeItemDetail(item.id)}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   {/* Item Selection Row */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Item *
//                       </label>
//                       <select
//                         value={item.selectedItem}
//                         onChange={(e) => handleItemSelect(item.id, e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                       >
//                         <option value="">-- Choose Item --</option>
//                         {itemList.map((itemOption) => (
//                           <option key={itemOption.id} value={itemOption.id}>
//                             {itemOption.name}
//                             {itemOption.hsnCode && ` (HSN: ${itemOption.hsnCode})`}
//                             {itemOption.rate && ` - ₹${parseFloat(itemOption.rate).toFixed(5)}`}
//                           </option>
//                         ))}
//                       </select>
//                       {!item.selectedItem && location.state?.reorderData?.items?.[index] && (
//                         <p className="mt-1 text-sm text-gray-500">
//                           Original: {location.state.reorderData.items[index].itemName}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Unit
//                       </label>
//                       <select
//                         value={item.selectedUnit}
//                         onChange={(e) => updateItemDetail(item.id, 'selectedUnit', e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                       >
//                         <option value="">-- Choose Unit --</option>
//                         {unitTypes.map((u) => (
//                           <option key={u.value} value={u.value}>
//                             {u.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* HSN and Model Number */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         HSN Code *
//                       </label>
//                       <input
//                         type="text"
//                         value={item.hsnCode}
//                         onChange={(e) => updateItemDetail(item.id, 'hsnCode', e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="Enter HSN code"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Model Number
//                       </label>
//                       <input
//                         type="text"
//                         value={item.modelNumber}
//                         onChange={(e) => updateItemDetail(item.id, 'modelNumber', e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="Enter model number"
//                       />
//                     </div>
//                   </div>

//                   {/* Pricing Section */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Rate ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}) *
//                       </label>
//                       <input
//                         type="number"
//                         value={item.rate}
//                         onChange={(e) => updateItemDetail(item.id, 'rate', e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="0.00"
//                         step="0.01"
//                         min="0"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Quantity *
//                       </label>
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) => updateItemDetail(item.id, 'quantity', e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="0"
//                         step="1"
//                         min="0"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Total Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})
//                       </label>
//                       <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
//                         {item.totalAmount.toFixed(5)}
//                       </div>
//                     </div>
//                   </div>

//                   {/* GST Rate Section - Only show for itemwise GST */}
//                   {isItemWiseGST && (
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             GST Rate (%) *
//                           </label>
//                           <input
//                             type="number"
//                             value={item.gstRate}
//                             onChange={(e) => updateItemDetail(item.id, 'gstRate', e.target.value)}
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                             placeholder="0.00"
//                             step="0.01"
//                             min="0"
//                             max="100"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Taxable Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})
//                           </label>
//                           <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
//                             {item.taxableAmount.toFixed(5)}
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             GST Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})
//                           </label>
//                           <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
//                             {item.gstAmount.toFixed(5)}
//                           </div>
//                         </div>
//                       </div>

//                       {item.gstRate && (
//                         <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
//                           <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                           </svg>
//                           Item GST Rate: {item.gstRate}%
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Item Description */}
//                   <div className="mt-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Item Description
//                     </label>
//                     <textarea
//                       value={item.itemDetail}
//                       onChange={(e) => updateItemDetail(item.id, 'itemDetail', e.target.value)}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                       placeholder="Enter item specifications, description, and other details..."
//                       rows="3"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* OTHER CHARGES SECTION */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
//               Other Charges
//             </h2>
//             <button
//               type="button"
//               className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
//               onClick={addOtherCharge}
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Charge
//             </button>
//           </div>

//           <div className="space-y-6">
//             {otherCharges.map((charge, index) => (
//               <div key={charge.id} className="border border-gray-200 rounded-xl overflow-hidden">
//                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     Charge {index + 1}
//                   </h3>
//                   {otherCharges.length > 1 && (
//                     <button
//                       type="button"
//                       className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
//                       onClick={() => removeOtherCharge(charge.id)}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Charge Name *
//                       </label>
//                       <input
//                         type="text"
//                         value={charge.name}
//                         onChange={(e) => updateOtherCharge(charge.id, 'name', e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="e.g., Freight, Loading, Packaging, etc."
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}) *
//                       </label>
//                       <input
//                         type="number"
//                         value={charge.amount}
//                         onChange={(e) => updateOtherCharge(charge.id, 'amount', e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="0.00"
//                         step="0.01"
//                         min="0"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Submit Buttons */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
//             <button
//               type="button"
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
//               onClick={handleReset}
//             >
//               Reset Form
//             </button>
//             <button
//               type="button"
//               className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleSubmit}
//               disabled={!selectedCompany || !selectedVendor || !selectedGstType}
//             >
//               {location.state?.reorderData ? 'Create ReOrder' : 'Create Purchase Order'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePurchaseOrder;

// import React, { useState, useEffect } from "react";
// import Api from "../../auth/Api";
// import { useLocation } from "react-router-dom";
// import { removeStartingZero } from "../../utils/number/removeStartingZero";

// const CreatePurchaseOrder = () => {
//   const location = useLocation();

//   const [companies, setCompanies] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState("");

//   const [vendorsList, setVendorsList] = useState([]);
//   const [selectedVendor, setSelectedVendor] = useState("");

//   const [selectedGstType, setSelectedGstType] = useState("");
//   const [paymentTerms, setPaymentTerms] = useState("");
//   const [deliveryTerms, setDeliveryTerms] = useState("");
//   const [warranty, setWarranty] = useState("");
//   const [contactPerson, setContactPerson] = useState("");
//   const [cellNo, setCellNo] = useState("");
//   const [currency, setCurrency] = useState("INR");
//   const [exchangeRate, setExchangeRate] = useState("1.00");
//   const [gstRate, setGstRate] = useState("");
//   const [itemList, setItemList] = useState([]);
//   const [warehouseList, setWarehouseList] = useState([]);
//   const [selectedWarehouse, setSelectedWarehouse] = useState("");
//   const [itemDetails, setItemDetails] = useState([
//     {
//       id: 1,
//       selectedItem: "",
//       hsnCode: "",
//       modelNumber: "",
//       selectedUnit: "",
//       rate: "",
//       quantity: "",
//       gstRate: "",
//       amount: "",
//       taxableAmount: 0,
//       gstAmount: 0,
//       totalAmount: 0,
//       itemDetail: "",
//     },
//   ]);

//   const [otherCharges, setOtherCharges] = useState([
//     {
//       id: 1,
//       name: "",
//       amount: "",
//     },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [processingReorder, setProcessingReorder] = useState(false);
//   const [pendingReorderItems, setPendingReorderItems] = useState([]);
//   const [isItemListLoaded, setIsItemListLoaded] = useState(false);
//   const [skipCalculation, setSkipCalculation] = useState({});
//   const [showOtherCharges, setShowOtherCharges] = useState(false);

//   // Add state for tracking loading status for individual items
//   const [loadingItems, setLoadingItems] = useState({});

//   const currencyOptions = [
//     { value: "INR", label: "INR" },
//     { value: "USD", label: "USD" },
//     { value: "CNY", label: "CNY" },
//     { value: "EUR", label: "EUR" },
//     { value: "GBP", label: "GBP" },
//     { value: "AED", label: "AED" },
//   ];

//   const gstTypes = [
//     { value: "IGST_5", label: "IGST 5%" },
//     { value: "IGST_12", label: "IGST 12%" },
//     { value: "IGST_18", label: "IGST 18%" },
//     { value: "IGST_28", label: "IGST 28%" },
//     { value: "IGST_EXEMPTED", label: "IGST Exempted" },
//     { value: "LGST_5", label: "LGST 5%" },
//     { value: "LGST_12", label: "LGST 12%" },
//     { value: "LGST_18", label: "LGST 18%" },
//     { value: "LGST_28", label: "LGST 28%" },
//     { value: "LGST_EXEMPTED", label: "LGST Exempted" },
//     { value: "IGST_ITEMWISE", label: "IGST Itemwise" },
//     { value: "LGST_ITEMWISE", label: "LGST Itemwise" },
//   ];

//   const unitTypes = [
//     { value: "Nos", label: "Nos" },
//     { value: "Pcs", label: "Pcs" },
//     { value: "Mtr", label: "Mtr" },
//     { value: "Kg", label: "Kg" },
//     { value: "Box", label: "Box" },
//     { value: "Set", label: "Set" },
//     { value: "Roll", label: "Roll" },
//     { value: "Ltr", label: "Ltr" },
//   ];

//   const isItemWiseGST =
//     selectedGstType === "IGST_ITEMWISE" || selectedGstType === "LGST_ITEMWISE";

//   // Get currency symbol
//   const getCurrencySymbol = (curr) => {
//     const currency = currencyOptions.find((c) => c.value === curr);
//     return currency ? currency.label.match(/\((.*?)\)/)?.[1] || "" : "₹";
//   };

//   // Extract GST rate from GST type (e.g., IGST_5 -> 5)
//   const getFixedGSTRate = () => {
//     if (selectedGstType.includes("EXEMPTED")) return 0;
//     const rateMatch = selectedGstType.match(/(\d+)/);
//     return rateMatch ? parseFloat(rateMatch[1]) : 0;
//   };

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

//   const fetchCompanies = async () => {
//     setLoading(true);
//     try {
//       const response = await Api.get("/purchase/companies");
//       setCompanies(response?.data?.data || []);
//     } catch (error) {
//       alert("Error: " + (error?.response?.data?.message || error?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const response = await Api.get("/purchase/vendors");
//       setVendorsList(response?.data?.data || []);
//     } catch (error) {
//       alert("Error: " + (error?.response?.data?.message || error?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchItemList = async () => {
//     setLoading(true);
//     try {
//       const response = await Api.get("/purchase/items");
//       setItemList(response?.data?.items || []);
//       setIsItemListLoaded(true);
//     } catch (error) {
//       alert("Error: " + (error?.response?.data?.message || error?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle reorder data from ShowPurchaseOrder
//   useEffect(() => {
//     if (location.state?.reorderData) {
//       const reorderData = location.state.reorderData;
//       console.log("Received reorder data:", reorderData);

//       // Set basic information
//       setSelectedCompany(reorderData.companyId);
//       setSelectedVendor(reorderData.vendorId);
//       setSelectedGstType(reorderData.gstType);
//       setCurrency(reorderData.currency || "INR");
//       setExchangeRate(reorderData.exchangeRate || "1.00");
//       setPaymentTerms(reorderData.paymentTerms || "");
//       setDeliveryTerms(reorderData.deliveryTerms || "");
//       setWarranty(reorderData.warranty || "");
//       setContactPerson(reorderData.contactPerson || "");
//       setCellNo(reorderData.cellNo || "");
//       setSelectedWarehouse(reorderData.warehouseId || "");

//       // Store items for processing after itemList is loaded
//       if (reorderData.items && reorderData.items.length > 0) {
//         setPendingReorderItems(reorderData.items);
//       }

//       // Set other charges
//       if (reorderData.otherCharges && reorderData.otherCharges.length > 0) {
//         const mappedCharges = reorderData.otherCharges.map((charge, index) => ({
//           id: index + 1,
//           name: charge.name || "",
//           amount: charge.amount || "",
//         }));
//         setOtherCharges(mappedCharges);
//       }
//     }
//   }, [location.state]);

//   // Process reorder items when itemList is loaded
//   useEffect(() => {
//     if (pendingReorderItems.length > 0 && isItemListLoaded) {
//       setProcessingReorder(true);

//       const mappedItems = pendingReorderItems.map((item, index) => {
//         // Try to find the item in itemList
//         let foundItem = null;

//         // First try by ID
//         if (item.itemId || item.id) {
//           foundItem = itemList.find(
//             (i) => String(i.id) === String(item.itemId || item.id)
//           );
//         }

//         // If not found by ID, try by name
//         if (!foundItem && item.itemName) {
//           foundItem = itemList.find(
//             (i) =>
//               i.name.toLowerCase().includes(item.itemName.toLowerCase()) ||
//               (item.itemName &&
//                 i.name.toLowerCase() === item.itemName.toLowerCase())
//           );
//         }

//         // Calculate amounts
//         const rate = parseFloat(item.rate) || 0;
//         const quantity = parseFloat(item.quantity) || 1;
//         const total = rate * quantity;

//         // For itemwise GST, use item's gstRate, otherwise use fixed rate from GST type
//         let itemGstRate = 0;
//         if (isItemWiseGST) {
//           itemGstRate = parseFloat(item.gstRate) || 0;
//         } else {
//           itemGstRate = getFixedGSTRate();
//         }

//         const gstAmount = (total * itemGstRate) / 100;

//         return {
//           id: index + 1,
//           selectedItem: foundItem?.id || "",
//           hsnCode: foundItem?.hsnCode || item.hsnCode || "",
//           modelNumber: foundItem?.modelNumber || item.modelNumber || "",
//           selectedUnit: foundItem?.unit || item.unit || "Nos",
//           rate: rate.toString(),
//           quantity: quantity.toString(),
//           gstRate: itemGstRate.toString(),
//           amount: total.toString(),
//           taxableAmount: total,
//           gstAmount: gstAmount,
//           totalAmount: total + gstAmount,
//           itemDetail: foundItem?.itemDetail || item.itemDetail || "",
//         };
//       });

//       setItemDetails(mappedItems);
//       setPendingReorderItems([]);

//       // Show success message
//       setTimeout(() => {
//         setProcessingReorder(false);
//         console.log("Reorder items processed:", mappedItems);
//       }, 500);
//     }
//   }, [isItemListLoaded, pendingReorderItems, selectedGstType, itemList]);

//   // Reset exchange rate when currency changes
//   useEffect(() => {
//     if (currency === "INR") {
//       setExchangeRate("1.00");
//     } else {
//       setExchangeRate("");
//     }
//   }, [currency]);

//   const addItemDetail = () => {
//     const newId = itemDetails.length + 1;
//     setItemDetails([
//       ...itemDetails,
//       {
//         id: newId,
//         selectedItem: "",
//         hsnCode: "",
//         modelNumber: "",
//         selectedUnit: "",
//         rate: "",
//         quantity: "",
//         gstRate: "",
//         amount: "",
//         taxableAmount: 0,
//         gstAmount: 0,
//         totalAmount: 0,
//         itemDetail: "",
//       },
//     ]);
//   };

//   const removeItemDetail = (id) => {
//     if (itemDetails.length > 1) {
//       setItemDetails(itemDetails.filter((item) => item.id !== id));
//       // Remove loading state for removed item
//       setLoadingItems((prev) => {
//         const updated = { ...prev };
//         delete updated[id];
//         return updated;
//       });
//     }
//   };

//   const addOtherCharge = () => {
//     const newId = otherCharges.length + 1;
//     setOtherCharges([
//       ...otherCharges,
//       {
//         id: newId,
//         name: "",
//         amount: "",
//       },
//     ]);
//   };

//   const removeOtherCharge = (id) => {
//     if (otherCharges.length > 1) {
//       setOtherCharges(otherCharges.filter((charge) => charge.id !== id));
//     }
//   };

//   const updateOtherCharge = (id, field, value) => {
//     setOtherCharges(
//       otherCharges.map((charge) => {
//         if (charge.id === id) {
//           return { ...charge, [field]: value };
//         }
//         return charge;
//       })
//     );
//   };

//   // Calculate missing value among rate, quantity, and amount
//   const calculateMissingValue = (rate, quantity, amount) => {
//     const r = rate === "" ? 0 : parseFloat(rate) || 0;
//     const q = quantity === "" ? 0 : parseFloat(quantity) || 0;
//     const a = amount === "" ? 0 : parseFloat(amount) || 0;

//     // Count how many valid (non-empty) values we have
//     const rateValid = rate !== "" && !isNaN(r) && r > 0;
//     const quantityValid = quantity !== "" && !isNaN(q) && q > 0;
//     const amountValid = amount !== "" && !isNaN(a) && a > 0;

//     const validCount = [rateValid, quantityValid, amountValid].filter(
//       Boolean
//     ).length;

//     // Only calculate if we have exactly 2 valid values
//     if (validCount === 2) {
//       if (rateValid && quantityValid && !amountValid) {
//         // Calculate amount from rate and quantity
//         return { amount: r * q, rate: r, quantity: q };
//       } else if (rateValid && amountValid && !quantityValid) {
//         // Calculate quantity from rate and amount
//         return { amount: a, rate: r, quantity: a / r };
//       } else if (quantityValid && amountValid && !rateValid) {
//         // Calculate rate from quantity and amount
//         return { amount: a, rate: a / q, quantity: q };
//       }
//     }

//     // If all three are valid, recalculate amount for consistency
//     if (validCount === 3) {
//       return { amount: r * q, rate: r, quantity: q };
//     }

//     // Otherwise, return as-is (allowing partial inputs)
//     return { amount: a, rate: r, quantity: q };
//   };

//   const calculateItemAmounts = (item) => {
//     const rate = item.rate || 0;
//     const quantity = item.quantity || 0;
//     const amount = item.amount || 0;

//     // Calculate missing values
//     const calculated = calculateMissingValue(rate, quantity, amount);

//     const total = calculated.amount;

//     let gstRate = 0;

//     if (isItemWiseGST) {
//       gstRate = parseFloat(item.gstRate) || 0;
//     } else {
//       gstRate = getFixedGSTRate();
//     }

//     const taxableAmount = total;
//     const gstAmount = (taxableAmount * gstRate) / 100;
//     const finalTotalAmount = taxableAmount + gstAmount;

//     return {
//       amount: total,
//       rate: calculated.rate,
//       quantity: calculated.quantity,
//       taxableAmount,
//       gstAmount,
//       totalAmount: finalTotalAmount,
//       gstRate: gstRate.toString(),
//     };
//   };

//   // Updated handleItemSelect with API call for detailed item information
//   const handleItemSelect = async (id, itemId) => {
//     if (!itemId) {
//       // If item is cleared, reset the fields
//       setItemDetails(
//         itemDetails.map((item) => {
//           if (item.id === id) {
//             return {
//               ...item,
//               selectedItem: "",
//               hsnCode: "",
//               modelNumber: "",
//               selectedUnit: "",
//               rate: "",
//               itemDetail: "",
//             };
//           }
//           return item;
//         })
//       );

//       // Clear loading state
//       setLoadingItems((prev) => ({ ...prev, [id]: false }));
//       return;
//     }

//     const selectedItemData = itemList.find((item) => item.id === itemId);
//     if (selectedItemData) {
//       // Set loading state for this specific item
//       setLoadingItems((prev) => ({ ...prev, [id]: true }));

//       try {
//         // First, update with basic information from itemList
//         let updatedItemDetails = itemDetails.map((item) => {
//           if (item.id === id) {
//             const updatedItem = {
//               ...item,
//               selectedItem: itemId,
//               hsnCode: selectedItemData.hsnCode || item.hsnCode,
//               modelNumber: selectedItemData.modelNumber || item.modelNumber,
//               selectedUnit: selectedItemData.unit || item.selectedUnit,
//               rate: selectedItemData.rate || item.rate,
//               itemDetail: selectedItemData.itemDetail || item.itemDetail,
//             };

//             const calculatedAmounts = calculateItemAmounts(updatedItem);
//             return {
//               ...updatedItem,
//               rate: calculatedAmounts.rate.toString(),
//               quantity: calculatedAmounts.quantity.toString(),
//               amount: calculatedAmounts.amount.toString(),
//               taxableAmount: calculatedAmounts.taxableAmount,
//               gstAmount: calculatedAmounts.gstAmount,
//               totalAmount: calculatedAmounts.totalAmount,
//             };
//           }
//           return item;
//         });

//         setItemDetails(updatedItemDetails);

//         // Fetch detailed item information from the API
//         try {
//           const response = await Api.get(`/purchase/items/details/${itemId}`);

//           if (response.data.success) {
//             const detailedItem = response.data.item;

//             // Update item with detailed information
//             setItemDetails((prevItemDetails) =>
//               prevItemDetails.map((item) => {
//                 if (item.id === id) {
//                   // Use API's unit if available, otherwise keep existing
//                   const newUnit = detailedItem.unit || item.selectedUnit;
//                   // Use API's description if available, otherwise keep existing
//                   const newDescription =
//                     detailedItem.description || item.itemDetail;

//                   const updatedItem = {
//                     ...item,
//                     selectedUnit: newUnit,
//                     itemDetail: newDescription,
//                   };

//                   return updatedItem;
//                 }
//                 return item;
//               })
//             );

//             // Show notification if data was fetched from API
//             if (detailedItem.unit || detailedItem.description) {
//               console.log(
//                 `Item ${id}: Loaded unit="${detailedItem.unit}", description="${detailedItem.description}"`
//               );
//             }
//           }
//         } catch (apiError) {
//           console.error("Error fetching item details:", apiError);
//           // Continue with itemList data if API fails
//         }
//       } catch (error) {
//         console.error("Error in handleItemSelect:", error);
//       } finally {
//         // Clear loading state
//         setLoadingItems((prev) => ({ ...prev, [id]: false }));
//       }
//     }
//   };

//   const updateItemDetail = (id, field, value) => {
//     // If clearing a value, mark that we should skip calculation temporarily
//     if (
//       value === "" &&
//       (field === "rate" || field === "quantity" || field === "amount")
//     ) {
//       setSkipCalculation((prev) => ({ ...prev, [id]: true }));

//       // Clear the skip after a short delay
//       setTimeout(() => {
//         setSkipCalculation((prev) => ({ ...prev, [id]: false }));
//       }, 100);
//     }

//     setItemDetails(
//       itemDetails.map((item) => {
//         if (item.id === id) {
//           const updatedItem = { ...item, [field]: value };

//           // If we're currently in skip calculation mode for this item, just update the field
//           if (
//             skipCalculation[id] &&
//             (field === "rate" || field === "quantity" || field === "amount")
//           ) {
//             return updatedItem;
//           }

//           // If any of the three main fields change, recalculate
//           // console.log("udated Item -- ", updatedItem)
//           if (field === "rate") {
//             const newAmount = Number(value) * Number(updatedItem.quantity || 0);

//             return {
//               ...updatedItem,
//               rate: value,
//               amount: Number(newAmount.toFixed(3)),
//             };
//           }
//           if (field === "amount") {
//             const newRate = Number(value) / Number(updatedItem.quantity);
//             return {
//               ...updatedItem,
//               rate: Number(newRate.toFixed(3)),
//               amount: value,
//             };
//           }
//           if (field === "quantity") {
//             const newAmount = Number(value) * Number(updatedItem.rate);
//             const newValue = Number(removeStartingZero(value));
//             // console.log("quantity $ -- ", newValue)
//             return {
//               ...updatedItem,
//               quantity: value,
//               amount: Number(newAmount.toFixed(3)),
//             };
//           }
//           // For GST rate changes (only for itemwise GST)
//           if (isItemWiseGST && field === "gstRate") {
//             const calculatedAmounts = calculateItemAmounts(updatedItem);
//             return {
//               ...updatedItem,
//               gstRate: value,
//               taxableAmount: calculatedAmounts.taxableAmount,
//               gstAmount: calculatedAmounts.gstAmount,
//               totalAmount: calculatedAmounts.totalAmount,
//             };
//           }

//           return updatedItem;
//         }
//         return item;
//       })
//     );
//   };

//   // Recalculate item amounts when GST type changes
//   useEffect(() => {
//     if (selectedGstType) {
//       setItemDetails(
//         itemDetails.map((item) => {
//           const calculatedAmounts = calculateItemAmounts(item);
//           return {
//             ...item,
//             taxableAmount: calculatedAmounts.taxableAmount,
//             gstAmount: calculatedAmounts.gstAmount,
//             totalAmount: calculatedAmounts.totalAmount,
//             gstRate: calculatedAmounts.gstRate,
//           };
//         })
//       );
//     }
//   }, [selectedGstType]);

//   const itemTotals = itemDetails.reduce(
//     (acc, item) => {
//       return {
//         amount: acc.amount + (parseFloat(item.amount) || 0),
//         taxableAmount:
//           acc.taxableAmount + (parseFloat(item.taxableAmount) || 0),
//         gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
//         totalAmount: acc.totalAmount + (parseFloat(item.totalAmount) || 0),
//       };
//     },
//     { amount: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 }
//   );

//   const otherChargesTotal = otherCharges.reduce((total, charge) => {
//     return total + (parseFloat(charge.amount) || 0);
//   }, 0);

//   const finalTotals = {
//     amount: itemTotals.amount,
//     taxableAmount: itemTotals.taxableAmount,
//     gstAmount: itemTotals.gstAmount,
//     otherCharges: otherChargesTotal,
//     totalAmount:
//       itemTotals.taxableAmount + itemTotals.gstAmount + otherChargesTotal,
//   };

//   const handleSubmit = async () => {

//     if (!selectedWarehouse) {
//       alert("Please select a warehouse");
//       return;
//     }
//     if (!selectedCompany) {
//       alert("Please select a company");
//       return;
//     }
//     if (!selectedVendor) {
//       alert("Please select a vendor");
//       return;
//     }
//     if (!selectedGstType) {
//       alert("Please select a GST type");
//       return;
//     }
//     if (
//       currency !== "INR" &&
//       (!exchangeRate || parseFloat(exchangeRate) <= 0)
//     ) {
//       alert("Please enter a valid exchange rate for non-INR currency");
//       return;
//     }

//     const invalidItems = itemDetails.filter(
//       (item) =>
//         !item.selectedItem || !item.hsnCode || !item.rate || !item.quantity
//     );

//     if (invalidItems.length > 0) {
//       alert("Please fill all required fields for all items");
//       return;
//     }

//     try {
//       const purchaseOrderData = {
//         companyId: selectedCompany,
//         vendorId: selectedVendor,
//         gstType: selectedGstType,
//         currency: currency,
//         exchangeRate: exchangeRate,
//         paymentTerms,
//         deliveryTerms,
//         warranty,
//         contactPerson,
//         cellNo,
//         warehouseId: selectedWarehouse,
//         items: itemDetails.map((item) => {
//           const selectedItemData = itemList.find(
//             (i) => i.id === item.selectedItem
//           );
//           const itemData = {
//             id: item.selectedItem,
//             name: selectedItemData?.name || "",
//             source: selectedItemData?.source || "",
//             hsnCode: item.hsnCode,
//             modelNumber: item.modelNumber,
//             itemDetail: item.itemDetail,
//             unit: item.selectedUnit,
//             quantity: item.quantity.toString(),
//             rate: item.rate.toString(),
//           };

//           // Only add gstRate for itemwise GST types
//           if (isItemWiseGST) {
//             itemData.gstRate = item.gstRate.toString();
//           }

//           return itemData;
//         }),
//         otherCharges: otherCharges.map((charge) => ({
//           name: charge.name,
//           amount: charge.amount.toString(),
//         })),
//       };

//       console.log("Purchase Order Data:", purchaseOrderData);

//       const response = await Api.post(
//         "/purchase/purchase-orders/create",
//         purchaseOrderData
//       );

//       if (response.data.success) {
//         alert("Purchase Order created successfully!");
//         handleReset();
//       } else {
//         alert("Error creating purchase order: " + response.data.message);
//       }
//     } catch (error) {
//       console.error("Error creating purchase order:", error);
//       alert(
//         "Error creating purchase order: " +
//           (error?.response?.data?.message || error?.message)
//       );
//     }
//   };

//   const handleReset = () => {
//     setSelectedCompany("");
//     setSelectedVendor("");
//     setSelectedGstType("");
//     setGstRate("");
//     setCurrency("INR");
//     setExchangeRate("1.00");
//     setSelectedWarehouse("");
//     setPaymentTerms("");
//     setDeliveryTerms("");
//     setWarranty("");
//     setContactPerson("");
//     setCellNo("");
//     setItemDetails([
//       {
//         id: 1,
//         selectedItem: "",
//         hsnCode: "",
//         modelNumber: "",
//         selectedUnit: "",
//         rate: "",
//         quantity: "",
//         gstRate: "",
//         amount: "",
//         taxableAmount: 0,
//         gstAmount: 0,
//         totalAmount: 0,
//         itemDetail: "",
//       },
//     ]);
//     setOtherCharges([
//       {
//         id: 1,
//         name: "",
//         amount: "",
//       },
//     ]);
//     setPendingReorderItems([]);
//     setSkipCalculation({});
//     setShowOtherCharges(false);
//     setLoadingItems({});
//   };

//   useEffect(() => {
//     fetchCompanies();
//     fetchVendors();
//     fetchItemList();
//     fetchWarehouses();
//   }, []);
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Loading Overlay for Reorder Processing */}
//         {processingReorder && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-700">Loading reorder data...</p>
//             </div>
//           </div>
//         )}

//         {/* Centered Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
//             {location.state?.reorderData
//               ? "ReOrder Purchase Order"
//               : "Create Purchase Order"}
//           </h1>
//           <p className="text-gray-600">
//             {location.state?.reorderData
//               ? "Review and modify the reorder details below"
//               : "Fill in the details below to create a new purchase order"}
//           </p>

//           {location.state?.reorderData && (
//             <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                 />
//               </svg>
//               Reorder Mode - All fields are editable
//             </div>
//           )}
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
//             Basic Information
//           </h2>

//           <div className="space-y-6">
//             {/* FIRST ROW */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Company *
//                 </label>
//                 <select
//                   value={selectedCompany}
//                   onChange={(e) => setSelectedCompany(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 >
//                   <option value="">-- Select Company --</option>
//                   {companies.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.companyName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Vendor *
//                 </label>
//                 <select
//                   value={selectedVendor}
//                   onChange={(e) => setSelectedVendor(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 >
//                   <option value="">-- Select Vendor --</option>
//                   {vendorsList.map((v) => (
//                     <option key={v.id} value={v.id}>
//                       {v.displayName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select GST Type *
//                 </label>
//                 <select
//                   value={selectedGstType}
//                   onChange={(e) => setSelectedGstType(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 >
//                   <option value="">-- Select GST Type --</option>
//                   {gstTypes.map((gst) => (
//                     <option key={gst.value} value={gst.value}>
//                       {gst.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Currency *
//                 </label>
//                 <select
//                   value={currency}
//                   onChange={(e) => setCurrency(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 >
//                   {currencyOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* SECOND ROW */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Exchange Rate{" "}
//                   {currency !== "INR" && `(1 ${currency} = ? INR)`}
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder={
//                     currency === "INR" ? "1.00 (Fixed)" : "Enter exchange rate"
//                   }
//                   step="0.01"
//                   min="0.01"
//                   disabled={currency === "INR"}
//                 />
//                 {currency === "INR" && (
//                   <p className="mt-1 text-sm text-gray-500">
//                     INR is base currency
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Warehouse *
//                 </label>
//                 <select
//                   value={selectedWarehouse}
//                   onChange={(e) => setSelectedWarehouse(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                 >
//                   <option value="">-- Select Warehouse --</option>
//                   {warehouseList.map((warehouse) => (
//                     <option key={warehouse.value} value={warehouse.value}>
//                       {warehouse.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Payment Terms
//                 </label>
//                 <input
//                   type="text"
//                   value={paymentTerms}
//                   onChange={(e) => setPaymentTerms(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="e.g., 60 Days Credit"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Delivery Terms
//                 </label>
//                 <input
//                   type="text"
//                   value={deliveryTerms}
//                   onChange={(e) => setDeliveryTerms(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="e.g., Immediate"
//                 />
//               </div>
//             </div>

//             {/* THIRD ROW */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Warranty
//                 </label>
//                 <input
//                   type="text"
//                   value={warranty}
//                   onChange={(e) => setWarranty(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="Enter warranty details"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Contact Person
//                 </label>
//                 <input
//                   type="text"
//                   value={contactPerson}
//                   onChange={(e) => setContactPerson(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="Enter contact person name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Contact Number
//                 </label>
//                 <input
//                   type="text"
//                   value={cellNo}
//                   onChange={(e) => setCellNo(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   placeholder="Enter contact number"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ITEM SECTION */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
//               Item Details
//             </h2>
//             <button
//               type="button"
//               className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
//               onClick={addItemDetail}
//             >
//               <svg
//                 className="w-5 h-5 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               Add Item
//             </button>
//           </div>

//           {/* GST Type Info */}
//           {selectedGstType && (
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center">
//                 <svg
//                   className="w-5 h-5 text-blue-600 mr-2"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="font-medium text-blue-800">
//                   Selected GST Type:
//                 </span>
//                 <span className="ml-2 text-blue-700">
//                   {gstTypes.find((gst) => gst.value === selectedGstType)?.label}
//                   {!isItemWiseGST && (
//                     <span className="ml-2 font-medium">
//                       (Rate: {getFixedGSTRate()}%)
//                     </span>
//                   )}
//                   {isItemWiseGST && (
//                     <span className="ml-2 font-medium">
//                       (Itemwise GST - Enter rate for each item)
//                     </span>
//                   )}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Currency Info */}
//           <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <div className="flex items-center">
//               <svg
//                 className="w-5 h-5 text-yellow-600 mr-2"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span className="font-medium text-yellow-800">Currency:</span>
//               <span className="ml-2 text-yellow-700">
//                 All amounts are in {currency} ({getCurrencySymbol(currency)})
//                 {currency !== "INR" && exchangeRate && (
//                   <span className="ml-2">
//                     (Exchange Rate: 1 {currency} ={" "}
//                     {parseFloat(exchangeRate).toFixed(3)} INR)
//                   </span>
//                 )}
//               </span>
//             </div>
//           </div>

//           {/* Item Details Cards */}
//           <div className="space-y-6">
//             {itemDetails.map((item, index) => (
//               <div
//                 key={item.id}
//                 className="border border-gray-200 rounded-xl overflow-hidden"
//               >
//                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     Item {index + 1}
//                   </h3>
//                   {itemDetails.length > 1 && (
//                     <button
//                       type="button"
//                       className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
//                       onClick={() => removeItemDetail(item.id)}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   {/* Item Selection Row */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Item *
//                         {loadingItems[item.id] && (
//                           <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                             <svg
//                               className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Loading...
//                           </span>
//                         )}
//                       </label>
//                       <select
//                         value={item.selectedItem}
//                         onChange={(e) =>
//                           handleItemSelect(item.id, e.target.value)
//                         }
//                         disabled={loadingItems[item.id]}
//                         className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
//                           loadingItems[item.id] ? "opacity-50" : ""
//                         }`}
//                       >
//                         <option value="">-- Choose Item --</option>
//                         {itemList.map((itemOption) => (
//                           <option key={itemOption.id} value={itemOption.id}>
//                             {itemOption.name}
//                             {itemOption.hsnCode &&
//                               ` (HSN: ${itemOption.hsnCode})`}
//                             {itemOption.rate &&
//                               ` - ${getCurrencySymbol(currency)}${parseFloat(
//                                 itemOption.rate
//                               ).toFixed(3)}`}
//                           </option>
//                         ))}
//                       </select>
//                       {!item.selectedItem &&
//                         location.state?.reorderData?.items?.[index] && (
//                           <p className="mt-1 text-sm text-gray-500">
//                             Original:{" "}
//                             {location.state.reorderData.items[index].itemName}
//                           </p>
//                         )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Unit
//                         {loadingItems[item.id] && (
//                           <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                             <svg
//                               className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               ></circle>
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               ></path>
//                             </svg>
//                             Loading...
//                           </span>
//                         )}
//                       </label>
//                       <select
//                         value={item.selectedUnit}
//                         onChange={(e) =>
//                           updateItemDetail(
//                             item.id,
//                             "selectedUnit",
//                             e.target.value
//                           )
//                         }
//                         disabled={loadingItems[item.id]}
//                         className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
//                           loadingItems[item.id] ? "opacity-50" : ""
//                         }`}
//                       >
//                         <option value="">-- Choose Unit --</option>
//                         {unitTypes.map((u) => (
//                           <option key={u.value} value={u.value}>
//                             {u.label}
//                           </option>
//                         ))}
//                       </select>
//                       {loadingItems[item.id] && (
//                         <p className="mt-1 text-xs text-blue-600">
//                           Fetching item details from database...
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* HSN and Model Number */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         HSN Code *
//                       </label>
//                       <input
//                         type="text"
//                         value={item.hsnCode}
//                         onChange={(e) =>
//                           updateItemDetail(item.id, "hsnCode", e.target.value)
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="Enter HSN code"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Model Number
//                       </label>
//                       <input
//                         type="text"
//                         value={item.modelNumber}
//                         onChange={(e) =>
//                           updateItemDetail(
//                             item.id,
//                             "modelNumber",
//                             e.target.value
//                           )
//                         }
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="Enter model number"
//                       />
//                     </div>
//                   </div>

//                   {/* Pricing Section */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Quantity
//                       </label>
//                       {/* <input
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) => updateItemDetail(item.id, 'quantity', e.target.value)}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="0"

//                       /> */}
//                       <input
//                         type="text"
//                         value={item.quantity}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           // allow only digits
//                           if (/^\d*\.?\d*$/.test(value)) {
//                             updateItemDetail(item.id, "quantity", value);
//                           }
//                         }}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="0"
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                       />

//                       <p className="mt-1 text-xs text-gray-500">
//                         Enter quantity in {item.selectedUnit || "unit"}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Rate
//                       </label>
//                       <input
//                         type="text"
//                         value={item.rate}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           // allow only digits
//                           if (/^\d*\.?\d*$/.test(value)) {
//                             updateItemDetail(item.id, "rate", value);
//                           }
//                         }}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="0"
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                         disabled={!item.quantity.toString().length >= 1}
//                       />
//                       <p className="mt-1 text-xs text-gray-500">
//                         Enter rate per unit
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Total Amount
//                       </label>
//                       <input
//                         type="text"
//                         value={item.amount}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           // allow only digits
//                           if (/^\d*\.?\d*$/.test(value)) {
//                             updateItemDetail(item.id, "amount", value);
//                           }
//                         }}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         placeholder="0"
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                         disabled={!item.quantity.toString().length >= 1}
//                       />
//                       <p className="mt-1 text-xs text-gray-500">
//                         Total without GST
//                       </p>
//                     </div>
//                   </div>

//                   {/* GST Rate Section - Only show for itemwise GST */}
//                   {isItemWiseGST && (
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             GST Rate (%) *
//                           </label>
//                           <input
//                             type="number"
//                             value={item.gstRate}
//                             onChange={(e) =>
//                               updateItemDetail(
//                                 item.id,
//                                 "gstRate",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                             placeholder="0.00"
//                             step="0.01"
//                             min="0"
//                             max="100"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Taxable Amount ({getCurrencySymbol(currency)})
//                           </label>
//                           <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
//                             {item.taxableAmount.toFixed(3)}
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             GST Amount ({getCurrencySymbol(currency)})
//                           </label>
//                           <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
//                             {item.gstAmount.toFixed(3)}
//                           </div>
//                         </div>
//                       </div>

//                       {item.gstRate && (
//                         <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
//                           <svg
//                             className="w-4 h-4 mr-1.5"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                           Item GST Rate: {item.gstRate}%
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Item Description */}
//                   <div className="mt-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Item Description
//                       {loadingItems[item.id] && (
//                         <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                           <svg
//                             className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Loading...
//                         </span>
//                       )}
//                     </label>
//                     <textarea
//                       value={item.itemDetail}
//                       onChange={(e) =>
//                         updateItemDetail(item.id, "itemDetail", e.target.value)
//                       }
//                       disabled={loadingItems[item.id]}
//                       className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
//                         loadingItems[item.id] ? "opacity-50" : ""
//                       }`}
//                       placeholder="Enter item specifications, description, and other details..."
//                       rows="3"
//                     />
//                     {loadingItems[item.id] && (
//                       <p className="mt-1 text-xs text-blue-600">
//                         Item description will be auto-filled from database if
//                         available
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* OTHER CHARGES SECTION - Collapsible */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
//             <div className="flex items-center space-x-4">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
//                 Other Charges
//               </h2>
//               <button
//                 type="button"
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium flex items-center"
//                 onClick={() => setShowOtherCharges(!showOtherCharges)}
//               >
//                 <svg
//                   className={`w-5 h-5 mr-2 transform transition-transform ${
//                     showOtherCharges ? "rotate-180" : ""
//                   }`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//                 {showOtherCharges ? "Hide Charges" : "Show Charges"}
//               </button>
//             </div>

//             {showOtherCharges && (
//               <button
//                 type="button"
//                 className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
//                 onClick={addOtherCharge}
//               >
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//                 Add Charge
//               </button>
//             )}
//           </div>

//           {showOtherCharges && (
//             <div className="space-y-6">
//               {otherCharges.map((charge, index) => (
//                 <div
//                   key={charge.id}
//                   className="border border-gray-200 rounded-xl overflow-hidden"
//                 >
//                   <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       Charge {index + 1}
//                     </h3>
//                     {otherCharges.length > 1 && (
//                       <button
//                         type="button"
//                         className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
//                         onClick={() => removeOtherCharge(charge.id)}
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </div>

//                   <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Charge Name *
//                         </label>
//                         <input
//                           type="text"
//                           value={charge.name}
//                           onChange={(e) =>
//                             updateOtherCharge(charge.id, "name", e.target.value)
//                           }
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                           placeholder="e.g., Freight, Loading, Packaging, etc."
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Amount ({getCurrencySymbol(currency)}) *
//                         </label>
//                         <input
//                           type="number"
//                           value={charge.amount}
//                           onChange={(e) =>
//                             updateOtherCharge(
//                               charge.id,
//                               "amount",
//                               e.target.value
//                             )
//                           }
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                           placeholder="0.00"
//                           step="0.01"
//                           min="0"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {!showOtherCharges && (
//             <div className="text-center py-8">
//               <svg
//                 className="w-16 h-16 text-gray-300 mx-auto mb-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <p className="text-gray-500 mb-4">No charges added yet</p>
//               <button
//                 type="button"
//                 className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center mx-auto"
//                 onClick={() => {
//                   setShowOtherCharges(true);
//                   addOtherCharge();
//                 }}
//               >
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//                 Add Charge
//               </button>
//             </div>
//           )}
//         </div>

//         {/* SUMMARY SECTION */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <div className="flex justify-between items-end">
//               <div>
//                 <p className="text-sm text-gray-600">
//                   Currency: <span className="font-medium">{currency}</span>
//                 </p>
//                 {currency !== "INR" && exchangeRate && (
//                   <p className="text-sm text-gray-600 mt-1">
//                     Exchange Rate:{" "}
//                     <span className="font-medium">
//                       1 {currency} = {parseFloat(exchangeRate).toFixed(2)} INR
//                     </span>
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Submit Buttons */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
//             <button
//               type="button"
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
//               onClick={handleReset}
//             >
//               Reset Form
//             </button>
//             <button
//               type="button"
//               className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleSubmit}
//               disabled={
//                 !selectedCompany ||
//                 !selectedVendor ||
//                 !selectedGstType ||
//                 (currency !== "INR" &&
//                   (!exchangeRate || parseFloat(exchangeRate) <= 0))
//               }
//             >
//               {location.state?.reorderData
//                 ? "Create ReOrder"
//                 : "Create Purchase Order"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePurchaseOrder;



import React, { useState, useEffect } from "react";
import Api from "../../auth/Api";
import { useLocation } from "react-router-dom";
import { removeStartingZero } from "../../utils/number/removeStartingZero";

const CreatePurchaseOrder = () => {
  const location = useLocation();

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [vendorsList, setVendorsList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");

  const [selectedGstType, setSelectedGstType] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("");
  const [warranty, setWarranty] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [cellNo, setCellNo] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState("1.00");
  const [gstRate, setGstRate] = useState("");
  const [itemList, setItemList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [itemDetails, setItemDetails] = useState([
    {
      id: 1,
      selectedItem: "",
      hsnCode: "",
      modelNumber: "",
      selectedUnit: "",
      rate: "",
      quantity: "",
      gstRate: "",
      amount: "",
      taxableAmount: 0,
      gstAmount: 0,
      totalAmount: 0,
      itemDetail: "",
    },
  ]);

  const [otherCharges, setOtherCharges] = useState([
    {
      id: 1,
      name: "",
      amount: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [processingReorder, setProcessingReorder] = useState(false);
  const [pendingReorderItems, setPendingReorderItems] = useState([]);
  const [isItemListLoaded, setIsItemListLoaded] = useState(false);
  const [skipCalculation, setSkipCalculation] = useState({});
  const [showOtherCharges, setShowOtherCharges] = useState(false);

  // Add state for tracking loading status for individual items
  const [loadingItems, setLoadingItems] = useState({});

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  // Make unitTypes state modifiable
  const [unitTypes, setUnitTypes] = useState([
    { value: "Nos", label: "Nos" },
    { value: "Pcs", label: "Pcs" },
    { value: "Mtr", label: "Mtr" },
    { value: "Kg", label: "Kg" },
    { value: "Box", label: "Box" },
    { value: "Set", label: "Set" },
    { value: "Roll", label: "Roll" },
    { value: "Ltr", label: "Ltr" },
  ]);

  const currencyOptions = [
    { value: "INR", label: "INR" },
    { value: "USD", label: "USD" },
    { value: "CNY", label: "CNY" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "AED", label: "AED" },
  ];

  const gstTypes = [
    { value: "IGST_5", label: "IGST 5%" },
    { value: "IGST_12", label: "IGST 12%" },
    { value: "IGST_18", label: "IGST 18%" },
    { value: "IGST_28", label: "IGST 28%" },
    { value: "IGST_EXEMPTED", label: "IGST Exempted" },
    { value: "LGST_5", label: "LGST 5%" },
    { value: "LGST_12", label: "LGST 12%" },
    { value: "LGST_18", label: "LGST 18%" },
    { value: "LGST_28", label: "LGST 28%" },
    { value: "LGST_EXEMPTED", label: "LGST Exempted" },
    { value: "IGST_ITEMWISE", label: "IGST Itemwise" },
    { value: "LGST_ITEMWISE", label: "LGST Itemwise" },
  ];

  const isItemWiseGST =
    selectedGstType === "IGST_ITEMWISE" || selectedGstType === "LGST_ITEMWISE";

  // Get currency symbol
  const getCurrencySymbol = (curr) => {
    const currency = currencyOptions.find((c) => c.value === curr);
    return currency ? currency.label.match(/\((.*?)\)/)?.[1] || "" : "₹";
  };

  // Extract GST rate from GST type (e.g., IGST_5 -> 5)
  const getFixedGSTRate = () => {
    if (selectedGstType.includes("EXEMPTED")) return 0;
    const rateMatch = selectedGstType.match(/(\d+)/);
    return rateMatch ? parseFloat(rateMatch[1]) : 0;
  };

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(itemList);
    } else {
      const filtered = itemList.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hsnCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, itemList]);

  // Initialize filtered items when itemList loads
  useEffect(() => {
    if (itemList.length > 0) {
      setFilteredItems(itemList);
    }
  }, [itemList]);

  // Add useEffect to handle adding custom units from API responses
  useEffect(() => {
    // Check if any items have units not in unitTypes
    const customUnits = itemDetails
      .map(item => item.selectedUnit)
      .filter(unit => 
        unit && 
        unit.trim() && 
        !unitTypes.some(u => u.value === unit)
      )
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

    if (customUnits.length > 0) {
      // Add custom units to unitTypes
      const newUnitTypes = [...unitTypes];
      let addedUnits = false;
      
      customUnits.forEach(unit => {
        if (!newUnitTypes.some(u => u.value === unit)) {
          newUnitTypes.push({ value: unit, label: unit });
          addedUnits = true;
        }
      });

      if (addedUnits) {
        setUnitTypes(newUnitTypes);
      }
    }
  }, [itemDetails]);

  // Helper function to check and log unit issues
  const checkUnitStatus = (item) => {
    if (item.selectedItem && !item.selectedUnit) {
      console.log(`Warning: Item ${item.selectedItem} has no unit set.`);
    }
  };

  // Call this function in useEffect to check unit status
  useEffect(() => {
    itemDetails.forEach(item => {
      if (item.selectedItem) {
        checkUnitStatus(item);
      }
    });
  }, [itemDetails]);

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

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/purchase/companies");
      setCompanies(response?.data?.data || []);
    } catch (error) {
      alert("Error: " + (error?.response?.data?.message || error?.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/purchase/vendors");
      setVendorsList(response?.data?.data || []);
    } catch (error) {
      alert("Error: " + (error?.response?.data?.message || error?.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchItemList = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/purchase/items");
      setItemList(response?.data?.items || []);
      setIsItemListLoaded(true);
    } catch (error) {
      alert("Error: " + (error?.response?.data?.message || error?.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle reorder data from ShowPurchaseOrder
  useEffect(() => {
    if (location.state?.reorderData) {
      const reorderData = location.state.reorderData;
      console.log("Received reorder data:", reorderData);

      // Set basic information
      setSelectedCompany(reorderData.companyId);
      setSelectedVendor(reorderData.vendorId);
      setSelectedGstType(reorderData.gstType);
      setCurrency(reorderData.currency || "INR");
      setExchangeRate(reorderData.exchangeRate || "1.00");
      setPaymentTerms(reorderData.paymentTerms || "");
      setDeliveryTerms(reorderData.deliveryTerms || "");
      setWarranty(reorderData.warranty || "");
      setContactPerson(reorderData.contactPerson || "");
      setCellNo(reorderData.cellNo || "");
      setSelectedWarehouse(reorderData.warehouseId || "");

      // Store items for processing after itemList is loaded
      if (reorderData.items && reorderData.items.length > 0) {
        setPendingReorderItems(reorderData.items);
      }

      // Set other charges
      if (reorderData.otherCharges && reorderData.otherCharges.length > 0) {
        const mappedCharges = reorderData.otherCharges.map((charge, index) => ({
          id: index + 1,
          name: charge.name || "",
          amount: charge.amount || "",
        }));
        setOtherCharges(mappedCharges);
      }
    }
  }, [location.state]);

  // Process reorder items when itemList is loaded
  useEffect(() => {
    if (pendingReorderItems.length > 0 && isItemListLoaded) {
      setProcessingReorder(true);

      const mappedItems = pendingReorderItems.map((item, index) => {
        // Try to find the item in itemList
        let foundItem = null;

        // First try by ID
        if (item.itemId || item.id) {
          foundItem = itemList.find(
            (i) => String(i.id) === String(item.itemId || item.id)
          );
        }

        // If not found by ID, try by name
        if (!foundItem && item.itemName) {
          foundItem = itemList.find(
            (i) =>
              i.name.toLowerCase().includes(item.itemName.toLowerCase()) ||
              (item.itemName &&
                i.name.toLowerCase() === item.itemName.toLowerCase())
          );
        }

        // Calculate amounts
        const rate = parseFloat(item.rate) || 0;
        const quantity = parseFloat(item.quantity) || 1;
        const total = rate * quantity;

        // For itemwise GST, use item's gstRate, otherwise use fixed rate from GST type
        let itemGstRate = 0;
        if (isItemWiseGST) {
          itemGstRate = parseFloat(item.gstRate) || 0;
        } else {
          itemGstRate = getFixedGSTRate();
        }

        const gstAmount = (total * itemGstRate) / 100;

        return {
          id: index + 1,
          selectedItem: foundItem?.id || "",
          hsnCode: foundItem?.hsnCode || item.hsnCode || "",
          modelNumber: foundItem?.modelNumber || item.modelNumber || "",
          selectedUnit: foundItem?.unit || item.unit || "Nos",
          rate: rate.toString(),
          quantity: quantity.toString(),
          gstRate: itemGstRate.toString(),
          amount: total.toString(),
          taxableAmount: total,
          gstAmount: gstAmount,
          totalAmount: total + gstAmount,
          itemDetail: foundItem?.itemDetail || item.itemDetail || "",
        };
      });

      setItemDetails(mappedItems);
      setPendingReorderItems([]);

      // Show success message
      setTimeout(() => {
        setProcessingReorder(false);
        console.log("Reorder items processed:", mappedItems);
      }, 500);
    }
  }, [isItemListLoaded, pendingReorderItems, selectedGstType, itemList]);

  // Reset exchange rate when currency changes
  useEffect(() => {
    if (currency === "INR") {
      setExchangeRate("1.00");
    } else {
      setExchangeRate("");
    }
  }, [currency]);

  const addItemDetail = () => {
    const newId = itemDetails.length + 1;
    setItemDetails([
      ...itemDetails,
      {
        id: newId,
        selectedItem: "",
        hsnCode: "",
        modelNumber: "",
        selectedUnit: "",
        rate: "",
        quantity: "",
        gstRate: "",
        amount: "",
        taxableAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        itemDetail: "",
      },
    ]);
  };

  const removeItemDetail = (id) => {
    if (itemDetails.length > 1) {
      setItemDetails(itemDetails.filter((item) => item.id !== id));
      // Remove loading state for removed item
      setLoadingItems((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const addOtherCharge = () => {
    const newId = otherCharges.length + 1;
    setOtherCharges([
      ...otherCharges,
      {
        id: newId,
        name: "",
        amount: "",
      },
    ]);
  };

  const removeOtherCharge = (id) => {
    if (otherCharges.length > 1) {
      setOtherCharges(otherCharges.filter((charge) => charge.id !== id));
    }
  };

  const updateOtherCharge = (id, field, value) => {
    setOtherCharges(
      otherCharges.map((charge) => {
        if (charge.id === id) {
          return { ...charge, [field]: value };
        }
        return charge;
      })
    );
  };

  // Calculate missing value among rate, quantity, and amount
  const calculateMissingValue = (rate, quantity, amount) => {
    const r = rate === "" ? 0 : parseFloat(rate) || 0;
    const q = quantity === "" ? 0 : parseFloat(quantity) || 0;
    const a = amount === "" ? 0 : parseFloat(amount) || 0;

    // Count how many valid (non-empty) values we have
    const rateValid = rate !== "" && !isNaN(r) && r > 0;
    const quantityValid = quantity !== "" && !isNaN(q) && q > 0;
    const amountValid = amount !== "" && !isNaN(a) && a > 0;

    const validCount = [rateValid, quantityValid, amountValid].filter(
      Boolean
    ).length;

    // Only calculate if we have exactly 2 valid values
    if (validCount === 2) {
      if (rateValid && quantityValid && !amountValid) {
        // Calculate amount from rate and quantity
        return { amount: r * q, rate: r, quantity: q };
      } else if (rateValid && amountValid && !quantityValid) {
        // Calculate quantity from rate and amount
        return { amount: a, rate: r, quantity: a / r };
      } else if (quantityValid && amountValid && !rateValid) {
        // Calculate rate from quantity and amount
        return { amount: a, rate: a / q, quantity: q };
      }
    }

    // If all three are valid, recalculate amount for consistency
    if (validCount === 3) {
      return { amount: r * q, rate: r, quantity: q };
    }

    // Otherwise, return as-is (allowing partial inputs)
    return { amount: a, rate: r, quantity: q };
  };

  const calculateItemAmounts = (item) => {
    const rate = item.rate || 0;
    const quantity = item.quantity || 0;
    const amount = item.amount || 0;

    // Calculate missing values
    const calculated = calculateMissingValue(rate, quantity, amount);

    const total = calculated.amount;

    let gstRate = 0;

    if (isItemWiseGST) {
      gstRate = parseFloat(item.gstRate) || 0;
    } else {
      gstRate = getFixedGSTRate();
    }

    const taxableAmount = total;
    const gstAmount = (taxableAmount * gstRate) / 100;
    const finalTotalAmount = taxableAmount + gstAmount;

    return {
      amount: total,
      rate: calculated.rate,
      quantity: calculated.quantity,
      taxableAmount,
      gstAmount,
      totalAmount: finalTotalAmount,
      gstRate: gstRate.toString(),
    };
  };

  // Updated handleItemSelect with proper API unit handling for empty strings
  const handleItemSelect = async (id, itemId) => {
    if (!itemId) {
      // If item is cleared, reset the fields
      setItemDetails(
        itemDetails.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              selectedItem: "",
              hsnCode: "",
              modelNumber: "",
              selectedUnit: "",
              rate: "",
              itemDetail: "",
            };
          }
          return item;
        })
      );

      // Clear loading state
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
      return;
    }

    const selectedItemData = itemList.find((item) => item.id === itemId);
    if (selectedItemData) {
      // Set loading state for this specific item
      setLoadingItems((prev) => ({ ...prev, [id]: true }));

      try {
        // First, update with basic information from itemList
        let updatedItemDetails = itemDetails.map((item) => {
          if (item.id === id) {
            const updatedItem = {
              ...item,
              selectedItem: itemId,
              hsnCode: selectedItemData.hsnCode || item.hsnCode,
              modelNumber: selectedItemData.modelNumber || item.modelNumber,
              selectedUnit: selectedItemData.unit || item.selectedUnit,
              rate: selectedItemData.rate || item.rate,
              itemDetail: selectedItemData.itemDetail || item.itemDetail,
            };

            const calculatedAmounts = calculateItemAmounts(updatedItem);
            return {
              ...updatedItem,
              rate: calculatedAmounts.rate.toString(),
              quantity: calculatedAmounts.quantity.toString(),
              amount: calculatedAmounts.amount.toString(),
              taxableAmount: calculatedAmounts.taxableAmount,
              gstAmount: calculatedAmounts.gstAmount,
              totalAmount: calculatedAmounts.totalAmount,
            };
          }
          return item;
        });

        setItemDetails(updatedItemDetails);

        // Fetch detailed item information from the API
        try {
          const response = await Api.get(`/purchase/items/details/${itemId}`);

          if (response.data.success) {
            const detailedItem = response.data.item;

            // Update item with detailed information from API
            setItemDetails((prevItemDetails) =>
              prevItemDetails.map((item) => {
                if (item.id === id) {
                  // Use API's unit if available and not empty, otherwise keep existing
                  const apiUnit = detailedItem.unit;
                  const newUnit = apiUnit !== undefined && apiUnit !== null && apiUnit.toString().trim() !== "" 
                    ? apiUnit.toString().trim() 
                    : item.selectedUnit;
                  
                  // Use API's description if available and not empty, otherwise keep existing
                  const apiDescription = detailedItem.description;
                  const newDescription = apiDescription !== undefined && apiDescription !== null && apiDescription.toString().trim() !== ""
                    ? apiDescription.toString().trim()
                    : item.itemDetail;

                  console.log(`API Response for item ${itemId}:`, {
                    source: response.data.source,
                    apiUnit,
                    apiDescription,
                    newUnit,
                    newDescription
                  });

                  const updatedItem = {
                    ...item,
                    selectedUnit: newUnit,
                    itemDetail: newDescription,
                  };

                  // Recalculate amounts if needed
                  const calculatedAmounts = calculateItemAmounts(updatedItem);
                  
                  return {
                    ...updatedItem,
                    rate: calculatedAmounts.rate.toString(),
                    quantity: calculatedAmounts.quantity.toString(),
                    amount: calculatedAmounts.amount.toString(),
                    taxableAmount: calculatedAmounts.taxableAmount,
                    gstAmount: calculatedAmounts.gstAmount,
                    totalAmount: calculatedAmounts.totalAmount,
                  };
                }
                return item;
              })
            );

            // Show notification if data was fetched from API
            console.log(
              `Item ${id}: Loaded from ${response.data.source} - unit="${detailedItem.unit}", description="${detailedItem.description}"`
            );
          }
        } catch (apiError) {
          console.error("Error fetching item details:", apiError);
          // Continue with itemList data if API fails
        }
      } catch (error) {
        console.error("Error in handleItemSelect:", error);
      } finally {
        // Clear loading state
        setLoadingItems((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  const updateItemDetail = (id, field, value) => {
    // If clearing a value, mark that we should skip calculation temporarily
    if (
      value === "" &&
      (field === "rate" || field === "quantity" || field === "amount")
    ) {
      setSkipCalculation((prev) => ({ ...prev, [id]: true }));

      // Clear the skip after a short delay
      setTimeout(() => {
        setSkipCalculation((prev) => ({ ...prev, [id]: false }));
      }, 100);
    }

    setItemDetails(
      itemDetails.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // If we're currently in skip calculation mode for this item, just update the field
          if (
            skipCalculation[id] &&
            (field === "rate" || field === "quantity" || field === "amount")
          ) {
            return updatedItem;
          }

          // If any of the three main fields change, recalculate
          // console.log("udated Item -- ", updatedItem)
          if (field === "rate") {
            const newAmount = Number(value) * Number(updatedItem.quantity || 0);

            return {
              ...updatedItem,
              rate: value,
              amount: Number(newAmount.toFixed(3)),
            };
          }
          if (field === "amount") {
            const newRate = Number(value) / Number(updatedItem.quantity);
            return {
              ...updatedItem,
              rate: Number(newRate.toFixed(3)),
              amount: value,
            };
          }
          if (field === "quantity") {
            const newAmount = Number(value) * Number(updatedItem.rate);
            const newValue = Number(removeStartingZero(value));
            // console.log("quantity $ -- ", newValue)
            return {
              ...updatedItem,
              quantity: value,
              amount: Number(newAmount.toFixed(3)),
            };
          }
          // For GST rate changes (only for itemwise GST)
          if (isItemWiseGST && field === "gstRate") {
            const calculatedAmounts = calculateItemAmounts(updatedItem);
            return {
              ...updatedItem,
              gstRate: value,
              taxableAmount: calculatedAmounts.taxableAmount,
              gstAmount: calculatedAmounts.gstAmount,
              totalAmount: calculatedAmounts.totalAmount,
            };
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Recalculate item amounts when GST type changes
  useEffect(() => {
    if (selectedGstType) {
      setItemDetails(
        itemDetails.map((item) => {
          const calculatedAmounts = calculateItemAmounts(item);
          return {
            ...item,
            taxableAmount: calculatedAmounts.taxableAmount,
            gstAmount: calculatedAmounts.gstAmount,
            totalAmount: calculatedAmounts.totalAmount,
            gstRate: calculatedAmounts.gstRate,
          };
        })
      );
    }
  }, [selectedGstType]);

  const itemTotals = itemDetails.reduce(
    (acc, item) => {
      return {
        amount: acc.amount + (parseFloat(item.amount) || 0),
        taxableAmount:
          acc.taxableAmount + (parseFloat(item.taxableAmount) || 0),
        gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
        totalAmount: acc.totalAmount + (parseFloat(item.totalAmount) || 0),
      };
    },
    { amount: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 }
  );

  const otherChargesTotal = otherCharges.reduce((total, charge) => {
    return total + (parseFloat(charge.amount) || 0);
  }, 0);

  const finalTotals = {
    amount: itemTotals.amount,
    taxableAmount: itemTotals.taxableAmount,
    gstAmount: itemTotals.gstAmount,
    otherCharges: otherChargesTotal,
    totalAmount:
      itemTotals.taxableAmount + itemTotals.gstAmount + otherChargesTotal,
  };

  const handleSubmit = async () => {

    if (!selectedWarehouse) {
      alert("Please select a warehouse");
      return;
    }
    if (!selectedCompany) {
      alert("Please select a company");
      return;
    }
    if (!selectedVendor) {
      alert("Please select a vendor");
      return;
    }
    if (!selectedGstType) {
      alert("Please select a GST type");
      return;
    }
    if (
      currency !== "INR" &&
      (!exchangeRate || parseFloat(exchangeRate) <= 0)
    ) {
      alert("Please enter a valid exchange rate for non-INR currency");
      return;
    }

    const invalidItems = itemDetails.filter(
      (item) =>
        !item.selectedItem || !item.hsnCode || !item.rate || !item.quantity
    );

    if (invalidItems.length > 0) {
      alert("Please fill all required fields for all items");
      return;
    }

    try {
      const purchaseOrderData = {
        companyId: selectedCompany,
        vendorId: selectedVendor,
        gstType: selectedGstType,
        currency: currency,
        exchangeRate: exchangeRate,
        paymentTerms,
        deliveryTerms,
        warranty,
        contactPerson,
        cellNo,
        warehouseId: selectedWarehouse,
        items: itemDetails.map((item) => {
          const selectedItemData = itemList.find(
            (i) => i.id === item.selectedItem
          );
          const itemData = {
            id: item.selectedItem,
            name: selectedItemData?.name || "",
            source: selectedItemData?.source || "",
            hsnCode: item.hsnCode,
            modelNumber: item.modelNumber,
            itemDetail: item.itemDetail,
            unit: item.selectedUnit,
            quantity: item.quantity.toString(),
            rate: item.rate.toString(),
          };

          // Only add gstRate for itemwise GST types
          if (isItemWiseGST) {
            itemData.gstRate = item.gstRate.toString();
          }

          return itemData;
        }),
        otherCharges: otherCharges.map((charge) => ({
          name: charge.name,
          amount: charge.amount.toString(),
        })),
      };

      console.log("Purchase Order Data:", purchaseOrderData);

      const response = await Api.post(
        "/purchase/purchase-orders/create",
        purchaseOrderData
      );

      if (response.data.success) {
        alert("Purchase Order created successfully!");
        handleReset();
      } else {
        alert("Error creating purchase order: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating purchase order:", error);
      alert(
        "Error creating purchase order: " +
          (error?.response?.data?.message || error?.message)
      );
    }
  };

  const handleReset = () => {
    setSelectedCompany("");
    setSelectedVendor("");
    setSelectedGstType("");
    setGstRate("");
    setCurrency("INR");
    setExchangeRate("1.00");
    setSelectedWarehouse("");
    setPaymentTerms("");
    setDeliveryTerms("");
    setWarranty("");
    setContactPerson("");
    setCellNo("");
    setItemDetails([
      {
        id: 1,
        selectedItem: "",
        hsnCode: "",
        modelNumber: "",
        selectedUnit: "",
        rate: "",
        quantity: "",
        gstRate: "",
        amount: "",
        taxableAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        itemDetail: "",
      },
    ]);
    setOtherCharges([
      {
        id: 1,
        name: "",
        amount: "",
      },
    ]);
    setPendingReorderItems([]);
    setSkipCalculation({});
    setShowOtherCharges(false);
    setLoadingItems({});
    setSearchTerm("");
    setFilteredItems([]);
  };

  useEffect(() => {
    fetchCompanies();
    fetchVendors();
    fetchItemList();
    fetchWarehouses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Loading Overlay for Reorder Processing */}
        {processingReorder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Loading reorder data...</p>
            </div>
          </div>
        )}

        {/* Centered Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {location.state?.reorderData
              ? "ReOrder Purchase Order"
              : "Create Purchase Order"}
          </h1>
          <p className="text-gray-600">
            {location.state?.reorderData
              ? "Review and modify the reorder details below"
              : "Fill in the details below to create a new purchase order"}
          </p>

          {location.state?.reorderData && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reorder Mode - All fields are editable
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            Basic Information
          </h2>

          <div className="space-y-6">
            {/* FIRST ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Company *
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">-- Select Company --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Vendor *
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">-- Select Vendor --</option>
                  {vendorsList.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select GST Type *
                </label>
                <select
                  value={selectedGstType}
                  onChange={(e) => setSelectedGstType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">-- Select GST Type --</option>
                  {gstTypes.map((gst) => (
                    <option key={gst.value} value={gst.value}>
                      {gst.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {currencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECOND ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exchange Rate{" "}
                  {currency !== "INR" && `(1 ${currency} = ? INR)`}
                </label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder={
                    currency === "INR" ? "1.00 (Fixed)" : "Enter exchange rate"
                  }
                  step="0.01"
                  min="0.01"
                  disabled={currency === "INR"}
                />
                {currency === "INR" && (
                  <p className="mt-1 text-sm text-gray-500">
                    INR is base currency
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Warehouse *
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">-- Select Warehouse --</option>
                  {warehouseList.map((warehouse) => (
                    <option key={warehouse.value} value={warehouse.value}>
                      {warehouse.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="e.g., 60 Days Credit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Terms
                </label>
                <input
                  type="text"
                  value={deliveryTerms}
                  onChange={(e) => setDeliveryTerms(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="e.g., Immediate"
                />
              </div>
            </div>

            {/* THIRD ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter warranty details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={cellNo}
                  onChange={(e) => setCellNo(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ITEM SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Item Details
            </h2>
            <button
              type="button"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
              onClick={addItemDetail}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Item
            </button>
          </div>

          {/* GST Type Info */}
          {selectedGstType && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-blue-800">
                  Selected GST Type:
                </span>
                <span className="ml-2 text-blue-700">
                  {gstTypes.find((gst) => gst.value === selectedGstType)?.label}
                  {!isItemWiseGST && (
                    <span className="ml-2 font-medium">
                      (Rate: {getFixedGSTRate()}%)
                    </span>
                  )}
                  {isItemWiseGST && (
                    <span className="ml-2 font-medium">
                      (Itemwise GST - Enter rate for each item)
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Currency Info */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-yellow-800">Currency:</span>
              <span className="ml-2 text-yellow-700">
                All amounts are in {currency} ({getCurrencySymbol(currency)})
                {currency !== "INR" && exchangeRate && (
                  <span className="ml-2">
                    (Exchange Rate: 1 {currency} ={" "}
                    {parseFloat(exchangeRate).toFixed(3)} INR)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Item Details Cards */}
          <div className="space-y-6">
            {itemDetails.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Item {index + 1}
                  </h3>
                  {itemDetails.length > 1 && (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                      onClick={() => removeItemDetail(item.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {/* Item Selection Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Item *
                        {loadingItems[item.id] && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <svg
                              className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Loading...
                          </span>
                        )}
                      </label>
                      
                      {/* Search Bar for Items */}
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Search items by name, HSN or model number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {filteredItems.length} items found
                            {searchTerm && (
                              <span className="ml-2">
                                for: "{searchTerm}"
                              </span>
                            )}
                          </span>
                          {searchTerm && (
                            <button
                              type="button"
                              onClick={() => setSearchTerm("")}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      </div>

                      <select
                        value={item.selectedItem}
                        onChange={(e) =>
                          handleItemSelect(item.id, e.target.value)
                        }
                        disabled={loadingItems[item.id]}
                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          loadingItems[item.id] ? "opacity-50" : ""
                        }`}
                      >
                        <option value="">-- Choose Item --</option>
                        {filteredItems.map((itemOption) => (
                          <option key={itemOption.id} value={itemOption.id}>
                            {itemOption.name}
                            {itemOption.hsnCode &&
                              ` (HSN: ${itemOption.hsnCode})`}
                            {itemOption.modelNumber &&
                              ` (Model: ${itemOption.modelNumber})`}
                            {itemOption.rate &&
                              ` - ${getCurrencySymbol(currency)}${parseFloat(
                                itemOption.rate
                              ).toFixed(3)}`}
                          </option>
                        ))}
                      </select>
                      
                      {filteredItems.length === 0 && searchTerm && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600">
                            No items found matching "{searchTerm}"
                          </p>
                          <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            Show all items
                          </button>
                        </div>
                      )}
                      
                      {!item.selectedItem &&
                        location.state?.reorderData?.items?.[index] && (
                          <p className="mt-1 text-sm text-gray-500">
                            Original:{" "}
                            {location.state.reorderData.items[index].itemName}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Unit
                        {loadingItems[item.id] && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <svg
                              className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Loading...
                          </span>
                        )}
                      </label>
                      <select
                        value={item.selectedUnit}
                        onChange={(e) =>
                          updateItemDetail(
                            item.id,
                            "selectedUnit",
                            e.target.value
                          )
                        }
                        disabled={loadingItems[item.id]}
                        className={`w-full px-4 py-2.5 border ${item.selectedItem && !item.selectedUnit ? 'border-orange-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          loadingItems[item.id] ? "opacity-50" : ""
                        }`}
                      >
                        <option value="">-- Choose Unit --</option>
                        {unitTypes.map((u) => (
                          <option key={u.value} value={u.value}>
                            {u.label}
                          </option>
                        ))}
                      </select>
                      {item.selectedUnit ? (
                        <p className="mt-1 text-xs text-green-600">
                          Current unit: {item.selectedUnit}
                        </p>
                      ) : item.selectedItem && !loadingItems[item.id] ? (
                        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                          <p className="text-xs text-orange-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            No unit available for this item. Please select a unit manually.
                          </p>
                        </div>
                      ) : null}
                      {loadingItems[item.id] && (
                        <p className="mt-1 text-xs text-blue-600">
                          Fetching item details from database...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* HSN and Model Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        HSN Code *
                      </label>
                      <input
                        type="text"
                        value={item.hsnCode}
                        onChange={(e) =>
                          updateItemDetail(item.id, "hsnCode", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Enter HSN code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Number
                      </label>
                      <input
                        type="text"
                        value={item.modelNumber}
                        onChange={(e) =>
                          updateItemDetail(
                            item.id,
                            "modelNumber",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Enter model number"
                      />
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          // allow only digits
                          if (/^\d*\.?\d*$/.test(value)) {
                            updateItemDetail(item.id, "quantity", value);
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        Enter quantity in {item.selectedUnit || "unit"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate
                      </label>
                      <input
                        type="text"
                        value={item.rate}
                        onChange={(e) => {
                          const value = e.target.value;
                          // allow only digits
                          if (/^\d*\.?\d*$/.test(value)) {
                            updateItemDetail(item.id, "rate", value);
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={!item.quantity.toString().length >= 1}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter rate per unit
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount
                      </label>
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          // allow only digits
                          if (/^\d*\.?\d*$/.test(value)) {
                            updateItemDetail(item.id, "amount", value);
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={!item.quantity.toString().length >= 1}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Total without GST
                      </p>
                    </div>
                  </div>

                  {/* GST Rate Section - Only show for itemwise GST */}
                  {isItemWiseGST && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GST Rate (%) *
                          </label>
                          <input
                            type="number"
                            value={item.gstRate}
                            onChange={(e) =>
                              updateItemDetail(
                                item.id,
                                "gstRate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            max="100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Taxable Amount ({getCurrencySymbol(currency)})
                          </label>
                          <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
                            {item.taxableAmount.toFixed(3)}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GST Amount ({getCurrencySymbol(currency)})
                          </label>
                          <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
                            {item.gstAmount.toFixed(3)}
                          </div>
                        </div>
                      </div>

                      {item.gstRate && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          <svg
                            className="w-4 h-4 mr-1.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Item GST Rate: {item.gstRate}%
                        </div>
                      )}
                    </div>
                  )}

                  {/* Item Description */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Description
                      {loadingItems[item.id] && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          <svg
                            className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </span>
                      )}
                    </label>
                    <textarea
                      value={item.itemDetail}
                      onChange={(e) =>
                        updateItemDetail(item.id, "itemDetail", e.target.value)
                      }
                      disabled={loadingItems[item.id]}
                      className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        loadingItems[item.id] ? "opacity-50" : ""
                      }`}
                      placeholder="Enter item specifications, description, and other details..."
                      rows="3"
                    />
                    {loadingItems[item.id] && (
                      <p className="mt-1 text-xs text-blue-600">
                        Item description will be auto-filled from database if
                        available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OTHER CHARGES SECTION - Collapsible */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
                Other Charges
              </h2>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium flex items-center"
                onClick={() => setShowOtherCharges(!showOtherCharges)}
              >
                <svg
                  className={`w-5 h-5 mr-2 transform transition-transform ${
                    showOtherCharges ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {showOtherCharges ? "Hide Charges" : "Show Charges"}
              </button>
            </div>

            {showOtherCharges && (
              <button
                type="button"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
                onClick={addOtherCharge}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Charge
              </button>
            )}
          </div>

          {showOtherCharges && (
            <div className="space-y-6">
              {otherCharges.map((charge, index) => (
                <div
                  key={charge.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Charge {index + 1}
                    </h3>
                    {otherCharges.length > 1 && (
                      <button
                        type="button"
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                        onClick={() => removeOtherCharge(charge.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Charge Name *
                        </label>
                        <input
                          type="text"
                          value={charge.name}
                          onChange={(e) =>
                            updateOtherCharge(charge.id, "name", e.target.value)
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="e.g., Freight, Loading, Packaging, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount ({getCurrencySymbol(currency)}) *
                        </label>
                        <input
                          type="number"
                          value={charge.amount}
                          onChange={(e) =>
                            updateOtherCharge(
                              charge.id,
                              "amount",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showOtherCharges && (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 mb-4">No charges added yet</p>
              <button
                type="button"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center mx-auto"
                onClick={() => {
                  setShowOtherCharges(true);
                  addOtherCharge();
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Charge
              </button>
            </div>
          )}
        </div>

        {/* SUMMARY SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-600">
                  Currency: <span className="font-medium">{currency}</span>
                </p>
                {currency !== "INR" && exchangeRate && (
                  <p className="text-sm text-gray-600 mt-1">
                    Exchange Rate:{" "}
                    <span className="font-medium">
                      1 {currency} = {parseFloat(exchangeRate).toFixed(2)} INR
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              onClick={handleReset}
            >
              Reset Form
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={
                !selectedCompany ||
                !selectedVendor ||
                !selectedGstType ||
                (currency !== "INR" &&
                  (!exchangeRate || parseFloat(exchangeRate) <= 0))
              }
            >
              {location.state?.reorderData
                ? "Create ReOrder"
                : "Create Purchase Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;