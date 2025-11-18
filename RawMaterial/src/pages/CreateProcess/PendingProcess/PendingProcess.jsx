// import React, { useEffect, useState } from "react";
// import Api from "../../../auth/Api";
// import UserItemStock from "../UserItemStock/UserItemStock";
// import "./PendingProcess.css";
// import { useNavigate } from "react-router-dom";

// const PendingProcess = () => {
//   const [pendingList, setPendingList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [processingId, setProcessingId] = useState(null);
//   const [actionType, setActionType] = useState("");
//   const [selectedProcess, setSelectedProcess] = useState(null);
//   const [showUserItemStock, setShowUserItemStock] = useState(false);
//   const [showRemarksModal, setShowRemarksModal] = useState(false);
//   const [remarksData, setRemarksData] = useState({
//     serviceProcessId: "",
//     status: "",
//     failureReason: "",
//     remarks: "",
//   });
//   const navigate = useNavigate();

//   const fetchPendingActivities = async () => {
//     try {
//       const res = await Api.get(
//         `/line-worker/getPendingActivitiesForUserStage`
//       );

//       if (res.data.success) {
//         setPendingList(res.data.data);
//       } else {
//         setError("No pending activities found.");
//       }
//     } catch (err) {
//       setError("Unable to load pending activities.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (serviceProcessId) => {
//     setProcessingId(serviceProcessId);
//     setActionType("accept");
//     try {
//       const res = await Api.put(`/line-worker/acceptServiceProcess`, {
//         serviceProcessId: serviceProcessId,
//       });

//       if (res.data.success) {
//         setPendingList((prevList) =>
//           prevList.map((item) =>
//             item.serviceProcessId === serviceProcessId
//               ? { ...item, processAccepted: true }
//               : item
//           )
//         );

//         console.log("Process accepted successfully:", res.data);
//         alert("Process accepted successfully!");
//       } else {
//         setError(
//           "Failed to accept process: " + (res.data.message || "Unknown error")
//         );
//       }
//     } catch (err) {
//       console.error("Error accepting process:", err);
//       setError("Unable to accept process. Please try again.");
//     } finally {
//       setProcessingId(null);
//       setActionType("");
//     }
//   };

//   // Start process function
//   const handleStarted = async (serviceProcessId) => {
//     setProcessingId(serviceProcessId);
//     setActionType("start");
//     try {
//       const res = await Api.put(`/line-worker/startServiceProcess`, {
//         serviceProcessId: serviceProcessId,
//       });

//       if (res.data.success) {
//         setPendingList((prevList) =>
//           prevList.map((item) =>
//             item.serviceProcessId === serviceProcessId
//               ? { ...item, processStarted: true }
//               : item
//           )
//         );

//         console.log("Process started successfully:", res.data);
//         alert("Process started successfully!");
//       } else {
//         setError(
//           "Failed to start process: " + (res.data.message || "Unknown error")
//         );
//       }
//     } catch (err) {
//       console.error("Error starting process:", err);
//       setError("Unable to start process. Please try again.");
//     } finally {
//       setProcessingId(null);
//       setActionType("");
//     }
//   };

//   const openRemarksModal = (serviceProcessId, status) => {
//     setRemarksData({
//       serviceProcessId: serviceProcessId,
//       status: status,

//       remarks: "",
//     });
//     setShowRemarksModal(true);
//   };

//   const handleRemarksSubmit = async () => {
//     if (!remarksData.remarks.trim()) {
//       alert("Please enter remarks before submitting.");
//       return;
//     }

//     setProcessingId(remarksData.serviceProcessId);
//     setActionType(remarksData.status === "SKIPPED" ? "skip" : "complete");

//     try {
//       const res = await Api.post(
//         `/line-worker/completeServiceProcess`,
//         remarksData
//       );

//       if (res.data.success) {
//         if (remarksData.status === "COMPLETED") {
//           setPendingList((prevList) =>
//             prevList.filter(
//               (item) => item.serviceProcessId !== remarksData.serviceProcessId
//             )
//           );
//           alert("Process completed successfully!");
//         } else if (remarksData.status === "SKIPPED") {
//           setPendingList((prevList) =>
//             prevList.filter(
//               (item) => item.serviceProcessId !== remarksData.serviceProcessId
//             )
//           );
//           alert("Process skipped successfully!");
//         }

//         console.log("Operation successful:", res.data);
//       } else {
//         setError(
//           `Failed to ${remarksData.status.toLowerCase()} process: ` +
//             (res.data.message || "Unknown error")
//         );
//       }
//     } catch (err) {
//       console.error(
//         `Error ${remarksData.status.toLowerCase()}ing process:`,
//         err
//       );
//       setError(
//         `Unable to ${remarksData.status.toLowerCase()} process. Please try again.`
//       );
//     } finally {
//       setProcessingId(null);
//       setActionType("");
//       setShowRemarksModal(false);
//       setRemarksData({
//         serviceProcessId: "",
//         status: "",
//         failureReason: "",
//         remarks: "",
//       });
//     }
//   };

//   const handleCloseRemarksModal = () => {
//     setShowRemarksModal(false);
//     setRemarksData({
//       serviceProcessId: "",
//       status: "",
//       failureReason: "",
//       remarks: "",
//     });
//   };

//   const handleFormFill = (item) => {
//     navigate("/user-item-stock", {
//       state: { serviceProcessId: item.serviceProcessId },
//     });
//   };

//   const handleCloseUserItemStock = () => {
//     setShowUserItemStock(false);
//     setSelectedProcess(null);
//   };

//   const getButtonText = (buttonType, serviceProcessId) => {
//     if (processingId === serviceProcessId && actionType === buttonType) {
//       return (
//         <>
//           <span className="btn-spinner"></span>
//           {buttonType === "accept"
//             ? "Accepting..."
//             : buttonType === "start"
//             ? "Starting..."
//             : buttonType === "complete"
//             ? "Completing..."
//             : "Skipping..."}
//         </>
//       );
//     }
//     return buttonType === "accept"
//       ? "Accept"
//       : buttonType === "start"
//       ? "Started"
//       : buttonType === "complete"
//       ? "Completed"
//       : "Skip";
//   };

//   const isButtonDisabled = (serviceProcessId) => {
//     return processingId === serviceProcessId;
//   };

//   const shouldShowActionButton = (item, buttonType) => {
//     switch (buttonType) {
//       case "accept":
//         return !item.processAccepted;
//       case "start":
//         return item.processAccepted && !item.processStarted;
//       case "complete":
//         return item.processStarted && !item.processCompleted;
//       default:
//         return false;
//     }
//   };

//   const isProcessAccepted = (item) => {
//     return item.processAccepted;
//   };

//   useEffect(() => {
//     fetchPendingActivities();
//   }, []);

//   if (loading) return <div className="loading">Loading pending tasks...</div>;

//   if (error) return <div className="error-box">{error}</div>;

//   return (
//     <>
//       {showUserItemStock && selectedProcess && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Form Fill - {selectedProcess.itemName}</h3>
//               <button className="close-btn" onClick={handleCloseUserItemStock}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <UserItemStock
//                 processData={selectedProcess}
//                 onClose={handleCloseUserItemStock}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {showRemarksModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>
//                 {remarksData.status === "COMPLETED"
//                   ? "Complete Process"
//                   : "Skip Process"}{" "}
//                 - Remarks
//               </h3>
//               <button className="close-btn" onClick={handleCloseRemarksModal}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="remarks-form">
//                 <div className="form-group">
//                   <label htmlFor="remarks">
//                     {remarksData.status === "COMPLETED"
//                       ? "Please enter completion remarks:"
//                       : "Please enter reason for skipping:"}
//                   </label>
//                   <textarea
//                     id="remarks"
//                     className="remarks-textarea"
//                     value={remarksData.remarks}
//                     onChange={(e) =>
//                       setRemarksData((prev) => ({
//                         ...prev,
//                         remarks: e.target.value,
//                       }))
//                     }
//                     placeholder={
//                       remarksData.status === "COMPLETED"
//                         ? "Enter completion remarks..."
//                         : "Enter reason for skipping..."
//                     }
//                     rows="4"
//                   />
//                 </div>
//                 <div className="modal-actions">
//                   <button
//                     className="action-btn cancel-btn"
//                     onClick={handleCloseRemarksModal}
//                     disabled={processingId === remarksData.serviceProcessId}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className={`action-btn ${
//                       remarksData.status === "COMPLETED"
//                         ? "completed-btn"
//                         : "skip-btn"
//                     }`}
//                     onClick={handleRemarksSubmit}
//                     disabled={
//                       processingId === remarksData.serviceProcessId ||
//                       !remarksData.remarks.trim()
//                     }
//                   >
//                     {processingId === remarksData.serviceProcessId ? (
//                       <>
//                         <span className="btn-spinner"></span>
//                         {remarksData.status === "COMPLETED"
//                           ? "Completing..."
//                           : "Skipping..."}
//                       </>
//                     ) : remarksData.status === "COMPLETED" ? (
//                       "Complete"
//                     ) : (
//                       "Skip"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="pending-container">
//         <h2 className="title">Pending Process List</h2>

//         {pendingList.length === 0 ? (
//           <div className="no-data">No pending activities.</div>
//         ) : (
//           <div className="card-list">
//             {pendingList.map((item) => (
//               <div key={item.activityId} className="pending-card">
//                 <h3>{item.itemName}</h3>

//                 <div className="card-details">
//                   <p>
//                     <strong>Product:</strong> {item.productName}
//                   </p>
//                   <p>
//                     <strong>Serial:</strong> {item.serialNumber}
//                   </p>
//                   <p>
//                     <strong>Qty:</strong> {item.quantity}
//                   </p>
//                   <p>
//                     <strong>Stage:</strong> {item.processStage}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {item.status}
//                   </p>
//                   <p>
//                     <strong>Accepted:</strong>{" "}
//                     {item.processAccepted ? "Yes" : "No"}
//                   </p>
//                   <p>
//                     <strong>Started:</strong>{" "}
//                     {item.processStarted ? "Yes" : "No"}
//                   </p>
//                   <p>
//                     <strong>Completed:</strong>{" "}
//                     {item.processCompleted ? "Yes" : "No"}
//                   </p>
//                 </div>

//                 <p className="date">
//                   <strong>Created:</strong>{" "}
//                   {new Date(item.createdAt).toLocaleString()}
//                 </p>

//                 <div className="button-group">
//                   {/* Accept Button - Show only if processAccepted is false */}
//                   {shouldShowActionButton(item, "accept") && (
//                     <button
//                       className={`action-btn accept-btn ${
//                         processingId === item.serviceProcessId &&
//                         actionType === "accept"
//                           ? "loading"
//                           : ""
//                       }`}
//                       onClick={() => handleAccept(item.serviceProcessId)}
//                       disabled={isButtonDisabled(item.serviceProcessId)}
//                     >
//                       {getButtonText("accept", item.serviceProcessId)}
//                     </button>
//                   )}

//                   {/* Show all other buttons only if process is accepted */}
//                   {isProcessAccepted(item) && (
//                     <>
//                       {/* Started Button - Show only if processStarted is false */}
//                       {shouldShowActionButton(item, "start") && (
//                         <button
//                           className={`action-btn started-btn ${
//                             processingId === item.serviceProcessId &&
//                             actionType === "start"
//                               ? "loading"
//                               : ""
//                           }`}
//                           onClick={() => handleStarted(item.serviceProcessId)}
//                           disabled={isButtonDisabled(item.serviceProcessId)}
//                         >
//                           {getButtonText("start", item.serviceProcessId)}
//                         </button>
//                       )}

//                       {/* Completed Button - Show only if processStarted is true and processCompleted is false */}
//                       {shouldShowActionButton(item, "complete") && (
//                         <button
//                           className={`action-btn completed-btn ${
//                             processingId === item.serviceProcessId &&
//                             actionType === "complete"
//                               ? "loading"
//                               : ""
//                           }`}
//                           onClick={() =>
//                             openRemarksModal(item.serviceProcessId, "COMPLETED")
//                           }
//                           disabled={isButtonDisabled(item.serviceProcessId)}
//                         >
//                           {getButtonText("complete", item.serviceProcessId)}
//                         </button>
//                       )}

//                       {/* Skip Button - Always show after accept */}
//                       <button
//                         className="action-btn skip-btn"
//                         onClick={() =>
//                           openRemarksModal(item.serviceProcessId, "SKIPPED")
//                         }
//                         disabled={isButtonDisabled(item.serviceProcessId)}
//                       >
//                         Skip
//                       </button>

//                       {/* Form Fill Button - Always show after accept */}
//                       <button
//                         className="action-btn form-btn"
//                         onClick={() => handleFormFill(item)}
//                         disabled={isButtonDisabled(item.serviceProcessId)}
//                       >
//                         Form Fill
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 {/* Progress indicator */}
//                 <div className="progress-indicator">
//                   <div
//                     className={`progress-step ${
//                       item.processAccepted ? "completed" : "active"
//                     }`}
//                   >
//                     <span className="step-number">1</span>
//                     <span className="step-label">Accepted</span>
//                   </div>
//                   <div
//                     className={`progress-connector ${
//                       item.processAccepted ? "completed" : ""
//                     }`}
//                   ></div>
//                   <div
//                     className={`progress-step ${
//                       item.processStarted
//                         ? "completed"
//                         : item.processAccepted
//                         ? "active"
//                         : ""
//                     }`}
//                   >
//                     <span className="step-number">2</span>
//                     <span className="step-label">Started</span>
//                   </div>
//                   <div
//                     className={`progress-connector ${
//                       item.processStarted ? "completed" : ""
//                     }`}
//                   ></div>
//                   <div
//                     className={`progress-step ${
//                       item.processCompleted
//                         ? "completed"
//                         : item.processStarted
//                         ? "active"
//                         : ""
//                     }`}
//                   >
//                     <span className="step-number">3</span>
//                     <span className="step-label">Completed</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default PendingProcess;

// import React, { useEffect, useState } from "react";
// import Api from "../../../auth/Api";
// import UserItemStock from "../UserItemStock/UserItemStock";
// import "./PendingProcess.css";
// import { useNavigate } from "react-router-dom";

// const PendingProcess = () => {
//   const [pendingList, setPendingList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [processingId, setProcessingId] = useState(null);
//   const [actionType, setActionType] = useState("");
//   const [selectedProcess, setSelectedProcess] = useState(null);
//   const [showUserItemStock, setShowUserItemStock] = useState(false);
//   const [showRemarksModal, setShowRemarksModal] = useState(false);
//   const [remarksData, setRemarksData] = useState({
//     serviceProcessId: "",
//     status: "",
//     failureReason: "",
//     remarks: "",
//   });
  
//   const navigate = useNavigate();

//   // Failure reasons dropdown options
//   const failureReasons = [
//     "VIBRATION",
//     "OVERLOAD", 
//     "EARTHING",
//     "LEAKAGE",
//     "REJECTED",
//   ];

//   // Check if current process is testing
//   const isTestingProcess = (item) => {
//     return item.processStage?.toLowerCase().includes("testing") || 
//            item.itemName?.toLowerCase().includes("testing");
//   };

//   const fetchPendingActivities = async () => {
//     try {
//       const res = await Api.get(
//         `/line-worker/getPendingActivitiesForUserStage`
//       );

//       if (res.data.success) {
//         setPendingList(res.data.data);
//       } else {
//         setError("No pending activities found.");
//       }
//     } catch (err) {
//       setError("Unable to load pending activities.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (serviceProcessId) => {
//     setProcessingId(serviceProcessId);
//     setActionType("accept");
//     try {
//       const res = await Api.put(`/line-worker/acceptServiceProcess`, {
//         serviceProcessId: serviceProcessId,
//       });

//       if (res.data.success) {
//         setPendingList((prevList) =>
//           prevList.map((item) =>
//             item.serviceProcessId === serviceProcessId
//               ? { ...item, processAccepted: true }
//               : item
//           )
//         );

//         console.log("Process accepted successfully:", res.data);
//         alert("Process accepted successfully!");
//       } else {
//         setError(
//           "Failed to accept process: " + (res.data.message || "Unknown error")
//         );
//       }
//     } catch (err) {
//       console.error("Error accepting process:", err);
//       setError("Unable to accept process. Please try again.");
//     } finally {
//       setProcessingId(null);
//       setActionType("");
//     }
//   };

//   // Start process function
//   const handleStarted = async (serviceProcessId) => {
//     setProcessingId(serviceProcessId);
//     setActionType("start");
//     try {
//       const res = await Api.put(`/line-worker/startServiceProcess`, {
//         serviceProcessId: serviceProcessId,
//       });

//       if (res.data.success) {
//         setPendingList((prevList) =>
//           prevList.map((item) =>
//             item.serviceProcessId === serviceProcessId
//               ? { ...item, processStarted: true }
//               : item
//           )
//         );

//         console.log("Process started successfully:", res.data);
//         alert("Process started successfully!");
//       } else {
//         setError(
//           "Failed to start process: " + (res.data.message || "Unknown error")
//         );
//       }
//     } catch (err) {
//       console.error("Error starting process:", err);
//       setError("Unable to start process. Please try again.");
//     } finally {
//       setProcessingId(null);
//       setActionType("");
//     }
//   };

//   // New function for testing status updates
//   const handleTestingStatus = async (serviceProcessId, status) => {
//     // For FAILED status, show dropdown in remarks modal
//     if (status === "FAILED") {
//       setRemarksData({
//         serviceProcessId: serviceProcessId,
//         status: status,
//         failureReason: "",
//         remarks: "",
//       });
//       setShowRemarksModal(true);
//     } else {
//       // For COMPLETED and REJECTED, open remarks modal without dropdown
//       setRemarksData({
//         serviceProcessId: serviceProcessId,
//         status: status,
//         failureReason: "",
//         remarks: "",
//       });
//       setShowRemarksModal(true);
//     }
//   };

//   const openRemarksModal = (serviceProcessId, status) => {
//     setRemarksData({
//       serviceProcessId: serviceProcessId,
//       status: status,
//       failureReason: "",
//       remarks: "",
//     });
//     setShowRemarksModal(true);
//   };

//   const handleRemarksSubmit = async () => {
//     // For FAILED status, require failure reason
//     if (remarksData.status === "FAILED" && !remarksData.failureReason) {
//       alert("Please select a failure reason before submitting.");
//       return;
//     }

//     if (!remarksData.remarks.trim()) {
//       alert("Please enter remarks before submitting.");
//       return;
//     }

//     setProcessingId(remarksData.serviceProcessId);
//     setActionType(remarksData.status.toLowerCase());

//     try {
//       const res = await Api.post(
//         `/line-worker/completeServiceProcess`,
//         remarksData
//       );

//       if (res.data.success) {
//         setPendingList((prevList) =>
//           prevList.filter(
//             (item) => item.serviceProcessId !== remarksData.serviceProcessId
//           )
//         );
        
//         // Show appropriate success message based on status
//         if (remarksData.status === "COMPLETED") {
//           alert("Process completed successfully!");
//         } else if (remarksData.status === "SKIPPED") {
//           alert("Process skipped successfully!");
//         } else if (remarksData.status === "REJECTED") {
//           alert("Process rejected successfully!");
//         } else if (remarksData.status === "FAILED") {
//           alert("Process marked as failed successfully!");
//         }

//         console.log("Operation successful:", res.data);
//       } else {
//         setError(
//           `Failed to ${remarksData.status.toLowerCase()} process: ` +
//             (res.data.message || "Unknown error")
//         );
//       }
//     } catch (err) {
//       console.error(
//         `Error ${remarksData.status.toLowerCase()}ing process:`,
//         err
//       );
//       setError(
//         `Unable to ${remarksData.status.toLowerCase()} process. Please try again.`
//       );
//     } finally {
//       setProcessingId(null);
//       setActionType("");
//       setShowRemarksModal(false);
//       setRemarksData({
//         serviceProcessId: "",
//         status: "",
//         failureReason: "",
//         remarks: "",
//       });
//     }
//   };

//   const handleCloseRemarksModal = () => {
//     setShowRemarksModal(false);
//     setRemarksData({
//       serviceProcessId: "",
//       status: "",
//       failureReason: "",
//       remarks: "",
//     });
//   };

//   const handleFormFill = (item) => {
//     navigate("/user-item-stock", {
//       state: { serviceProcessId: item.serviceProcessId },
//     });
//   };

//   const handleCloseUserItemStock = () => {
//     setShowUserItemStock(false);
//     setSelectedProcess(null);
//   };

//   const getButtonText = (buttonType, serviceProcessId) => {
//     if (processingId === serviceProcessId && actionType === buttonType) {
//       return (
//         <>
//           <span className="btn-spinner"></span>
//           {buttonType === "accept"
//             ? "Accepting..."
//             : buttonType === "start"
//             ? "Starting..."
//             : buttonType === "complete"
//             ? "Completing..."
//             : buttonType === "rejected"
//             ? "Rejecting..."
//             : buttonType === "failed"
//             ? "Marking as Failed..."
//             : "Skipping..."}
//         </>
//       );
//     }
//     return buttonType === "accept"
//       ? "Accept"
//       : buttonType === "start"
//       ? "Started"
//       : buttonType === "complete"
//       ? "Completed"
//       : buttonType === "rejected"
//       ? "Rejected"
//       : buttonType === "failed"
//       ? "Failed"
//       : "Skip";
//   };

//   const isButtonDisabled = (serviceProcessId) => {
//     return processingId === serviceProcessId;
//   };

//   const shouldShowActionButton = (item, buttonType) => {
//     switch (buttonType) {
//       case "accept":
//         return !item.processAccepted;
//       case "start":
//         return item.processAccepted && !item.processStarted;
//       case "complete":
//         return item.processStarted && !item.processCompleted;
//       default:
//         return false;
//     }
//   };

//   const isProcessAccepted = (item) => {
//     return item.processAccepted;
//   };

//   useEffect(() => {
//     fetchPendingActivities();
//   }, []);

//   if (loading) return <div className="loading">Loading pending tasks...</div>;

//   if (error) return <div className="error-box">{error}</div>;

//   return (
//     <>
//       {showUserItemStock && selectedProcess && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Form Fill - {selectedProcess.itemName}</h3>
//               <button className="close-btn" onClick={handleCloseUserItemStock}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <UserItemStock
//                 processData={selectedProcess}
//                 onClose={handleCloseUserItemStock}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Combined Remarks Modal with Failure Dropdown */}
//       {showRemarksModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>
//                 {remarksData.status === "COMPLETED"
//                   ? "Complete Process"
//                   : remarksData.status === "REJECTED"
//                   ? "Reject Process"
//                   : remarksData.status === "FAILED"
//                   ? "Mark as Failed"
//                   : "Skip Process"}{" "}
//                 - Remarks
//               </h3>
//               <button className="close-btn" onClick={handleCloseRemarksModal}>
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="remarks-form">
//                 {/* Failure Reason Dropdown - Only show for FAILED status */}
//                 {remarksData.status === "FAILED" && (
//                   <div className="form-group">
//                     <label htmlFor="failureReason">
//                       Please select the failure reason: *
//                     </label>
//                     <select
//                       id="failureReason"
//                       className="failure-reason-dropdown"
//                       value={remarksData.failureReason}
//                       onChange={(e) => {
//                         const selectedReason = e.target.value;
//                         setRemarksData(prev => ({
//                           ...prev,
//                           failureReason: selectedReason,
//                           remarks: prev.remarks || `${selectedReason} issue detected during testing`
//                         }));
//                       }}
//                     >
//                       <option value="">Select a failure reason</option>
//                       {failureReasons.map((reason) => (
//                         <option key={reason} value={reason}>
//                           {reason}
//                         </option>
//                       ))}
//                     </select>
//                     {remarksData.failureReason && (
//                       <div className="selected-reason-info">
//                         Selected: <strong>{remarksData.failureReason}</strong>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="form-group">
//                   <label htmlFor="remarks">
//                     {remarksData.status === "COMPLETED"
//                       ? "Please enter completion remarks: *"
//                       : remarksData.status === "REJECTED"
//                       ? "Please enter rejection details: *"
//                       : remarksData.status === "FAILED"
//                       ? "Please enter failure details: *"
//                       : "Please enter reason for skipping: *"}
//                   </label>
//                   <textarea
//                     id="remarks"
//                     className="remarks-textarea"
//                     value={remarksData.remarks}
//                     onChange={(e) =>
//                       setRemarksData((prev) => ({
//                         ...prev,
//                         remarks: e.target.value,
//                       }))
//                     }
//                     placeholder={
//                       remarksData.status === "COMPLETED"
//                         ? "Enter completion remarks..."
//                         : remarksData.status === "REJECTED"
//                         ? "Enter rejection details..."
//                         : remarksData.status === "FAILED"
//                         ? "Enter failure details..."
//                         : "Enter reason for skipping..."
//                     }
//                     rows="4"
//                   />
//                 </div>
//                 <div className="modal-actions">
//                   <button
//                     className="action-btn cancel-btn"
//                     onClick={handleCloseRemarksModal}
//                     disabled={processingId === remarksData.serviceProcessId}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className={`action-btn ${
//                       remarksData.status === "COMPLETED"
//                         ? "completed-btn"
//                         : remarksData.status === "REJECTED"
//                         ? "rejected-btn"
//                         : remarksData.status === "FAILED"
//                         ? "failed-btn"
//                         : "skip-btn"
//                     }`}
//                     onClick={handleRemarksSubmit}
//                     disabled={
//                       processingId === remarksData.serviceProcessId ||
//                       !remarksData.remarks.trim() ||
//                       (remarksData.status === "FAILED" && !remarksData.failureReason)
//                     }
//                   >
//                     {processingId === remarksData.serviceProcessId ? (
//                       <>
//                         <span className="btn-spinner"></span>
//                         {remarksData.status === "COMPLETED"
//                           ? "Completing..."
//                           : remarksData.status === "REJECTED"
//                           ? "Rejecting..."
//                           : remarksData.status === "FAILED"
//                           ? "Marking as Failed..."
//                           : "Skipping..."}
//                       </>
//                     ) : remarksData.status === "COMPLETED" ? (
//                       "Complete"
//                     ) : remarksData.status === "REJECTED" ? (
//                       "Reject"
//                     ) : remarksData.status === "FAILED" ? (
//                       "Mark as Failed"
//                     ) : (
//                       "Skip"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="pending-container">
//         <h2 className="title">Pending Process List</h2>

//         {pendingList.length === 0 ? (
//           <div className="no-data">No pending activities.</div>
//         ) : (
//           <div className="card-list">
//             {pendingList.map((item) => (
//               <div key={item.activityId} className="pending-card">
//                 <h3>{item.itemName}</h3>

//                 <div className="card-details">
//                   <p>
//                     <strong>Product:</strong> {item.productName}
//                   </p>
//                   <p>
//                     <strong>Serial:</strong> {item.serialNumber}
//                   </p>
//                   <p>
//                     <strong>Qty:</strong> {item.quantity}
//                   </p>
//                   <p>
//                     <strong>Stage:</strong> {item.processStage}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {item.status}
//                   </p>
//                   <p>
//                     <strong>Accepted:</strong>{" "}
//                     {item.processAccepted ? "Yes" : "No"}
//                   </p>
//                   <p>
//                     <strong>Started:</strong>{" "}
//                     {item.processStarted ? "Yes" : "No"}
//                   </p>
//                   <p>
//                     <strong>Completed:</strong>{" "}
//                     {item.processCompleted ? "Yes" : "No"}
//                   </p>
//                 </div>

//                 <p className="date">
//                   <strong>Created:</strong>{" "}
//                   {new Date(item.createdAt).toLocaleString()}
//                 </p>

//                 <div className="button-group">
//                   {/* Accept Button - Show only if processAccepted is false */}
//                   {shouldShowActionButton(item, "accept") && (
//                     <button
//                       className={`action-btn accept-btn ${
//                         processingId === item.serviceProcessId &&
//                         actionType === "accept"
//                           ? "loading"
//                           : ""
//                       }`}
//                       onClick={() => handleAccept(item.serviceProcessId)}
//                       disabled={isButtonDisabled(item.serviceProcessId)}
//                     >
//                       {getButtonText("accept", item.serviceProcessId)}
//                     </button>
//                   )}

//                   {/* Show all other buttons only if process is accepted */}
//                   {isProcessAccepted(item) && (
//                     <>
//                       {/* Started Button - Show only if processStarted is false */}
//                       {shouldShowActionButton(item, "start") && (
//                         <button
//                           className={`action-btn started-btn ${
//                             processingId === item.serviceProcessId &&
//                             actionType === "start"
//                               ? "loading"
//                               : ""
//                           }`}
//                           onClick={() => handleStarted(item.serviceProcessId)}
//                           disabled={isButtonDisabled(item.serviceProcessId)}
//                         >
//                           {getButtonText("start", item.serviceProcessId)}
//                         </button>
//                       )}

//                       {/* For Testing Processes */}
//                       {isTestingProcess(item) && item.processStarted && !item.processCompleted && (
//                         <>
//                           {/* Completed Button for Testing */}
//                           <button
//                             className={`action-btn completed-btn ${
//                               processingId === item.serviceProcessId &&
//                               actionType === "complete"
//                                 ? "loading"
//                                 : ""
//                             }`}
//                             onClick={() => handleTestingStatus(item.serviceProcessId, "COMPLETED")}
//                             disabled={isButtonDisabled(item.serviceProcessId)}
//                           >
//                             {getButtonText("complete", item.serviceProcessId)}
//                           </button>

//                           {/* Rejected Button for Testing */}
//                           <button
//                             className={`action-btn rejected-btn ${
//                               processingId === item.serviceProcessId &&
//                               actionType === "rejected"
//                                 ? "loading"
//                                 : ""
//                             }`}
//                             onClick={() => handleTestingStatus(item.serviceProcessId, "REJECTED")}
//                             disabled={isButtonDisabled(item.serviceProcessId)}
//                           >
//                             {getButtonText("rejected", item.serviceProcessId)}
//                           </button>

//                           {/* Failed Button for Testing - Only this shows failure dropdown */}
//                           <button
//                             className={`action-btn failed-btn ${
//                               processingId === item.serviceProcessId &&
//                               actionType === "failed"
//                                 ? "loading"
//                                 : ""
//                             }`}
//                             onClick={() => handleTestingStatus(item.serviceProcessId, "FAILED")}
//                             disabled={isButtonDisabled(item.serviceProcessId)}
//                           >
//                             {getButtonText("failed", item.serviceProcessId)}
//                           </button>

//                           {/* Form Fill Button for Testing */}
//                           <button
//                             className="action-btn form-btn"
//                             onClick={() => handleFormFill(item)}
//                             disabled={isButtonDisabled(item.serviceProcessId)}
//                           >
//                             Form Fill
//                           </button>
//                         </>
//                       )}

//                       {/* For Non-Testing Processes */}
//                       {!isTestingProcess(item) && item.processStarted && !item.processCompleted && (
//                         <>
//                           {/* Completed Button for Non-Testing */}
//                           <button
//                             className={`action-btn completed-btn ${
//                               processingId === item.serviceProcessId &&
//                               actionType === "complete"
//                                 ? "loading"
//                                 : ""
//                             }`}
//                             onClick={() => openRemarksModal(item.serviceProcessId, "COMPLETED")}
//                             disabled={isButtonDisabled(item.serviceProcessId)}
//                           >
//                             {getButtonText("complete", item.serviceProcessId)}
//                           </button>

//                           {/* Skip Button for Non-Testing - Hidden for Testing */}
//                           <button
//                             className="action-btn skip-btn"
//                             onClick={() => openRemarksModal(item.serviceProcessId, "SKIPPED")}
//                             disabled={isButtonDisabled(item.serviceProcessId)}
//                           >
//                             Skip
//                           </button>

//                           {/* Form Fill Button for Non-Testing */}
//                           <button
//                             className="action-btn form-btn"
//                             onClick={() => handleFormFill(item)}
//                             disabled={isButtonDisabled(item.serviceProcessId)}
//                           >
//                             Form Fill
//                           </button>
//                         </>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* Progress indicator */}
//                 <div className="progress-indicator">
//                   <div
//                     className={`progress-step ${
//                       item.processAccepted ? "completed" : "active"
//                     }`}
//                   >
//                     <span className="step-number">1</span>
//                     <span className="step-label">Accepted</span>
//                   </div>
//                   <div
//                     className={`progress-connector ${
//                       item.processAccepted ? "completed" : ""
//                     }`}
//                   ></div>
//                   <div
//                     className={`progress-step ${
//                       item.processStarted
//                         ? "completed"
//                         : item.processAccepted
//                         ? "active"
//                         : ""
//                     }`}
//                   >
//                     <span className="step-number">2</span>
//                     <span className="step-label">Started</span>
//                   </div>
//                   <div
//                     className={`progress-connector ${
//                       item.processStarted ? "completed" : ""
//                     }`}
//                   ></div>
//                   <div
//                     className={`progress-step ${
//                       item.processCompleted
//                         ? "completed"
//                         : item.processStarted
//                         ? "active"
//                         : ""
//                     }`}
//                   >
//                     <span className="step-number">3</span>
//                     <span className="step-label">Completed</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default PendingProcess;

import React, { useEffect, useState } from "react";
import Api from "../../../auth/Api";
import UserItemStock from "../UserItemStock/UserItemStock";
import "./PendingProcess.css";
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

  // Failure reasons dropdown options
  const failureReasons = [
    "VIBRATION",
    "OVERLOAD", 
    "EARTHING",
    "LEAKAGE",
    "REJECTED",
  ];

  // Check if current process is testing
  const isTestingProcess = (item) => {
    return item.processStage?.toLowerCase().includes("testing") || 
           item.itemName?.toLowerCase().includes("testing");
  };

  // Check if disassemble form should be shown - ONLY check these two conditions
  const shouldShowDisassembleForm = (item) => {
    return item.isDisassemblePending === true && item.disassembleSessionId;
  };

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

        console.log("Process accepted successfully:", res.data);
        alert("Process accepted successfully!");
      } else {
        setError(
          "Failed to accept process: " + (res.data.message || "Unknown error")
        );
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

        console.log("Process started successfully:", res.data);
        alert("Process started successfully!");
      } else {
        setError(
          "Failed to start process: " + (res.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error starting process:", err);
      setError("Unable to start process. Please try again.");
    } finally {
      setProcessingId(null);
      setActionType("");
    }
  };

  // New function for testing status updates
  const handleTestingStatus = async (serviceProcessId, status) => {
    // For FAILED status, show dropdown in remarks modal
    if (status === "FAILED") {
      setRemarksData({
        serviceProcessId: serviceProcessId,
        status: status,
        failureReason: "",
        remarks: "",
      });
      setShowRemarksModal(true);
    } else {
      // For COMPLETED and REJECTED, open remarks modal without dropdown
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
    // For FAILED status, require failure reason
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
      const res = await Api.post(
        `/line-worker/completeServiceProcess`,
        remarksData
      );

      if (res.data.success) {
        setPendingList((prevList) =>
          prevList.filter(
            (item) => item.serviceProcessId !== remarksData.serviceProcessId
          )
        );
        
        // Show appropriate success message based on status
        if (remarksData.status === "COMPLETED") {
          alert("Process completed successfully!");
        } else if (remarksData.status === "SKIPPED") {
          alert("Process skipped successfully!");
        } else if (remarksData.status === "REJECTED") {
          alert("Process rejected successfully!");
        } else if (remarksData.status === "FAILED") {
          alert("Process marked as failed successfully!");
        }

        console.log("Operation successful:", res.data);
      } else {
        setError(
          `Failed to ${remarksData.status.toLowerCase()} process: ` +
            (res.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error(
        `Error ${remarksData.status.toLowerCase()}ing process:`,
        err
      );
      setError(
        `Unable to ${remarksData.status.toLowerCase()} process. Please try again.`
      );
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

  // Navigate to ReusableItems page for disassemble form
  const handleDisassembleForm = (item) => {
    navigate("/reusable-items", {
      state: { 
        serviceProcessId: item.serviceProcessId,
        disassembleSessionId: item.disassembleSessionId,
        isDisassemblePending: item.isDisassemblePending
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
          <span className="btn-spinner"></span>
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

  if (loading) return <div className="loading">Loading pending tasks...</div>;

  if (error) return <div className="error-box">{error}</div>;

  return (
    <>
      {showUserItemStock && selectedProcess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Form Fill - {selectedProcess.itemName}</h3>
              <button className="close-btn" onClick={handleCloseUserItemStock}>
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

      {/* Combined Remarks Modal with Failure Dropdown */}
      {showRemarksModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {remarksData.status === "COMPLETED"
                  ? "Complete Process"
                  : remarksData.status === "REJECTED"
                  ? "Reject Process"
                  : remarksData.status === "FAILED"
                  ? "Mark as Failed"
                  : "Skip Process"}{" "}
                - Remarks
              </h3>
              <button className="close-btn" onClick={handleCloseRemarksModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="remarks-form">
                {/* Failure Reason Dropdown - Only show for FAILED status */}
                {remarksData.status === "FAILED" && (
                  <div className="form-group">
                    <label htmlFor="failureReason">
                      Please select the failure reason: *
                    </label>
                    <select
                      id="failureReason"
                      className="failure-reason-dropdown"
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
                      <div className="selected-reason-info">
                        Selected: <strong>{remarksData.failureReason}</strong>
                      </div>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="remarks">
                    {remarksData.status === "COMPLETED"
                      ? "Please enter completion remarks: *"
                      : remarksData.status === "REJECTED"
                      ? "Please enter rejection details: *"
                      : remarksData.status === "FAILED"
                      ? "Please enter failure details: *"
                      : "Please enter reason for skipping: *"}
                  </label>
                  <textarea
                    id="remarks"
                    className="remarks-textarea"
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
                      remarksData.status === "COMPLETED"
                        ? "completed-btn"
                        : remarksData.status === "REJECTED"
                        ? "rejected-btn"
                        : remarksData.status === "FAILED"
                        ? "failed-btn"
                        : "skip-btn"
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
                        <span className="btn-spinner"></span>
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
        </div>
      )}

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
                  <p>
                    <strong>Product:</strong> {item.productName}
                  </p>
                  <p>
                    <strong>Serial:</strong> {item.serialNumber}
                  </p>
                  <p>
                    <strong>Qty:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Stage:</strong> {item.processStage}
                  </p>
                  <p>
                    <strong>Status:</strong> {item.status}
                  </p>
                  <p>
                    <strong>Accepted:</strong>{" "}
                    {item.processAccepted ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Started:</strong>{" "}
                    {item.processStarted ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Completed:</strong>{" "}
                    {item.processCompleted ? "Yes" : "No"}
                  </p>
                  {/* Show disassemble info if applicable */}
                  {shouldShowDisassembleForm(item) && (
                    <>
                      <p className="disassemble-info">
                        <strong>Disassemble Pending:</strong> Yes
                      </p>
                      {/* <p className="disassemble-info">
                        <strong>Session ID:</strong> {item.disassembleSessionId}
                      </p> */}
                    </>
                  )}
                </div>

                <p className="date">
                  <strong>Created:</strong>{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <div className="button-group">
                  {/* Show ONLY Fill Form button when disassemble conditions are met */}
                  {shouldShowDisassembleForm(item) ? (
                    <button
                      className="action-btn disassemble-form-btn"
                      onClick={() => handleDisassembleForm(item)}
                    >
                      Fill Form
                    </button>
                  ) : (
                    <>
                      {/* Accept Button - Show only if processAccepted is false */}
                      {shouldShowActionButton(item, "accept") && (
                        <button
                          className={`action-btn accept-btn ${
                            processingId === item.serviceProcessId &&
                            actionType === "accept"
                              ? "loading"
                              : ""
                          }`}
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
                          {shouldShowActionButton(item, "start") && (
                            <button
                              className={`action-btn started-btn ${
                                processingId === item.serviceProcessId &&
                                actionType === "start"
                                  ? "loading"
                                  : ""
                              }`}
                              onClick={() => handleStarted(item.serviceProcessId)}
                              disabled={isButtonDisabled(item.serviceProcessId)}
                            >
                              {getButtonText("start", item.serviceProcessId)}
                            </button>
                          )}

                          {/* For Testing Processes */}
                          {isTestingProcess(item) && item.processStarted && !item.processCompleted && (
                            <>
                              {/* Completed Button for Testing */}
                              <button
                                className={`action-btn completed-btn ${
                                  processingId === item.serviceProcessId &&
                                  actionType === "complete"
                                    ? "loading"
                                    : ""
                                }`}
                                onClick={() => handleTestingStatus(item.serviceProcessId, "COMPLETED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                {getButtonText("complete", item.serviceProcessId)}
                              </button>

                              {/* Rejected Button for Testing */}
                              <button
                                className={`action-btn rejected-btn ${
                                  processingId === item.serviceProcessId &&
                                  actionType === "rejected"
                                    ? "loading"
                                    : ""
                                }`}
                                onClick={() => handleTestingStatus(item.serviceProcessId, "REJECTED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                {getButtonText("rejected", item.serviceProcessId)}
                              </button>

                              {/* Failed Button for Testing - Only this shows failure dropdown */}
                              <button
                                className={`action-btn failed-btn ${
                                  processingId === item.serviceProcessId &&
                                  actionType === "failed"
                                    ? "loading"
                                    : ""
                                }`}
                                onClick={() => handleTestingStatus(item.serviceProcessId, "FAILED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                {getButtonText("failed", item.serviceProcessId)}
                              </button>

                              {/* Form Fill Button for Testing */}
                              <button
                                className="action-btn form-btn"
                                onClick={() => handleFormFill(item)}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                Form Fill
                              </button>
                            </>
                          )}

                          {/* For Non-Testing Processes */}
                          {!isTestingProcess(item) && item.processStarted && !item.processCompleted && (
                            <>
                              {/* Completed Button for Non-Testing */}
                              <button
                                className={`action-btn completed-btn ${
                                  processingId === item.serviceProcessId &&
                                  actionType === "complete"
                                    ? "loading"
                                    : ""
                                }`}
                                onClick={() => openRemarksModal(item.serviceProcessId, "COMPLETED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                {getButtonText("complete", item.serviceProcessId)}
                              </button>

                              {/* Skip Button for Non-Testing - Hidden for Testing */}
                              <button
                                className="action-btn skip-btn"
                                onClick={() => openRemarksModal(item.serviceProcessId, "SKIPPED")}
                                disabled={isButtonDisabled(item.serviceProcessId)}
                              >
                                Skip
                              </button>

                              {/* Form Fill Button for Non-Testing */}
                              <button
                                className="action-btn form-btn"
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

                {/* Progress indicator - Hide when disassemble form is shown */}
                {!shouldShowDisassembleForm(item) && (
                  <div className="progress-indicator">
                    <div
                      className={`progress-step ${
                        item.processAccepted ? "completed" : "active"
                      }`}
                    >
                      <span className="step-number">1</span>
                      <span className="step-label">Accepted</span>
                    </div>
                    <div
                      className={`progress-connector ${
                        item.processAccepted ? "completed" : ""
                      }`}
                    ></div>
                    <div
                      className={`progress-step ${
                        item.processStarted
                          ? "completed"
                          : item.processAccepted
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="step-number">2</span>
                      <span className="step-label">Started</span>
                    </div>
                    <div
                      className={`progress-connector ${
                        item.processStarted ? "completed" : ""
                      }`}
                    ></div>
                    <div
                      className={`progress-step ${
                        item.processCompleted
                          ? "completed"
                          : item.processStarted
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="step-number">3</span>
                      <span className="step-label">Completed</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PendingProcess;