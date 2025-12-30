import React, { useState, useEffect } from "react";
import Api from "../../auth/Api";

const InstallationStock = () => {
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const [systemList, setSystemList] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState("");

  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  /* ---------------- Fetch Warehouses & Systems ---------------- */
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await Api.get("/purchase/warehouses");
        const formatted = res?.data?.data?.map((w) => ({
          label: w.warehouseName,
          value: w._id,
        }));
        setWarehouseList(formatted || []);
      } catch (err) {
        console.error("Error loading warehouses:", err);
        alert("Error loading warehouses");
      }
    };

    const fetchSystems = async () => {
      try {
        const res = await Api.get("/purchase/systems");
        const formatted = res?.data?.data?.map((s) => ({
          label: s.name,
          value: s._id || s.id,
        }));
        setSystemList(formatted || []);
      } catch (err) {
        console.error("Error loading systems:", err);
        alert("Error loading systems");
      }
    };

    fetchWarehouses();
    fetchSystems();
  }, []);

  /* ---------------- Fetch Stock Data ---------------- */
  useEffect(() => {
    if (!selectedWarehouse || !selectedSystem) {
      setStockData(null);
      return;
    }

    const fetchStockData = async () => {
      try {
        setLoading(true);
        const res = await Api.get(
          `/purchase/dashboard/warehouses/${selectedWarehouse}/systems/${selectedSystem}/orders`
        );
        setStockData(res?.data?.data || null);
      } catch (err) {
        console.error("Error loading stock details:", err);
        alert("Error loading stock details");
        setStockData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedWarehouse, selectedSystem]);

  // Helper function to get status color based on shortage
  const getShortageColor = (shortageQty) => {
    if (shortageQty === 0) return "text-green-600 bg-green-50";
    if (shortageQty > 0 && shortageQty <= 100) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  // Calculate totals for summary
  const calculateTotals = () => {
    if (!stockData) return {};
    
    const commonItems = stockData.commonItems || [];
    const variableItems = stockData.variableItems || [];
    
    let totalRequiredQty = 0;
    let totalShortageQty = 0;
    let totalStockQty = 0;
    
    commonItems.forEach(item => {
      totalRequiredQty += item.requiredQty || 0;
      totalShortageQty += item.shortageQty || 0;
      totalStockQty += item.stockQty || 0;
    });
    
    variableItems.forEach(head => {
      head.items?.forEach(item => {
        totalRequiredQty += item.requiredQty || 0;
        totalShortageQty += item.shortageQty || 0;
        totalStockQty += item.stockQty || 0;
      });
    });
    
    return {
      totalRequiredQty,
      totalShortageQty,
      totalStockQty,
      totalItems: commonItems.length + variableItems.reduce((sum, head) => sum + (head.items?.length || 0), 0)
    };
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedWarehouse("");
    setSelectedSystem("");
    setStockData(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Installation Stock Analysis
        </h2>
        <p className="text-gray-600 mt-2">
          View detailed stock availability for installation projects
        </p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Warehouse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Warehouse *
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition duration-150 ease-in-out bg-white
                hover:border-gray-400 cursor-pointer"
            >
              <option value="">-- Select Warehouse --</option>
              {warehouseList.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          {/* System */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select System *
            </label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition duration-150 ease-in-out bg-white
                hover:border-gray-400 cursor-pointer"
            >
              <option value="">-- Select System --</option>
              {systemList.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-4 text-sm text-gray-500">
          <p>Please select both warehouse and system to view installation stock details.</p>
        </div>
      </div>

      {/* Active Filters Summary */}
      {selectedWarehouse && selectedSystem && stockData && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <h3 className="text-base font-semibold text-blue-800">Analysis Results</h3>
              </div>
              <div className="mt-2">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Warehouse:</span> {stockData.warehouse} • 
                  <span className="font-semibold ml-2">System:</span> {stockData.system}
                </p>
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Analyzing stock data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we calculate availability</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !stockData && selectedWarehouse && selectedSystem && (
        <div className="text-center py-16 px-4">
          <div className="mx-auto h-32 w-32 text-gray-300 mb-6">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No stock data found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            No installation stock data available for the selected warehouse and system combination.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Try Different Filters
          </button>
        </div>
      )}

      {/* Initial State */}
      {!loading && (!selectedWarehouse || !selectedSystem) && !stockData && (
        <div className="text-center py-16 px-4 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200">
          <div className="mx-auto h-32 w-32 text-blue-100 mb-6">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Select Filters to Begin</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose a warehouse and system from the dropdowns above to view installation stock analysis.
          </p>
        </div>
      )}

      {/* Stock Data Display */}
      {!loading && stockData && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Systems Possible</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stockData.summary?.motorCommonSystem?.possibleSystem || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Desired Systems</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stockData.summary?.motorCommonSystem?.totalDesired || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-50 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Common Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stockData.commonItems?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-50 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pump Heads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stockData.variableItems?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("summary")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "summary"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                System Summary
              </button>
              <button
                onClick={() => setActiveTab("common")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "common"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Common Items ({stockData.commonItems?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("variable")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "variable"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Variable Items
              </button>
              <button
                onClick={() => setActiveTab("headwise")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "headwise"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Head-wise Analysis
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Summary Tab */}
            {activeTab === "summary" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">System Summary</h3>
                
                {/* Motor Common System */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-700 mb-4">Motor Common System Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Total Desired Systems</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stockData.summary?.motorCommonSystem?.totalDesired || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Possible Systems</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stockData.summary?.motorCommonSystem?.possibleSystem || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Head-wise System Summary */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Head-wise System Summary</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pump Head
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Desired Systems
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Possible Systems
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stockData.summary?.headWiseSystem && Object.entries(stockData.summary.headWiseSystem).map(([head, data]) => (
                          <tr key={head} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {head}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-900">
                              {data.desiredSystem || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                data.possibleSystem >= data.desiredSystem
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {data.possibleSystem || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.possibleSystem >= data.desiredSystem ? (
                                <span className="inline-flex items-center text-green-600">
                                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  Sufficient
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-red-600">
                                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                  Shortage
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Common Items Tab */}
            {activeTab === "common" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Common Items</h3>
                  <div className="text-sm text-gray-500">
                    Showing {stockData.commonItems?.length || 0} items
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          BOM Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Possible System
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Required Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Shortage Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stockData.commonItems?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.bomQty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.stockQty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              item.possibleSystem >= Math.ceil(item.requiredQty / item.bomQty)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.possibleSystem}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.requiredQty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getShortageColor(item.shortageQty)}`}>
                              {item.shortageQty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.shortageQty === 0 ? (
                              <span className="inline-flex items-center text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-red-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Shortage
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Variable Items Tab */}
            {activeTab === "variable" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Variable Items by Pump Head</h3>
                  <div className="text-sm text-gray-500">
                    {stockData.variableItems?.length || 0} pump heads
                  </div>
                </div>
                
                <div className="space-y-6">
                  {stockData.variableItems?.map((head, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-md font-semibold text-gray-900">
                              Pump Head: {head.pumpHead}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-600">
                                Desired Systems: <span className="font-semibold">{head.desiredSystems}</span>
                              </span>
                              <span className="text-sm text-gray-600">
                                Possible Systems: <span className="font-semibold">{head.possibleSystems}</span>
                              </span>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                head.possibleSystems >= head.desiredSystems
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {head.possibleSystems >= head.desiredSystems ? 'Sufficient' : 'Shortage'}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {head.items?.length || 0} items
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                BOM Qty
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock Qty
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Possible System
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Required Qty
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shortage Qty
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {head.items?.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.itemName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.bomQty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.stockQty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    item.possibleSystem >= Math.ceil(item.requiredQty / item.bomQty)
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {item.possibleSystem}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.requiredQty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getShortageColor(item.shortageQty)}`}>
                                    {item.shortageQty}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Head-wise Analysis Tab */}
            {activeTab === "headwise" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Head-wise System Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stockData.variableItems?.map((head, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-md font-semibold text-gray-900">{head.pumpHead}</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          head.possibleSystems >= head.desiredSystems
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {head.possibleSystems >= head.desiredSystems ? '✓ Available' : '⚠ Shortage'}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Desired Systems</span>
                          <span className="text-lg font-bold text-gray-900">{head.desiredSystems}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Possible Systems</span>
                          <span className="text-lg font-bold text-gray-900">{head.possibleSystems}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Items Required</span>
                          <span className="text-lg font-bold text-gray-900">{head.items?.length || 0}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Critical Items:</h5>
                        <div className="space-y-2">
                          {head.items?.filter(item => item.shortageQty > 0).slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 truncate mr-2">{item.itemName}</span>
                              <span className="text-red-600 font-medium whitespace-nowrap">-{item.shortageQty}</span>
                            </div>
                          ))}
                          {head.items?.filter(item => item.shortageQty > 0).length > 2 && (
                            <div className="text-sm text-blue-600">
                              +{head.items.filter(item => item.shortageQty > 0).length - 2} more items
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary Chart */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">System Availability Overview</h4>
                  <div className="space-y-4">
                    {stockData.variableItems?.map((head, index) => {
                      const percentage = Math.min(100, (head.possibleSystems / head.desiredSystems) * 100);
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">{head.pumpHead}</span>
                            <span className="text-sm text-gray-600">
                              {head.possibleSystems} / {head.desiredSystems} systems
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                percentage >= 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Stock Analysis Summary</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-600">
                      {stockData.summary?.motorCommonSystem?.possibleSystem || 0}
                    </p>
                    <p className="text-xs text-gray-500">Systems Possible</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">
                      {stockData.commonItems?.filter(item => item.shortageQty === 0).length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Fully Available Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-yellow-600">
                      {stockData.commonItems?.filter(item => item.shortageQty > 0 && item.shortageQty <= 100).length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Minor Shortages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-red-600">
                      {stockData.commonItems?.filter(item => item.shortageQty > 100).length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Major Shortages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InstallationStock;