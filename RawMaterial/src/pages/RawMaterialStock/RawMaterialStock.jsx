// import React, { useEffect, useState } from "react";
// import Api from "../../auth/Api";
// import {
//   CheckCircleIcon,
//   XCircleIcon,
//   ArrowPathIcon,
//   ExclamationTriangleIcon,
//   InformationCircleIcon,
//   BellAlertIcon,
//   CubeIcon,
//   TagIcon,
//   CubeTransparentIcon,
//   ArrowsUpDownIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   BeakerIcon,
//   ShoppingCartIcon
// } from "@heroicons/react/24/outline";

// const RawMaterialStock = () => {
//   const [rawMaterials, setRawMaterials] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [blinkingItems, setBlinkingItems] = useState([]);
//   const [viewMode, setViewMode] = useState("grid");

//   const fetchRawMaterials = async () => {
//     try {
//       const res = await Api.get(`/store-keeper/getRawMaterialList`);
//       const list = res.data.data || [];
//       setRawMaterials(list);
//       setFiltered(list);
      
//       const outOfStockIds = list.filter(item => item.outOfStock).map(item => item.id);
//       setBlinkingItems(outOfStockIds);
//     } catch (error) {
//       console.log("Error fetching raw materials:", error?.response?.data?.message || error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRawMaterials();
//   }, []);

//   useEffect(() => {
//     let results = [...rawMaterials];

//     if (search) {
//       const s = search.toLowerCase();
//       results = results.filter((item) =>
//         item.name.toLowerCase().includes(s) ||
//         item.unit.toLowerCase().includes(s) ||
//         item.stock.toString().includes(s)
//       );
//     }

//     if (statusFilter !== "all") {
//       switch (statusFilter) {
//         case "used": results = results.filter(item => item.isUsed === true); break;
//         case "not-used": results = results.filter(item => item.isUsed === false); break;
//         case "out-of-stock": results = results.filter(item => item.outOfStock === true); break;
//         case "in-stock": results = results.filter(item => item.outOfStock === false); break;
//       }
//     }

//     setFiltered(results);
//   }, [search, rawMaterials, statusFilter]);

//   const toggleMaterialUsage = async (id, currentStatus) => {
//     if (updating) return;

//     setUpdating(id);
//     try {
//       const newStatus = !currentStatus;
//       await Api.put(`/store-keeper/markRawMaterialUsedOrNotUsed?id=${id}&isUsed=${newStatus}`);
      
//       setRawMaterials(prev =>
//         prev.map(item =>
//           item.id === id ? { ...item, isUsed: newStatus } : item
//         )
//       );
      
//       alert(`Material marked as ${newStatus ? 'Used' : 'Not Used'} successfully!`);
//     } catch (error) {
//       console.error("Error updating material usage:", error);
//       alert("Failed to update material status. Please try again.");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const stats = {
//     total: rawMaterials.length,
//     used: rawMaterials.filter(item => item.isUsed).length,
//     notUsed: rawMaterials.filter(item => !item.isUsed).length,
//     outOfStock: rawMaterials.filter(item => item.outOfStock).length,
//     inStock: rawMaterials.filter(item => !item.outOfStock).length
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <CubeTransparentIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
//             <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin absolute top-4 left-1/2 transform -translate-x-1/2" />
//           </div>
//           <p className="text-gray-700 text-lg font-medium">Loading Inventory...</p>
//           <p className="text-gray-500 text-sm mt-2">Fetching raw material data</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Stats */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
//                 Raw Material Inventory
//               </h1>
//               <p className="text-gray-600 mt-2">Manage your production materials and stock levels</p>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
//                 <button
//                   onClick={() => setViewMode("grid")}
//                   className={`px-4 py-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
//                 >
//                   <EyeIcon className="h-5 w-5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className={`px-4 py-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
//                 >
//                   <ArrowsUpDownIcon className="h-5 w-5" />
//                 </button>
//               </div>
              
//               <button
//                 onClick={fetchRawMaterials}
//                 className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
//               >
//                 <ArrowPathIcon className="h-4 w-4 mr-2" />
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* Stats Dashboard */}
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//             <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 mb-2">Total Items</p>
//                   <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
//                 </div>
//                 <div className="p-3 bg-blue-50 rounded-lg">
//                   <CubeTransparentIcon className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-green-200 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 mb-2">In Use</p>
//                   <p className="text-3xl font-bold text-green-600">{stats.used}</p>
//                 </div>
//                 <div className="p-3 bg-green-50 rounded-lg">
//                   <BeakerIcon className="h-6 w-6 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-5 border border-blue-200 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 mb-2">Not in Use</p>
//                   <p className="text-3xl font-bold text-blue-600">{stats.notUsed}</p>
//                 </div>
//                 <div className="p-3 bg-blue-50 rounded-lg">
//                   <EyeSlashIcon className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-green-200 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 mb-2">In Stock</p>
//                   <p className="text-3xl font-bold text-green-600">{stats.inStock}</p>
//                 </div>
//                 <div className="p-3 bg-green-50 rounded-lg">
//                   <CheckCircleIcon className="h-6 w-6 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className={`bg-gradient-to-br from-white to-red-50 rounded-xl p-5 border shadow-sm ${
//               stats.outOfStock > 0 ? 'border-red-300 animate-pulse' : 'border-red-200'
//             }`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 mb-2">Out of Stock</p>
//                   <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
//                 </div>
//                 <div className={`p-3 rounded-lg ${stats.outOfStock > 0 ? 'bg-red-100 animate-bounce' : 'bg-red-50'}`}>
//                   <ShoppingCartIcon className="h-6 w-6 text-red-600" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Search and Filter Bar */}
//           <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <TagIcon className="h-4 w-4" />
//                     Search Materials
//                   </div>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search by name, unit, or stock..."
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                   <TagIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Filter by Status
//                 </label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="all">All Materials</option>
//                   <option value="used">In Use Only</option>
//                   <option value="not-used">Not in Use Only</option>
//                   <option value="in-stock">In Stock Only</option>
//                   <option value="out-of-stock">Out of Stock Only</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quick Actions
//                 </label>
//                 <div className="flex gap-2">
//                   {stats.outOfStock > 0 && (
//                     <button
//                       onClick={() => setStatusFilter("out-of-stock")}
//                       className="flex-1 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <BellAlertIcon className="h-4 w-4" />
//                       Stock Alerts
//                     </button>
//                   )}
//                   <button
//                     onClick={fetchRawMaterials}
//                     className="px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
//                   >
//                     <ArrowPathIcon className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Alert Banner */}
//           {stats.outOfStock > 0 && (
//             <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl shadow-sm animate-pulse">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-red-100 rounded-full animate-bounce">
//                     <BellAlertIcon className="h-6 w-6 text-red-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-red-900 text-lg">Stock Attention Required!</h3>
//                     <p className="text-red-700">
//                       {stats.outOfStock} item{stats.outOfStock !== 1 ? 's' : ''} {stats.outOfStock !== 1 ? 'are' : 'is'} out of stock and need to be reordered.
//                       You can still update their usage status.
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setStatusFilter("out-of-stock")}
//                   className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
//                 >
//                   View All ({stats.outOfStock})
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Content based on view mode */}
//           {viewMode === "grid" ? (
//             /* Grid View */
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.length > 0 ? (
//                 filtered.map((item) => {
//                   const isOutOfStock = item.outOfStock;
//                   const isBlinking = blinkingItems.includes(item.id);
                  
//                   return (
//                     <div
//                       key={item.id}
//                       className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
//                         isOutOfStock 
//                           ? `border-red-300 ${isBlinking ? 'animate-pulse' : ''}`
//                           : 'border-gray-200'
//                       }`}
//                     >
//                       {/* Header with Status */}
//                       <div className={`p-4 ${isOutOfStock ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className={`p-2 rounded-lg ${isOutOfStock ? 'bg-red-200' : 'bg-blue-100'}`}>
//                               <CubeIcon className={`h-5 w-5 ${isOutOfStock ? 'text-red-700' : 'text-blue-600'}`} />
//                             </div>
//                             <div>
//                               <h3 className="font-bold text-gray-900 text-lg truncate">{item.name}</h3>
//                               <div className="flex items-center gap-2 mt-1">
//                                 <span className="text-sm text-gray-600">{item.unit}</span>
//                                 {isOutOfStock && (
//                                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-200 text-red-800 animate-pulse">
//                                     <ShoppingCartIcon className="h-3 w-3 mr-1" />
//                                     Out of Stock
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Content */}
//                       <div className="p-5">
//                         <div className="grid grid-cols-2 gap-4 mb-6">
//                           <div className={`p-4 rounded-lg ${
//                             isOutOfStock ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
//                           }`}>
//                             <p className="text-xs text-gray-500 mb-1">Current Stock</p>
//                             <div className="flex items-baseline gap-2">
//                               <p className={`text-3xl font-bold ${isOutOfStock ? 'text-red-600' : 'text-gray-900'}`}>
//                                 {item.stock}
//                               </p>
//                               {isOutOfStock && (
//                                 <ExclamationTriangleIcon className="h-5 w-5 text-red-500 animate-pulse" />
//                               )}
//                             </div>
//                           </div>
                          
//                           <div className={`p-4 rounded-lg border ${
//                             item.isUsed ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
//                           }`}>
//                             <p className="text-xs text-gray-500 mb-1">Usage Status</p>
//                             <div className="flex items-center gap-2">
//                               {item.isUsed ? (
//                                 <>
//                                   <BeakerIcon className="h-5 w-5 text-green-600" />
//                                   <span className="text-lg font-semibold text-green-700">In Use</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <EyeSlashIcon className="h-5 w-5 text-blue-600" />
//                                   <span className="text-lg font-semibold text-blue-700">Not Used</span>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="space-y-3">
//                           {/* Usage Toggle Button - Always Enabled */}
//                           <button
//                             onClick={() => toggleMaterialUsage(item.id, item.isUsed)}
//                             disabled={updating === item.id}
//                             className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                               updating === item.id
//                                 ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
//                                 : item.isUsed
//                                   ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-300'
//                                   : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
//                             } ${isOutOfStock ? 'opacity-100' : ''}`}
//                           >
//                             {updating === item.id ? (
//                               <>
//                                 <ArrowPathIcon className="h-4 w-4 animate-spin" />
//                                 Updating...
//                               </>
//                             ) : item.isUsed ? (
//                               <>
//                                 <EyeSlashIcon className="h-4 w-4" />
//                                 Mark as Not Used
//                               </>
//                             ) : (
//                               <>
//                                 <BeakerIcon className="h-4 w-4" />
//                                 Mark as Used
//                               </>
//                             )}
//                           </button>

//                           {/* Stock Status Message */}
//                           {isOutOfStock && (
//                             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                               <div className="flex items-center gap-2">
//                                 <InformationCircleIcon className="h-4 w-4 text-red-600 flex-shrink-0" />
//                                 <p className="text-xs text-red-700">
//                                   This item is out of stock. Usage status can still be updated, but it needs to be reordered.
//                                 </p>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center">
//                   <ExclamationTriangleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-500 mb-2">No Materials Found</h3>
//                   <p className="text-gray-400">
//                     {search || statusFilter !== 'all' 
//                       ? 'Try adjusting your search or filter criteria'
//                       : 'Start by adding some raw materials to your inventory'}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             /* List View (Table) */
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                         Material
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                         Stock & Unit
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                         Usage Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filtered.map((item) => {
//                       const isOutOfStock = item.outOfStock;
//                       const isBlinking = blinkingItems.includes(item.id);
                      
//                       return (
//                         <tr 
//                           key={item.id} 
//                           className={`hover:bg-gray-50 transition-colors ${
//                             isOutOfStock ? `bg-red-50 ${isBlinking ? 'animate-pulse' : ''}` : ''
//                           }`}
//                         >
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-4">
//                               <div className={`p-3 rounded-lg ${isOutOfStock ? 'bg-red-100' : 'bg-blue-100'}`}>
//                                 <CubeIcon className={`h-5 w-5 ${isOutOfStock ? 'text-red-600' : 'text-blue-600'}`} />
//                               </div>
//                               <div>
//                                 <h4 className="font-semibold text-gray-900">{item.name}</h4>
//                                 {isOutOfStock && (
//                                   <div className="flex items-center gap-2 mt-1">
//                                     <ShoppingCartIcon className="h-4 w-4 text-red-500" />
//                                     <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
//                                       Out of Stock
//                                     </span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="space-y-2">
//                               <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
//                                 isOutOfStock ? 'bg-red-100 border border-red-200' : 'bg-gray-100 border border-gray-200'
//                               }`}>
//                                 <span className={`text-xl font-bold ${isOutOfStock ? 'text-red-600' : 'text-gray-900'}`}>
//                                   {item.stock}
//                                 </span>
//                                 <span className="text-sm text-gray-600">•</span>
//                                 <span className="text-sm text-gray-700">{item.unit}</span>
//                                 {isOutOfStock && (
//                                   <ExclamationTriangleIcon className="h-4 w-4 text-red-500 animate-pulse" />
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
//                               item.isUsed 
//                                 ? 'bg-green-100 border border-green-200' 
//                                 : 'bg-blue-100 border border-blue-200'
//                             }`}>
//                               {item.isUsed ? (
//                                 <>
//                                   <BeakerIcon className="h-5 w-5 text-green-600" />
//                                   <span className="font-medium text-green-700">In Use</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <EyeSlashIcon className="h-5 w-5 text-blue-600" />
//                                   <span className="font-medium text-blue-700">Not Used</span>
//                                 </>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="space-y-2">
//                               <button
//                                 onClick={() => toggleMaterialUsage(item.id, item.isUsed)}
//                                 disabled={updating === item.id}
//                                 className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-w-[140px] ${
//                                   updating === item.id
//                                     ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
//                                     : item.isUsed
//                                       ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-300'
//                                       : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
//                                 }`}
//                               >
//                                 {updating === item.id ? (
//                                   <>
//                                     <ArrowPathIcon className="h-4 w-4 animate-spin" />
//                                     Updating...
//                                   </>
//                                 ) : item.isUsed ? (
//                                   <>
//                                     <EyeSlashIcon className="h-4 w-4" />
//                                     Mark Not Used
//                                   </>
//                                 ) : (
//                                   <>
//                                     <BeakerIcon className="h-4 w-4" />
//                                     Mark Used
//                                   </>
//                                 )}
//                               </button>
                              
//                               {isOutOfStock && (
//                                 <p className="text-xs text-red-600 text-center mt-1">
//                                   Stock needs reorder
//                                 </p>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Table Footer */}
//               <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   <p className="text-sm text-gray-600">
//                     Showing <span className="font-semibold">{filtered.length}</span> of{' '}
//                     <span className="font-semibold">{rawMaterials.length}</span> materials
//                   </p>
//                   <div className="flex items-center gap-6">
//                     <div className="flex items-center gap-2">
//                       <BeakerIcon className="h-4 w-4 text-green-600" />
//                       <span className="text-sm text-gray-600">In Use: {stats.used}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <EyeSlashIcon className="h-4 w-4 text-blue-600" />
//                       <span className="text-sm text-gray-600">Not Used: {stats.notUsed}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <ShoppingCartIcon className="h-4 w-4 text-red-600 animate-pulse" />
//                       <span className="text-sm text-gray-600">Out of Stock: {stats.outOfStock}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Legend and Help Section */}
//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="h-3 w-3 rounded-full bg-green-500"></div>
//                   <span className="text-sm text-gray-600">
//                     <span className="font-medium">In Use</span> - Currently being used in production
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-3 w-3 rounded-full bg-blue-500"></div>
//                   <span className="text-sm text-gray-600">
//                     <span className="font-medium">Not Used</span> - Available for production use
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-3 w-3 rounded-full bg-green-500"></div>
//                   <span className="text-sm text-gray-600">
//                     <span className="font-medium">In Stock</span> - Sufficient quantity available
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
//                   <span className="text-sm text-gray-600 font-medium">
//                     <span className="font-medium">Out of Stock</span> - Needs to be reordered (usage status can still be updated)
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
//               <div className="flex items-center gap-3 mb-4">
//                 <InformationCircleIcon className="h-6 w-6 text-blue-600" />
//                 <h3 className="text-lg font-semibold text-blue-900">Key Features</h3>
//               </div>
//               <div className="space-y-3">
//                 <div className="flex items-start gap-2">
//                   <div className="p-1 bg-blue-100 rounded">
//                     <BeakerIcon className="h-4 w-4 text-blue-600" />
//                   </div>
//                   <p className="text-sm text-blue-700">
//                     <span className="font-semibold">Usage Status Toggle:</span> Always enabled, even for out-of-stock items
//                   </p>
//                 </div>
//                 <div className="flex items-start gap-2">
//                   <div className="p-1 bg-red-100 rounded">
//                     <ShoppingCartIcon className="h-4 w-4 text-red-600" />
//                   </div>
//                   <p className="text-sm text-blue-700">
//                     <span className="font-semibold">Out of Stock:</span> Items marked with blinking indicators but can still have usage status updated
//                   </p>
//                 </div>
//                 <div className="flex items-start gap-2">
//                   <div className="p-1 bg-green-100 rounded">
//                     <EyeSlashIcon className="h-4 w-4 text-green-600" />
//                   </div>
//                   <p className="text-sm text-blue-700">
//                     <span className="font-semibold">Quick Updates:</span> Click buttons to toggle between "Used" and "Not Used" instantly
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RawMaterialStock;


import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BellAlertIcon,
  CubeIcon,
  TagIcon,
  CubeTransparentIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  EyeSlashIcon,
  BeakerIcon,
  ShoppingCartIcon,
  BuildingLibraryIcon
} from "@heroicons/react/24/outline";

const RawMaterialStock = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [blinkingItems, setBlinkingItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouseLoading, setWarehouseLoading] = useState(true);

  const fetchWarehouses = async () => {
    try {
      setWarehouseLoading(true);
      const res = await Api.get(`/purchase/warehouses`);
      const formatted = res?.data?.data?.map((w) => ({
        label: w.warehouseName,
        value: w._id,
      }));
      setWarehouseList(formatted);
      console.log("Warehouse List: ", res.data.data);
      
      // Auto-select first warehouse if none selected
      if (formatted.length > 0 && !selectedWarehouse) {
        setSelectedWarehouse(formatted[0].value);
      }
    } catch (err) {
      console.error("Error loading warehouses:", err);
      alert("Error loading warehouses");
    } finally {
      setWarehouseLoading(false);
    }
  };

  const fetchRawMaterials = async (_id) => {
    try {
      setLoading(true);
      let url = `purchase/warehouses/${selectedWarehouse}/raw-material`;
      
      // Add warehouse filter if selected
      
      const res = await Api.get(url);
      const list = res.data.data || [];
      setRawMaterials(list);
      setFiltered(list);
      
      const outOfStockIds = list.filter(item => item.outOfStock).map(item => item.id);
      setBlinkingItems(outOfStockIds);
    } catch (error) {
      console.log("Error fetching raw materials:", error?.response?.data?.message || error);
      alert("Failed to fetch raw materials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (warehouseList.length > 0) {
      fetchRawMaterials();
    }
  }, [selectedWarehouse]);

  useEffect(() => {
    let results = [...rawMaterials];

    if (search) {
      const s = search.toLowerCase();
      results = results.filter((item) =>
        item.name?.toLowerCase().includes(s) ||
        item.unit?.toLowerCase().includes(s) ||
        item.stock?.toString().includes(s)
      );
    }

    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "used": results = results.filter(item => item.isUsed === true); break;
        case "not-used": results = results.filter(item => item.isUsed === false); break;
        case "out-of-stock": results = results.filter(item => item.outOfStock === true); break;
        case "in-stock": results = results.filter(item => item.outOfStock === false); break;
      }
    }

    setFiltered(results);
  }, [search, rawMaterials, statusFilter]);

  const toggleMaterialUsage = async (id, currentStatus) => {
    if (updating) return;

    setUpdating(id);
    try {
      const newStatus = !currentStatus;
      await Api.put(`/store-keeper/markRawMaterialUsedOrNotUsed?id=${id}&isUsed=${newStatus}`);
      
      setRawMaterials(prev =>
        prev.map(item =>
          item.id === id ? { ...item, isUsed: newStatus } : item
        )
      );
      
      alert(`Material marked as ${newStatus ? 'Used' : 'Not Used'} successfully!`);
    } catch (error) {
      console.error("Error updating material usage:", error);
      alert("Failed to update material status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const handleWarehouseChange = (warehouseId) => {
    setSelectedWarehouse(warehouseId);
  };

  const stats = {
    total: rawMaterials.length,
    used: rawMaterials.filter(item => item.isUsed).length,
    notUsed: rawMaterials.filter(item => !item.isUsed).length,
    outOfStock: rawMaterials.filter(item => item.outOfStock).length,
    inStock: rawMaterials.filter(item => !item.outOfStock).length
  };

  if (loading && warehouseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <CubeTransparentIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin absolute top-4 left-1/2 transform -translate-x-1/2" />
          </div>
          <p className="text-gray-700 text-lg font-medium">Loading Inventory...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching warehouse and material data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Raw Material Inventory
              </h1>
              <p className="text-gray-600 mt-2">Manage your production materials and stock levels</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <BuildingLibraryIcon className="h-4 w-4" />
                  Select Warehouse
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => handleWarehouseChange(e.target.value)}
                  disabled={warehouseLoading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {warehouseLoading ? (
                    <option>Loading warehouses...</option>
                  ) : (
                    <>
                      
                      {warehouseList.map((warehouse) => (
                        <option key={warehouse.value} value={warehouse.value}>
                          {warehouse.label}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                  >
                    <ArrowsUpDownIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <button
                  onClick={fetchRawMaterials}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>

          {/* Warehouse Info Banner */}
          {selectedWarehouse && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BuildingLibraryIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">
                      {warehouseList.find(w => w.value === selectedWarehouse)?.label || "Selected Warehouse"}
                    </h3>
                    <p className="text-blue-700">
                      Viewing materials from this warehouse only
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedWarehouse("");
                    fetchRawMaterials();
                  }}
                  className="px-6 py-2.5 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  
                </button>
              </div>
            </div>
          )}

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  {selectedWarehouse && (
                    <p className="text-xs text-gray-500 mt-1">In this warehouse</p>
                  )}
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CubeTransparentIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">In Use</p>
                  <p className="text-3xl font-bold text-green-600">{stats.used}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? `${Math.round((stats.used / stats.total) * 100)}%` : '0%'}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <BeakerIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-5 border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Not in Use</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.notUsed}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? `${Math.round((stats.notUsed / stats.total) * 100)}%` : '0%'}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <EyeSlashIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">In Stock</p>
                  <p className="text-3xl font-bold text-green-600">{stats.inStock}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? `${Math.round((stats.inStock / stats.total) * 100)}%` : '0%'}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br from-white to-red-50 rounded-xl p-5 border shadow-sm ${
              stats.outOfStock > 0 ? 'border-red-300 animate-pulse' : 'border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? `${Math.round((stats.outOfStock / stats.total) * 100)}%` : '0%'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stats.outOfStock > 0 ? 'bg-red-100 animate-bounce' : 'bg-red-50'}`}>
                  <ShoppingCartIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4" />
                    Search Materials
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, unit, or stock..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <TagIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Materials</option>
                  <option value="used">In Use Only</option>
                  <option value="not-used">Not in Use Only</option>
                  <option value="in-stock">In Stock Only</option>
                  <option value="out-of-stock">Out of Stock Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Actions
                </label>
                <div className="flex gap-2">
                  {stats.outOfStock > 0 && (
                    <button
                      onClick={() => setStatusFilter("out-of-stock")}
                      className="flex-1 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <BellAlertIcon className="h-4 w-4" />
                      Stock Alerts ({stats.outOfStock})
                    </button>
                  )}
                  <button
                    onClick={fetchRawMaterials}
                    className="px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          {stats.outOfStock > 0 && (
            <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl shadow-sm animate-pulse">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-full animate-bounce">
                    <BellAlertIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-lg">Stock Attention Required!</h3>
                    <p className="text-red-700">
                      {stats.outOfStock} item{stats.outOfStock !== 1 ? 's' : ''} {stats.outOfStock !== 1 ? 'are' : 'is'} out of stock and need to be reordered.
                      You can still update their usage status.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStatusFilter("out-of-stock")}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  View All ({stats.outOfStock})
                </button>
              </div>
            </div>
          )}

          {/* Content based on view mode */}
          {viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const isOutOfStock = item.outOfStock;
                  const isBlinking = blinkingItems.includes(item.id);
                  
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                        isOutOfStock 
                          ? `border-red-300 ${isBlinking ? 'animate-pulse' : ''}`
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Header with Status */}
                      <div className={`p-4 ${isOutOfStock ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isOutOfStock ? 'bg-red-200' : 'bg-blue-100'}`}>
                              <CubeIcon className={`h-5 w-5 ${isOutOfStock ? 'text-red-700' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg truncate">{item.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">{item.unit}</span>
                                {isOutOfStock && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-200 text-red-800 animate-pulse">
                                    <ShoppingCartIcon className="h-3 w-3 mr-1" />
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className={`p-4 rounded-lg ${
                            isOutOfStock ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <p className="text-xs text-gray-500 mb-1">Current Stock</p>
                            <div className="flex items-baseline gap-2">
                              <p className={`text-3xl font-bold ${isOutOfStock ? 'text-red-600' : 'text-gray-900'}`}>
                                {item.stock}
                              </p>
                              {isOutOfStock && (
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 animate-pulse" />
                              )}
                            </div>
                          </div>
                          
                          <div className={`p-4 rounded-lg border ${
                            item.isUsed ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
                          }`}>
                            <p className="text-xs text-gray-500 mb-1">Usage Status</p>
                            <div className="flex items-center gap-2">
                              {item.isUsed ? (
                                <>
                                  <BeakerIcon className="h-5 w-5 text-green-600" />
                                  <span className="text-lg font-semibold text-green-700">In Use</span>
                                </>
                              ) : (
                                <>
                                  <EyeSlashIcon className="h-5 w-5 text-blue-600" />
                                  <span className="text-lg font-semibold text-blue-700">Not Used</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          {/* Usage Toggle Button - Always Enabled */}
                          <button
                            onClick={() => toggleMaterialUsage(item.id, item.isUsed)}
                            disabled={updating === item.id}
                            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                              updating === item.id
                                ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                                : item.isUsed
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-300'
                                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
                            } ${isOutOfStock ? 'opacity-100' : ''}`}
                          >
                            {updating === item.id ? (
                              <>
                                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : item.isUsed ? (
                              <>
                                <EyeSlashIcon className="h-4 w-4" />
                                Mark as Not Used
                              </>
                            ) : (
                              <>
                                <BeakerIcon className="h-4 w-4" />
                                Mark as Used
                              </>
                            )}
                          </button>

                          {/* Stock Status Message */}
                          {isOutOfStock && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <InformationCircleIcon className="h-4 w-4 text-red-600 flex-shrink-0" />
                                <p className="text-xs text-red-700">
                                  This item is out of stock. Usage status can still be updated, but it needs to be reordered.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <ExclamationTriangleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">
                    {selectedWarehouse ? 'No Materials Found in This Warehouse' : 'No Materials Found'}
                  </h3>
                  <p className="text-gray-400">
                    {search || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start by adding some raw materials to your inventory'}
                  </p>
                  {selectedWarehouse && (
                    <button
                      onClick={() => setSelectedWarehouse("")}
                      className="mt-4 px-6 py-2 bg-blue-50 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                     
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* List View (Table) */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Stock & Unit
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Usage Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((item) => {
                      const isOutOfStock = item.outOfStock;
                      const isBlinking = blinkingItems.includes(item.id);
                      
                      return (
                        <tr 
                          key={item.id} 
                          className={`hover:bg-gray-50 transition-colors ${
                            isOutOfStock ? `bg-red-50 ${isBlinking ? 'animate-pulse' : ''}` : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg ${isOutOfStock ? 'bg-red-100' : 'bg-blue-100'}`}>
                                <CubeIcon className={`h-5 w-5 ${isOutOfStock ? 'text-red-600' : 'text-blue-600'}`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                {isOutOfStock && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <ShoppingCartIcon className="h-4 w-4 text-red-500" />
                                    <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                      Out of Stock
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                                isOutOfStock ? 'bg-red-100 border border-red-200' : 'bg-gray-100 border border-gray-200'
                              }`}>
                                <span className={`text-xl font-bold ${isOutOfStock ? 'text-red-600' : 'text-gray-900'}`}>
                                  {item.stock}
                                </span>
                                <span className="text-sm text-gray-600">•</span>
                                <span className="text-sm text-gray-700">{item.unit}</span>
                                {isOutOfStock && (
                                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500 animate-pulse" />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                              item.isUsed 
                                ? 'bg-green-100 border border-green-200' 
                                : 'bg-blue-100 border border-blue-200'
                            }`}>
                              {item.isUsed ? (
                                <>
                                  <BeakerIcon className="h-5 w-5 text-green-600" />
                                  <span className="font-medium text-green-700">In Use</span>
                                </>
                              ) : (
                                <>
                                  <EyeSlashIcon className="h-5 w-5 text-blue-600" />
                                  <span className="font-medium text-blue-700">Not Used</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <button
                                onClick={() => toggleMaterialUsage(item.id, item.isUsed)}
                                disabled={updating === item.id}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-w-[140px] ${
                                  updating === item.id
                                    ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                                    : item.isUsed
                                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-300'
                                      : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
                                }`}
                              >
                                {updating === item.id ? (
                                  <>
                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : item.isUsed ? (
                                  <>
                                    <EyeSlashIcon className="h-4 w-4" />
                                    Mark Not Used
                                  </>
                                ) : (
                                  <>
                                    <BeakerIcon className="h-4 w-4" />
                                    Mark Used
                                  </>
                                )}
                              </button>
                              
                              {isOutOfStock && (
                                <p className="text-xs text-red-600 text-center mt-1">
                                  Stock needs reorder
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{filtered.length}</span> of{' '}
                      <span className="font-semibold">{rawMaterials.length}</span> materials
                      {selectedWarehouse && (
                        <span className="text-blue-600 ml-2">
                          • Warehouse: {warehouseList.find(w => w.value === selectedWarehouse)?.label}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <BeakerIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">In Use: {stats.used}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EyeSlashIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Not Used: {stats.notUsed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingCartIcon className="h-4 w-4 text-red-600 animate-pulse" />
                      <span className="text-sm text-gray-600">Out of Stock: {stats.outOfStock}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legend and Help Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">In Use</span> - Currently being used in production
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Not Used</span> - Available for production use
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">In Stock</span> - Sufficient quantity available
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">
                    <span className="font-medium">Out of Stock</span> - Needs to be reordered (usage status can still be updated)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Key Features</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <BuildingLibraryIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Warehouse Filtering:</span> View materials by specific warehouse or all warehouses combined
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <BeakerIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Usage Status Toggle:</span> Always enabled, even for out-of-stock items
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-red-100 rounded">
                    <ShoppingCartIcon className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Out of Stock:</span> Items marked with blinking indicators but can still have usage status updated
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-green-100 rounded">
                    <EyeSlashIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Quick Updates:</span> Click buttons to toggle between "Used" and "Not Used" instantly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RawMaterialStock;