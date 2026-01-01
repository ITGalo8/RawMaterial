import React, { useState, useEffect } from "react";
import Api from "../../../auth/Api";

const StoreKeeper = () => {
  const [lineWorkers, setLineWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [materialGivenLoading, setMaterialGivenLoading] = useState(null);
  const [declineRemarks, setDeclineRemarks] = useState({});
  const [showRemarksField, setShowRemarksField] = useState({});

  useEffect(() => {
    const fetchLineWorkers = async () => {
      try {
        const response = await Api.get("/store-keeper/getLineWorkerList");
        setLineWorkers(response?.data?.data || []);
      } catch (err) {
        setError("Error fetching workers: " + (err?.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    

    fetchLineWorkers();
  }, []);

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      if (!selectedWorker) {
        setIncomingRequests([]);
        return;
      }

      setRequestsLoading(true);
      try {
        const response = await Api.get(
          `/store-keeper/showIncomingItemRequest?empId=${selectedWorker}`
        );

        if (response.data.success) {
          setIncomingRequests(response.data.data || []);
        } else {
          setIncomingRequests([]);
        }
      } catch (err) {
        setError("Error fetching incoming requests: " + err?.response?.data?.message || err.message);
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchIncomingRequests();
  }, [selectedWorker]);

  // ---------------- APPROVE ----------------
  const handleApprove = async (requestId) => {
    try {
      const response = await Api.put("/store-keeper/approveOrDeclineItemRequest", {
        itemRequestId: requestId,
        action: "APPROVE",
      });

      if (response.data.success) {
        alert("Request approved successfully!");
        refreshRequests();
      } else {
        alert("Failed to approve request: " + response.data.message);
      }
    } catch (err) {
      alert("Error approving request: " + (err?.response?.data?.message || err.message));
    }
  };

  // ---------------- DECLINE ----------------
  const handleDecline = async (requestId) => {
    const remarks = declineRemarks[requestId]?.trim();

    if (!remarks) {
      alert("Remarks are required to decline the request.");
      return;
    }

    try {
      const response = await Api.put("/store-keeper/approveOrDeclineItemRequest", {
        itemRequestId: requestId,
        action: "DECLINE",
        remarks,
      });

      if (response.data.success) {
        alert("Request declined successfully!");
        refreshRequests();
        // Reset remarks field
        setDeclineRemarks(prev => ({ ...prev, [requestId]: "" }));
        setShowRemarksField(prev => ({ ...prev, [requestId]: false }));
      } else {
        alert("Failed to decline request: " + response.data.message);
      }
    } catch (err) {
      alert("Error declining request: " + (err?.response?.data?.message || err.message));
    }
  };

  // ---------------- SANCTION MATERIAL ----------------
  const handleMaterialGiven = async (requestId) => {
    setMaterialGivenLoading(requestId);
    try {
      const response = await Api.post("/store-keeper/sanctionItemForRequest", {
        itemRequestId: requestId,
      });

      if (response.data.success) {
        alert("Material sanctioned successfully!");
        refreshRequests();
      } else {
        alert("Failed to sanction material: " + response.data.message);
      }
    } catch (err) {
      alert("Error sanctioning material: " + (err?.response?.data?.message || err.message));
    } finally {
      setMaterialGivenLoading(null);
    }
  };

  const refreshRequests = async () => {
    const response = await Api.get(
      `/store-keeper/showIncomingItemRequest?empId=${selectedWorker}`
    );
    if (response.data.success) {
      setIncomingRequests(response.data.data || []);
    }
  };

  const handleWorkerChange = (event) => {
    setSelectedWorker(event.target.value);
    setError(null);
  };

  const handleDeclineClick = (requestId) => {
    setShowRemarksField(prev => ({ ...prev, [requestId]: true }));
  };

  const handleCancelDecline = (requestId) => {
    setShowRemarksField(prev => ({ ...prev, [requestId]: false }));
    setDeclineRemarks(prev => ({ ...prev, [requestId]: "" }));
  };

  const handleRemarksChange = (requestId, value) => {
    setDeclineRemarks(prev => ({ ...prev, [requestId]: value }));
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Helper function to determine request status
  const getRequestStatus = (request) => {
    if (request.declined === true) return "declined";
    if (request.approved === true) return "approved";
    if (request.approved === false) return "rejected";
    return "pending";
  };

  if (loading) {
    return <div className="p-4 text-center bg-blue-50 text-blue-600">Loading line workers...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-600">
        Error: {error}
        <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans">
      <h2 className="text-2xl font-bold mb-6 text-center">StoreKeeper Dashboard</h2>

      {/* Worker Dropdown */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block mb-2 font-semibold">Select Line Worker:</label>
        <select
          value={selectedWorker}
          onChange={handleWorkerChange}
          className="w-full p-3 border rounded"
        >
          <option value="">-- Select a Line Worker --</option>
          {lineWorkers.map((worker) => (
            <option key={worker.id} value={worker.id}>
              {worker.name} - {worker.role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading incoming requests */}
      {requestsLoading && (
        <div className="p-4 bg-blue-50 text-blue-600 text-center">Loading incoming requests...</div>
      )}

      {/* Incoming Requests List */}
      {selectedWorker && !requestsLoading && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-5 text-center">Incoming Requests</h3>

          {incomingRequests.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg border">
              No pending requests for this worker.
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((request) => {
                const status = getRequestStatus(request);
                
                return (
                  <div key={request.id} className="p-4 bg-white shadow rounded border-l-4 border-blue-500">

                    {/* STATUS */}
                    <div className="mb-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {status === "pending" && "Pending"}
                        {status === "approved" && "Approved"}
                        {status === "declined" && "Declined"}
                        {status === "rejected" && "Rejected"}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="text-sm space-y-1">
                      <div><strong>Requested At:</strong> {formatDate(request.requestedAt)}</div>
                      <div><strong>Process Request:</strong> {request.isProcessRequest ? "Yes" : "No"}</div>
                    </div>

                    {/* MATERIALS */}
                    <div className="mt-3 bg-gray-50 p-3 rounded">
                      <h4 className="font-semibold mb-2">Requested Materials:</h4>
                      {request.rawMaterialRequested.map((mat, i) => (
                        <div key={i} className="border-l-4 border-green-500 bg-white p-2 rounded mb-2">
                          <div><strong>Name:</strong> {mat.name}</div>
                          <div><strong>Qty:</strong> {mat.quantity} {mat.unit}</div>
                        </div>
                      ))}
                    </div>

                    {/* DECLINED REMARKS */}
                    {request.declinedRemarks && (
                      <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                        <div className="text-sm">
                          <strong>Decline Reason:</strong> {request.declinedRemarks}
                        </div>
                      </div>
                    )}

                    {/* SHOW BUTTONS BASED ON STATUS */}
                    {status === "pending" && (
                      <div className="mt-4">
                        {!showRemarksField[request.id] ? (
                          <div className="flex gap-3">
                            <button
                              className="flex-1 px-4 py-2 bg-green-500 text-white rounded"
                              onClick={() => handleApprove(request.id)}
                            >
                              Approve
                            </button>

                            <button
                              className="flex-1 px-4 py-2 bg-red-500 text-white rounded"
                              onClick={() => handleDeclineClick(request.id)}
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for declining:
                              </label>
                              <textarea
                                value={declineRemarks[request.id] || ""}
                                onChange={(e) => handleRemarksChange(request.id, e.target.value)}
                                placeholder="Enter reason for declining this request..."
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                rows="3"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded"
                                onClick={() => handleDecline(request.id)}
                                disabled={!declineRemarks[request.id]?.trim()}
                              >
                                Confirm Decline
                              </button>
                              <button
                                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded"
                                onClick={() => handleCancelDecline(request.id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SANCTION MATERIAL BUTTON - Only show for approved requests where material is not given */}
                    {status === "approved" && !request.materialGiven && (
                      <button
                        className="w-full mt-4 px-4 py-2 bg-teal-500 text-white rounded"
                        disabled={materialGivenLoading === request.id}
                        onClick={() => handleMaterialGiven(request.id)}
                      >
                        {materialGivenLoading === request.id ? "Sanctioning..." : "Sanction & Send Material"}
                      </button>
                    )}

                    {/* STATUS MESSAGES */}
                    {request.materialGiven && (
                      <div className="mt-3 text-green-600 font-bold text-center">
                        ✓ Material Sanctioned & Sent
                      </div>
                    )}

                    {status === "declined" && (
                      <div className="mt-3 text-red-600 font-bold text-center">
                        ✗ Request Declined
                      </div>
                    )}

                    {status === "rejected" && (
                      <div className="mt-3 text-red-600 font-bold text-center">
                        ✗ Request Rejected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!selectedWorker && (
        <div className="text-center p-6 text-gray-600">
          Please select a worker to view their requests.
        </div>
      )}
    </div>
  );
};

export default StoreKeeper;