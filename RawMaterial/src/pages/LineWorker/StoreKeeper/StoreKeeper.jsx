import React, { useState, useEffect } from 'react'
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
      const response = await Api.post('/store-keeper/declineRequest', { 
        requestId,
        declinedBy: "store-keeper"
      })
      
      if (response.data.success) {
        alert('Request declined successfully!')
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
      const response = await Api.post('/store-keeper/sanctionItemForRequest', { 
        itemRequestId: requestId,
      })
      
      if (response.data.success) {
        alert('Material sanctioned and sent successfully!')
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
      <div className="p-4 max-w-6xl mx-auto">
        <div className="p-4 text-center text-blue-600 bg-blue-50 rounded-lg">Loading line workers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="p-4 text-red-600 bg-red-50 rounded-lg border-l-4 border-red-500">
          Error: {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">StoreKeeper Dashboard</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label htmlFor="lineWorkerSelect" className="block mb-2 font-semibold text-gray-700">
          Select Line Worker:
        </label>
        <select 
          id="lineWorkerSelect"
          value={selectedWorker} 
          onChange={handleWorkerChange}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
        >
          <option value="">-- Select a Line Worker --</option>
          {lineWorkers.map(worker => (
            <option key={worker.id} value={worker.id}>
              {worker.name} - {worker.role.name}
            </option>
          ))}
        </select>
        
        {selectedWorker && (
          <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
            <p className="text-sm">
              Selected: <strong>{lineWorkers.find(w => w.id === selectedWorker)?.name}</strong> 
              - <em>{lineWorkers.find(w => w.id === selectedWorker)?.role.name}</em>
            </p>
          </div>
        )}
      </div>

      {requestsLoading && (
        <div className="p-4 text-center text-blue-600 bg-blue-50 rounded-lg my-4">
          Loading incoming requests...
        </div>
      )}

      {selectedWorker && !requestsLoading && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-5 text-center">Raw Material Item Requests</h3>
          
          {incomingRequests.length === 0 ? (
            <div className="text-center p-6 text-gray-600 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              No pending requests found for this worker.
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((request, index) => (
                <div key={request.id || index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                    {/* <h4 className="font-medium">Request ID: {request.id?.substring(0, 8)}...</h4> */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      request.approved === null 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                        : request.approved 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {request.approved === null ? 'Pending' : request.approved ? 'Approved' : 'Declined'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-gray-100 text-sm">
                      <strong className="text-gray-700 min-w-[120px]">Requested By:</strong> 
                      <span>{lineWorkers.find(w => w.id === request.requestedBy)?.name || request.requestedBy}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-gray-100 text-sm">
                      <strong className="text-gray-700 min-w-[120px]">Requested At:</strong> 
                      <span>{formatDate(request.requestedAt)}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-gray-100 text-sm">
                      <strong className="text-gray-700 min-w-[120px]">Process Request:</strong> 
                      <span>{request.isProcessRequest ? 'Yes' : 'No'}</span>
                    </div>

                    {request.serviceProcessId && (
                      <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-gray-100 text-sm">
                        <strong className="text-gray-700 min-w-[120px]">Service Process ID:</strong> 
                        <span>{request.serviceProcessId}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-700 mb-2">Requested Materials:</h5>
                    {request.rawMaterialRequested && request.rawMaterialRequested.length > 0 ? (
                      <div className="space-y-2">
                        {request.rawMaterialRequested.map((material, matIndex) => (
                          <div key={matIndex} className="p-2 bg-white rounded border-l-3 border-green-500">
                            <div className="text-sm">
                              <strong>Material Name:</strong> {material.name}
                            </div>
                            <div className="text-sm">
                              <strong>Quantity:</strong> {material.quantity} {material.unit}
                            </div>
                            {material.type && (
                              <div className="text-sm">
                                <strong>Type:</strong> {material.type}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">No materials requested</p>
                    )}
                  </div>

                  {request.approvedBy && (
                    <div className="mb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between py-1 text-sm">
                        <strong className="text-gray-700">Approved At:</strong> 
                        <span>{formatDate(request.approvedAt)}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 p-3 bg-blue-50 rounded flex justify-between text-sm">
                    <strong>Material Sanctioned:</strong> 
                    <span className={request.materialGiven ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {request.materialGiven ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {request.approved === null && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
                      <button 
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex-1 sm:flex-none"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex-1 sm:flex-none"
                        onClick={() => handleDecline(request.id)}
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {request.approved === true && !request.materialGiven && (
                    <div className="mt-4">
                      <button 
                        className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                        onClick={() => handleMaterialGiven(request.id)}
                        disabled={materialGivenLoading === request.id}
                      >
                        {materialGivenLoading === request.id ? 'Sanctioning...' : 'Sanction & Send Material'}
                      </button>
                    </div>
                  )}

                  {request.approved === true && request.materialGiven && (
                    <div className="mt-4 text-center">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        ✓ Material Sanctioned & Sent
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedWorker && (
        <div className="text-center p-6 text-gray-600">
          <p>Please select a line worker to view their incoming item requests.</p>
        </div>
      )}
    </div>
  )
}

export default StoreKeeper