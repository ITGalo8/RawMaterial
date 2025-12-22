import React, { useState, useEffect } from "react";
import Api from "../../auth/Api";

const PurchaseDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    poStats: { total: 0, yearly: 0, monthly: 0, weekly: 0, today: 0 },
    spendStats: { total: 0, yearly: 0, monthly: 0, weekly: 0, today: 0 }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/purchase/dashboard");
      setDashboardData(res.data.data);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)}K`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyFull = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const formatNumberFull = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const timeRangeLabel = {
    today: "Today",
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Year",
    total: "Total"
  };

  const calculatePercentage = (current, total) => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-base font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 gap-3 p-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <p className="text-red-600 text-base font-medium mb-1">{error}</p>
          <p className="text-sm text-gray-600 mb-3">Please try again</p>
          <button
            onClick={fetchDashboardData}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md font-medium text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { poStats, spendStats } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-5 w-full max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Purchase Dashboard</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">Overview of purchase orders and spending</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            <span className="text-xs">↻</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-2 text-sm font-medium ${activeTab === "overview" 
            ? "border-b-2 border-yellow-500 text-yellow-700" 
            : "text-gray-600 hover:text-gray-900"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-3 py-2 text-sm font-medium ${activeTab === "details" 
            ? "border-b-2 border-yellow-500 text-yellow-700" 
            : "text-gray-600 hover:text-gray-900"}`}
        >
          Detailed Stats
        </button>
      </div>

      {/* Time Range Filter */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-wrap gap-1 md:gap-2">
          {["today", "weekly", "monthly", "yearly", "total"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 md:px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-yellow-500 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {timeRangeLabel[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      {activeTab === "overview" && (
        <div className="space-y-4 md:space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* PO Count */}
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="text-lg bg-yellow-50 p-1.5 rounded">📊</div>
                <span className="text-xs font-medium text-gray-500">
                  {timeRangeLabel[timeRange]}
                </span>
              </div>
              <h3 className="font-medium text-gray-600 text-xs mb-1">Purchase Orders</h3>
              <div className="mb-2">
                <p className="text-lg md:text-xl font-bold text-gray-900 truncate" title={formatNumberFull(poStats[timeRange])}>
                  {formatNumber(poStats[timeRange])}
                </p>
                <p className="text-xs text-gray-500">
                  {calculatePercentage(poStats[timeRange], poStats.total)}% of total
                </p>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${Math.min(100, calculatePercentage(poStats[timeRange], poStats.total))}%` }}
                ></div>
              </div>
            </div>

            {/* Spend Amount */}
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="text-lg bg-green-50 p-1.5 rounded">💰</div>
                <span className="text-xs font-medium text-gray-500">
                  {timeRangeLabel[timeRange]}
                </span>
              </div>
              <h3 className="font-medium text-gray-600 text-xs mb-1">Total Spend</h3>
              <div className="mb-2">
                <p className="text-lg md:text-xl font-bold text-gray-900 truncate" title={formatCurrencyFull(spendStats[timeRange])}>
                  {formatCurrency(spendStats[timeRange])}
                </p>
                <p className="text-xs text-gray-500">
                  {calculatePercentage(spendStats[timeRange], spendStats.total)}% of total
                </p>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.min(100, calculatePercentage(spendStats[timeRange], spendStats.total))}%` }}
                ></div>
              </div>
            </div>

            {/* Average PO Value */}
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="text-lg bg-purple-50 p-1.5 rounded">📦</div>
                <span className="text-xs font-medium text-gray-500">
                  Average
                </span>
              </div>
              <h3 className="font-medium text-gray-600 text-xs mb-1">Avg. PO Value</h3>
              <div className="mb-2">
                <p className="text-lg md:text-xl font-bold text-gray-900 truncate">
                  {formatCurrency(
                    poStats[timeRange] > 0
                      ? spendStats[timeRange] / poStats[timeRange]
                      : 0
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Based on {timeRangeLabel[timeRange]}
                </p>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Orders: {formatNumber(poStats[timeRange])}</span>
                <span>Spend: {formatCurrency(spendStats[timeRange])}</span>
              </div>
            </div>

            {/* Activity Status */}
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="text-lg bg-blue-50 p-1.5 rounded">⚡</div>
                <span className="text-xs font-medium text-gray-500">
                  Status
                </span>
              </div>
              <h3 className="font-medium text-gray-600 text-xs mb-1">PO Activity</h3>
              <div className="mb-2">
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {poStats[timeRange] > 0 ? "Active" : "Idle"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatNumber(poStats[timeRange])} orders
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  poStats[timeRange] > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span>{poStats[timeRange] > 0 ? "↑" : "↓"}</span>
                <span>{poStats[timeRange] > 0 ? "Processing" : "No Activity"}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3">Quick Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {["today", "weekly", "monthly", "yearly", "total"].map((key) => (
                <div key={key} className="text-center p-2 bg-gray-50 rounded-md">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    {timeRangeLabel[key]}
                  </p>
                  <div className="space-y-1">
                    <div>
                      <p className="text-[10px] text-gray-600">POs</p>
                      <p className="text-sm font-bold text-gray-900 truncate" title={formatNumberFull(poStats[key])}>
                        {formatNumber(poStats[key])}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600">Spend</p>
                      <p className="text-sm font-bold text-gray-900 truncate" title={formatCurrencyFull(spendStats[key])}>
                        {formatCurrency(spendStats[key])}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Statistics Section */}
      {activeTab === "details" && (
        <div className="space-y-4 md:space-y-6">
          {/* PO Statistics Table */}
          <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">Purchase Order Statistics</h3>
            
            <div className="overflow-x-auto">
              <div className="min-w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {["today", "weekly", "monthly", "yearly", "total"].map((key) => {
                  const percentage = calculatePercentage(poStats[key], poStats.total);
                  return (
                    <div key={key} className="bg-gray-50 rounded p-2 md:p-3">
                      <div className="flex items-center mb-1">
                        <span className={`w-2 h-2 rounded-full mr-2 ${key === timeRange ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                        <span className="text-xs font-medium text-gray-700 capitalize">{key}</span>
                      </div>
                      <p className="text-base md:text-lg font-bold text-gray-900 mb-1 truncate" title={formatNumberFull(poStats[key])}>
                        {formatNumber(poStats[key])}
                      </p>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                          <div 
                            className="bg-yellow-500 h-1.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Spend Statistics Table */}
          <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">Spending Statistics</h3>
            
            <div className="overflow-x-auto">
              <div className="min-w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {["today", "weekly", "monthly", "yearly", "total"].map((key) => {
                  const percentage = calculatePercentage(spendStats[key], spendStats.total);
                  return (
                    <div key={key} className="bg-gray-50 rounded p-2 md:p-3">
                      <div className="flex items-center mb-1">
                        <span className={`w-2 h-2 rounded-full mr-2 ${key === timeRange ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-xs font-medium text-gray-700 capitalize">{key}</span>
                      </div>
                      <p className="text-base md:text-lg font-bold text-gray-900 mb-1 truncate" title={formatCurrencyFull(spendStats[key])}>
                        {formatCurrency(spendStats[key])}
                      </p>
                      <div className="text-xs text-gray-600 mb-1 truncate" title={formatCurrencyFull(spendStats[key])}>
                        {formatCurrencyFull(spendStats[key])}
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 md:p-4 border border-yellow-200">
              <h4 className="text-sm md:text-base font-bold text-gray-900 mb-2">PO Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Orders</span>
                  <span className="text-sm font-bold text-gray-900 truncate" title={formatNumberFull(poStats.total)}>
                    {formatNumber(poStats.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Monthly Average</span>
                  <span className="text-sm font-bold text-gray-900 truncate" title={formatNumberFull(poStats.monthly)}>
                    {formatNumber(poStats.monthly)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Today's Orders</span>
                  <span className="text-sm font-bold text-gray-900 truncate" title={formatNumberFull(poStats.today)}>
                    {formatNumber(poStats.today)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200">
              <h4 className="text-sm md:text-base font-bold text-gray-900 mb-2">Spend Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Spend</span>
                  <span className="text-sm font-bold text-gray-900 truncate" title={formatCurrencyFull(spendStats.total)}>
                    {formatCurrency(spendStats.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Monthly Average</span>
                  <span className="text-sm font-bold text-gray-900 truncate" title={formatCurrencyFull(spendStats.monthly)}>
                    {formatCurrency(spendStats.monthly)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Today's Spend</span>
                  <span className="text-sm font-bold text-gray-900 truncate" title={formatCurrencyFull(spendStats.today)}>
                    {formatCurrency(spendStats.today)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Detailed View */}
          <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">Detailed Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-2 text-left text-gray-700 font-medium">Period</th>
                    <th className="py-2 px-2 text-left text-gray-700 font-medium">Orders</th>
                    <th className="py-2 px-2 text-left text-gray-700 font-medium">Spend (Short)</th>
                    <th className="py-2 px-2 text-left text-gray-700 font-medium">Spend (Full)</th>
                    <th className="py-2 px-2 text-left text-gray-700 font-medium">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {["today", "weekly", "monthly", "yearly", "total"].map((key) => (
                    <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 font-medium capitalize">{key}</td>
                      <td className="py-2 px-2 font-bold">{formatNumber(poStats[key])}</td>
                      <td className="py-2 px-2 font-bold">{formatCurrency(spendStats[key])}</td>
                      <td className="py-2 px-2 text-gray-600 truncate max-w-[120px]" title={formatCurrencyFull(spendStats[key])}>
                        {formatCurrencyFull(spendStats[key])}
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full" 
                              style={{ width: `${calculatePercentage(spendStats[key], spendStats.total)}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{calculatePercentage(spendStats[key], spendStats.total)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseDashboard;