import React, { useState, useEffect } from 'react';
import './StoreTracking.css';
import Api from '../../../../auth/Api';

const StoreTracking = () => {
  const [processData, setProcessData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProcess, setExpandedProcess] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    filterType: 'Custom',
    startDate: '',
    endDate: '',
    status: '',
    itemType: ''
  });

  useEffect(() => {
    fetchProcessData();
    fetchItemTypes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [processData, filters]);

  const fetchProcessData = async () => {
    try {
      setLoading(true);
      const response = await Api.get(`/store-keeper/showProcessData`);
      setProcessData(response?.data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch process data');
      console.error('Error fetching process data:', err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemTypes = async () => {
    try {
      const response = await Api.get(`/common/getItemType`);
      setItemTypes(response?.data?.data || []);
    } catch (err) {
      console.error('Error fetching item types:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...processData];

    // Apply filters based on filterType
    switch (filters.filterType) {
      case 'Custom':
        if (filters.startDate) {
          filtered = filtered.filter(process => 
            new Date(process.createdAt) >= new Date(filters.startDate)
          );
        }
        if (filters.endDate) {
          filtered = filtered.filter(process => 
            new Date(process.createdAt) <= new Date(filters.endDate + 'T23:59:59')
          );
        }
        break;

      case 'Today':
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        
        filtered = filtered.filter(process => {
          const processDate = new Date(process.createdAt);
          return processDate >= todayStart && processDate <= todayEnd;
        });
        break;

      case 'Week':
        const now = new Date();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6, 23, 59, 59);
        
        filtered = filtered.filter(process => {
          const processDate = new Date(process.createdAt);
          return processDate >= weekStart && processDate <= weekEnd;
        });
        break;

      case 'Month':
        const current = new Date();
        const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59);
        
        filtered = filtered.filter(process => {
          const processDate = new Date(process.createdAt);
          return processDate >= monthStart && processDate <= monthEnd;
        });
        break;

      case 'Year':
        const currentYear = new Date();
        const yearStart = new Date(currentYear.getFullYear(), 0, 1);
        const yearEnd = new Date(currentYear.getFullYear(), 11, 31, 23, 59, 59);
        
        filtered = filtered.filter(process => {
          const processDate = new Date(process.createdAt);
          return processDate >= yearStart && processDate <= yearEnd;
        });
        break;

      case 'Status':
        if (filters.status) {
          filtered = filtered.filter(process => 
            process.processStatus === filters.status
          );
        }
        break;

      case 'ItemType':
        if (filters.itemType) {
          filtered = filtered.filter(process => 
            process.itemType === filters.itemType
          );
        }
        break;

      default:
        break;
    }

    // Apply item type filter for all filter types except ItemType
    if (filters.itemType && filters.filterType !== 'ItemType') {
      filtered = filtered.filter(process => 
        process.itemType === filters.itemType
      );
    }

    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setFilters({
      filterType: 'Custom',
      startDate: '',
      endDate: '',
      status: '',
      itemType: ''
    });
  };

  const toggleProcessDetails = (serviceProcessId) => {
    setExpandedProcess(expandedProcess === serviceProcessId ? null : serviceProcessId);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-badge completed';
      case 'IN_PROGRESS':
        return 'status-badge in-progress';
      case 'PENDING':
        return 'status-badge pending';
      case 'FAILED':
        return 'status-badge failed';
      case 'REJECTED':
        return 'status-badge rejected';
      case 'SKIPPED':
        return 'status-badge skipped';
      case 'REDIRECTED':
        return 'status-badge redirected';
      default:
        return 'status-badge';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStageProgress = (stageActivities) => {
    if (!stageActivities || stageActivities.length === 0) return 0;
    
    const completedStages = stageActivities.filter(activity => 
      activity.activityStatus && ['COMPLETED', 'SKIPPED'].includes(activity.activityStatus)
    ).length;
    
    const progress = Math.round((completedStages / stageActivities.length) * 100);
    return isNaN(progress) ? 0 : progress;
  };

  if (loading) {
    return (
      <div className="store-tracking">
        <div className="loading">Loading process data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-tracking">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchProcessData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="store-tracking">
      <div className="header">
        <h1>Process Tracking</h1>
        <button onClick={fetchProcessData} className="refresh-btn">
          Refresh Data
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="filterType">Filter Type</label>
            <select 
              id="filterType"
              value={filters.filterType}
              onChange={(e) => handleFilterChange('filterType', e.target.value)}
              className="filter-input"
            >
              <option value="Custom">Custom Date Range</option>
              <option value="Today">Today</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
              <option value="Year">This Year</option>
              <option value="Status">Status</option>
              <option value="ItemType">Item Type</option>
            </select>
          </div>

          {/* Show date filters only when Custom is selected */}
          {filters.filterType === 'Custom' && (
            <>
              <div className="filter-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="filter-input"
                />
              </div>
            </>
          )}

          {/* Show status filter only when Status is selected */}
          {filters.filterType === 'Status' && (
            <div className="filter-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-input"
              >
                <option value="">All Status</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="PENDING">PENDING</option>
                <option value="REDIRECTED">REDIRECTED</option>
                <option value="FAILED">FAILED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          )}

          {/* Show item type filter only when ItemType is selected */}
          {filters.filterType === 'ItemType' && (
            <div className="filter-group">
              <label htmlFor="itemType">Item Type</label>
              <select
                id="itemType"
                value={filters.itemType}
                onChange={(e) => handleFilterChange('itemType', e.target.value)}
                className="filter-input"
              >
                <option value="">All Item Types</option>
                {itemTypes.map(type => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Item Type filter that shows for all filter types except ItemType */}
          {filters.filterType !== 'ItemType' && (
            <div className="filter-group">
              <label htmlFor="itemType">Item Type (Additional)</label>
              <select
                id="itemType"
                value={filters.itemType}
                onChange={(e) => handleFilterChange('itemType', e.target.value)}
                className="filter-input"
              >
                <option value="">All Item Types</option>
                {itemTypes.map(type => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="filter-actions">
          <button onClick={resetFilters} className="reset-btn">
            Reset Filters
          </button>
          <span className="results-count">
            Showing {filteredData.length} of {processData.length} processes
          </span>
        </div>
      </div>

      <div className="process-list">
        {filteredData.length === 0 ? (
          <div className="no-data">
            No process data found matching your filters
          </div>
        ) : (
          filteredData.map((process) => {
            const progressPercentage = getStageProgress(process.stageActivities);
            
            return (
              <div key={process.serviceProcessId} className="process-card">
                <div 
                  className="process-summary"
                  onClick={() => toggleProcessDetails(process.serviceProcessId)}
                >
                  <div className="process-main-info">
                    <div className="product-info">
                      <h3>{process.productName} - {process.itemName}</h3>
                      <p className="serial-number">Serial: {process.serialNumber}</p>
                      <p className="sub-item">Sub Item: {process.subItemName}</p>
                      <p className="item-type">Type: {process.itemType}</p>
                      <p className="quantity">Quantity: {process.quantity}</p>
                    </div>
                    <div className="process-status">
                      <span className={getStatusBadgeClass(process.processStatus)}>
                        {process.processStatus?.replace('_', ' ') || 'N/A'}
                      </span>
                      <p className="current-stage">Current Stage: {process.currentStage}</p>
                      <p className="created-date">
                        Created: {formatDate(process.createdAt)}
                      </p>
                      {/* <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {progressPercentage}% Complete
                        </span>
                      </div> */}
                    </div>
                  </div>
                  <div className="expand-icon">
                    {expandedProcess === process.serviceProcessId ? '▼' : '►'}
                  </div>
                </div>

                {expandedProcess === process.serviceProcessId && (
                  <div className="process-details">
                    <h4>Stage Activities</h4>
                    <div className="activities-timeline">
                      {process.stageActivities?.map((activity, index) => (
                        <div key={activity.activityId || index} className="activity-item">
                          <div className="activity-timeline">
                            <div className={`timeline-marker ${activity.activityStatus?.toLowerCase()}`}></div>
                            {index < (process.stageActivities?.length || 0) - 1 && (
                              <div className="timeline-connector"></div>
                            )}
                          </div>
                          <div className="activity-content">
                            <div className="activity-header">
                              <h5>{activity.stageName}</h5>
                              <div className="activity-status-group">
                                <span className={getStatusBadgeClass(activity.activityStatus)}>
                                  {activity.activityStatus}
                                </span>
                                {activity.isCurrent && (
                                  <span className="current-badge">Current</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="activity-details">
                              <div className="activity-times">
                                <div className="time-item">
                                  <strong>Accepted:</strong> {formatDate(activity.acceptedAt)}
                                </div>
                                <div className="time-item">
                                  <strong>Started:</strong> {formatDate(activity.startedAt)}
                                </div>
                                <div className="time-item">
                                  <strong>Completed:</strong> {formatDate(activity.completedAt)}
                                </div>
                              </div>
                              
                              {activity.remarks && (
                                <div className="activity-remarks">
                                  <strong>Remarks:</strong> {activity.remarks}
                                </div>
                              )}
                              
                              {activity.failureReason && (
                                <div className="activity-failure">
                                  <strong>Failure Reason:</strong> {activity.failureReason}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StoreTracking;