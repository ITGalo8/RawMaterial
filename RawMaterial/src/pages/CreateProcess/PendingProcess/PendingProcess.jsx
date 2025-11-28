import React, { useEffect, useState } from "react";
import Api from "../../../auth/Api";
import UserItemStock from "../UserItemStock/UserItemStock";
import { useNavigate } from "react-router-dom";

const PendingProcess = () => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [actionType, setActionType] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showUserItemStock, setShowUserItemStock] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarksData, setRemarksData] = useState({
    serviceProcessId: "",
    status: "",
    failureReason: "",
    remarks: "",
  });
  
  const navigate = useNavigate();

  const failureReasons = [
    "VIBRATION",
    "OVERLOAD", 
    "EARTHING",
    "LEAKAGE",
    "REJECTED",
  ];

  const isTestingProcess = (item) => {
    return item.processStage?.toLowerCase().includes("testing") || 
           item.itemName?.toLowerCase().includes("testing");
  };

  const shouldShowDisassembleForm = (item) => {
    return item.disassembleSessionId && item.disassembleStatus;
  };

  const isDisassembleWorkflow = (item) => {
    return shouldShowDisassembleForm(item);
  };

  const fetchPendingActivities = async () => {
    try {
      const res = await Api.get(`/line-worker/getPendingActivitiesForUserStage`);
      if (res.data.success) {
        setPendingList(res.data.data);
      } else {
        setError("No pending activities found.");
      }
    } catch (err) {
      setError("Unable to load pending activities.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (serviceProcessId) => {
    setProcessingId(serviceProcessId);
    setActionType("accept");
    try {
      const res = await Api.put(`/line-worker/acceptServiceProcess`, {
        serviceProcessId: serviceProcessId,
      });

      if (res.data.success) {
        setPendingList((prevList) =>
          prevList.map((item) =>
            item.serviceProcessId === serviceProcessId
              ? { ...item, processAccepted: true }
              : item
          )
        );
        alert("Process accepted successfully!");
      } else {
        setError("Failed to accept process: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      setError("Unable to accept process. Please try again.");
    } finally {
      setProcessingId(null);
      setActionType("");
    }
  };

  const handleStarted = async (serviceProcessId) => {
    setProcessingId(serviceProcessId);
    setActionType("start");
    try {
      const res = await Api.put(`/line-worker/startServiceProcess`, {
        serviceProcessId: serviceProcessId,
      });

      if (res.data.success) {
        setPendingList((prevList) =>
          prevList.map((item) =>
            item.serviceProcessId === serviceProcessId
              ? { ...item, processStarted: true }
              : item
          )
        );
        alert("Process started successfully!");
      } else {
        setError("Failed to start process: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      setError("Unable to start process. Please try again.");
    } finally {
      setProcessingId(null);
      setActionType("");
    }
  };

  const handleTestingStatus = async (serviceProcessId, status) => {
    if (status === "FAILED") {
      setRemarksData({
        serviceProcessId: serviceProcessId,
        status: status,
        failureReason: "",
        remarks: "",
      });
      setShowRemarksModal(true);
    } else {
      setRemarksData({
        serviceProcessId: serviceProcessId,
        status: status,
        failureReason: "",
        remarks: "",
      });
      setShowRemarksModal(true);
    }
  };

  const openRemarksModal = (serviceProcessId, status) => {
    setRemarksData({
      serviceProcessId: serviceProcessId,
      status: status,
      failureReason: "",
      remarks: "",
    });
    setShowRemarksModal(true);
  };

  const handleRemarksSubmit = async () => {
    if (remarksData.status === "FAILED" && !remarksData.failureReason) {
      alert("Please select a failure reason before submitting.");
      return;
    }

    if (!remarksData.remarks.trim()) {
      alert("Please enter remarks before submitting.");
      return;
    }

    setProcessingId(remarksData.serviceProcessId);
    setActionType(remarksData.status.toLowerCase());

    try {
      const res = await Api.post(`/line-worker/completeServiceProcess`, remarksData);

      if (res.data.success) {
        setPendingList((prevList) =>
          prevList.filter(
            (item) => item.serviceProcessId !== remarksData.serviceProcessId
          )
        );
        
        if (remarksData.status === "COMPLETED") {
          alert("Process completed successfully!");
        } else if (remarksData.status === "SKIPPED") {
          alert("Process skipped successfully!");
        } else if (remarksData.status === "REJECTED") {
          alert("Process rejected successfully!");
        } else if (remarksData.status === "FAILED") {
          alert("Process marked as failed successfully!");
        }
      } else {
        setError(`Failed to ${remarksData.status.toLowerCase()} process: ` + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      setError(`Unable to ${remarksData.status.toLowerCase()} process. Please try again.`);
    } finally {
      setProcessingId(null);
      setActionType("");
      setShowRemarksModal(false);
      setRemarksData({
        serviceProcessId: "",
        status: "",
        failureReason: "",
        remarks: "",
      });
    }
  };

  const handleCloseRemarksModal = () => {
    setShowRemarksModal(false);
    setRemarksData({
      serviceProcessId: "",
      status: "",
      failureReason: "",
      remarks: "",
    });
  };

  const handleFormFill = (item) => {
    navigate("/user-item-stock", {
      state: { serviceProcessId: item.serviceProcessId },
    });
  };

  const handleDisassembleForm = (item) => {
    navigate("/reusable-items", {
      state: { 
        serviceProcessId: item.serviceProcessId,
        disassembleSessionId: item.disassembleSessionId,
        isDisassemblePending: item.isDisassemblePending,
        disassembleStatus: item.disassembleStatus
      },
    });
  };

  const handleCloseUserItemStock = () => {
    setShowUserItemStock(false);
    setSelectedProcess(null);
  };

  const getButtonText = (buttonType, serviceProcessId) => {
    if (processingId === serviceProcessId && actionType === buttonType) {
      return (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {buttonType === "accept"
            ? "Accepting..."
            : buttonType === "start"
            ? "Starting..."
            : buttonType === "complete"
            ? "Completing..."
            : buttonType === "rejected"
            ? "Rejecting..."
            : buttonType === "failed"
            ? "Marking as Failed..."
            : "Skipping..."}
        </>
      );
    }
    return buttonType === "accept"
      ? "Accept"
      : buttonType === "start"
      ? "Started"
      : buttonType === "complete"
      ? "Completed"
      : buttonType === "rejected"
      ? "Rejected"
      : buttonType === "failed"
      ? "Failed"
      : "Skip";
  };

  const isButtonDisabled = (serviceProcessId) => {
    return processingId === serviceProcessId;
  };

  const shouldShowActionButton = (item, buttonType) => {
    switch (buttonType) {
      case "accept":
        return !item.processAccepted;
      case "start":
        return item.processAccepted && !item.processStarted;
      case "complete":
        return item.processStarted && !item.processCompleted;
      default:
        return false;
    }
  };

  const isProcessAccepted = (item) => {
    return item.processAccepted;
  };

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-fadeIn flex items-center gap-3 text-lg text-gray-700">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        Loading pending tasks...
      </div>
    </div>
  );

  if (error) return (
    <div className="animate-fadeIn bg-red-50 border border-red-200 rounded-lg p-4 m-4 text-red-700 text-center">
      {error}
    </div>
  );

  return (
    <>
      {/* User Item Stock Modal */}
      {showUserItemStock && selectedProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Form Fill - {selectedProcess.itemName}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={handleCloseUserItemStock}
              >
                ×
              </button>
            </div>
            <div className="max-h-[calc(90vh-80px)] overflow-auto">
              <UserItemStock
                processData={selectedProcess}
                onClose={handleCloseUserItemStock}
              />
            </div>
          </div>
        </div>
      )}

      {/* Remarks Modal */}
      {showRemarksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md animate-fadeIn">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {remarksData.status === "COMPLETED"
                  ? "Complete Process"
                  : remarksData.status === "REJECTED"
                  ? "Reject Process"
                  : remarksData.status === "FAILED"
                  ? "Mark as Failed"
                  : "Skip Process"}{" "}
                - Remarks
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={handleCloseRemarksModal}
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              {remarksData.status === "FAILED" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please select the failure reason: *
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={remarksData.failureReason}
                    onChange={(e) => {
                      const selectedReason = e.target.value;
                      setRemarksData(prev => ({
                        ...prev,
                        failureReason: selectedReason,
                        remarks: prev.remarks || `${selectedReason} issue detected during testing`
                      }));
                    }}
                  >
                    <option value="">Select a failure reason</option>
                    {failureReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                  {remarksData.failureReason && (
                    <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
                      Selected: <strong>{remarksData.failureReason}</strong>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {remarksData.status === "COMPLETED"
                    ? "Please enter completion remarks: *"
                    : remarksData.status === "REJECTED"
                    ? "Please enter rejection details: *"
                    : remarksData.status === "FAILED"
                    ? "Please enter failure details: *"
                    : "Please enter reason for skipping: *"}
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[100px]"
                  value={remarksData.remarks}
                  onChange={(e) =>
                    setRemarksData((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  placeholder={
                    remarksData.status === "COMPLETED"
                      ? "Enter completion remarks..."
                      : remarksData.status === "REJECTED"
                      ? "Enter rejection details..."
                      : remarksData.status === "FAILED"
                      ? "Enter failure details..."
                      : "Enter reason for skipping..."
                  }
                  rows="4"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  onClick={handleCloseRemarksModal}
                  disabled={processingId === remarksData.serviceProcessId}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-md font-medium disabled:opacity-50 flex items-center gap-2 ${
                    remarksData.status === "COMPLETED"
                      ? "bg-green-500 hover:bg-green-600"
                      : remarksData.status === "REJECTED"
                      ? "bg-red-500 hover:bg-red-600"
                      : remarksData.status === "FAILED"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-yellow-500 hover:bg-yellow-600 text-gray-800"
                  }`}
                  onClick={handleRemarksSubmit}
                  disabled={
                    processingId === remarksData.serviceProcessId ||
                    !remarksData.remarks.trim() ||
                    (remarksData.status === "FAILED" && !remarksData.failureReason)
                  }
                >
                  {processingId === remarksData.serviceProcessId ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {remarksData.status === "COMPLETED"
                        ? "Completing..."
                        : remarksData.status === "REJECTED"
                        ? "Rejecting..."
                        : remarksData.status === "FAILED"
                        ? "Marking as Failed..."
                        : "Skipping..."}
                    </>
                  ) : remarksData.status === "COMPLETED" ? (
                    "Complete"
                  ) : remarksData.status === "REJECTED" ? (
                    "Reject"
                  ) : remarksData.status === "FAILED" ? (
                    "Mark as Failed"
                  ) : (
                    "Skip"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen p-4 max-w-7xl mx-auto animate-fadeIn">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Pending Process List
        </h2>

        {pendingList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending activities.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingList.map((item) => (
              <div 
                key={item.activityId} 
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-3 pb-2 border-b">
                  {item.itemName}
                </h3>

                <div className="space-y-2 mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Product:</span> {item.productName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Serial:</span> {item.serialNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Qty:</span> {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Stage:</span> {item.processStage}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {item.status}
                  </p>
                  
                  {shouldShowDisassembleForm(item) && (
                    <p className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      <span className="font-medium">Disassemble Status:</span> {item.disassembleStatus}
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">Created:</span> {new Date(item.createdAt).toLocaleString()}
                </p>

                {/* Button Group */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {isDisassembleWorkflow(item) ? (
                    <>
                      {shouldShowActionButton(item, "accept") && (
                        <button
                          className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                            processingId === item.serviceProcessId && actionType === "accept"
                              ? "bg-green-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          onClick={() => handleAccept(item.serviceProcessId)}
                          disabled={isButtonDisabled(item.serviceProcessId)}
                        >
                          {getButtonText("accept", item.serviceProcessId)}
                        </button>
                      )}

                      {item.processAccepted && !item.processStarted && (
                        <button
                          className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                            processingId === item.serviceProcessId && actionType === "start"
                              ? "bg-blue-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                          onClick={() => handleStarted(item.serviceProcessId)}
                          disabled={isButtonDisabled(item.serviceProcessId)}
                        >
                          {getButtonText("start", item.serviceProcessId)}
                        </button>
                      )}

                      {item.processStarted && !item.processCompleted && (
                        <button
                          className="flex-1 px-3 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
                          onClick={() => handleDisassembleForm(item)}
                        >
                          Fill Form
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {shouldShowActionButton(item, "accept") && (
                        <button
                          className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                            processingId === item.serviceProcessId && actionType === "accept"
                              ? "bg-green-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          onClick={() => handleAccept(item.serviceProcessId)}
                          disabled={isButtonDisabled(item.serviceProcessId)}
                        >
                          {getButtonText("accept", item.serviceProcessId)}
                        </button>
                      )}

                      {isProcessAccepted(item) && (
                        <>
                          {shouldShowActionButton(item, "start") && (
                            <button
                              className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                                processingId === item.serviceProcessId && actionType === "start"
                                  ? "bg-blue-600"
                                  : "bg-blue-500 hover:bg-blue-600"
                              }`}
                              onClick={() => handleStarted(item.serviceProcessId)}
                              disabled={isButtonDisabled(item.serviceProcessId)}
                            >
                              {getButtonText("start", item.serviceProcessId)}
                            </button>
                          )}

                          {isTestingProcess(item) && item.processStarted && !item.processCompleted && (
                            <>
                              <button
                                className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                                  processingId === item.serviceProcessId && actionType === "complete"
                                    ? "bg-teal-600"
                                    : "bg-teal-500 hover:bg-teal-600"
                                }`}
                                onClick={() => handleTestingStatus(item.serviceProcessId, "COMPLETED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                {getButtonText("complete", item.serviceProcessId)}
                              </button>

                              <button
                                className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                                  processingId === item.serviceProcessId && actionType === "rejected"
                                    ? "bg-red-600"
                                    : "bg-red-500 hover:bg-red-600"
                                }`}
                                onClick={() => handleTestingStatus(item.serviceProcessId, "REJECTED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                {getButtonText("rejected", item.serviceProcessId)}
                              </button>

                              <button
                                className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                                  processingId === item.serviceProcessId && actionType === "failed"
                                    ? "bg-orange-600"
                                    : "bg-orange-500 hover:bg-orange-600"
                                }`}
                                onClick={() => handleTestingStatus(item.serviceProcessId, "FAILED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                {getButtonText("failed", item.serviceProcessId)}
                              </button>

                              <button
                                className="flex-1 px-3 py-2 bg-purple-500 text-white rounded text-sm font-medium hover:bg-purple-600 disabled:opacity-50"
                                onClick={() => handleFormFill(item)}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                Form Fill
                              </button>
                            </>
                          )}

                          {!isTestingProcess(item) && item.processStarted && !item.processCompleted && (
                            <>
                              <button
                                className={`flex-1 px-3 py-2 text-white rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                                  processingId === item.serviceProcessId && actionType === "complete"
                                    ? "bg-teal-600"
                                    : "bg-teal-500 hover:bg-teal-600"
                                }`}
                                onClick={() => openRemarksModal(item.serviceProcessId, "COMPLETED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                {getButtonText("complete", item.serviceProcessId)}
                              </button>

                              <button
                                className="flex-1 px-3 py-2 bg-yellow-500 text-gray-800 rounded text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
                                onClick={() => openRemarksModal(item.serviceProcessId, "SKIPPED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                Skip
                              </button>

                              <button
                                className="flex-1 px-3 py-2 bg-purple-500 text-white rounded text-sm font-medium hover:bg-purple-600 disabled:opacity-50"
                                onClick={() => handleFormFill(item)}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                Form Fill
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-2 text-xs">
                  <div className={`flex flex-col items-center ${item.processAccepted ? "text-green-600" : "text-blue-600"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      item.processAccepted ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                    }`}>
                      1
                    </div>
                    <span>Accepted</span>
                  </div>
                  <div className={`flex-1 h-1 mx-1 ${item.processAccepted ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <div className={`flex flex-col items-center ${
                    item.processStarted ? "text-green-600" : item.processAccepted ? "text-blue-600" : "text-gray-400"
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      item.processStarted ? "bg-green-500 text-white" : item.processAccepted ? "bg-blue-500 text-white" : "bg-gray-300"
                    }`}>
                      2
                    </div>
                    <span>Started</span>
                  </div>
                  <div className={`flex-1 h-1 mx-1 ${item.processStarted ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <div className={`flex flex-col items-center ${
                    item.processCompleted ? "text-green-600" : item.processStarted ? "text-blue-600" : "text-gray-400"
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      item.processCompleted ? "bg-green-500 text-white" : item.processStarted ? "bg-blue-500 text-white" : "bg-gray-300"
                    }`}>
                      3
                    </div>
                    <span>{isDisassembleWorkflow(item) ? "Fill Form" : "Completed"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PendingProcess;