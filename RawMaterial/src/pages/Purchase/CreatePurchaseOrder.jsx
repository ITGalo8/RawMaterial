import React, { useState, useEffect } from "react";
import Api from "../../auth/Api";
import "./CSS/CreatePurchaseOrder.css";

const CreatePurchaseOrder = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const [vendorsList, setVendorsList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");

  const [selectedGstType, setSelectedGstType] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("");
  const [warranty, setWarranty] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [cellNo, setCellNo] = useState("");
  // const [remarks, setRemarks] = useState("");

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

  // Check if itemwise GST is selected
  const isItemWiseGST = selectedGstType === "IGST_ITEMWISE" || selectedGstType === "LGST_ITEMWISE";

  // Get fixed GST rate from selected GST type
  const getFixedGSTRate = () => {
    if (selectedGstType.includes("EXEMPTED")) return 0;
    const rateMatch = selectedGstType.match(/(\d+)/);
    return rateMatch ? parseFloat(rateMatch[1]) : 0;
  };

  // Get GST type prefix (IGST or LGST)
  const getGSTTypePrefix = () => {
    if (selectedGstType.startsWith('IGST')) return 'IGST';
    if (selectedGstType.startsWith('LGST')) return 'LGST';
    return null;
  };

  // Fetch API Calls
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

  // Add new item detail row
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

  // Remove item detail row
  const removeItemDetail = (id) => {
    if (itemDetails.length > 1) {
      setItemDetails(itemDetails.filter(item => item.id !== id));
    }
  };

  // Calculate amounts for an item
  const calculateItemAmounts = (item) => {
    const rate = parseFloat(item.rate) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    
    // Calculate total amount (rate * quantity)
    const total = rate * quantity;
    
    let gstRate = 0;
    let itemGSTType = null;

    if (isItemWiseGST) {
      // For itemwise GST, use the individual item's GST rate
      gstRate = parseFloat(item.gstRate) || 0;
      itemGSTType = getGSTTypePrefix();
    } else {
      // For fixed GST, use the main GST type rate
      gstRate = getFixedGSTRate();
    }

    const taxableAmount = total;
    const gstAmount = (taxableAmount * gstRate) / 100;
    const finalTotalAmount = taxableAmount + gstAmount;
    
    return {
      amount: total,
      taxableAmount,
      gstAmount,
      totalAmount: finalTotalAmount,
      itemGSTType: isItemWiseGST ? itemGSTType : null
    };
  };

  // Update item detail
  const updateItemDetail = (id, field, value) => {
    setItemDetails(itemDetails.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate all amounts when rate, quantity, or GST rate changes
        if (field === 'rate' || field === 'quantity' || (isItemWiseGST && field === 'gstRate')) {
          const calculatedAmounts = calculateItemAmounts(updatedItem);
          return { ...updatedItem, ...calculatedAmounts };
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Auto-fill item details when item is selected
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

  // Recalculate all items when GST type changes
  useEffect(() => {
    if (selectedGstType) {
      setItemDetails(itemDetails.map(item => {
        const calculatedAmounts = calculateItemAmounts(item);
        return { ...item, ...calculatedAmounts };
      }));
    }
  }, [selectedGstType]);

  // Calculate totals
  const totals = itemDetails.reduce((acc, item) => {
    return {
      amount: acc.amount + (parseFloat(item.amount) || 0),
      taxableAmount: acc.taxableAmount + (parseFloat(item.taxableAmount) || 0),
      gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
      totalAmount: acc.totalAmount + (parseFloat(item.totalAmount) || 0)
    };
  }, { amount: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 });

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
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

    // Validate item details
    const invalidItems = itemDetails.filter(item => 
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
        paymentTerms,
        deliveryTerms,
        warranty,
        contactPerson,
        cellNo,
        // remarks,
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
            gstRate: isItemWiseGST ? item.gstRate.toString() : ""
          };
        })
      };

      console.log('Purchase Order Data:', purchaseOrderData);
      
      // Send data to API
      const response = await Api.post('/purchase/purchase-orders/create', purchaseOrderData);
      
      if (response.data.success) {
        alert('Purchase Order created successfully!');
        handleReset();
      } else {
        alert('Error creating purchase order: ' + response.data.message);
      }
      
    } catch (error) {
      alert("Error creating purchase order: " + (error?.response?.data?.message || error?.message));
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedCompany("");
    setSelectedVendor("");
    setSelectedGstType("");
    setPaymentTerms("");
    setDeliveryTerms("");
    setWarranty("");
    setContactPerson("");
    setCellNo("");
    // setRemarks("");
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
  };

  useEffect(() => {
    fetchCompanies();
    fetchVendors();
    fetchItemList();
  }, []);

  return (
    <div className="Container">
      <div className="create-purchase-order">
        <div className="page-header">
          <h1>Create Purchase Order</h1>
          <div className="header-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset Form
            </button>
          </div>
        </div>
        
        {/* BASIC INFORMATION SECTION */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          
          {/* FIRST ROW - Company, Vendor, GST Type */}
          <div className="form-row-three">
            <div className="form-group">
              <label className="form-label">Select Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="form-select"
              >
                <option value="">-- Select Company --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Vendor</label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="form-select"
              >
                <option value="">-- Select Vendor --</option>
                {vendorsList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select GST Type</label>
              <select
                value={selectedGstType}
                onChange={(e) => setSelectedGstType(e.target.value)}
                className="form-select"
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

          {/* SECOND ROW - Payment Terms, Delivery Terms, Warranty */}
          <div className="form-row-three">
            <div className="form-group">
              <label className="form-label">Payment Terms</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="form-input"
                placeholder="e.g., 60 Days Credit"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Terms</label>
              <input
                type="text"
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                className="form-input"
                placeholder="e.g., Immediate"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Warranty</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="form-input"
                placeholder="Enter warranty details"
              />
            </div>
          </div>

          {/* THIRD ROW - Contact Person, Contact Number, Remarks */}
          <div className="form-row-three">
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="form-input"
                placeholder="Enter contact person name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                type="text"
                value={cellNo}
                onChange={(e) => setCellNo(e.target.value)}
                className="form-input"
                placeholder="Enter contact number"
              />
            </div>

            {/* <div className="form-group">
              <label className="form-label">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="form-input"
                placeholder="Enter any remarks"
              />
            </div> */}
          </div>
        </div>

        {/* ITEM SECTION */}
        <div className="form-section">
          <div className="section-header">
            <h2 className="section-title">Item Details</h2>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={addItemDetail}
            >
              <span className="icon">+</span> Add Item
            </button>
          </div>

          {/* GST Type Info */}
          {selectedGstType && (
            <div className="gst-type-info">
              <strong>Selected GST Type:</strong> {gstTypes.find(gst => gst.value === selectedGstType)?.label}
              {!isItemWiseGST && (
                <span className="gst-rate-info"> (Rate: {getFixedGSTRate()}%)</span>
              )}
            </div>
          )}

          {/* Item Details Rows */}
          {itemDetails.map((item, index) => (
            <div key={item.id} className="item-detail-card">
              <div className="card-header">
                <h3 className="card-title">Item {index + 1}</h3>
                {itemDetails.length > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => removeItemDetail(item.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {/* ITEM SELECTION SECTION */}
              <div className="item-selection-section">
                <div className="item-basic-details">
                  {/* Left Column - Item Selection */}
                  <div className="item-selection-column">
                    <div className="form-group">
                      <label className="form-label">Select Item</label>
                      <select
                        value={item.selectedItem}
                        onChange={(e) => handleItemSelect(item.id, e.target.value)}
                        className="form-select item-select"
                      >
                        <option value="">-- Choose Item --</option>
                        {itemList.map((itemOption) => (
                          <option key={itemOption.id} value={itemOption.id}>
                            {itemOption.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Select Unit</label>
                      <select
                        value={item.selectedUnit}
                        onChange={(e) => updateItemDetail(item.id, 'selectedUnit', e.target.value)}
                        className="form-select"
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

                  {/* Right Column - Item Information */}
                  <div className="item-info-column">
                    <div className="form-row-two">
                      <div className="form-group">
                        <label className="form-label">HSN Code</label>
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={(e) => updateItemDetail(item.id, 'hsnCode', e.target.value)}
                          className="form-input"
                          placeholder="Enter HSN code"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Model Number</label>
                        <input
                          type="text"
                          value={item.modelNumber}
                          onChange={(e) => updateItemDetail(item.id, 'modelNumber', e.target.value)}
                          className="form-input"
                          placeholder="Enter model number"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="item-pricing-section">
                  <div className="form-row-three compact">
                    <div className="form-group">
                      <label className="form-label">Rate (₹)</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItemDetail(item.id, 'rate', e.target.value)}
                        className="form-input"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemDetail(item.id, 'quantity', e.target.value)}
                        className="form-input"
                        placeholder="0"
                        step="1"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Amount</label>
                      <input
                        type="text"
                        value={item.totalAmount.toFixed(2)}
                        className="form-input total-amount-display"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Item Details Description */}
                <div className="form-group full-width">
                  <label className="form-label">Item Description</label>
                  <textarea
                    value={item.itemDetail}
                    onChange={(e) => updateItemDetail(item.id, 'itemDetail', e.target.value)}
                    className="form-textarea"
                    placeholder="Enter item specifications, description, and other details..."
                    rows="3"
                  />
                </div>

                {/* GST Rate Section - Only show for itemwise GST */}
                {isItemWiseGST && (
                  <div className="gst-section">
                    <div className="form-row-three compact">
                      <div className="form-group">
                        <label className="form-label">GST Rate (%)</label>
                        <input
                          type="number"
                          value={item.gstRate}
                          onChange={(e) => updateItemDetail(item.id, 'gstRate', e.target.value)}
                          className="form-input"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Taxable Amount (₹)</label>
                        <input
                          type="text"
                          value={item.taxableAmount.toFixed(2)}
                          className="form-input amount-display"
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">GST Amount (₹)</label>
                        <input
                          type="text"
                          value={item.gstAmount.toFixed(2)}
                          className="form-input amount-display"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    {/* Item GST Type Info */}
                    {item.gstRate && (
                      <div className="item-gst-info">
                        <span className="gst-badge">
                          {getGSTTypePrefix()} | Rate: {item.gstRate}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total Amount Section */}
        <div className="form-section total-section">
          <div className="total-breakdown">
            <h3 className="total-title">Order Summary</h3>
            <div className="total-row">
              <span>Subtotal (₹):</span>
              <span>{totals.amount.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Total Taxable Amount (₹):</span>
              <span>{totals.taxableAmount.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Total GST Amount (₹):</span>
              <span>{totals.gstAmount.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Grand Total (₹):</span>
              <span>{totals.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={!selectedCompany || !selectedVendor || !selectedGstType}
          >
            Create Purchase Order
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;