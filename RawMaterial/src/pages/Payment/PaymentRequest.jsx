import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../../auth/Api";

const PaymentRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { poData } = location?.state || {};

  const [billpaymentType, setBillpaymentType] = useState("");
  const [percentage, setPercentage] = useState("");
  const [amount, setAmount] = useState("");
  const [lastChanged, setLastChanged] = useState("");
  const [loading, setLoading] = useState(false);

  const subTotal = Number(poData?.subTotal || 0);
  const pendingAmount = Number(poData?.pendingAmount || 0);

  /* ===============================
     Decide calculation base
  =============================== */
  const getBaseAmount = () => {
    if (billpaymentType === "Advance_Payment") return subTotal;
    if (billpaymentType === "Partial_Payment") return pendingAmount;
    if (billpaymentType === "Full_Payment") return pendingAmount;
    return 0;
  };

  const baseAmount = getBaseAmount();

  /* ===============================
     Percentage → Amount
  =============================== */
  useEffect(() => {
    if (
      lastChanged === "percentage" &&
      percentage !== "" &&
      baseAmount > 0
    ) {
      const pct = Number(percentage);

      if (pct <= 0 || pct > 100) {
        setAmount("");
        return;
      }

      const calculatedAmount = ((baseAmount * pct) / 100).toFixed(2);
      setAmount(calculatedAmount);
    }
  }, [percentage, baseAmount, lastChanged]);

  /* ===============================
     Amount → Percentage
  =============================== */
  useEffect(() => {
    if (
      lastChanged === "amount" &&
      amount !== "" &&
      baseAmount > 0
    ) {
      const amt = Number(amount);

      if (amt <= 0 || amt > baseAmount) {
        setPercentage("");
        return;
      }

      const calculatedPercentage = ((amt / baseAmount) * 100).toFixed(2);
      setPercentage(calculatedPercentage);
    }
  }, [amount, baseAmount, lastChanged]);

  /* ===============================
     Reset when payment type changes
  =============================== */
  useEffect(() => {
    setPercentage("");
    setAmount("");
    setLastChanged("");
  }, [billpaymentType]);

  /* ===============================
     Submit
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!billpaymentType) {
      alert("Please select payment type");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter valid percentage or amount");
      return;
    }

    const payload = {
      poId: poData?.poId,
      billpaymentType,
      percentage: percentage ? Number(percentage) : null,
      amount: Number(amount),
      baseAmount,
    };

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
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-md p-6">

        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Payment Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PO Number
              </label>
              <input
                type="text"
                value={poData?.poNumber || ""}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
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
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sub Total
              </label>
              <input
                type="text"
                value={subTotal}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Pending Amount
              </label>
              <input
                type="text"
                value={pendingAmount}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Payment Type
              </label>
              <select
                value={billpaymentType}
                onChange={(e) => setBillpaymentType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Payment Type</option>
                <option value="Advance_Payment">Advance Payment</option>
                <option value="Partial_Payment">Partial Payment</option>
                <option value="Full_Payment">Full Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Calculation Base
              </label>
              <input
                type="text"
                value={baseAmount}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Percentage (%)
              </label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => {
                  setPercentage(e.target.value);
                  setLastChanged("percentage");
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setLastChanged("amount");
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Payment Request"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PaymentRequest;
