import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";

const PoPaymentDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const res = await Api.get(`/purchase/purchase-orders/payments/pending`);
      setData(res.data?.data || []);
    } catch (err) {
      setError("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN");

  const formatAmount = (amount) =>
    `₹ ${Number(amount).toLocaleString("en-IN")}`;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Pending PO Payment Details
      </h2>

      {loading && (
        <p className="text-blue-600 font-medium">Loading...</p>
      )}

      {error && (
        <p className="text-red-600 font-medium">{error}</p>
      )}

      {!loading && data.length === 0 && (
        <p className="text-gray-500">No pending payments found.</p>
      )}

      {!loading && data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-4 py-3">PO Number</th>
                <th className="px-4 py-3">PO Date</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Grand Total</th>
                <th className="px-4 py-3">Total Paid</th>
                <th className="px-4 py-3">Pending Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Items</th>
              </tr>
            </thead>

            <tbody>
              {data.map((po) => (
                <tr
                  key={po.poId}
                  className="border-t hover:bg-gray-50 text-sm"
                >
                  <td className="px-4 py-3 font-medium">
                    {po.poNumber}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(po.poDate)}
                  </td>
                  <td className="px-4 py-3">
                    {po.companyName}
                  </td>
                  <td className="px-4 py-3">
                    {po.vendorName}
                  </td>
                  <td className="px-4 py-3">
                    {formatAmount(po.grandTotal)}
                  </td>
                  <td className="px-4 py-3">
                    {formatAmount(po.totalPaid)}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
                    {formatAmount(po.pendingAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {po.paymentStatusFlag}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ul className="list-disc ml-4 space-y-1">
                      {po.orderedItems.map((item) => (
                        <li key={item.purchaseOrderItemId}>
                          {item.itemName} –{" "}
                          <span className="font-medium">
                            {item.quantity}
                          </span>{" "}
                          {item.unit}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PoPaymentDetails;
