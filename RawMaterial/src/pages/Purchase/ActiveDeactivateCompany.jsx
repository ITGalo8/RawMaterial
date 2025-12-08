import React, { useState, useEffect } from 'react'
import Api from '../../auth/Api'
import { 
  BuildingOffice2Icon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const ActiveDeactivateCompany = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingCompany, setUpdatingCompany] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [actionType, setActionType] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    filterAndSortCompanies()
  }, [companies, searchTerm, statusFilter, sortConfig])

  const fetchCompanies = async () => {
    setLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const response = await Api.get('/purchase/companies/data')
      if (response.data.success) {
        setCompanies(response.data.data || [])
      } else {
        throw new Error(response.data.message || 'Failed to fetch companies')
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setError(error.response?.data?.message || 'Failed to load companies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCompanies = () => {
    let filtered = [...companies]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(company => 
        company.name?.toLowerCase().includes(term) ||
        company.gstNumber?.toLowerCase().includes(term) ||
        company.state?.toLowerCase().includes(term) ||
        company.country?.toLowerCase().includes(term) ||
        company.address?.toLowerCase().includes(term)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(company => 
        statusFilter === 'active' ? company.isActive : !company.isActive
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key] || ''
        let bValue = b[sortConfig.key] || ''

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    setFilteredCompanies(filtered)
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleStatusChange = (company, action) => {
    setSelectedCompany(company)
    setActionType(action)
    setShowConfirmModal(true)
  }

  const confirmStatusChange = async () => {
    if (!selectedCompany) return

    setUpdatingCompany(selectedCompany.id)
    setError(null)
    setSuccessMessage(null)
    
    try {
      // Convert action to boolean status
      const newStatus = actionType === 'activate'
      
      // Call the API endpoint with PUT method
      const response = await Api.put(`/common/update/${selectedCompany.id}/${newStatus}`)
      
      if (response.data.success) {
        // Update local state immediately
        setCompanies(prevCompanies => 
          prevCompanies.map(company => 
            company.id === selectedCompany.id 
              ? { ...company, isActive: newStatus }
              : company
          )
        )

        // Show success message
        setSuccessMessage(`Company "${selectedCompany.name}" ${actionType === 'activate' ? 'activated' : 'deactivated'} successfully!`)
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } else {
        throw new Error(response.data.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating company status:', error)
      const errorMessage = error.response?.data?.message || `Failed to ${actionType} company. Please try again.`
      setError(errorMessage)
    } finally {
      setUpdatingCompany(null)
      setShowConfirmModal(false)
      setSelectedCompany(null)
      setActionType('')
    }
  }

  const getStatusBadge = (isActive) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      isActive 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <span className={`h-2 w-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )

  const getActionButton = (company) => {
    if (company.isActive) {
      return (
        <button
          onClick={() => handleStatusChange(company, 'deactivate')}
          disabled={updatingCompany === company.id}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {updatingCompany === company.id ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <XCircleIcon className="h-4 w-4 mr-2" />
          )}
          Deactivate
        </button>
      )
    } else {
      return (
        <button
          onClick={() => handleStatusChange(company, 'activate')}
          disabled={updatingCompany === company.id}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {updatingCompany === company.id ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CheckCircleIcon className="h-4 w-4 mr-2" />
          )}
          Activate
        </button>
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <BuildingOffice2Icon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin absolute top-4 left-1/2 transform -translate-x-1/2" />
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading companies...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch company data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Confirmation Modal */}
      {showConfirmModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${actionType === 'activate' ? 'bg-green-100' : 'bg-red-100'}`}>
                {actionType === 'activate' ? (
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircleIcon className="h-8 w-8 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {actionType === 'activate' ? 'Activate Company' : 'Deactivate Company'}
                </h3>
                <p className="text-gray-500 text-sm">Company: {selectedCompany.name}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Current Status:</span>
                  {getStatusBadge(selectedCompany.isActive)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">New Status:</span>
                  {getStatusBadge(actionType === 'activate')}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                Are you sure you want to {actionType} this company?
              </p>
              
              {actionType === 'deactivate' ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Important Notice</p>
                      <p className="text-sm text-red-700 mt-1">
                        Deactivating this company may affect related purchase orders and transactions.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Activation Notice</p>
                      <p className="text-sm text-green-700 mt-1">
                        Activating this company will make it available for all transactions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  setSelectedCompany(null)
                  setActionType('')
                  setError(null)
                }}
                disabled={updatingCompany === selectedCompany.id}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                disabled={updatingCompany === selectedCompany.id}
                className={`px-5 py-2.5 text-white rounded-lg transition-colors font-medium flex items-center gap-2 ${
                  actionType === 'activate' 
                    ? 'bg-green-600 hover:bg-green-700 shadow-sm' 
                    : 'bg-red-600 hover:bg-red-700 shadow-sm'
                } disabled:opacity-50`}
              >
                {updatingCompany === selectedCompany.id ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm {actionType === 'activate' ? 'Activation' : 'Deactivation'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Success</p>
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BuildingOffice2Icon className="h-6 w-6 text-yellow-600" />
                  </div>
                  Company Status Management
                </h1>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Companies</dt>
                  <dd className="mt-2 text-3xl font-bold text-gray-900">{companies.length}</dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-green-200">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Active Companies
                  </dt>
                  <dd className="mt-2 text-3xl font-bold text-green-600">
                    {companies.filter(c => c.isActive).length}
                  </dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-red-200">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    Inactive Companies
                  </dt>
                  <dd className="mt-2 text-3xl font-bold text-red-600">
                    {companies.filter(c => !c.isActive).length}
                  </dd>
                </div>
              </div>
            
            </div>

            {/* Filters */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search companies by name, GST, location..."
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <span className="text-gray-400 hover:text-gray-600">✕</span>
                    </button>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <FunnelIcon className="h-5 w-5 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-2 py-2 text-base border-none bg-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Companies Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors group"
                    >
                      <HomeIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      Company Name
                      <ChevronUpDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('gstNumber')}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors group"
                    >
                      GST Number
                      <ChevronUpDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('state')}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors group"
                    >
                      <MapPinIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      Location
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('country')}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors group"
                    >
                      <GlobeAltIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      Country
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Current Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <BuildingOffice2Icon className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No companies found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-md">
                          {searchTerm 
                            ? `No results for "${searchTerm}". Try a different search term.`
                            : statusFilter !== 'all'
                            ? `No ${statusFilter} companies found`
                            : 'No companies available in the system'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                            <BuildingOffice2Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-xs">
                              {company.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                          {company.gstNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <span className={`h-3 w-3 rounded-full ${
                            company.country === 'INDIA' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></span>
                          {company.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(company.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getActionButton(company)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredCompanies.length}</span> of{' '}
                <span className="font-medium">{companies.length}</span> companies shown
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-600 flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Active: {companies.filter(c => c.isActive).length}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    Inactive: {companies.filter(c => !c.isActive).length}
                  </span>
                </div>
                {updatingCompany && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Updating status...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveDeactivateCompany