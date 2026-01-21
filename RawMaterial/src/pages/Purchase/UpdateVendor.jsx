// import React, { useState, useEffect } from "react";
// import Api from "../../auth/Api";
// import { 
//   BuildingOffice2Icon, 
//   PencilSquareIcon,
//   CheckIcon,
//   XMarkIcon,
//   ArrowPathIcon,
//   ChevronDownIcon,
//   MagnifyingGlassIcon,
//   MapPinIcon,
//   PhoneIcon,
//   EnvelopeIcon,
//   CurrencyDollarIcon,
//   GlobeAmericasIcon
// } from "@heroicons/react/24/outline";

// const UpdateVendor = () => {
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [companyDetails, setCompanyDetails] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   const [isEditable, setIsEditable] = useState(false);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await Api.get("/purchase/vendors");
//         setCompanies(response?.data?.data || []);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   const handleCompanyChange = async (e) => {
//     const companyId = e.target.value;
//     setSelectedCompany(companyId);
//     setIsEditable(false);

//     if (!companyId) return;

//     setDetailsLoading(true);

//     try {
//       const response = await Api.get(`/purchase/vendors/${companyId}`);
//       setCompanyDetails(response?.data?.data);
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setCompanyDetails({
//       ...companyDetails,
//       [e.target.name]: e.target.value,
//     });
//   };
//   const handleUpdateSubmit = async () => {
//     try {
//       const payload = {
//         name: companyDetails.name,
//         companyCode: companyDetails.companyCode,
//         gstNumber: companyDetails.gstNumber,
//         address: companyDetails.address,
//         city: companyDetails.city,
//         state: companyDetails.state,
//         pincode: companyDetails.pincode,
//         contactNumber: companyDetails.contactNumber,
//         contactPerson: companyDetails.contactPerson,
//         email: companyDetails.email,
//         country: companyDetails.country,
//         currency: companyDetails.currency,
//       };

//       await Api.put(`/purchase/vendors/${selectedCompany}`, payload);
      

//       alert("Company Updated Successfully!");
//       setIsEditable(false);
//     } catch (error) {
//       console.log(error);
//       alert("Error updating company");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading companies...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
//                 Update Vendor
//               </h1>
//               <p className="text-gray-600 mt-2">Select and update vendor information</p>
//             </div>
//             <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200">
//               Total Vendors: {companies.length}
//             </div>
//           </div>
//           <div className="mb-8">
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Vendor <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <select
//                   value={selectedCompany}
//                   onChange={handleCompanyChange}
//                   className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer"
//                 >
//                   <option value="">-- Select Vendor --</option>
//                   {companies.length > 0 && companies?.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.displayName}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                   <ChevronDownIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//               </div>
//             </div>
//           </div>
//           {detailsLoading && (
//             <div className="text-center py-12">
//               <ArrowPathIcon className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
//               <p className="text-gray-600">Loading vendor details...</p>
//             </div>
//           )}

//           {companyDetails && (
//             <div className="space-y-8">
//               <div className="flex items-center justify-between border-b border-gray-200 pb-4">
//                 <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                   <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
//                   Vendor Information
//                 </h2>
//                 <div className="flex items-center gap-3">
//                   {!isEditable ? (
//                     <button
//                       onClick={() => setIsEditable(true)}
//                       className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       <PencilSquareIcon className="h-5 w-5" />
//                       Edit Details
//                     </button>
//                   ) : (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => setIsEditable(false)}
//                         className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                       >
//                         <XMarkIcon className="h-5 w-5" />
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleUpdateSubmit}
//                         className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                       >
//                         <CheckIcon className="h-5 w-5" />
//                         Save Changes
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Basic Information */}
//               <div className="border-b border-gray-200 pb-8">
//                 <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Company Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={companyDetails.name || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       GST Number
//                     </label>
//                     <input
//                       type="text"
//                       name="gstNumber"
//                       value={companyDetails.gstNumber || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <CurrencyDollarIcon className="h-4 w-4" />
//                       Currency
//                     </label>
//                     <input
//                       name="currency"
//                       value={companyDetails.currency || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <CurrencyDollarIcon className="h-4 w-4" />
//                       Exchange Rate
//                     </label>
//                     <input
//                       name="exchangeRate"
//                       value={companyDetails.exchangeRate || 'NA' || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <GlobeAmericasIcon className="h-4 w-4" />
//                       Country
//                     </label>
//                     <input
//                       name="country"
//                       value={companyDetails.country || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Address Details */}
//               <div className="border-b border-gray-200 pb-8">
//                 <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
//                   <MapPinIcon className="h-5 w-5" />
//                   Address Details
//                 </h3>
                
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Complete Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={companyDetails.address || ''}
//                     onChange={handleInputChange}
//                     disabled={!isEditable}
//                     rows="3"
//                     className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
//                       !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                     } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City
//                     </label>
//                     <input
//                       name="city"
//                       value={companyDetails.city || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       State
//                     </label>
//                     <input
//                       name="state"
//                       value={companyDetails.state || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Pincode
//                     </label>
//                     <input
//                       name="pincode"
//                       value={companyDetails.pincode || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div className="pb-8">
//                 <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
//                   <PhoneIcon className="h-5 w-5" />
//                   Contact Information
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <PhoneIcon className="h-4 w-4" />
//                       Contact Number
//                     </label>
//                     <input
//                       name="contactNumber"
//                       value={companyDetails.contactNumber || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>


//                    <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <EnvelopeIcon className="h-4 w-4" />
//                       Contact Person Name
//                     </label>
//                     <input
//                       name="contactPerson"
//                       value={companyDetails.contactPerson || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>


//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <EnvelopeIcon className="h-4 w-4" />
//                       Email Address
//                     </label>
//                     <input
//                       name="email"
//                       value={companyDetails.email || ''}
//                       onChange={handleInputChange}
//                       disabled={!isEditable}
//                       className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
//                         !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
//                       } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Status Bar */}
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className={`h-3 w-3 rounded-full ${isEditable ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`}></div>
//                     <span className="text-sm font-medium">
//                       {isEditable ? 'Editing Mode - All fields are editable' : 'View Mode - Click Edit to make changes'}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     Last updated: {new Date().toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* No Vendor Selected Message */}
//           {!companyDetails && !detailsLoading && (
//             <div className="text-center py-12">
//               <BuildingOffice2Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendor Selected</h3>
//               <p className="text-gray-600">Please select a vendor from the dropdown above to view and edit details.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateVendor;


import React, { useState, useEffect, useRef } from "react";
import Api from "../../auth/Api";
import { 
  BuildingOffice2Icon, 
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  DocumentTextIcon,
  BanknotesIcon,
  UserCircleIcon,
  DocumentArrowUpIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

const UpdateVendor = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyDetails, setCompanyDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  // Document upload states
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [pancardFile, setPancardFile] = useState(null);
  const [aadhaarFileName, setAadhaarFileName] = useState("");
  const [pancardFileName, setPancardFileName] = useState("");

  // Refs for file inputs
  const aadhaarFileRef = useRef(null);
  const pancardFileRef = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await Api.get("/purchase/vendors");
        setCompanies(response?.data?.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = async (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setIsEditable(false);
    setAadhaarFile(null);
    setPancardFile(null);
    setAadhaarFileName("");
    setPancardFileName("");

    if (!companyId) {
      setCompanyDetails(null);
      return;
    }

    setDetailsLoading(true);

    try {
      const response = await Api.get(`/purchase/vendors2/${companyId}`);
      setCompanyDetails(response?.data?.data);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCompanyDetails({
      ...companyDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPEG, PNG files are allowed");
      return;
    }

    if (type === 'aadhaar') {
      setAadhaarFile(file);
      setAadhaarFileName(file.name);
    } else if (type === 'pancard') {
      setPancardFile(file);
      setPancardFileName(file.name);
    }
  };

  const removeFile = (type) => {
    if (type === 'aadhaar') {
      setAadhaarFile(null);
      setAadhaarFileName("");
      if (aadhaarFileRef.current) aadhaarFileRef.current.value = "";
    } else if (type === 'pancard') {
      setPancardFile(null);
      setPancardFileName("");
      if (pancardFileRef.current) pancardFileRef.current.value = "";
    }
  };

  const uploadDocument = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('vendorId', selectedCompany);

    try {
      const response = await Api.post(`/purchase/vendors/upload-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      setUploading(true);
      
      // Upload documents first if new files are selected
      if (aadhaarFile) {
        await uploadDocument(aadhaarFile, 'aadhaar');
      }
      if (pancardFile) {
        await uploadDocument(pancardFile, 'pancard');
      }

      // Then update vendor details
      const payload = {
        name: companyDetails.name,
        companyCode: companyDetails.companyCode,
        gstNumber: companyDetails.gstNumber,
        address: companyDetails.address,
        city: companyDetails.city,
        state: companyDetails.state,
        pincode: companyDetails.pincode || companyDetails.zipCode,
        contactNumber: companyDetails.contactNumber,
        contactPerson: companyDetails.contactPerson,
        email: companyDetails.email,
        country: companyDetails.country,
        currency: companyDetails.currency,
        exchangeRate: companyDetails.exchangeRate,
        alternateNumber: companyDetails.alternateNumber,
        vendorAadhaar: companyDetails.vendorAadhaar,
        vendorPanCard: companyDetails.vendorPanCard,
        bankName: companyDetails.bankName,
        accountHolder: companyDetails.accountHolder,
        accountNumber: companyDetails.accountNumber,
        ifscCode: companyDetails.ifscCode,
        isActive: companyDetails.isActive
      };

      await Api.put(`/purchase/vendors/${selectedCompany}`, payload);
      
      // Refresh vendor details
      const response = await Api.get(`/purchase/vendors2/${selectedCompany}`);
      setCompanyDetails(response?.data?.data);

      // Reset file states
      setAadhaarFile(null);
      setPancardFile(null);
      setAadhaarFileName("");
      setPancardFileName("");

      alert("Vendor Updated Successfully!");
      setIsEditable(false);
    } catch (error) {
      console.log(error);
      alert("Error updating vendor");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    setAadhaarFile(null);
    setPancardFile(null);
    setAadhaarFileName("");
    setPancardFileName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
                Update Vendor
              </h1>
              <p className="text-gray-600 mt-2">Select and update vendor information</p>
            </div>
            <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200">
              Total Vendors: {companies.length}
            </div>
          </div>
          <div className="mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Vendor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="">-- Select Vendor --</option>
                  {companies.length > 0 && companies?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {detailsLoading && (
            <div className="text-center py-12">
              <ArrowPathIcon className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading vendor details...</p>
            </div>
          )}

          {companyDetails && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
                  Vendor Information
                </h2>
                <div className="flex items-center gap-3">
                  {!isEditable ? (
                    <button
                      onClick={() => setIsEditable(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                      Edit Details
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateSubmit}
                        disabled={uploading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          uploading 
                            ? 'bg-green-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {uploading ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-5 w-5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={companyDetails.name || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={companyDetails.gstNumber || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      Currency
                    </label>
                    <input
                      name="currency"
                      value={companyDetails.currency || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      Exchange Rate
                    </label>
                    <input
                      type="number"
                      name="exchangeRate"
                      value={companyDetails.exchangeRate || ''}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      placeholder="Enter exchange rate"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <GlobeAmericasIcon className="h-4 w-4" />
                      Country
                    </label>
                    <input
                      name="country"
                      value={companyDetails.country || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Address Details
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address
                  </label>
                  <textarea
                    name="address"
                    value={companyDetails.address || 'NA'}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    rows="3"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
                      !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                    } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      name="city"
                      value={companyDetails.city || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      name="state"
                      value={companyDetails.state || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode / ZIP Code
                    </label>
                    <input
                      name="pincode"
                      value={companyDetails.pincode || companyDetails.zipCode || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      placeholder="Enter pincode or zip code"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <UserCircleIcon className="h-4 w-4" />
                      Contact Person
                    </label>
                    <input
                      name="contactPerson"
                      value={companyDetails.contactPerson || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Contact Number
                    </label>
                    <input
                      name="contactNumber"
                      value={companyDetails.contactNumber || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Alternate Number
                    </label>
                    <input
                      name="alternateNumber"
                      value={companyDetails.alternateNumber || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      placeholder="Enter alternate contact"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={companyDetails.email || ''}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      placeholder="Enter email address"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>

              {/* KYC Documents */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  KYC Documents
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aadhaar Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number
                    </label>
                    <input
                      name="vendorAadhaar"
                      value={companyDetails.vendorAadhaar || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                    
                    {companyDetails.aadhaarUrl ? (
                      <div className="mt-3 flex items-center gap-2">
                        <a 
                          href={companyDetails.aadhaarUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Aadhaar Document
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">No Aadhaar document uploaded</p>
                    )}

                    {isEditable && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Aadhaar Document
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={aadhaarFileRef}
                            onChange={(e) => handleFileChange(e, 'aadhaar')}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="aadhaar-upload"
                          />
                          <label
                            htmlFor="aadhaar-upload"
                            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <DocumentArrowUpIcon className="h-5 w-5" />
                            Choose File
                          </label>
                          {aadhaarFileName && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700 truncate max-w-xs">{aadhaarFileName}</span>
                              <button
                                type="button"
                                onClick={() => removeFile('aadhaar')}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>

                  {/* PAN Card Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Card Number
                    </label>
                    <input
                      name="vendorPanCard"
                      value={companyDetails.vendorPanCard || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                    
                    {companyDetails.pancardUrl ? (
                      <div className="mt-3 flex items-center gap-2">
                        <a 
                          href={companyDetails.pancardUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View PAN Card Document
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">No PAN Card document uploaded</p>
                    )}

                    {isEditable && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload PAN Card Document
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={pancardFileRef}
                            onChange={(e) => handleFileChange(e, 'pancard')}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="pancard-upload"
                          />
                          <label
                            htmlFor="pancard-upload"
                            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <DocumentArrowUpIcon className="h-5 w-5" />
                            Choose File
                          </label>
                          {pancardFileName && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700 truncate max-w-xs">{pancardFileName}</span>
                              <button
                                type="button"
                                onClick={() => removeFile('pancard')}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Account Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <BanknotesIcon className="h-5 w-5" />
                  Bank Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      name="bankName"
                      value={companyDetails.bankName || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      name="accountHolder"
                      value={companyDetails.accountHolder || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      name="accountNumber"
                      value={companyDetails.accountNumber || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      name="ifscCode"
                      value={companyDetails.ifscCode || 'NA'}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${isEditable ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-sm font-medium">
                      {isEditable ? 'Editing Mode - All fields are editable' : 'View Mode - Click Edit to make changes'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Vendor Selected Message */}
          {!companyDetails && !detailsLoading && (
            <div className="text-center py-12">
              <BuildingOffice2Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendor Selected</h3>
              <p className="text-gray-600">Please select a vendor from the dropdown above to view and edit details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateVendor;