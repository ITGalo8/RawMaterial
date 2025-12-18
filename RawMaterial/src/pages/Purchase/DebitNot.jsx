import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";

const DebitNot = () => {
  // Existing states
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");
  const [loadingPO, setLoadingPO] = useState(false);
  const [poDetails, setPoDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // New states for debit note fields
  const [orgInvoiceNo, setOrgInvoiceNo] = useState("");
  const [orgInvoiceDate, setOrgInvoiceDate] = useState("");
  const [grRrNo, setGrRrNo] = useState("");
  const [transport, setTransport] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [station, setStation] = useState("");
  const [gstType, setGstType] = useState("");
  const [otherCharges, setOtherCharges] = useState([
    { id: Date.now(), name: "", amount: "" }
  ]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const gstTypes = [
    { value: "IGST_5", label: "IGST 5%", rate: 5 },
    { value: "IGST_12", label: "IGST 12%", rate: 12 },
    { value: "IGST_18", label: "IGST 18%", rate: 18 },
    { value: "IGST_28", label: "IGST 28%", rate: 28 },
    { value: "IGST_EXEMPTED", label: "IGST Exempted", rate: 0 },
    { value: "LGST_5", label: "LGST 5%", rate: 5 },
    { value: "LGST_12", label: "LGST 12%", rate: 12 },
    { value: "LGST_18", label: "LGST 18%", rate: 18 },
    { value: "LGST_28", label: "LGST 28%", rate: 28 },
    { value: "LGST_EXEMPTED", label: "LGST Exempted", rate: 0 },
    { value: "IGST_ITEMWISE", label: "IGST Itemwise", rate: null },
    { value: "LGST_ITEMWISE", label: "LGST Itemwise", rate: null },
  ];

  // Check if GST type is itemwise
  const isItemwiseGST = gstType === "IGST_ITEMWISE" || gstType === "LGST_ITEMWISE";

  // Get default GST rate for non-itemwise GST types
  const getDefaultGSTRate = () => {
    const selectedGstType = gstTypes.find(gst => gst.value === gstType);
    return selectedGstType?.rate || 0;
  };

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await Api.get("/purchase/companies");
        setCompanies(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch PO list
  useEffect(() => {
    if (!selectedCompany) return;

    const fetchPO = async () => {
      try {
        setLoadingPO(true);
        setPurchaseOrders([]);
        setSelectedPO("");
        setPoDetails(null);
        resetForm();

        const res = await Api.get(
          `/purchase/purchase-orders/company/${selectedCompany}`
        );
        setPurchaseOrders(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPO(false);
      }
    };

    fetchPO();
  }, [selectedCompany]);

  // Fetch PO damaged stock details
  useEffect(() => {
    if (!selectedPO) return;

    const fetchPODetails = async () => {
      try {
        setLoadingDetails(true);
        resetForm();

        const res = await Api.get(
          `/purchase/purchase-orders/damaged-stock/details/${selectedPO}`
        );

        setPoDetails(res.data.data);
        
        // Initialize items with empty fields for the form
        if (res.data.data?.damagedStock) {
          const defaultGSTRate = getDefaultGSTRate();
          const initializedItems = res.data.data.damagedStock.map(item => ({
            id: item.id,
            itemId: item.itemId,
            itemName: item.itemName,
            unit: item.unit || "-",
            quantity: item.quantity || "",
            hsnCode: "",
            modelNumber: "",
            itemDetail: "",
            rate: "",
            gstRate: defaultGSTRate, // Initialize with default GST rate
          }));
          setItems(initializedItems);
        }
      } catch (error) {
        console.error(error);
        setMessage({ type: "error", text: "Failed to load PO details" });
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchPODetails();
  }, [selectedPO]);

  // Update item GST rates when GST type changes (only for non-itemwise)
  useEffect(() => {
    if (!isItemwiseGST && items.length > 0) {
      const defaultGSTRate = getDefaultGSTRate();
      const updatedItems = items.map(item => ({
        ...item,
        gstRate: defaultGSTRate
      }));
      setItems(updatedItems);
    }
  }, [gstType]);

  const resetForm = () => {
    setOrgInvoiceNo("");
    setOrgInvoiceDate("");
    setGrRrNo("");
    setTransport("");
    setVehicleNumber("");
    setStation("");
    setGstType("");
    setOtherCharges([
      { id: Date.now(), name: "", amount: "" }
    ]);
    setItems([]);
    setMessage({ type: "", text: "" });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleOtherChargeChange = (index, field, value) => {
    const updatedCharges = [...otherCharges];
    updatedCharges[index][field] = value;
    setOtherCharges(updatedCharges);
  };

  const addOtherCharge = () => {
    setOtherCharges([
      ...otherCharges,
      { id: Date.now() + Math.random(), name: "", amount: "" }
    ]);
  };

  const removeOtherCharge = (index) => {
    if (otherCharges.length <= 1) {
      setMessage({ type: "error", text: "At least one charge is required" });
      return;
    }
    const updatedCharges = otherCharges.filter((_, i) => i !== index);
    setOtherCharges(updatedCharges);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalGST = 0;
    
    const itemTotals = items.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const gstRate = parseFloat(item.gstRate) || 0;
      const taxableValue = quantity * rate;
      const gstAmount = (taxableValue * gstRate) / 100;
      const total = taxableValue + gstAmount;
      
      subtotal += taxableValue;
      totalGST += gstAmount;
      
      return {
        ...item,
        taxableValue: taxableValue.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        total: total.toFixed(2)
      };
    });

    const otherChargesTotal = otherCharges.reduce((sum, charge) => {
      return sum + (parseFloat(charge.amount) || 0);
    }, 0);

    const grandTotal = subtotal + totalGST + otherChargesTotal;

    return { 
      itemTotals, 
      subtotal, 
      totalGST, 
      otherChargesTotal, 
      grandTotal 
    };
  };

  const validateForm = () => {
    if (!orgInvoiceNo.trim()) {
      setMessage({ type: "error", text: "Original Invoice No. is required" });
      return false;
    }
    if (!orgInvoiceDate) {
      setMessage({ type: "error", text: "Original Invoice Date is required" });
      return false;
    }
    if (!gstType) {
      setMessage({ type: "error", text: "GST Type is required" });
      return false;
    }
    
    // Validate items
    for (const item of items) {
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        setMessage({ type: "error", text: `Invalid quantity for ${item.itemName}` });
        return false;
      }
      if (!item.rate || parseFloat(item.rate) <= 0) {
        setMessage({ type: "error", text: `Invalid rate for ${item.itemName}` });
        return false;
      }
      if (isItemwiseGST) {
        if (item.gstRate === undefined || item.gstRate === null || item.gstRate === "") {
          setMessage({ type: "error", text: `GST Rate is required for ${item.itemName}` });
          return false;
        }
        if (parseFloat(item.gstRate) < 0 || parseFloat(item.gstRate) > 100) {
          setMessage({ type: "error", text: `GST Rate must be between 0-100% for ${item.itemName}` });
          return false;
        }
      }
    }

    // Validate other charges
    for (const charge of otherCharges) {
      if (!charge.name.trim()) {
        setMessage({ type: "error", text: "Charge name is required for all other charges" });
        return false;
      }
      if (charge.amount && parseFloat(charge.amount) < 0) {
        setMessage({ type: "error", text: `Invalid amount for ${charge.name}` });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { itemTotals } = calculateTotals();
      
      // Filter out charges with empty amounts
      const validOtherCharges = otherCharges
        .filter(charge => charge.name.trim() !== "")
        .map(charge => ({
          name: charge.name,
          amount: parseFloat(charge.amount) || 0
        }));

      const debitNoteData = {
        companyId: selectedCompany,
        purchaseOrderId: selectedPO,
        orgInvoiceNo,
        orgInvoiceDate,
        grRrNo,
        transport,
        vehicleNumber,
        station,
        gstType,
        otherCharges: validOtherCharges,
        items: itemTotals.map(item => ({
          itemId: item.itemId,
          quantity: parseFloat(item.quantity),
          hsnCode: item.hsnCode,
          modelNumber: item.modelNumber,
          itemDetail: item.itemDetail,
          rate: parseFloat(item.rate),
          unit: item.unit,
          gstRate: parseFloat(item.gstRate) || 0
        }))
      };

      console.log("Submitting debit note:", debitNoteData);

      const response = await Api.post(
        "/purchase/debit-note/create",
        debitNoteData
      );

      if (response.data.success) {
        setMessage({ 
          type: "success", 
          text: "Debit Note created successfully!" 
        });
        // Reset form after successful submission
        resetForm();
        setSelectedPO("");
        setPoDetails(null);
      } else {
        setMessage({ 
          type: "error", 
          text: response.data.message || "Failed to create debit note" 
        });
      }
    } catch (error) {
      console.error("Error creating debit note:", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Error creating debit note. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, totalGST, otherChargesTotal, grandTotal } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Debit Note
      </h1>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl">
        <form onSubmit={handleSubmit}>
          {/* Company */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Company Name *
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* PO */}
          {selectedCompany && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Purchase Order *
              </label>

              {loadingPO ? (
                <p className="text-blue-600 text-sm">Loading PO...</p>
              ) : (
                <select
                  value={selectedPO}
                  onChange={(e) => setSelectedPO(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">-- Select PO Number --</option>
                  {purchaseOrders.map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.poNumber}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* PO DETAILS */}
          {loadingDetails && (
            <p className="text-blue-600">Loading PO details...</p>
          )}

          {poDetails && items.length > 0 && (
            <>
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600">PO Number</label>
                  <input
                    value={poDetails.poNumber}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Company</label>
                  <input
                    value={poDetails.companyName}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Vendor</label>
                  <input
                    value={poDetails.vendorName}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Original Invoice No. *
                    </label>
                    <input
                      type="text"
                      value={orgInvoiceNo}
                      onChange={(e) => setOrgInvoiceNo(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Original Invoice Date *
                    </label>
                    <input
                      type="date"
                      value={orgInvoiceDate}
                      onChange={(e) => setOrgInvoiceDate(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      GR/RR No.
                    </label>
                    <input
                      type="text"
                      value={grRrNo}
                      onChange={(e) => setGrRrNo(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Transport
                    </label>
                    <input
                      type="text"
                      value={transport}
                      onChange={(e) => setTransport(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Station
                    </label>
                    <input
                      type="text"
                      value={station}
                      onChange={(e) => setStation(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      GST Type *
                    </label>
                    <select
                      value={gstType}
                      onChange={(e) => setGstType(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">-- Select GST Type --</option>
                      {gstTypes.map((gst) => (
                        <option key={gst.value} value={gst.value}>
                          {gst.label}
                        </option>
                      ))}
                    </select>
                    {!isItemwiseGST && gstType && (
                      <p className="text-sm text-gray-500 mt-1">
                        GST Rate: {getDefaultGSTRate()}%
                      </p>
                    )}
                    {isItemwiseGST && (
                      <p className="text-sm text-blue-600 mt-1">
                        You can set GST rate for each item individually below
                      </p>
                    )}
                  </div>
                </div>

                {/* Other Charges - Dynamic Form */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium">Other Charges</h4>
                    <button
                      type="button"
                      onClick={addOtherCharge}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      + Add Charge
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {otherCharges.map((charge, index) => (
                      <div key={charge.id} className="flex items-center gap-3 p-3 border rounded bg-white">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">
                            Charge Name *
                          </label>
                          <input
                            type="text"
                            value={charge.name}
                            onChange={(e) => handleOtherChargeChange(index, 'name', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Freight, Loading, Insurance, etc."
                            required
                          />
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">
                            Amount (₹)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={charge.amount}
                            onChange={(e) => handleOtherChargeChange(index, 'amount', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter amount"
                          />
                        </div>
                        
                        <div className="pt-6">
                          <button
                            type="button"
                            onClick={() => removeOtherCharge(index)}
                            className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                            disabled={otherCharges.length <= 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary of Other Charges */}
                  {otherChargesTotal > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Other Charges:</span>
                        <span className="font-bold text-lg">₹{otherChargesTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Damaged Stock Table */}
              <h2 className="text-lg font-semibold mb-3">
                Damaged Stock Details
              </h2>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Item Name</th>
                      <th className="border px-3 py-2 text-left">HSN Code</th>
                      <th className="border px-3 py-2 text-left">Model Number</th>
                      <th className="border px-3 py-2 text-left">Item Details</th>
                      <th className="border px-3 py-2 text-left">Quantity</th>
                      <th className="border px-3 py-2 text-left">Unit</th>
                      <th className="border px-3 py-2 text-left">Rate (₹)</th>
                      <th className="border px-3 py-2 text-left">Taxable Value (₹)</th>
                      {isItemwiseGST && (
                        <th className="border px-3 py-2 text-left">GST Rate (%)</th>
                      )}
                      <th className="border px-3 py-2 text-left">GST Amount (₹)</th>
                      <th className="border px-3 py-2 text-left">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const quantity = parseFloat(item.quantity) || 0;
                      const rate = parseFloat(item.rate) || 0;
                      const gstRate = parseFloat(item.gstRate) || 0;
                      const taxableValue = quantity * rate;
                      const gstAmount = (taxableValue * gstRate) / 100;
                      const total = taxableValue + gstAmount;
                      
                      return (
                        <tr key={item.id}>
                          <td className="border px-3 py-2">
                            {item.itemName}
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              value={item.hsnCode}
                              onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
                              className="w-full border rounded px-2 py-1"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              value={item.modelNumber}
                              onChange={(e) => handleItemChange(index, 'modelNumber', e.target.value)}
                              className="w-full border rounded px-2 py-1"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              value={item.itemDetail}
                              onChange={(e) => handleItemChange(index, 'itemDetail', e.target.value)}
                              className="w-full border rounded px-2 py-1"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full border rounded px-2 py-1"
                              required
                            />
                          </td>
                          <td className="border px-3 py-2">
                            {item.unit}
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.rate}
                              onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                              className="w-full border rounded px-2 py-1"
                              required
                            />
                          </td>
                          <td className="border px-3 py-2 text-right">
                            {taxableValue.toFixed(2)}
                          </td>
                          {isItemwiseGST && (
                            <td className="border px-3 py-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  value={item.gstRate}
                                  onChange={(e) => handleItemChange(index, 'gstRate', e.target.value)}
                                  className="w-20 border rounded px-2 py-1"
                                  required={isItemwiseGST}
                                />
                                <span className="text-sm">%</span>
                              </div>
                            </td>
                          )}
                          <td className="border px-3 py-2 text-right">
                            {gstAmount.toFixed(2)}
                          </td>
                          <td className="border px-3 py-2 text-right font-medium">
                            {total.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-end">
                  <div className="w-full md:w-1/3">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal (Taxable Value):</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Total GST:</span>
                      <span>₹{totalGST.toFixed(2)}</span>
                    </div>
                    
                    {/* List individual other charges */}
                    {otherCharges.map((charge, index) => (
                      parseFloat(charge.amount) > 0 && (
                        <div key={index} className="flex justify-between mb-2 text-sm">
                          <span className="text-gray-600">{charge.name}:</span>
                          <span>₹{parseFloat(charge.amount).toFixed(2)}</span>
                        </div>
                      )
                    ))}
                    
                    {otherChargesTotal > 0 && (
                      <div className="flex justify-between mb-2 pt-2 border-t">
                        <span className="font-medium">Other Charges Total:</span>
                        <span className="font-medium">₹{otherChargesTotal.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GST Type Information */}
              {isItemwiseGST && (
                <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="text-md font-semibold text-blue-800 mb-2">
                    GST Itemwise Information
                  </h3>
                  <p className="text-sm text-blue-600">
                    You have selected {gstType.replace("_", " ")}. Please enter GST rate for each item individually.
                    The GST rate can be 0%, 5%, 12%, 18%, 28%, or any other valid percentage.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Creating...
                    </span>
                  ) : "Create Debit Note"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default DebitNot;