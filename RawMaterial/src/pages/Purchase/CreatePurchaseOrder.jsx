// import React, { useState, useEffect } from "react";
// import Api from "../../auth/Api";
// import "./CSS/CreatePurchaseOrder.css";

// const CreatePurchaseOrder = () => {
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [vendorsList, setVendorsList] = useState([]);
//   const [selectedVendor, setSelectedVendor] = useState("");

//   const [selectedGstType, setSelectedGstType] = useState("");
//   const [paymentTerms, setPaymentTerms] = useState("");
//   const [deliveryTerms, setDeliveryTerms] = useState("");
//   const [warranty, setWarranty] = useState("");
//   const [contactPerson, setContactPerson] = useState("");
//   const [cellNo, setCellNo] = useState("");
//   // const [remarks, setRemarks] = useState("");

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
//       itemGSTType: null,
//       itemDetail: ""
//     }
//   ]);

//   // New state for other charges
//   const [otherCharges, setOtherCharges] = useState([
//     {
//       id: 1,
//       name: "",
//       amount: ""
//     }
//   ]);

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

//   // Check if itemwise GST is selected
//   const isItemWiseGST = selectedGstType === "IGST_ITEMWISE" || selectedGstType === "LGST_ITEMWISE";

//   // Get fixed GST rate from selected GST type
//   const getFixedGSTRate = () => {
//     if (selectedGstType.includes("EXEMPTED")) return 0;
//     const rateMatch = selectedGstType.match(/(\d+)/);
//     return rateMatch ? parseFloat(rateMatch[1]) : 0;
//   };

//   // Get GST type prefix (IGST or LGST)
//   const getGSTTypePrefix = () => {
//     if (selectedGstType.startsWith('IGST')) return 'IGST';
//     if (selectedGstType.startsWith('LGST')) return 'LGST';
//     return null;
//   };

//   // Fetch API Calls
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
//     } catch (error) {
//       alert("Error: " + (error?.response?.data?.message || error?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add new item detail row
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
//         itemGSTType: null,
//         itemDetail: ""
//       }
//     ]);
//   };

//   // Remove item detail row
//   const removeItemDetail = (id) => {
//     if (itemDetails.length > 1) {
//       setItemDetails(itemDetails.filter(item => item.id !== id));
//     }
//   };

//   // Add new other charge row
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

//   // Remove other charge row
//   const removeOtherCharge = (id) => {
//     if (otherCharges.length > 1) {
//       setOtherCharges(otherCharges.filter(charge => charge.id !== id));
//     }
//   };

//   // Update other charge
//   const updateOtherCharge = (id, field, value) => {
//     setOtherCharges(otherCharges.map(charge => {
//       if (charge.id === id) {
//         return { ...charge, [field]: value };
//       }
//       return charge;
//     }));
//   };

//   // Calculate amounts for an item
//   const calculateItemAmounts = (item) => {
//     const rate = parseFloat(item.rate) || 0;
//     const quantity = parseFloat(item.quantity) || 0;
    
//     // Calculate total amount (rate * quantity) - WITHOUT GST
//     const total = rate * quantity;
    
//     let gstRate = 0;
//     let itemGSTType = null;

//     if (isItemWiseGST) {
//       // For itemwise GST, use the individual item's GST rate
//       gstRate = parseFloat(item.gstRate) || 0;
//       itemGSTType = getGSTTypePrefix();
//     } else {
//       // For fixed GST, use the main GST type rate
//       gstRate = getFixedGSTRate();
//     }

//     const taxableAmount = total;
//     const gstAmount = (taxableAmount * gstRate) / 100;
//     const finalTotalAmount = taxableAmount + gstAmount;
    
//     return {
//       amount: total,
//       taxableAmount,
//       gstAmount,
//       totalAmount: total, // Changed from finalTotalAmount to total - shows base amount only without GST
//       itemGSTType: isItemWiseGST ? itemGSTType : null
//     };
//   };

//   // Update item detail
//   const updateItemDetail = (id, field, value) => {
//     setItemDetails(itemDetails.map(item => {
//       if (item.id === id) {
//         const updatedItem = { ...item, [field]: value };
        
//         // Recalculate all amounts when rate, quantity, or GST rate changes
//         if (field === 'rate' || field === 'quantity' || (isItemWiseGST && field === 'gstRate')) {
//           const calculatedAmounts = calculateItemAmounts(updatedItem);
//           return { ...updatedItem, ...calculatedAmounts };
//         }
        
//         return updatedItem;
//       }
//       return item;
//     }));
//   };

//   // Auto-fill item details when item is selected
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

//   // Recalculate all items when GST type changes
//   useEffect(() => {
//     if (selectedGstType) {
//       setItemDetails(itemDetails.map(item => {
//         const calculatedAmounts = calculateItemAmounts(item);
//         return { ...item, ...calculatedAmounts };
//       }));
//     }
//   }, [selectedGstType]);

//   // Calculate item totals
//   const itemTotals = itemDetails.reduce((acc, item) => {
//     return {
//       amount: acc.amount + (parseFloat(item.amount) || 0),
//       taxableAmount: acc.taxableAmount + (parseFloat(item.taxableAmount) || 0),
//       gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
//       totalAmount: acc.totalAmount + (parseFloat(item.totalAmount) || 0)
//     };
//   }, { amount: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 });

//   // Calculate other charges total
//   const otherChargesTotal = otherCharges.reduce((total, charge) => {
//     return total + (parseFloat(charge.amount) || 0);
//   }, 0);

//   // Calculate final totals including other charges
//   const finalTotals = {
//     amount: itemTotals.amount,
//     taxableAmount: itemTotals.taxableAmount,
//     gstAmount: itemTotals.gstAmount,
//     otherCharges: otherChargesTotal,
//     totalAmount: itemTotals.taxableAmount + itemTotals.gstAmount + otherChargesTotal
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     // Basic validation
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

//     // Validate item details
//     const invalidItems = itemDetails.filter(item => 
//       !item.selectedItem || !item.hsnCode || !item.rate || !item.quantity
//     );

//     if (invalidItems.length > 0) {
//       alert("Please fill all required fields for all items");
//       return;
//     }

//     // Validate other charges
//     const invalidCharges = otherCharges.filter(charge => 
//       !charge.name || !charge.amount
//     );

//     if (invalidCharges.length > 0) {
//       alert("Please fill all fields for other charges");
//       return;
//     }

//     try {
//       const purchaseOrderData = {
//         companyId: selectedCompany,
//         vendorId: selectedVendor,
//         gstType: selectedGstType,
//         paymentTerms,
//         deliveryTerms,
//         warranty,
//         contactPerson,
//         cellNo,
//         // remarks,
//         items: itemDetails.map(item => {
//           const selectedItemData = itemList.find(i => i.id === item.selectedItem);
//           return {
//             id: item.selectedItem,
//             name: selectedItemData?.name || "",
//             source: selectedItemData?.source || "",
//             hsnCode: item.hsnCode,
//             modelNumber: item.modelNumber,
//             itemDetail: item.itemDetail,
//             unit: item.selectedUnit,
//             quantity: item.quantity.toString(),
//             rate: item.rate.toString(),
//             gstRate: isItemWiseGST ? item.gstRate.toString() : ""
//           };
//         }),
//         otherCharges: otherCharges.map(charge => ({
//           name: charge.name,
//           amount: charge.amount.toString()
//         }))
//       };

//       console.log('Purchase Order Data:', purchaseOrderData);
      
//       // Send data to API
//       const response = await Api.post('/purchase/purchase-orders/create', purchaseOrderData);
      
//       if (response.data.success) {
//         alert('Purchase Order created successfully!', response?.data?.message);
//         handleReset();
//       } else {
//         alert('Error creating purchase order: ' + response.data.message);
//       }
      
//     } catch (error) {
//       alert("Error creating purchase order: " + (error?.response?.data?.message || error?.message));
//     }
//   };

//   // Reset form
//   const handleReset = () => {
//     setSelectedCompany("");
//     setSelectedVendor("");
//     setSelectedGstType("");
//     setPaymentTerms("");
//     setDeliveryTerms("");
//     setWarranty("");
//     setContactPerson("");
//     setCellNo("");
//     // setRemarks("");
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
//       itemGSTType: null,
//       itemDetail: ""
//     }]);
//     setOtherCharges([{
//       id: 1,
//       name: "",
//       amount: ""
//     }]);
//   };

//   useEffect(() => {
//     fetchCompanies();
//     fetchVendors();
//     fetchItemList();
//   }, []);

//   return (
//     <div className="Container">
//       <div className="create-purchase-order">
//         <div className="page-header">
//           <h1>Create Purchase Order</h1>
//           <div className="header-actions">
//             <button 
//               type="button" 
//               className="btn btn-secondary"
//               onClick={handleReset}
//             >
//               Reset Form
//             </button>
//           </div>
//         </div>
        
//         {/* BASIC INFORMATION SECTION */}
//         <div className="form-section">
//           <h2 className="section-title">Basic Information</h2>
          
//           {/* FIRST ROW - Company, Vendor, GST Type */}
//           <div className="form-row-three">
//             <div className="form-group">
//               <label className="form-label">Select Company</label>
//               <select
//                 value={selectedCompany}
//                 onChange={(e) => setSelectedCompany(e.target.value)}
//                 className="form-select"
//               >
//                 <option value="">-- Select Company --</option>
//                 {companies.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.companyName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Select Vendor</label>
//               <select
//                 value={selectedVendor}
//                 onChange={(e) => setSelectedVendor(e.target.value)}
//                 className="form-select"
//               >
//                 <option value="">-- Select Vendor --</option>
//                 {vendorsList.map((v) => (
//                   <option key={v.id} value={v.id}>
//                     {v.displayName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Select GST Type</label>
//               <select
//                 value={selectedGstType}
//                 onChange={(e) => setSelectedGstType(e.target.value)}
//                 className="form-select"
//               >
//                 <option value="">-- Select GST Type --</option>
//                 {gstTypes.map((gst) => (
//                   <option key={gst.value} value={gst.value}>
//                     {gst.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* SECOND ROW - Payment Terms, Delivery Terms, Warranty */}
//           <div className="form-row-three">
//             <div className="form-group">
//               <label className="form-label">Payment Terms</label>
//               <input
//                 type="text"
//                 value={paymentTerms}
//                 onChange={(e) => setPaymentTerms(e.target.value)}
//                 className="form-input"
//                 placeholder="e.g., 60 Days Credit"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Delivery Terms</label>
//               <input
//                 type="text"
//                 value={deliveryTerms}
//                 onChange={(e) => setDeliveryTerms(e.target.value)}
//                 className="form-input"
//                 placeholder="e.g., Immediate"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Warranty</label>
//               <input
//                 type="text"
//                 value={warranty}
//                 onChange={(e) => setWarranty(e.target.value)}
//                 className="form-input"
//                 placeholder="Enter warranty details"
//               />
//             </div>
//           </div>

//           {/* THIRD ROW - Contact Person, Contact Number, Remarks */}
//           <div className="form-row-three">
//             <div className="form-group">
//               <label className="form-label">Contact Person</label>
//               <input
//                 type="text"
//                 value={contactPerson}
//                 onChange={(e) => setContactPerson(e.target.value)}
//                 className="form-input"
//                 placeholder="Enter contact person name"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Contact Number</label>
//               <input
//                 type="text"
//                 value={cellNo}
//                 onChange={(e) => setCellNo(e.target.value)}
//                 className="form-input"
//                 placeholder="Enter contact number"
//               />
//             </div>

//             {/* <div className="form-group">
//               <label className="form-label">Remarks</label>
//               <input
//                 type="text"
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 className="form-input"
//                 placeholder="Enter any remarks"
//               />
//             </div> */}
//           </div>
//         </div>

//         {/* ITEM SECTION */}
//         <div className="form-section">
//           <div className="section-header">
//             <h2 className="section-title">Item Details</h2>
//             <button 
//               type="button" 
//               className="btn btn-primary"
//               onClick={addItemDetail}
//             >
//               <span className="icon">+</span> Add Item
//             </button>
//           </div>

//           {/* GST Type Info */}
//           {selectedGstType && (
//             <div className="gst-type-info">
//               <strong>Selected GST Type:</strong> {gstTypes.find(gst => gst.value === selectedGstType)?.label}
//               {!isItemWiseGST && (
//                 <span className="gst-rate-info"> (Rate: {getFixedGSTRate()}%)</span>
//               )}
//             </div>
//           )}

//           {/* Item Details Rows */}
//           {itemDetails.map((item, index) => (
//             <div key={item.id} className="item-detail-card">
//               <div className="card-header">
//                 <h3 className="card-title">Item {index + 1}</h3>
//                 {itemDetails.length > 1 && (
//                   <button 
//                     type="button" 
//                     className="btn btn-danger"
//                     onClick={() => removeItemDetail(item.id)}
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
              
//               {/* ITEM SELECTION SECTION */}
//               <div className="item-selection-section">
//                 <div className="item-basic-details">
//                   {/* Left Column - Item Selection */}
//                   <div className="item-selection-column">
//                     <div className="form-group">
//                       <label className="form-label">Select Item</label>
//                       <select
//                         value={item.selectedItem}
//                         onChange={(e) => handleItemSelect(item.id, e.target.value)}
//                         className="form-select item-select"
//                       >
//                         <option value="">-- Choose Item --</option>
//                         {itemList.map((itemOption) => (
//                           <option key={itemOption.id} value={itemOption.id}>
//                             {itemOption.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Select Unit</label>
//                       <select
//                         value={item.selectedUnit}
//                         onChange={(e) => updateItemDetail(item.id, 'selectedUnit', e.target.value)}
//                         className="form-select"
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

//                   {/* Right Column - Item Information */}
//                   <div className="item-info-column">
//                     <div className="form-row-two">
//                       <div className="form-group">
//                         <label className="form-label">HSN Code</label>
//                         <input
//                           type="text"
//                           value={item.hsnCode}
//                           onChange={(e) => updateItemDetail(item.id, 'hsnCode', e.target.value)}
//                           className="form-input"
//                           placeholder="Enter HSN code"
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label className="form-label">Model Number</label>
//                         <input
//                           type="text"
//                           value={item.modelNumber}
//                           onChange={(e) => updateItemDetail(item.id, 'modelNumber', e.target.value)}
//                           className="form-input"
//                           placeholder="Enter model number"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Pricing Section */}
//                 <div className="item-pricing-section">
//                   <div className="form-row-three compact">
//                     <div className="form-group">
//                       <label className="form-label">Rate (₹)</label>
//                       <input
//                         type="number"
//                         value={item.rate}
//                         onChange={(e) => updateItemDetail(item.id, 'rate', e.target.value)}
//                         className="form-input"
//                         placeholder="0.00"
//                         step="0.01"
//                         min="0"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Quantity</label>
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) => updateItemDetail(item.id, 'quantity', e.target.value)}
//                         className="form-input"
//                         placeholder="0"
//                         step="1"
//                         min="0"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Total Amount (₹)</label>
//                       <input
//                         type="text"
//                         value={item.totalAmount.toFixed(2)}
//                         className="form-input total-amount-display"
//                         readOnly
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Item Details Description */}
//                 <div className="form-group full-width">
//                   <label className="form-label">Item Description</label>
//                   <textarea
//                     value={item.itemDetail}
//                     onChange={(e) => updateItemDetail(item.id, 'itemDetail', e.target.value)}
//                     className="form-textarea"
//                     placeholder="Enter item specifications, description, and other details..."
//                     rows="3"
//                   />
//                 </div>

//                 {/* GST Rate Section - Only show for itemwise GST */}
//                 {isItemWiseGST && (
//                   <div className="gst-section">
//                     <div className="form-row-three compact">
//                       <div className="form-group">
//                         <label className="form-label">GST Rate (%)</label>
//                         <input
//                           type="number"
//                           value={item.gstRate}
//                           onChange={(e) => updateItemDetail(item.id, 'gstRate', e.target.value)}
//                           className="form-input"
//                           placeholder="0.00"
//                           step="0.01"
//                           min="0"
//                           max="100"
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label className="form-label">Taxable Amount (₹)</label>
//                         <input
//                           type="text"
//                           value={item.taxableAmount.toFixed(2)}
//                           className="form-input amount-display"
//                           readOnly
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label className="form-label">GST Amount (₹)</label>
//                         <input
//                           type="text"
//                           value={item.gstAmount.toFixed(2)}
//                           className="form-input amount-display"
//                           readOnly
//                         />
//                       </div>
//                     </div>
                    
//                     {/* Item GST Type Info */}
//                     {item.gstRate && (
//                       <div className="item-gst-info">
//                         <span className="gst-badge">
//                           {getGSTTypePrefix()} | Rate: {item.gstRate}%
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* OTHER CHARGES SECTION */}
//         <div className="form-section">
//           <div className="section-header">
//             <h2 className="section-title">Other Charges</h2>
//             <button 
//               type="button" 
//               className="btn btn-primary"
//               onClick={addOtherCharge}
//             >
//               <span className="icon">+</span> Add Charge
//             </button>
//           </div>

//           {otherCharges.map((charge, index) => (
//             <div key={charge.id} className="other-charge-card">
//               <div className="card-header">
//                 <h3 className="card-title">Charge {index + 1}</h3>
//                 {otherCharges.length > 1 && (
//                   <button 
//                     type="button" 
//                     className="btn btn-danger"
//                     onClick={() => removeOtherCharge(charge.id)}
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
              
//               <div className="form-row-two">
//                 <div className="form-group">
//                   <label className="form-label">Charge Name</label>
//                   <input
//                     type="text"
//                     value={charge.name}
//                     onChange={(e) => updateOtherCharge(charge.id, 'name', e.target.value)}
//                     className="form-input"
//                     placeholder="e.g., Freight, Loading, Packaging, etc."
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Amount (₹)</label>
//                   <input
//                     type="number"
//                     value={charge.amount}
//                     onChange={(e) => updateOtherCharge(charge.id, 'amount', e.target.value)}
//                     className="form-input"
//                     placeholder="0.00"
//                     step="0.01"
//                     min="0"
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Total Amount Section */}
//         <div className="form-section total-section">
//           <div className="total-breakdown">
//             <h3 className="total-title">Order Summary</h3>
//             <div className="total-row">
//               <span>Subtotal (₹):</span>
//               <span>{itemTotals.amount.toFixed(2)}</span>
//             </div>
//             <div className="total-row">
//               <span>Total Taxable Amount (₹):</span>
//               <span>{itemTotals.taxableAmount.toFixed(2)}</span>
//             </div>
//             <div className="total-row">
//               <span>Total GST Amount (₹):</span>
//               <span>{itemTotals.gstAmount.toFixed(2)}</span>
//             </div>
//             <div className="total-row">
//               <span>Other Charges (₹):</span>
//               <span>{otherChargesTotal.toFixed(2)}</span>
//             </div>
//             <div className="total-row grand-total">
//               <span>Grand Total (₹):</span>
//               <span>{finalTotals.totalAmount.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="form-actions">
//           <button 
//             type="button" 
//             className="btn btn-success"
//             onClick={handleSubmit}
//             disabled={!selectedCompany || !selectedVendor || !selectedGstType}
//           >
//             Create Purchase Order
//           </button>
//           <button 
//             type="button" 
//             className="btn btn-secondary"
//             onClick={handleReset}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePurchaseOrder;

import React, { useState, useEffect } from "react";
import Api from "../../auth/Api";
import { useLocation } from "react-router-dom";

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
  const [gstRate, setGstRate] = useState("");

  const [itemList, setItemList] = useState([]);
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
      amount: 0,
      taxableAmount: 0,
      gstAmount: 0,
      totalAmount: 0,
      itemGSTType: null,
      itemDetail: ""
    }
  ]);

  const [otherCharges, setOtherCharges] = useState([
    {
      id: 1,
      name: "",
      amount: ""
    }
  ]);

  const [loading, setLoading] = useState(false);

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

  const unitTypes = [
    { value: "Nos", label: "Nos" },
    { value: "Pcs", label: "Pcs" },
    { value: "Mtr", label: "Mtr" },
    { value: "Kg", label: "Kg" },
    { value: "Box", label: "Box" },
    { value: "Set", label: "Set" },
    { value: "Roll", label: "Roll" },
    { value: "Ltr", label: "Ltr" },
  ];

  const isItemWiseGST = selectedGstType === "IGST_ITEMWISE" || selectedGstType === "LGST_ITEMWISE";

  const getFixedGSTRate = () => {
    if (selectedGstType.includes("EXEMPTED")) return 0;
    const rateMatch = selectedGstType.match(/(\d+)/);
    return rateMatch ? parseFloat(rateMatch[1]) : 0;
  };

  const getGSTTypePrefix = () => {
    if (selectedGstType.startsWith('IGST')) return 'IGST';
    if (selectedGstType.startsWith('LGST')) return 'LGST';
    return null;
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
      
      // Set basic information
      setSelectedCompany(reorderData.companyId);
      setSelectedVendor(reorderData.vendorId);
      setSelectedGstType(reorderData.gstType);
      setGstRate(reorderData.gstRate || "");
      setCurrency(reorderData.currency || "INR");
      setPaymentTerms(reorderData.paymentTerms || "");
      setDeliveryTerms(reorderData.deliveryTerms || "");
      setWarranty(reorderData.warranty || "");
      setContactPerson(reorderData.contactPerson || "");
      setCellNo(reorderData.cellNo || "");

      // Set items
      if (reorderData.items && reorderData.items.length > 0) {
        const mappedItems = reorderData.items.map((item, index) => ({
          id: index + 1,
          selectedItem: item.itemId || item.id || "",
          hsnCode: item.hsnCode || "",
          modelNumber: item.modelNumber || "",
          selectedUnit: item.unit || "Nos",
          rate: item.rate || "",
          quantity: item.quantity || "1",
          gstRate: item.gstRate || reorderData.gstRate || "",
          amount: parseFloat(item.rate || 0) * parseFloat(item.quantity || 1),
          taxableAmount: parseFloat(item.rate || 0) * parseFloat(item.quantity || 1),
          gstAmount: (parseFloat(item.rate || 0) * parseFloat(item.quantity || 1) * parseFloat(item.gstRate || reorderData.gstRate || 0)) / 100,
          totalAmount: parseFloat(item.rate || 0) * parseFloat(item.quantity || 1),
          itemGSTType: reorderData.gstType?.startsWith('IGST') ? 'IGST' : reorderData.gstType?.startsWith('LGST') ? 'LGST' : null,
          itemDetail: item.itemDetail || ""
        }));
        setItemDetails(mappedItems);
      }

      // Set other charges
      if (reorderData.otherCharges && reorderData.otherCharges.length > 0) {
        const mappedCharges = reorderData.otherCharges.map((charge, index) => ({
          id: index + 1,
          name: charge.name || "",
          amount: charge.amount || ""
        }));
        setOtherCharges(mappedCharges);
      }
    }
  }, [location.state]);

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
        amount: 0,
        taxableAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        itemGSTType: null,
        itemDetail: ""
      }
    ]);
  };

  const removeItemDetail = (id) => {
    if (itemDetails.length > 1) {
      setItemDetails(itemDetails.filter(item => item.id !== id));
    }
  };

  const addOtherCharge = () => {
    const newId = otherCharges.length + 1;
    setOtherCharges([
      ...otherCharges,
      {
        id: newId,
        name: "",
        amount: ""
      }
    ]);
  };

  const removeOtherCharge = (id) => {
    if (otherCharges.length > 1) {
      setOtherCharges(otherCharges.filter(charge => charge.id !== id));
    }
  };

  const updateOtherCharge = (id, field, value) => {
    setOtherCharges(otherCharges.map(charge => {
      if (charge.id === id) {
        return { ...charge, [field]: value };
      }
      return charge;
    }));
  };

  const calculateItemAmounts = (item) => {
    const rate = parseFloat(item.rate) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const total = rate * quantity;
    
    let gstRate = 0;
    let itemGSTType = null;

    if (isItemWiseGST) {
      gstRate = parseFloat(item.gstRate) || 0;
      itemGSTType = getGSTTypePrefix();
    } else {
      gstRate = getFixedGSTRate();
    }

    const taxableAmount = total;
    const gstAmount = (taxableAmount * gstRate) / 100;
    const finalTotalAmount = taxableAmount + gstAmount;
    
    return {
      amount: total,
      taxableAmount,
      gstAmount,
      totalAmount: total,
      itemGSTType: isItemWiseGST ? itemGSTType : null
    };
  };

  const updateItemDetail = (id, field, value) => {
    setItemDetails(itemDetails.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'rate' || field === 'quantity' || (isItemWiseGST && field === 'gstRate')) {
          const calculatedAmounts = calculateItemAmounts(updatedItem);
          return { ...updatedItem, ...calculatedAmounts };
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleItemSelect = (id, itemId) => {
    const selectedItemData = itemList.find(item => item.id === itemId);
    if (selectedItemData) {
      setItemDetails(itemDetails.map(item => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            selectedItem: itemId,
            hsnCode: selectedItemData.hsnCode || item.hsnCode,
            modelNumber: selectedItemData.modelNumber || item.modelNumber,
            selectedUnit: selectedItemData.unit || item.selectedUnit,
            rate: selectedItemData.rate || item.rate,
            itemDetail: selectedItemData.itemDetail || item.itemDetail
          };
          const calculatedAmounts = calculateItemAmounts(updatedItem);
          return { ...updatedItem, ...calculatedAmounts };
        }
        return item;
      }));
    }
  };

  useEffect(() => {
    if (selectedGstType) {
      setItemDetails(itemDetails.map(item => {
        const calculatedAmounts = calculateItemAmounts(item);
        return { ...item, ...calculatedAmounts };
      }));
    }
  }, [selectedGstType]);

  const itemTotals = itemDetails.reduce((acc, item) => {
    return {
      amount: acc.amount + (parseFloat(item.amount) || 0),
      taxableAmount: acc.taxableAmount + (parseFloat(item.taxableAmount) || 0),
      gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
      totalAmount: acc.totalAmount + (parseFloat(item.totalAmount) || 0)
    };
  }, { amount: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 });

  const otherChargesTotal = otherCharges.reduce((total, charge) => {
    return total + (parseFloat(charge.amount) || 0);
  }, 0);

  const finalTotals = {
    amount: itemTotals.amount,
    taxableAmount: itemTotals.taxableAmount,
    gstAmount: itemTotals.gstAmount,
    otherCharges: otherChargesTotal,
    totalAmount: itemTotals.taxableAmount + itemTotals.gstAmount + otherChargesTotal
  };

  const handleSubmit = async () => {
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

    const invalidItems = itemDetails.filter(item => 
      !item.selectedItem || !item.hsnCode || !item.rate || !item.quantity
    );

    if (invalidItems.length > 0) {
      alert("Please fill all required fields for all items");
      return;
    }

    const invalidCharges = otherCharges.filter(charge => 
      !charge.name || !charge.amount
    );

    if (invalidCharges.length > 0) {
      alert("Please fill all fields for other charges");
      return;
    }

    try {
      const purchaseOrderData = {
        companyId: selectedCompany,
        vendorId: selectedVendor,
        gstType: selectedGstType,
        gstRate: gstRate,
        currency: currency,
        paymentTerms,
        deliveryTerms,
        warranty,
        contactPerson,
        cellNo,
        items: itemDetails.map(item => {
          const selectedItemData = itemList.find(i => i.id === item.selectedItem);
          return {
            id: item.selectedItem,
            name: selectedItemData?.name || "",
            source: selectedItemData?.source || "",
            hsnCode: item.hsnCode,
            modelNumber: item.modelNumber,
            itemDetail: item.itemDetail,
            unit: item.selectedUnit,
            quantity: item.quantity.toString(),
            rate: item.rate.toString(),
            gstRate: isItemWiseGST ? item.gstRate.toString() : gstRate.toString()
          };
        }),
        otherCharges: otherCharges.map(charge => ({
          name: charge.name,
          amount: charge.amount.toString()
        }))
      };

      console.log('Purchase Order Data:', purchaseOrderData);
      
      const response = await Api.post('/purchase/purchase-orders/create2', purchaseOrderData);
      
      if (response.data.success) {
        alert('Purchase Order created successfully!', response?.data?.message);
        handleReset();
      } else {
        alert('Error creating purchase order: ' + response.data.message);
      }
      
    } catch (error) {
      alert("Error creating purchase order: " + (error?.response?.data?.message || error?.message));
    }
  };

  const handleReset = () => {
    setSelectedCompany("");
    setSelectedVendor("");
    setSelectedGstType("");
    setGstRate("");
    setCurrency("INR");
    setPaymentTerms("");
    setDeliveryTerms("");
    setWarranty("");
    setContactPerson("");
    setCellNo("");
    setItemDetails([{
      id: 1,
      selectedItem: "",
      hsnCode: "",
      modelNumber: "",
      selectedUnit: "",
      rate: "",
      quantity: "",
      gstRate: "",
      amount: 0,
      taxableAmount: 0,
      gstAmount: 0,
      totalAmount: 0,
      itemGSTType: null,
      itemDetail: ""
    }]);
    setOtherCharges([{
      id: 1,
      name: "",
      amount: ""
    }]);
  };

  useEffect(() => {
    fetchCompanies();
    fetchVendors();
    fetchItemList();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Centered Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {location.state?.reorderData ? "ReOrder Purchase Order" : "Create Purchase Order"}
          </h1>
          <p className="text-gray-600">
            {location.state?.reorderData 
              ? "Review and modify the reorder details below" 
              : "Fill in the details below to create a new purchase order"}
          </p>
        </div>

        {/* BASIC INFORMATION SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            Basic Information
          </h2>
          
          {/* Responsive Form Grid */}
          <div className="space-y-6">
            {/* FIRST ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>

            {/* SECOND ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Rate (%)
                </label>
                <input
                  type="number"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0.00"
                  step="0.01"
                />
              </div> */}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div> */}

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
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>

          {/* GST Type Info */}
          {selectedGstType && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-blue-800">Selected GST Type:</span>
                <span className="ml-2 text-blue-700">
                  {gstTypes.find(gst => gst.value === selectedGstType)?.label}
                  {!isItemWiseGST && (
                    <span className="ml-2 font-medium">(Rate: {getFixedGSTRate()}%)</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Item Details Cards */}
          <div className="space-y-6">
            {itemDetails.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
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
                      </label>
                      <select
                        value={item.selectedItem}
                        onChange={(e) => handleItemSelect(item.id, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      >
                        <option value="">-- Choose Item --</option>
                        {itemList.map((itemOption) => (
                          <option key={itemOption.id} value={itemOption.id}>
                            {itemOption.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Unit
                      </label>
                      <select
                        value={item.selectedUnit}
                        onChange={(e) => updateItemDetail(item.id, 'selectedUnit', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      >
                        <option value="">-- Choose Unit --</option>
                        {unitTypes.map((u) => (
                          <option key={u.value} value={u.value}>
                            {u.label}
                          </option>
                        ))}
                      </select>
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
                        onChange={(e) => updateItemDetail(item.id, 'hsnCode', e.target.value)}
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
                        onChange={(e) => updateItemDetail(item.id, 'modelNumber', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Enter model number"
                      />
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}) *
                      </label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItemDetail(item.id, 'rate', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemDetail(item.id, 'quantity', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0"
                        step="1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})
                      </label>
                      <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
                        {item.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Item Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Description
                    </label>
                    <textarea
                      value={item.itemDetail}
                      onChange={(e) => updateItemDetail(item.id, 'itemDetail', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter item specifications, description, and other details..."
                      rows="3"
                    />
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
                            onChange={(e) => updateItemDetail(item.id, 'gstRate', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            max="100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Taxable Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})
                          </label>
                          <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
                            {item.taxableAmount.toFixed(2)}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GST Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})
                          </label>
                          <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
                            {item.gstAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {item.gstRate && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {getGSTTypePrefix()} | Rate: {item.gstRate}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OTHER CHARGES SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Other Charges
            </h2>
            <button 
              type="button" 
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
              onClick={addOtherCharge}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Charge
            </button>
          </div>

          <div className="space-y-6">
            {otherCharges.map((charge, index) => (
              <div key={charge.id} className="border border-gray-200 rounded-xl overflow-hidden">
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
                        onChange={(e) => updateOtherCharge(charge.id, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="e.g., Freight, Loading, Packaging, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}) *
                      </label>
                      <input
                        type="number"
                        value={charge.amount}
                        onChange={(e) => updateOtherCharge(charge.id, 'amount', e.target.value)}
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
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">
                {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}{itemTotals.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Taxable Amount:</span>
              <span className="font-medium">
                {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}{itemTotals.taxableAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total GST Amount:</span>
              <span className="font-medium">
                {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}{itemTotals.gstAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Other Charges:</span>
              <span className="font-medium">
                {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}{otherChargesTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-3 mt-4 bg-gray-50 rounded-lg px-4">
              <span className="text-lg font-semibold text-gray-800">Grand Total:</span>
              <span className="text-xl font-bold text-blue-600">
                {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}{finalTotals.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div> */}

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
              disabled={!selectedCompany || !selectedVendor || !selectedGstType}
            >
              {location.state?.reorderData ? 'Create ReOrder' : 'Create Purchase Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;