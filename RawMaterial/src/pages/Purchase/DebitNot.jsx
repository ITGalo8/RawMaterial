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
    { name: "Freight", amount: "" },
    { name: "Loading", amount: "" }
  ]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

  const resetForm = () => {
    setOrgInvoiceNo("");
    setOrgInvoiceDate("");
    setGrRrNo("");
    setTransport("");
    setVehicleNumber("");
    setStation("");
    setGstType("");
    setOtherCharges([
      { name: "Freight", amount: "" },
      { name: "Loading", amount: "" }
    ]);
    setItems([]);
    setMessage({ type: "", text: "" });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleOtherChargeChange = (index, value) => {
    const updatedCharges = [...otherCharges];
    updatedCharges[index].amount = value;
    setOtherCharges(updatedCharges);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    const itemTotals = items.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const total = quantity * rate;
      subtotal += total;
      return {
        ...item,
        total: total.toFixed(2)
      };
    });

    const otherChargesTotal = otherCharges.reduce((sum, charge) => {
      return sum + (parseFloat(charge.amount) || 0);
    }, 0);

    const grandTotal = subtotal + otherChargesTotal;

    return { itemTotals, subtotal, otherChargesTotal, grandTotal };
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
        otherCharges: otherCharges.map(charge => ({
          name: charge.name,
          amount: parseFloat(charge.amount) || 0
        })),
        items: itemTotals.map(item => ({
          itemId: item.itemId,
          quantity: parseFloat(item.quantity),
          hsnCode: item.hsnCode,
          modelNumber: item.modelNumber,
          itemDetail: item.itemDetail,
          rate: parseFloat(item.rate),
          unit: item.unit
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

  const { subtotal, otherChargesTotal, grandTotal } = calculateTotals();

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
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-6xl">
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
                    className="w-full border rounded px-3 py-2 bg-black-100"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Company</label>
                  <input
                    value={poDetails.companyName}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-black-100"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Vendor</label>
                  <input
                    value={poDetails.vendorName}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-black-100"
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="mb-8 p-4 border rounded-lg bg-black-50">
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
                  </div>
                </div>

                {/* Other Charges */}
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-3">Other Charges</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherCharges.map((charge, index) => (
                      <div key={charge.name}>
                        <label className="block text-sm font-medium mb-1">
                          {charge.name} (₹)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={charge.amount}
                          onChange={(e) => handleOtherChargeChange(index, e.target.value)}
                          className="w-full border rounded px-3 py-2"
                          placeholder="Enter amount"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Damaged Stock Table */}
              <h2 className="text-lg font-semibold mb-3">
                Damaged Stock Details
              </h2>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border border-black-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Item Name</th>
                      <th className="border px-3 py-2 text-left">HSN Code</th>
                      <th className="border px-3 py-2 text-left">Model Number</th>
                      <th className="border px-3 py-2 text-left">Item Details</th>
                      <th className="border px-3 py-2 text-left">Quantity</th>
                      <th className="border px-3 py-2 text-left">Unit</th>
                      <th className="border px-3 py-2 text-left">Rate (₹)</th>
                      <th className="border px-3 py-2 text-left">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
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
                        <td className="border px-3 py-2">
                          {(parseFloat(item.quantity || 0) * parseFloat(item.rate || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-end">
                  <div className="w-full md:w-1/3">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {otherCharges.map((charge, index) => (
                      parseFloat(charge.amount) > 0 && (
                        <div key={index} className="flex justify-between mb-2">
                          <span>{charge.name}:</span>
                          <span>₹{parseFloat(charge.amount).toFixed(2)}</span>
                        </div>
                      )
                    ))}
                    <div className="flex justify-between mb-2">
                      <span>Other Charges Total:</span>
                      <span>₹{otherChargesTotal.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Debit Note"}
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