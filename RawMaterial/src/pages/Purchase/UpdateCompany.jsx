import React, { useState, useEffect } from "react";
import "./CSS/UpdateCompany.css";
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="company-selector">
      <h2>Update Company</h2>

      {/* ✅ DROPDOWN */}
      <div className="dropdown-container">
        <label>Select Company:</label>
        <select
          value={selectedCompany}
          onChange={handleCompanyChange}
          className="company-dropdown"
        >
          <option value="">-- Select Company --</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.companyName}
            </option>
          ))}
        </select>
      </div>

      {detailsLoading && <p>Loading details...</p>}

      {/* ✅ FORM */}
      {companyDetails && (
        <div className="company-form">
          <h3>Company Information</h3>

          <div className="form-row">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={companyDetails.name}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>Company Code:</label>
            <input
              type="text"
              name="companyCode"
              value={companyDetails.companyCode}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>GST Number:</label>
            <input
              type="text"
              name="gstNumber"
              value={companyDetails.gstNumber}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>Address:</label>
            <textarea
              name="address"
              value={companyDetails.address}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>City:</label>
            <input
              name="city"
              value={companyDetails.city}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>State:</label>
            <input
              name="state"
              value={companyDetails.state}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>Pincode:</label>
            <input
              name="pincode"
              value={companyDetails.pincode}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>Contact Number:</label>
            <input
              name="contactNumber"
              value={companyDetails.contactNumber}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>Alternate Number:</label>
            <input
              name="alternateNumber"
              value={companyDetails.alternateNumber}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>Email:</label>
            <input
              name="email"
              value={companyDetails.email}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>Country:</label>
            <input
              name="country"
              value={companyDetails.country}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-row">
            <label>Currency:</label>
            <input
              name="currency"
              value={companyDetails.currency}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

          {/* ✅ BUTTONS */}
          {!isEditable ? (
            <button className="edit-btn" onClick={() => setIsEditable(true)}>
              Edit / Update
            </button>
          ) : (
            <button className="save-btn" onClick={handleUpdateSubmit}>
              Save Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateCompany;
