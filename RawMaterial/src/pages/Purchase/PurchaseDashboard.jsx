import React, { useState, useEffect } from 'react';
import './CSS/PurchaseDashboard.css';
import Api from '../../auth/Api'

const PurchaseDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    poStats: {
      total: 0,
      yearly: 0,
      monthly: 0,
      weekly: 0,
      today: 0
    },
    spendStats: {
      total: 0,
      yearly: 0,
      monthly: 0,
      weekly: 0,
      today: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly'); // monthly, yearly, weekly, today

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await Api.get('/purchase/dashboard');
      setDashboardData(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'today': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'This Month';
    }
  };

  const getProgressPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (loading) {
    return (
      <div className="purchase-dashboard">
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="purchase-dashboard">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { poStats, spendStats } = dashboardData;

  return (
    <div className="purchase-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Purchase Dashboard</h1>
        </div>
        <button onClick={fetchDashboardData} className="refresh-btn">
          ↻ Refresh
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="time-range-selector">
        <button
          className={`time-range-btn ${timeRange === 'today' ? 'active' : ''}`}
          onClick={() => setTimeRange('today')}
        >
          Today
        </button>
        <button
          className={`time-range-btn ${timeRange === 'weekly' ? 'active' : ''}`}
          onClick={() => setTimeRange('weekly')}
        >
          This Week
        </button>
        <button
          className={`time-range-btn ${timeRange === 'monthly' ? 'active' : ''}`}
          onClick={() => setTimeRange('monthly')}
        >
          This Month
        </button>
        <button
          className={`time-range-btn ${timeRange === 'yearly' ? 'active' : ''}`}
          onClick={() => setTimeRange('yearly')}
        >
          This Year
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        {/* PO Count Card */}
        <div className="metric-card po-count">
          <div className="metric-icon">
            📊
          </div>
          <div className="metric-content">
            <h3>Purchase Orders</h3>
            <div className="metric-value">
              {formatNumber(poStats[timeRange])}
            </div>
            <div className="metric-comparison">
              <span className="comparison-label">{getTimeRangeLabel()}</span>
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min(100, (poStats[timeRange] / (poStats.total || 1)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round((poStats[timeRange] / (poStats.total || 1)) * 100)}% of total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spend Amount Card */}
        <div className="metric-card spend-amount">
          <div className="metric-icon">
            💰
          </div>
          <div className="metric-content">
            <h3>Total Spend</h3>
            <div className="metric-value">
              {formatCurrency(spendStats[timeRange])}
            </div>
            <div className="metric-comparison">
              <span className="comparison-label">{getTimeRangeLabel()}</span>
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min(100, (spendStats[timeRange] / (spendStats.total || 1)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round((spendStats[timeRange] / (spendStats.total || 1)) * 100)}% of total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Average PO Value */}
        <div className="metric-card avg-po-value">
          <div className="metric-icon">
            📦
          </div>
          <div className="metric-content">
            <h3>Average PO Value</h3>
            <div className="metric-value">
              {formatCurrency(
                poStats[timeRange] > 0 ? spendStats[timeRange] / poStats[timeRange] : 0
              )}
            </div>
            <div className="metric-comparison">
              <span className="comparison-label">Per Purchase Order</span>
              <div className="metric-description">
                Based on {timeRange} data
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Metric */}
        <div className="metric-card efficiency">
          <div className="metric-icon">
            ⚡
          </div>
          <div className="metric-content">
            <h3>PO Activity</h3>
            <div className="metric-value">
              {poStats[timeRange] > 0 ? 'Active' : 'No Activity'}
            </div>
            <div className="metric-comparison">
              <span className="comparison-label">{getTimeRangeLabel()}</span>
              <div className="activity-status">
                <div className={`status-indicator ${poStats[timeRange] > 0 ? 'active' : 'inactive'}`}>
                  {poStats[timeRange] > 0 ? '📈 Processing' : '📉 Idle'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Section */}
      <div className="detailed-stats">
        <div className="stats-section">
          <h3>Purchase Order Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label>Today</label>
              <span className="stat-value">{formatNumber(poStats.today)}</span>
            </div>
            <div className="stat-item">
              <label>This Week</label>
              <span className="stat-value">{formatNumber(poStats.weekly)}</span>
            </div>
            <div className="stat-item">
              <label>This Month</label>
              <span className="stat-value">{formatNumber(poStats.monthly)}</span>
            </div>
            <div className="stat-item">
              <label>This Year</label>
              <span className="stat-value">{formatNumber(poStats.yearly)}</span>
            </div>
            <div className="stat-item total">
              <label>Total</label>
              <span className="stat-value">{formatNumber(poStats.total)}</span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h3>Spending Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label>Today</label>
              <span className="stat-value">{formatCurrency(spendStats.today)}</span>
            </div>
            <div className="stat-item">
              <label>This Week</label>
              <span className="stat-value">{formatCurrency(spendStats.weekly)}</span>
            </div>
            <div className="stat-item">
              <label>This Month</label>
              <span className="stat-value">{formatCurrency(spendStats.monthly)}</span>
            </div>
            <div className="stat-item">
              <label>This Year</label>
              <span className="stat-value">{formatCurrency(spendStats.yearly)}</span>
            </div>
            <div className="stat-item total">
              <label>Total</label>
              <span className="stat-value">{formatCurrency(spendStats.total)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PurchaseDashboard;