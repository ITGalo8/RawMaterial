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
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatNumber = (num) =>
    new Intl.NumberFormat("en-IN").format(num);

  const timeRangeLabel = {
    today: "Today",
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Year",
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading dashboard data...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );

  const { poStats, spendStats } = dashboardData;

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold">Total Purchase Details</h1>
      </div>

      {/* Time Range */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["today", "weekly", "monthly", "yearly"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg border ${
              timeRange === range
                ? "bg-yellow-300 text-dark border-dark-600"
                : "bg-yellow text-dark-800 border-dark-300"
            }`}
          >
            {timeRangeLabel[range]}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* PO Count */}
        <div className="bg-white shadow-lg rounded-xl p-5 border">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-lg mb-2">Purchase Orders</h3>
          <p className="text-3xl font-bold">{formatNumber(poStats[timeRange])}</p>
          <div className="mt-3 text-sm text-gray-600">
            {timeRangeLabel[timeRange]} —{" "}
            {Math.round((poStats[timeRange] / (poStats.total || 1)) * 100)}% of total
          </div>

          <div className="mt-2 h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{
                width: `${Math.min(100, (poStats[timeRange] / (poStats.total || 1)) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Spend Amount */}
        <div className="bg-white shadow-lg rounded-xl p-5 border">
          <div className="text-4xl mb-3">💰</div>
          <h3 className="font-semibold text-lg mb-2">Total Spend</h3>
          <p className="text-3xl font-bold">{formatCurrency(spendStats[timeRange])}</p>
          <div className="mt-3 text-sm text-gray-600">
            {Math.round((spendStats[timeRange] / (spendStats.total || 1)) * 100)}% of total
          </div>

          <div className="mt-2 h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-yellow-500 rounded"
              style={{
                width: `${Math.min(
                  100,
                  (spendStats[timeRange] / (spendStats.total || 1)) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Average PO Value */}
        <div className="bg-white shadow-lg rounded-xl p-5 border">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="font-semibold text-lg mb-2">Average PO Value</h3>
          <p className="text-3xl font-bold">
            {formatCurrency(
              poStats[timeRange] > 0
                ? spendStats[timeRange] / poStats[timeRange]
                : 0
            )}
          </p>
          <p className="text-sm text-gray-600 mt-2">Based on {timeRangeLabel[timeRange]}</p>
        </div>

        {/* Activity */}
        <div className="bg-white shadow-lg rounded-xl p-5 border">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-semibold text-lg mb-2">PO Activity</h3>
          <p className="text-3xl font-bold">
            {poStats[timeRange] > 0 ? "Active" : "No Activity"}
          </p>
          <div
            className={`mt-3 px-3 py-1 rounded text-sm ${
              poStats[timeRange] > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {poStats[timeRange] > 0 ? "📈 Processing" : "📉 Idle"}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PO Stats */}
        <div className="bg-white p-6 shadow-lg rounded-xl border">
          <h3 className="text-xl font-bold mb-4">Purchase Order Statistics</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {["today", "weekly", "monthly", "yearly", "total"].map((key) => (
              <div key={key} className="text-center">
                <p className="text-gray-500 capitalize">{key}</p>
                <p className="text-2xl font-semibold">
                  {formatNumber(poStats[key])}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Spend Stats */}
        <div className="bg-white p-6 shadow-lg rounded-xl border">
          <h3 className="text-xl font-bold mb-4">Spending Statistics</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {["today", "weekly", "monthly", "yearly", "total"].map((key) => (
              <div key={key} className="text-center">
                <p className="text-gray-500 capitalize">{key}</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(spendStats[key])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDashboard;
