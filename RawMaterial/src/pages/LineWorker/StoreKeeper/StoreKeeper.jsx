import React, { useState, useEffect } from 'react'
import './StoreKeeper.css'
import Api from '../../../auth/Api'

const StoreKeeper = () => {
  const [lineWorkers, setLineWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState('')
  const [incomingRequests, setIncomingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [materialGivenLoading, setMaterialGivenLoading] = useState(null)

  useEffect(() => {
    const fetchLineWorkers = async () => {
      try {
        const response = await Api.get('/store-keeper/getLineWorkerList')
        setLineWorkers(response?.data?.data || [])
      } catch (err) {
        setError('Error fetching data: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLineWorkers()
  }, [])

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      if (!selectedWorker) {
        setIncomingRequests([])
        return
      }

      setRequestsLoading(true)
      try {
        const response = await Api.get(`/store-keeper/showIncomingItemRequest?empId=${selectedWorker}`)
        
        if (response.data.success) {
          setIncomingRequests(response.data.data || [])
        } else {
          setError('Failed to fetch incoming requests')
          setIncomingRequests([])
        }
      } catch (err) {
        setError('Error fetching incoming requests: ' + err.message)
        setIncomingRequests([])
      } finally {
        setRequestsLoading(false)
      }
    }

    fetchIncomingRequests()
  }, [selectedWorker])

  const handleApprove = async (requestId) => {
    try {
      const response = await Api.put('/store-keeper/approveIncomingItemRequest', { 
        itemRequestId: requestId,
      })
      
      if (response.data.success) {
        alert('Request approved successfully!')
        const refreshResponse = await Api.get(`/store-keeper/showIncomingItemRequest?empId=${selectedWorker}`)
        if (refreshResponse.data.success) {
          setIncomingRequests(refreshResponse.data.data || [])
        }
      } else {
        alert('Failed to approve request: ' + response.data.message)
      }
    } catch (err) {
      alert('Error approving request: ' + err.message)
    }
  }

  const handleDecline = async (requestId) => {
    try {
      // Decline API call - replace with your actual endpoint
      const response = await Api.post('/store-keeper/declineRequest', { 
        requestId,
        declinedBy: "store-keeper" // You might want to add actual user ID
      })
      
      if (response.data.success) {
        alert('Request declined successfully!')
        // Refresh the requests list
        const refreshResponse = await Api.get(`/store-keeper/showIncomingItemRequest?empId=${selectedWorker}`)
        if (refreshResponse.data.success) {
          setIncomingRequests(refreshResponse.data.data || [])
        }
      } else {
        alert('Failed to decline request: ' + response.data.message)
      }
    } catch (err) {
      alert('Error declining request: ' + err.message)
    }
  }

  const handleMaterialGiven = async (requestId) => {
    setMaterialGivenLoading(requestId)
    try {
      // API call to sanction/send material for the request
      const response = await Api.post('/store-keeper/sanctionItemForRequest', { 
        itemRequestId: requestId,
      })
      
      if (response.data.success) {
        alert('Material sanctioned and sent successfully!')
        // Refresh the requests list to update the materialGiven status
        const refreshResponse = await Api.get(`/store-keeper/showIncomingItemRequest?empId=${selectedWorker}`)
        if (refreshResponse.data.success) {
          setIncomingRequests(refreshResponse.data.data || [])
        }
      } else {
        alert('Failed to sanction material: ' + response.data.message)
      }
    } catch (err) {
      alert('Error sanctioning material: ' + err.message)
    } finally {
      setMaterialGivenLoading(null)
    }
  }

  const handleWorkerChange = (event) => {
    setSelectedWorker(event.target.value)
    setError(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="store-keeper">
        <div className="loading">Loading line workers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="store-keeper">
        <div className="error">Error: {error}</div>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="store-keeper">
      <h2>StoreKeeper Dashboard</h2>
      
      <div className="worker-selection">
        <label htmlFor="lineWorkerSelect">Select Line Worker:</label>
        <select 
          id="lineWorkerSelect"
          value={selectedWorker} 
          onChange={handleWorkerChange}
          className="worker-dropdown"
        >
          <option value="">-- Select a Line Worker --</option>
          {lineWorkers.map(worker => (
            <option key={worker.id} value={worker.id}>
              {worker.name} - {worker.role.name}
            </option>
          ))}
        </select>
        
        {selectedWorker && (
          <div className="selected-worker-info">
            <p>Selected: <strong>{lineWorkers.find(w => w.id === selectedWorker)?.name}</strong> 
               - <em>{lineWorkers.find(w => w.id === selectedWorker)?.role.name}</em></p>
          </div>
        )}
      </div>

      {requestsLoading && (
        <div className="loading">Loading incoming requests...</div>
      )}

      {selectedWorker && !requestsLoading && (
        <div className="requests-section">
          <h3>Raw Material Item Requests</h3>
          
          {incomingRequests.length === 0 ? (
            <div className="no-requests">
              No pending requests found for this worker.
            </div>
          ) : (
            <div className="requests-list">
              {incomingRequests.map((request, index) => (
                <div key={request.id || index} className="request-item">
                  <div className="request-header">
                    {/* <h4>Request ID: {request.id?.substring(0, 8)}...</h4> */}
                    <span className={`status-badge ${request.approved === null ? 'pending' : request.approved ? 'approved' : 'declined'}`}>
                      {request.approved === null ? 'Pending' : request.approved ? 'Approved' : 'Declined'}
                    </span>
                  </div>
                  
                  <div className="request-details">
                    <div className="detail-row">
                      <strong>Requested By:</strong> 
                      <span>{lineWorkers.find(w => w.id === request.requestedBy)?.name || request.requestedBy}</span>
                    </div>
                    
                    <div className="detail-row">
                      <strong>Requested At:</strong> 
                      <span>{formatDate(request.requestedAt)}</span>
                    </div>
                    
                    <div className="detail-row">
                      <strong>Process Request:</strong> 
                      <span>{request.isProcessRequest ? 'Yes' : 'No'}</span>
                    </div>

                    {request.serviceProcessId && (
                      <div className="detail-row">
                        <strong>Service Process ID:</strong> 
                        <span>{request.serviceProcessId}</span>
                      </div>
                    )}
                  </div>

                  <div className="materials-section">
                    <h5>Requested Materials:</h5>
                    {request.rawMaterialRequested && request.rawMaterialRequested.length > 0 ? (
                      <div className="materials-list">
                        {request.rawMaterialRequested.map((material, matIndex) => (
                          <div key={matIndex} className="material-item">
                            <div className="material-detail">
                              <strong>Material Name:</strong> {material.name}
                            </div>
                            <div className="material-detail">
                              <strong>Quantity:</strong> {material.quantity} {material.unit}
                            </div>
                            {material.type && (
                              <div className="material-detail">
                                <strong>Type:</strong> {material.type}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No materials requested</p>
                    )}
                  </div>

                  {request.approvedBy && (
                    <div className="approval-info">
                      {/* <div className="detail-row">
                        <strong>Approved By:</strong> 
                        <span>{request.approvedBy}</span>
                      </div> */}
                      <div className="detail-row">
                        <strong>Approved At:</strong> 
                        <span>{formatDate(request.approvedAt)}</span>
                      </div>
                    </div>
                  )}

                  <div className="material-given-status">
                    <strong>Material Sanctioned:</strong> 
                    <span className={request.materialGiven ? 'given' : 'not-given'}>
                      {request.materialGiven ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {request.approved === null && (
                    <div className="request-actions">
                      <button 
                        className="approve-btn"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="decline-btn"
                        onClick={() => handleDecline(request.id)}
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {request.approved === true && !request.materialGiven && (
                    <div className="material-given-actions">
                      <button 
                        className="sanction-btn"
                        onClick={() => handleMaterialGiven(request.id)}
                        disabled={materialGivenLoading === request.id}
                      >
                        {materialGivenLoading === request.id ? 'Sanctioning...' : 'Sanction & Send Material'}
                      </button>
                    </div>
                  )}

                  {request.approved === true && request.materialGiven && (
                    <div className="material-given-complete">
                      <span className="completed-badge">✓ Material Sanctioned & Sent</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedWorker && (
        <div className="instructions">
          <p>Please select a line worker to view their incoming item requests.</p>
        </div>
      )}
    </div>
  )
}

export default StoreKeeper