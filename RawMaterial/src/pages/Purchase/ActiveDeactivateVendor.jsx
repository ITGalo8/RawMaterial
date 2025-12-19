// import React, { useState, useEffect } from 'react'
// import Api from '../../auth/Api'
// import { 
//   BuildingOffice2Icon, 
//   CheckCircleIcon, 
//   XCircleIcon,
//   ArrowPathIcon,
//   PowerIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   ChevronUpDownIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   ExclamationTriangleIcon
// } from '@heroicons/react/24/outline'

// const ActiveDeactivateVendor = () => {
//   const [vendors, setVendors] = useState([])
//   const [filteredVendors, setFilteredVendors] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [updatingVendor, setUpdatingVendor] = useState(null)
//   const [showConfirmModal, setShowConfirmModal] = useState(false)
//   const [selectedVendor, setSelectedVendor] = useState(null)
//   const [actionType, setActionType] = useState('')
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     fetchVendors()
//   }, [])

//   useEffect(() => {
//     filterAndSortVendors()
//   }, [vendors, searchTerm, statusFilter, sortConfig])

//   const fetchVendors = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await Api.get('/purchase/vendors/data')
//       if (response.data.success) {
//         setVendors(response.data.data || [])
//       } else {
//         throw new Error(response.data.message || 'Failed to fetch vendors')
//       }
//     } catch (error) {
//       console.error('Error fetching vendors:', error)
//       setError(error.response?.data?.message || 'Failed to load vendors. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterAndSortVendors = () => {
//     let filtered = [...vendors]

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       filtered = filtered.filter(vendor => 
//         vendor.name?.toLowerCase().includes(term) ||
//         vendor.gstNumber?.toLowerCase().includes(term) ||
//         vendor.state?.toLowerCase().includes(term) ||
//         vendor.country?.toLowerCase().includes(term) ||
//         vendor.address?.toLowerCase().includes(term)
//       )
//     }

//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(vendor => 
//         statusFilter === 'active' ? vendor.isActive : !vendor.isActive
//       )
//     }

//     // Apply sorting
//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         let aValue = a[sortConfig.key] || ''
//         let bValue = b[sortConfig.key] || ''

//         if (typeof aValue === 'string') {
//           aValue = aValue.toLowerCase()
//           bValue = bValue.toLowerCase()
//         }

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1
//         }
//         return 0
//       })
//     }

//     setFilteredVendors(filtered)
//   }

//   const handleSort = (key) => {
//     let direction = 'asc'
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc'
//     }
//     setSortConfig({ key, direction })
//   }

//   const handleStatusChange = (vendor, action) => {
//     setSelectedVendor(vendor)
//     setActionType(action)
//     setShowConfirmModal(true)
//   }

//   const confirmStatusChange = async () => {
//     if (!selectedVendor) return

//     setUpdatingVendor(selectedVendor.id)
//     setError(null)
    
//     try {
//       // Convert action to boolean status
//       const newStatus = actionType === 'activate'
      
//       // Call the API endpoint with PUT method
//       const response = await Api.put(`/common/update/${selectedVendor.id}/${newStatus}`)
      
//       if (response.data.success) {
//         // Update local state immediately
//         setVendors(prevVendors => 
//           prevVendors.map(vendor => 
//             vendor.id === selectedVendor.id 
//               ? { ...vendor, isActive: newStatus }
//               : vendor
//           )
//         )

//         // Show success message
//         alert(`Vendor ${actionType === 'activate' ? 'activated' : 'deactivated'} successfully!`)
//       } else {
//         throw new Error(response.data.message || 'Failed to update status')
//       }
//     } catch (error) {
//       console.error('Error updating vendor status:', error)
//       const errorMessage = error.response?.data?.message || `Failed to ${actionType} vendor. Please try again.`
//       setError(errorMessage)
//       alert(errorMessage)
//     } finally {
//       setUpdatingVendor(null)
//       setShowConfirmModal(false)
//       setSelectedVendor(null)
//       setActionType('')
//     }
//   }

//   const getStatusBadge = (isActive) => (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//       isActive 
//         ? 'bg-green-100 text-green-800 border border-green-200' 
//         : 'bg-red-100 text-red-800 border border-red-200'
//     }`}>
//       <span className={`h-2 w-2 rounded-full mr-1 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
//       {isActive ? 'Active' : 'Inactive'}
//     </span>
//   )

//   const getActionButton = (vendor) => {
//     if (vendor.isActive) {
//       return (
//         <button
//           onClick={() => handleStatusChange(vendor, 'deactivate')}
//           disabled={updatingVendor === vendor.id}
//           className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {updatingVendor === vendor.id ? (
//             <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
//           ) : (
//             <XCircleIcon className="h-4 w-4 mr-1" />
//           )}
//           Deactivate
//         </button>
//       )
//     } else {
//       return (
//         <button
//           onClick={() => handleStatusChange(vendor, 'activate')}
//           disabled={updatingVendor === vendor.id}
//           className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {updatingVendor === vendor.id ? (
//             <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
//           ) : (
//             <CheckCircleIcon className="h-4 w-4 mr-1" />
//           )}
//           Activate
//         </button>
//       )
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading vendors...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       {/* Confirmation Modal */}
//       {showConfirmModal && selectedVendor && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <ExclamationTriangleIcon className="h-10 w-10 text-yellow-500" />
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Confirm {actionType === 'activate' ? 'Activation' : 'Deactivation'}
//                 </h3>
//                 <p className="text-sm text-gray-500">Vendor: {selectedVendor.name}</p>
//               </div>
//             </div>
            
//             <div className="mb-6">
//               <p className="text-gray-600 mb-3">
//                 Are you sure you want to {actionType} this vendor?
//               </p>
              
//               {actionType === 'deactivate' ? (
//                 <div className="bg-red-50 border border-red-200 rounded-md p-3">
//                   <div className="flex items-start gap-2">
//                     <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-medium text-red-800">Important Note</p>
//                       <p className="text-sm text-red-700 mt-1">
//                         Deactivated vendors cannot be selected for new purchase orders or transactions.
//                         Existing orders will not be affected.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-green-50 border border-green-200 rounded-md p-3">
//                   <div className="flex items-start gap-2">
//                     <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-medium text-green-800">Activation Note</p>
//                       <p className="text-sm text-green-700 mt-1">
//                         Activated vendors will be available for new purchase orders and transactions.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="bg-gray-50 rounded-md p-4 mb-6">
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <span className="text-gray-500 font-medium">Current Status:</span>
//                   <div className="mt-1">{getStatusBadge(selectedVendor.isActive)}</div>
//                 </div>
//                 <div>
//                   <span className="text-gray-500 font-medium">New Status:</span>
//                   <div className="mt-1">
//                     {getStatusBadge(actionType === 'activate')}
//                   </div>
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-gray-500 font-medium">GST:</span>
//                   <div className="text-gray-900">{selectedVendor.gstNumber || 'N/A'}</div>
//                 </div>
//               </div>
//             </div>
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             )}
            
//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={() => {
//                   setShowConfirmModal(false)
//                   setSelectedVendor(null)
//                   setActionType('')
//                   setError(null)
//                 }}
//                 disabled={updatingVendor === selectedVendor.id}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmStatusChange}
//                 disabled={updatingVendor === selectedVendor.id}
//                 className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
//                   actionType === 'activate' 
//                     ? 'bg-green-600 hover:bg-green-700' 
//                     : 'bg-red-600 hover:bg-red-700'
//                 } disabled:opacity-50`}
//               >
//                 {updatingVendor === selectedVendor.id ? (
//                   <>
//                     <ArrowPathIcon className="h-4 w-4 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     {actionType === 'activate' ? 'Confirm Activation' : 'Confirm Deactivation'}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto">
//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <div className="flex items-center gap-3">
//               <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
//               <div>
//                 <p className="font-medium text-red-800">Error</p>
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//           {/* Header */}
//           <div className="px-6 py-5 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                   <BuildingOffice2Icon className="h-8 w-8 text-yellow-600 " />
//                   Vendor Status Management
//                 </h1>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
//               <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
//                 <div className="px-4 py-5 sm:p-6">
//                   <dt className="text-sm font-medium text-gray-500 truncate">Total Vendors</dt>
//                   <dd className="mt-1 text-3xl font-semibold text-gray-900">{vendors.length}</dd>
//                 </div>
//               </div>
//               <div className="bg-white overflow-hidden shadow rounded-lg border border-green-100">
//                 <div className="px-4 py-5 sm:p-6">
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     <span className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-green-500"></div>
//                       Active Vendors
//                     </span>
//                   </dt>
//                   <dd className="mt-1 text-3xl font-semibold text-green-600">
//                     {vendors.filter(v => v.isActive).length}
//                   </dd>
//                 </div>
//               </div>
//               <div className="bg-white overflow-hidden shadow rounded-lg border border-red-100">
//                 <div className="px-4 py-5 sm:p-6">
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     <span className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-red-500"></div>
//                       Inactive Vendors
//                     </span>
//                   </dt>
//                   <dd className="mt-1 text-3xl font-semibold text-red-600">
//                     {vendors.filter(v => !v.isActive).length}
//                   </dd>
//                 </div>
//               </div>
//             </div>

//             {/* Filters */}
//             <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               <div>
//                 <label htmlFor="search" className="sr-only">Search</label>
//                 <div className="relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="search"
//                     id="search"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
//                     placeholder="Search vendors..."
//                   />
//                 </div>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <FunnelIcon className="h-5 w-5 text-gray-400" />
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="active">Active Only</option>
//                     <option value="inactive">Inactive Only</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Vendors Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button
//                       onClick={() => handleSort('name')}
//                       className="flex items-center gap-1 hover:text-gray-700 transition-colors"
//                     >
//                       Vendor Name
//                       <ChevronUpDownIcon className="h-4 w-4" />
//                     </button>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button
//                       onClick={() => handleSort('gstNumber')}
//                       className="flex items-center gap-1 hover:text-gray-700 transition-colors"
//                     >
//                       GST Number
//                       <ChevronUpDownIcon className="h-4 w-4" />
//                     </button>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button
//                       onClick={() => handleSort('state')}
//                       className="flex items-center gap-1 hover:text-gray-700 transition-colors"
//                     >
//                       State
//                       <ChevronUpDownIcon className="h-4 w-4" />
//                     </button>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <button
//                       onClick={() => handleSort('country')}
//                       className="flex items-center gap-1 hover:text-gray-700 transition-colors"
//                     >
//                       Country
//                       <ChevronUpDownIcon className="h-4 w-4" />
//                     </button>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredVendors.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <BuildingOffice2Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                       <p className="text-gray-500">No vendors found</p>
//                       {searchTerm && (
//                         <p className="text-sm text-gray-400 mt-2">
//                           No results for "{searchTerm}". Try a different search term.
//                         </p>
//                       )}
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredVendors.map((vendor) => (
//                     <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
//                             <div className="text-sm text-gray-500 truncate max-w-xs">
//                               {vendor.address}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900 font-mono">{vendor.gstNumber}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{vendor.state}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{vendor.country}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getStatusBadge(vendor.isActive)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         {getActionButton(vendor)}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}
//           <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="text-sm text-gray-500">
//                 Showing <span className="font-medium">{filteredVendors.length}</span> of{' '}
//                 <span className="font-medium">{vendors.length}</span> vendors
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="text-sm text-gray-500">
//                   <span className="inline-flex items-center gap-1">
//                     <div className="h-2 w-2 rounded-full bg-green-500"></div>
//                     {vendors.filter(v => v.isActive).length} active
//                   </span>
//                   {' • '}
//                   <span className="inline-flex items-center gap-1">
//                     <div className="h-2 w-2 rounded-full bg-red-500"></div>
//                     {vendors.filter(v => !v.isActive).length} inactive
//                   </span>
//                 </div>
//                 {updatingVendor && (
//                   <div className="flex items-center gap-2 text-sm text-blue-600">
//                     <ArrowPathIcon className="h-4 w-4 animate-spin" />
//                     Updating vendor...
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ActiveDeactivateVendor


import React, { useState, useEffect } from "react";
import Api from "../../auth/Api";
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ActiveDeactivateVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [updatingVendor, setUpdatingVendor] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionType, setActionType] = useState("");
  const [error, setError] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vendors, searchTerm, statusFilter, sortConfig]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/purchase/vendors/data");
      setVendors(res.data?.data || []);
    } catch (err) {
      setError("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER + SORT ================= */
  const applyFilters = () => {
    let data = [...vendors];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (v) =>
          v.name?.toLowerCase().includes(term) ||
          v.gstNumber?.toLowerCase().includes(term) ||
          v.state?.toLowerCase().includes(term) ||
          v.country?.toLowerCase().includes(term) ||
          v.address?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((v) =>
        statusFilter === "active" ? v.isActive : !v.isActive
      );
    }

    data.sort((a, b) => {
      const aVal = a[sortConfig.key]?.toString().toLowerCase() || "";
      const bVal = b[sortConfig.key]?.toString().toLowerCase() || "";
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    setFilteredVendors(data);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  /* ================= STATUS UPDATE ================= */
  const handleStatusChange = (vendor, action) => {
    setSelectedVendor(vendor);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      setUpdatingVendor(selectedVendor.id);
      const newStatus = actionType === "activate";
      await Api.put(`/common/update/${selectedVendor.id}/${newStatus}`);

      setVendors((prev) =>
        prev.map((v) =>
          v.id === selectedVendor.id ? { ...v, isActive: newStatus } : v
        )
      );
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingVendor(null);
      setShowConfirmModal(false);
    }
  };

  const statusBadge = (active) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        active
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-red-100 text-red-700 border-red-200"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <ArrowPathIcon className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ================= MODAL ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-3">
              Confirm {actionType === "activate" ? "Activation" : "Deactivation"}
            </h2>
            <p className="mb-4 text-gray-600">{selectedVendor?.name}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`px-4 py-2 text-white rounded ${
                  actionType === "activate"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CARD ================= */}
      <div className="bg-white rounded-xl shadow-lg w-full">
        {/* HEADER */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BuildingOffice2Icon className="h-7 w-7 text-yellow-600" />
            Vendor Status Management
          </h1>

          {/* FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendor..."
                className="pl-10 w-full border rounded-md py-2"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md py-2 px-3"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {["name", "gstNumber", "state", "country"].map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-6 py-3 text-left text-xs font-bold uppercase cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      {key.replace(/([A-Z])/g, " $1")}
                      <ChevronUpDownIcon className="h-4 w-4" />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{vendor.name}</p>
                    <p className="text-sm text-gray-500 break-words">
                      {vendor.address}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {vendor.gstNumber}
                  </td>
                  <td className="px-6 py-4">{vendor.state}</td>
                  <td className="px-6 py-4">{vendor.country}</td>
                  <td className="px-6 py-4">
                    {statusBadge(vendor.isActive)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleStatusChange(
                          vendor,
                          vendor.isActive ? "deactivate" : "activate"
                        )
                      }
                      disabled={updatingVendor === vendor.id}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        vendor.isActive
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {vendor.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-gray-50 text-sm text-gray-600 flex justify-between">
          <span>
            Showing {filteredVendors.length} of {vendors.length}
          </span>
          <span>
            Active: {vendors.filter((v) => v.isActive).length} • Inactive:{" "}
            {vendors.filter((v) => !v.isActive).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActiveDeactivateVendor;
