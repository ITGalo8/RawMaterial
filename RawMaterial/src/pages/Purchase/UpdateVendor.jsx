import React, { useState, useEffect } from "react";
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
  GlobeAmericasIcon
} from "@heroicons/react/24/outline";

const UpdateVendor = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyDetails, setCompanyDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

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

    if (!companyId) return;

    setDetailsLoading(true);

    try {
      const response = await Api.get(`/purchase/vendors/${companyId}`);
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
  const handleUpdateSubmit = async () => {
    try {
      const payload = {
        name: companyDetails.name,
        companyCode: companyDetails.companyCode,
        gstNumber: companyDetails.gstNumber,
        address: companyDetails.address,
        city: companyDetails.city,
        state: companyDetails.state,
        pincode: companyDetails.pincode,
        contactNumber: companyDetails.contactNumber,
        alternateNumber: companyDetails.alternateNumber,
        email: companyDetails.email,
        country: companyDetails.country,
        currency: companyDetails.currency,
      };

      await Api.put(`/purchase/vendors/${selectedCompany}`, payload);
      

      alert("Company Updated Successfully!");
      setIsEditable(false);
    } catch (error) {
      console.log(error);
      alert("Error updating company");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading companies...</p>
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
                        onClick={() => setIsEditable(false)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateSubmit}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckIcon className="h-5 w-5" />
                        Save Changes
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
                      value={companyDetails.name || ''}
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
                      value={companyDetails.gstNumber || ''}
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
                      value={companyDetails.currency || ''}
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
                      name="exchangeRate"
                      value={companyDetails.exchangeRate || 'NA' || ''}
                      onChange={handleInputChange}
                      disabled={!isEditable}
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
                      value={companyDetails.country || ''}
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
                    value={companyDetails.address || ''}
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
                      value={companyDetails.city || ''}
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
                      value={companyDetails.state || ''}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      name="pincode"
                      value={companyDetails.pincode || ''}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Contact Number
                    </label>
                    <input
                      name="contactNumber"
                      value={companyDetails.contactNumber || ''}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Number
                    </label>
                    <input
                      name="alternateNumber"
                      value={companyDetails.alternateNumber || ''}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                      } ${isEditable ? 'border-blue-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      Email Address
                    </label>
                    <input
                      name="email"
                      value={companyDetails.email || ''}
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