import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, Package } from 'lucide-react';
import Api from '../../../../auth/Api';

const DirectItemIssueHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    issuedTo: '',
    issuedBy: '',
    startDate: '',
    endDate: ''
  });

  const fetchDirectIssueHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await Api.get('/store-keeper/directItemIssue/history');
      
      if (response.data.success) {
        const data = response.data.data || [];
        setTransactions(data);
        setFilteredTransactions(data);
      } else {
        setError('Failed to fetch transaction history');
        setTransactions([]);
        setFilteredTransactions([]);
      }
    } catch (err) {
      setError('Error fetching transaction history');
      console.error('Error fetching direct issue history:', err);
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Get unique users for filter dropdowns
  const getUniqueUsers = () => {
    const issuedToSet = new Set();
    const issuedBySet = new Set();
    
    transactions.forEach(transaction => {
      if (transaction.issuedToName) issuedToSet.add(transaction.issuedToName);
      if (transaction.issuedByName) issuedBySet.add(transaction.issuedByName);
    });
    
    return {
      issuedTo: Array.from(issuedToSet).sort(),
      issuedBy: Array.from(issuedBySet).sort()
    };
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.issuedToName?.toLowerCase().includes(term) ||
        transaction.issuedByName?.toLowerCase().includes(term) ||
        transaction.remarks?.toLowerCase().includes(term) ||
        transaction.rawMaterialIssued.some(item => 
          item.rawMaterialName?.toLowerCase().includes(term)
        )
      );
    }

    // Issued To filter
    if (filters.issuedTo) {
      filtered = filtered.filter(transaction => 
        transaction.issuedToName === filters.issuedTo
      );
    }

    // Issued By filter
    if (filters.issuedBy) {
      filtered = filtered.filter(transaction => 
        transaction.issuedByName === filters.issuedBy
      );
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(transaction => 
        new Date(transaction.issuedAt) >= startDate
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(transaction => 
        new Date(transaction.issuedAt) <= endDate
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      issuedTo: '',
      issuedBy: '',
      startDate: '',
      endDate: ''
    });
    setFilteredTransactions(transactions);
  };

  useEffect(() => {
    fetchDirectIssueHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, transactions]);

  const uniqueUsers = getUniqueUsers();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Direct Item Issue History
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Track all direct material issuance transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredTransactions.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Recipients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {uniqueUsers.issuedTo.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issuers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {uniqueUsers.issuedBy.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items Issued</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredTransactions.reduce((sum, transaction) => 
                    sum + transaction.rawMaterialIssued.length, 0
                  )}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Issued To Filter */}
            <select
              value={filters.issuedTo}
              onChange={(e) => handleFilterChange('issuedTo', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="">All Recipients</option>
              {uniqueUsers.issuedTo.map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>

            {/* Issued By Filter */}
            <select
              value={filters.issuedBy}
              onChange={(e) => handleFilterChange('issuedBy', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="">All Issuers</option>
              {uniqueUsers.issuedBy.map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="From"
              />
            </div>
          </div>

          {filters.startDate && (
            <div className="mt-2">
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="To"
              />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <span className="text-gray-600 text-lg">Loading transactions...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchDirectIssueHistory}
              className="sm:ml-auto px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-800 px-6 py-4 sm:px-8 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-semibold text-white">
                  Direct Issue Transactions
                </h3>
                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {filteredTransactions.length > 0 ? (
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issued To
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issued By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items Issued
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {transaction.issuedToName}
                              </div>
                              <div className="text-xs text-gray-500">
                                Recipient
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.issuedByName}
                          </div>
                          <div className="text-xs text-gray-500">
                            Issuer
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {transaction.rawMaterialIssued.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-900 font-medium truncate max-w-[200px]">
                                  {item.rawMaterialName}
                                </span>
                                <span className="ml-2 text-green-600 font-semibold">
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            ))}
                            <div className="text-xs text-gray-500 mt-2">
                              {transaction.rawMaterialIssued.length} item{transaction.rawMaterialIssued.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(transaction.issuedAt)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTimeAgo(transaction.issuedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-[200px]">
                            {transaction.remarks || (
                              <span className="text-gray-400 italic">No remarks</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No transactions found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || Object.values(filters).some(f => f) 
                      ? 'Try adjusting your search or filters' 
                      : 'No direct item issues have been recorded yet'}
                  </p>
                </div>
              )}
            </div>

            {/* Table Footer */}
            {filteredTransactions.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredTransactions.length}</span> of{' '}
                    <span className="font-medium">{transactions.length}</span> transactions
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectItemIssueHistory;