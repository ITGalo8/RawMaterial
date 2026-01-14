import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../../auth/Api"; 
const PaymentRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { poData } = location?.state || {};

  const [billpaymentType, setBillpaymentType] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!billpaymentType) {
      alert("Please select payment type");
      return;
    }

    if (!amount) {
      alert("Please enter amount");
      return;
    }

    const payload = {
      poId: poData?.poId,
      amount: amount,
      billpaymentType: billpaymentType,
    };

    console.log("Playload Dataa: ", payload)

    try {
      setLoading(true);
      await Api.post(
        "/purchase/purchase-orders/payments/request",
        payload
      );

      alert("Payment request sent successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Failed to send payment request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Payment Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PO ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              PO Number
            </label>
            <input
              type="text"
              value={poData?.poNumber || ""}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Vendor Name
            </label>
            <input
              type="text"
              value={poData?.vendorName || ""}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Sub Total
            </label>
            <input
              type="text"
              value={poData?.subTotal || ""}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Grand Total
            </label>
            <input
              type="text"
              value={poData?.grandTotal || ""}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Payment Type
            </label>
            <select
              value={billpaymentType}
              onChange={(e) => setBillpaymentType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Payment Type</option>
              <option value="Advance_Payment">Advance Payment</option>
              <option value="Partial_Payment">Partial Payment</option>
              <option value="Full_Payment">Full Payment</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Payment Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentRequest;
