import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
import { useUser } from "../../Context/UserContext";

const PrePoRequestHistory = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [prepoHistory, setPrepoHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({});
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    fetchPrePoHistory();
  }, []);

  const fetchPrePoHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await Api.get("/pre-po/pre-po-request");
      if (response.data.success) {
        setPrepoHistory(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      PREPO_APPROVED: { className: "bg-emerald-100 text-emerald-800", label: "PREPO_APPROVED" },
      PREPO_REJECTED: { className: "bg-rose-100 text-rose-800", label: "PREPO_REJECTED" },
      PREPO_REQUESTED: { className: "bg-blue-100 text-blue-800", label: "PREPO_REQUESTED" },
      PREPO_DRAFT: { className: "bg-slate-100 text-slate-800", label: "PREPO_DRAFT" },
    };
    const fallback = { className: "bg-amber-100 text-amber-800", label: status || "Unknown" };
    return config[status] || fallback;
  };

  // Determine if Approve/Reject buttons should be shown
  const isActionable = (status) => {
    if (user?.role === "Purchase") {
      return status === "PREPO_REQUESTED";
    }
    return status === "PREPO_DRAFT";
  };

  const updateStatus = async (requestId, status) => {
    setUpdating((prev) => ({ ...prev, [requestId]: true }));
    setActionMessage(null);
    try {
      const response = await Api.post(`/pre-po/pre-po-request/${requestId}`, { status });
      if (response.data.success) {
        setActionMessage({
          type: "success",
          text: `Request ${status.toLowerCase().replace("prepo_", "")} successfully!`,
        });
        await fetchPrePoHistory();
      } else {
        setActionMessage({ type: "error", text: response.data.message || "Update failed" });
      }
    } catch (err) {
      console.error("Update error:", err);
      setActionMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Something went wrong",
      });
    } finally {
      setUpdating((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleApprove = (id) => {
    const targetStatus = user?.role === "Purchase" ? "PREPO_APPROVED" : "PREPO_REQUESTED";
    updateStatus(id, targetStatus);
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      updateStatus(id, "PREPO_REJECTED");
    }
  };

  const handleCreatePO = (request) => {
    const vendor = request.vendor || {};
    const items = request.prePoItems || [];

    const reorderData = {
      vendorId: vendor.id || request.vendorId || "",
      contactPerson: vendor.contactPerson || "",
      cellNo: vendor.contactNumber || "",
      items: items.map((item) => ({
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        prePoId: item.prePoId,
      })),
      prePoId: request.id,
      fromPrePo: true,
    };

    navigate("/create-purchase-order", {
      state: { reorderData },
    });
  };

  // --- Render states ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-200"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-400"></div>
        </div>
        <span className="ml-3 text-gray-500">Loading Pre‑PO Requests…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block bg-rose-50 rounded-xl px-6 py-4 border border-rose-200 shadow-sm">
          <p className="text-rose-600 font-medium">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📋 Pre‑PO Requests
          <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {prepoHistory.length}
          </span>
        </h2>
        <p className="text-sm text-gray-400 mt-1 sm:mt-0">
          Updated: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Action feedback */}
      {actionMessage && (
        <div
          className={`mb-4 p-4 rounded-xl border ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          } shadow-sm`}
        >
          {actionMessage.text}
        </div>
      )}

      {prepoHistory.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No Pre‑PO Requests Found</p>
          <p className="text-gray-400 text-sm mt-1">Create a new request to get started.</p>
        </div>
      ) : (
        <>
          {/* --- Desktop Table (md and above) --- */}
          <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {prepoHistory.map((request) => {
                    const { className: badgeClass, label } = getStatusBadge(request.status);
                    const vendor = request.vendor || {};
                    const items = request.prePoItems || [];
                    const isUpdating = updating[request.id] || false;
                    const canAct = isActionable(request.status);

                    return (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vendor.name || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {vendor.contactPerson || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {vendor.contactNumber || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
                            {label}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(request.updatedAt)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {items.length > 0 ? (
                            <ul className="space-y-1 max-h-24 overflow-y-auto pr-2">
                              {items.map((item) => (
                                <li key={item.id} className="border-b border-gray-100 pb-1 last:border-0 last:pb-0 text-xs">
                                  <span className="font-medium">{item.itemName}</span>
                                  <span className="text-gray-500 ml-1">
                                    Qty: {item.quantity} {item.unit}
                                  </span>
                                  <span className="text-gray-500 ml-1">₹{item.rate}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400 italic">No items</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          {canAct ? (
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleApprove(request.id)}
                                disabled={isUpdating}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                  isUpdating
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 active:scale-95"
                                }`}
                              >
                                {isUpdating ? "⏳" : "✅ Approve"}
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                disabled={isUpdating}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                  isUpdating
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-rose-100 text-rose-700 hover:bg-rose-200 active:scale-95"
                                }`}
                              >
                                {isUpdating ? "⏳" : "❌ Reject"}
                              </button>
                            </div>
                          ) : user?.role === "Purchase" && request.status === "PREPO_APPROVED" ? (
                            <button
                              onClick={() => handleCreatePO(request)}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              📄 Create PO
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Mobile Card View (below md) --- */}
          <div className="md:hidden space-y-4">
            {prepoHistory.map((request) => {
              const { className: badgeClass, label } = getStatusBadge(request.status);
              const vendor = request.vendor || {};
              const items = request.prePoItems || [];
              const isUpdating = updating[request.id] || false;
              const canAct = isActionable(request.status);

              return (
                <div key={request.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-4 transition-all hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-800">{vendor.name || "—"}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {vendor.contactPerson && <span>{vendor.contactPerson}</span>}
                        {vendor.contactNumber && <span className="ml-2">· {vendor.contactNumber}</span>}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
                      {label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs uppercase">Created</span>
                      <div className="font-medium text-gray-700">{formatDate(request.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs uppercase">Updated</span>
                      <div className="font-medium text-gray-700">{formatDate(request.updatedAt)}</div>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <span className="text-gray-500 text-xs uppercase">Items</span>
                      <ul className="mt-1 space-y-1">
                        {items.map((item) => (
                          <li key={item.id} className="flex justify-between text-sm">
                            <span className="font-medium text-gray-800">{item.itemName}</span>
                            <span className="text-gray-600">
                              {item.quantity} {item.unit} · ₹{item.rate}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {canAct ? (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={isUpdating}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          isUpdating
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 active:scale-95"
                        }`}
                      >
                        {isUpdating ? "⏳ Approving…" : "✅ Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={isUpdating}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          isUpdating
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200 active:scale-95"
                        }`}
                      >
                        {isUpdating ? "⏳ Rejecting…" : "❌ Reject"}
                      </button>
                    </div>
                  ) : user?.role === "Purchase" && request.status === "PREPO_APPROVED" ? (
                    <div className="mt-4">
                      <button
                        onClick={() => handleCreatePO(request)}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        📄 Create Purchase Order
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PrePoRequestHistory;