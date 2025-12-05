import React, { useState, useEffect } from "react";
import Api from "../../auth/Api";

const UpdateCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyDetails, setCompanyDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  // ✅ FETCH COMPANIES LIST
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await Api.get("/purchase/companies");
        setCompanies(response.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // ✅ FETCH SINGLE COMPANY DETAILS
  const handleCompanyChange = async (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setIsEditable(false); // lock again when selecting new company

    if (!companyId) return;

    setDetailsLoading(true);

    try {
      const response = await Api.get(`/purchase/companies/${companyId}`);
      setCompanyDetails(response.data.data);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ✅ HANDLE INPUT CHANGE
  const handleInputChange = (e) => {
    setCompanyDetails({
      ...companyDetails,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ SAVE UPDATED VALUES
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

      await Api.put(`/purchase/companies/${selectedCompany}`, payload);

      alert("Company Updated Successfully!");
      setIsEditable(false);
    } catch (error) {
      console.log(error);
      alert("Error updating company");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Update Company</h2>
            <p className="mt-2 text-gray-600">Select a company to view and edit its details</p>
          </div>

          {/* ✅ DROPDOWN */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Company
            </label>
            <div className="relative">
              <select
                value={selectedCompany}
                onChange={handleCompanyChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
              >
                <option value="">-- Select Company --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {detailsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading company details...</p>
            </div>
          )}

          {/* ✅ FORM */}
          {companyDetails && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Company Information</h3>
                {/* Removed duplicate button from top */}
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={companyDetails.name}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Code
                    </label>
                    <input
                      type="text"
                      name="companyCode"
                      value={companyDetails.companyCode}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={companyDetails.gstNumber}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={companyDetails.contactNumber}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={companyDetails.address}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={companyDetails.city}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={companyDetails.state}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={companyDetails.pincode}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Number
                    </label>
                    <input
                      type="text"
                      name="alternateNumber"
                      value={companyDetails.alternateNumber}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={companyDetails.email}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={companyDetails.country}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <input
                      type="text"
                      name="currency"
                      value={companyDetails.currency}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        isEditable ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>
                </div>

                {/* ✅ SINGLE ACTION BUTTON */}
                <div className="pt-6 border-t border-gray-200">
                  {!isEditable ? (
                    <button
                      type="button"
                      onClick={() => setIsEditable(true)}
                      className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Company Details
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={handleUpdateSubmit}
                        className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditable(false)}
                        className="flex-1 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateCompany;