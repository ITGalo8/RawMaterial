import React, { useEffect, useState } from "react";
import Api from '../../../auth/Api'
import UserItemStock from '../UserItemStock/UserItemStock'; // Import the UserItemStock component
import "./PendingProcess.css";
import { useNavigate } from "react-router-dom";

const PendingProcess = () => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [actionType, setActionType] = useState(""); // 'accept', 'start', 'complete', 'skip'
  const [selectedProcess, setSelectedProcess] = useState(null); // Track which process is selected for form fill
  const [showUserItemStock, setShowUserItemStock] = useState(false); // Control UserItemStock visibility
  const [showRemarksModal, setShowRemarksModal] = useState(false); // Control remarks modal visibility
  const [remarksData, setRemarksData] = useState({
    serviceProcessId: "",
    status: "",
    failureReason: "",
    remarks: ""
  });
  const navigate = useNavigate();

  // Fetch pending process list
  const fetchPendingActivities = async () => {
    try {
      const res = await Api.get(
        `/line-worker/getPendingActivitiesForUserStage`
      );

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

  // Accept process function
  const handleAccept = async (serviceProcessId) => {
    setProcessingId(serviceProcessId);
    setActionType("accept");
    try {
      const res = await Api.put(
        `/line-worker/acceptServiceProcess`,
        {
          serviceProcessId: serviceProcessId
        }
      );

      if (res.data.success) {
        // Update the item to mark as accepted
        setPendingList(prevList => 
          prevList.map(item => 
            item.serviceProcessId === serviceProcessId 
              ? { ...item, processAccepted: true }
              : item
          )
        );
        
        console.log("Process accepted successfully:", res.data);
        alert("Process accepted successfully!");
      } else {
        setError("Failed to accept process: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error accepting process:", err);
      setError("Unable to accept process. Please try again.");
    } finally {
      setProcessingId(null);
      setActionType("");
    }
  };

  // Start process function
  const handleStarted = async (serviceProcessId) => {
    setProcessingId(serviceProcessId);
    setActionType("start");
    try {
      const res = await Api.put(
        `/line-worker/startServiceProcess`,
        {
          serviceProcessId: serviceProcessId
        }
      );

      if (res.data.success) {
        // Update the item to mark as started
        setPendingList(prevList => 
          prevList.map(item => 
            item.serviceProcessId === serviceProcessId 
              ? { ...item, processStarted: true }
              : item
          )
        );
        
        console.log("Process started successfully:", res.data);
        alert("Process started successfully!");
      } else {
        setError("Failed to start process: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error starting process:", err);
      setError("Unable to start process. Please try again.");
    } finally {
      setProcessingId(null);
      setActionType("");
    }
  };

  // Open remarks modal for Skip or Complete
  const openRemarksModal = (serviceProcessId, status) => {
    setRemarksData({
      serviceProcessId: serviceProcessId,
      status: status,
      // failureReason: status === "SKIPPED" ? "Skipped by user" : "",
      remarks: ""
    });
    setShowRemarksModal(true);
  };

  // Handle remarks submission
  const handleRemarksSubmit = async () => {
    if (!remarksData.remarks.trim()) {
      alert("Please enter remarks before submitting.");
      return;
    }

    setProcessingId(remarksData.serviceProcessId);
    setActionType(remarksData.status === "SKIPPED" ? "skip" : "complete");

    try {
      const res = await Api.post(
        `/line-worker/completeServiceProcess`,
        remarksData
      );

      if (res.data.success) {
        if (remarksData.status === "COMPLETED") {
          // Remove completed item from the list
          setPendingList(prevList => 
            prevList.filter(item => item.serviceProcessId !== remarksData.serviceProcessId)
          );
          alert("Process completed successfully!");
        } else if (remarksData.status === "SKIPPED") {
          // Remove skipped item from the list
          setPendingList(prevList => 
            prevList.filter(item => item.serviceProcessId !== remarksData.serviceProcessId)
          );
          alert("Process skipped successfully!");
        }
        
        console.log("Operation successful:", res.data);
      } else {
        setError(`Failed to ${remarksData.status.toLowerCase()} process: ` + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(`Error ${remarksData.status.toLowerCase()}ing process:`, err);
      setError(`Unable to ${remarksData.status.toLowerCase()} process. Please try again.`);
    } finally {
      setProcessingId(null);
      setActionType("");
      setShowRemarksModal(false);
      setRemarksData({
        serviceProcessId: "",
        status: "",
        failureReason: "",
        remarks: ""
      });
    }
  };

  // Close remarks modal
  const handleCloseRemarksModal = () => {
    setShowRemarksModal(false);
    setRemarksData({
      serviceProcessId: "",
      status: "",
      failureReason: "",
      remarks: ""
    });
  };

  // Handle Form Fill button click
  const handleFormFill = (item) => {
    navigate("/user-item-stock", {state :{serviceProcessId: item.serviceProcessId}});
  };

  // Handle closing UserItemStock
  const handleCloseUserItemStock = () => {
    setShowUserItemStock(false);
    setSelectedProcess(null);
  };

  // Helper function to get button text based on action type
  const getButtonText = (buttonType, serviceProcessId) => {
    if (processingId === serviceProcessId && actionType === buttonType) {
      return (
        <>
          <span className="btn-spinner"></span>
          {buttonType === "accept" ? "Accepting..." : 
           buttonType === "start" ? "Starting..." : 
           buttonType === "complete" ? "Completing..." : "Skipping..."}
        </>
      );
    }
    return buttonType === "accept" ? "Accept" : 
           buttonType === "start" ? "Started" : 
           buttonType === "complete" ? "Completed" : "Skip";
  };

  // Helper function to check if button is disabled
  const isButtonDisabled = (serviceProcessId) => {
    return processingId === serviceProcessId;
  };

  // Helper function to determine which main action buttons to show
  const shouldShowActionButton = (item, buttonType) => {
    switch (buttonType) {
      case 'accept':
        return !item.processAccepted;
      case 'start':
        return item.processAccepted && !item.processStarted;
      case 'complete':
        return item.processStarted && !item.processCompleted;
      default:
        return false;
    }
  };

  // Check if process is accepted to show additional buttons
  const isProcessAccepted = (item) => {
    return item.processAccepted;
  };

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  if (loading) return <div className="loading">Loading pending tasks...</div>;

  if (error) return <div className="error-box">{error}</div>;

  return (
    <>
      {/* UserItemStock Modal/Component */}
      {showUserItemStock && selectedProcess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Form Fill - {selectedProcess.itemName}</h3>
              <button 
                className="close-btn"
                onClick={handleCloseUserItemStock}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {remarksData.status === "COMPLETED" ? "Complete Process" : "Skip Process"} - Remarks
              </h3>
              <button 
                className="close-btn"
                onClick={handleCloseRemarksModal}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="remarks-form">
                <div className="form-group">
                  <label htmlFor="remarks">
                    {remarksData.status === "COMPLETED" 
                      ? "Please enter completion remarks:" 
                      : "Please enter reason for skipping:"}
                  </label>
                  <textarea
                    id="remarks"
                    className="remarks-textarea"
                    value={remarksData.remarks}
                    onChange={(e) => setRemarksData(prev => ({
                      ...prev,
                      remarks: e.target.value
                    }))}
                    placeholder={
                      remarksData.status === "COMPLETED"
                        ? "Enter completion remarks..."
                        : "Enter reason for skipping..."
                    }
                    rows="4"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="action-btn cancel-btn"
                    onClick={handleCloseRemarksModal}
                    disabled={processingId === remarksData.serviceProcessId}
                  >
                    Cancel
                  </button>
                  <button
                    className={`action-btn ${
                      remarksData.status === "COMPLETED" ? "completed-btn" : "skip-btn"
                    }`}
                    onClick={handleRemarksSubmit}
                    disabled={processingId === remarksData.serviceProcessId || !remarksData.remarks.trim()}
                  >
                    {processingId === remarksData.serviceProcessId ? (
                      <>
                        <span className="btn-spinner"></span>
                        {remarksData.status === "COMPLETED" ? "Completing..." : "Skipping..."}
                      </>
                    ) : (
                      remarksData.status === "COMPLETED" ? "Complete" : "Skip"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Pending Process Content */}
      <div className="pending-container">
        <h2 className="title">Pending Process List</h2>

        {pendingList.length === 0 ? (
          <div className="no-data">No pending activities.</div>
        ) : (
          <div className="card-list">
            {pendingList.map((item) => (
              <div key={item.activityId} className="pending-card">
                <h3>{item.itemName}</h3>

                <div className="card-details">
                  <p><strong>Product:</strong> {item.productName}</p>
                  <p><strong>Serial:</strong> {item.serialNumber}</p>
                  <p><strong>Qty:</strong> {item.quantity}</p>
                  <p><strong>Stage:</strong> {item.processStage}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Accepted:</strong> {item.processAccepted ? "Yes" : "No"}</p>
                  <p><strong>Started:</strong> {item.processStarted ? "Yes" : "No"}</p>
                  <p><strong>Completed:</strong> {item.processCompleted ? "Yes" : "No"}</p>
                </div>

                <p className="date">
                  <strong>Created:</strong>{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <div className="button-group">
                  {/* Accept Button - Show only if processAccepted is false */}
                  {shouldShowActionButton(item, 'accept') && (
                    <button 
                      className={`action-btn accept-btn ${processingId === item.serviceProcessId && actionType === 'accept' ? 'loading' : ''}`}
                      onClick={() => handleAccept(item.serviceProcessId)}
                      disabled={isButtonDisabled(item.serviceProcessId)}
                    >
                      {getButtonText("accept", item.serviceProcessId)}
                    </button>
                  )}

                  {/* Show all other buttons only if process is accepted */}
                  {isProcessAccepted(item) && (
                    <>
                      {/* Started Button - Show only if processStarted is false */}
                      {shouldShowActionButton(item, 'start') && (
                        <button 
                          className={`action-btn started-btn ${processingId === item.serviceProcessId && actionType === 'start' ? 'loading' : ''}`}
                          onClick={() => handleStarted(item.serviceProcessId)}
                          disabled={isButtonDisabled(item.serviceProcessId)}
                        >
                          {getButtonText("start", item.serviceProcessId)}
                        </button>
                      )}

                      {/* Completed Button - Show only if processStarted is true and processCompleted is false */}
                      {shouldShowActionButton(item, 'complete') && (
                        <button 
                          className={`action-btn completed-btn ${processingId === item.serviceProcessId && actionType === 'complete' ? 'loading' : ''}`}
                          onClick={() => openRemarksModal(item.serviceProcessId, "COMPLETED")}
                          disabled={isButtonDisabled(item.serviceProcessId)}
                        >
                          {getButtonText("complete", item.serviceProcessId)}
                        </button>
                      )}

                      {/* Skip Button - Always show after accept */}
                      <button 
                        className="action-btn skip-btn"
                        onClick={() => openRemarksModal(item.serviceProcessId, "SKIPPED")}
                        disabled={isButtonDisabled(item.serviceProcessId)}
                      >
                        Skip
                      </button>

                      {/* Form Fill Button - Always show after accept */}
                      <button 
                        className="action-btn form-btn"
                        onClick={() => handleFormFill(item)}
                        disabled={isButtonDisabled(item.serviceProcessId)}
                      >
                        Form Fill
                      </button>
                    </>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="progress-indicator">
                  <div className={`progress-step ${item.processAccepted ? 'completed' : 'active'}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Accepted</span>
                  </div>
                  <div className={`progress-connector ${item.processAccepted ? 'completed' : ''}`}></div>
                  <div className={`progress-step ${item.processStarted ? 'completed' : item.processAccepted ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Started</span>
                  </div>
                  <div className={`progress-connector ${item.processStarted ? 'completed' : ''}`}></div>
                  <div className={`progress-step ${item.processCompleted ? 'completed' : item.processStarted ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Completed</span>
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