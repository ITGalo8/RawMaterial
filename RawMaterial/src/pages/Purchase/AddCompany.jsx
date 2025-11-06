// AddCompany.js
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Api from '../../auth/Api';
import './CSS/AddCompany.css';

const AddCompany = () => {
  const [companyData, setCompanyData] = useState({
    name: '',
    companyCode: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'INDIA',
    contactNumber: '',
    alternateNumber: '',
    email: '',
    currency: 'INR'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const countries = useMemo(() => [
    'AFGHANISTAN', 'ALBANIA', 'ALGERIA', 'ANDORRA', 'ANGOLA', 'ANTIGUA AND BARBUDA', 
    'ARGENTINA', 'ARMENIA', 'AUSTRALIA', 'AUSTRIA', 'AZERBAIJAN', 'BAHAMAS', 
    'BAHRAIN', 'BANGLADESH', 'BARBADOS', 'BELARUS', 'BELGIUM', 'BELIZE', 'BENIN', 
    'BHUTAN', 'BOLIVIA', 'BOSNIA AND HERZEGOVINA', 'BOTSWANA', 'BRAZIL', 'BRUNEI', 
    'BULGARIA', 'BURKINA FASO', 'BURUNDI', 'CABO VERDE', 'CAMBODIA', 'CAMEROON', 
    'CANADA', 'CENTRAL AFRICAN REPUBLIC', 'CHAD', 'CHILE', 'CHINA', 'COLOMBIA', 
    'COMOROS', 'CONGO', 'COSTA RICA', 'CROATIA', 'CUBA', 'CYPRUS', 'CZECHIA', 
    'DENMARK', 'DJIBOUTI', 'DOMINICA', 'DOMINICAN REPUBLIC', 'ECUADOR', 'EGYPT', 
    'EL SALVADOR', 'EQUATORIAL GUINEA', 'ERITREA', 'ESTONIA', 'ESWATINI', 'ETHIOPIA', 
    'FIJI', 'FINLAND', 'FRANCE', 'GABON', 'GAMBIA', 'GEORGIA', 'GERMANY', 'GHANA', 
    'GREECE', 'GRENADA', 'GUATEMALA', 'GUINEA', 'GUINEA-BISSAU', 'GUYANA', 'HAITI', 
    'HONDURAS', 'HUNGARY', 'ICELAND', 'INDIA', 'INDONESIA', 'IRAN', 'IRAQ', 
    'IRELAND', 'ISRAEL', 'ITALY', 'JAMAICA', 'JAPAN', 'JORDAN', 'KAZAKHSTAN', 
    'KENYA', 'KIRIBATI', 'KOREA, NORTH', 'KOREA, SOUTH', 'KOSOVO', 'KUWAIT', 
    'KYRGYZSTAN', 'LAOS', 'LATVIA', 'LEBANON', 'LESOTHO', 'LIBERIA', 'LIBYA', 
    'LIECHTENSTEIN', 'LITHUANIA', 'LUXEMBOURG', 'MADAGASCAR', 'MALAWI', 'MALAYSIA', 
    'MALDIVES', 'MALI', 'MALTA', 'MARSHALL ISLANDS', 'MAURITANIA', 'MAURITIUS', 
    'MEXICO', 'MICRONESIA', 'MOLDOVA', 'MONACO', 'MONGOLIA', 'MONTENEGRO', 
    'MOROCCO', 'MOZAMBIQUE', 'MYANMAR', 'NAMIBIA', 'NAURU', 'NEPAL', 
    'NETHERLANDS', 'NEW ZEALAND', 'NICARAGUA', 'NIGER', 'NIGERIA', 'NORTH MACEDONIA', 
    'NORWAY', 'OMAN', 'PAKISTAN', 'PALAU', 'PALESTINE', 'PANAMA', 'PAPUA NEW GUINEA', 
    'PARAGUAY', 'PERU', 'PHILIPPINES', 'POLAND', 'PORTUGAL', 'QATAR', 'ROMANIA', 
    'RUSSIA', 'RWANDA', 'SAINT KITTS AND NEVIS', 'SAINT LUCIA', 
    'SAINT VINCENT AND THE GRENADINES', 'SAMOA', 'SAN MARINO', 'SAO TOME AND PRINCIPE', 
    'SAUDI ARABIA', 'SENEGAL', 'SERBIA', 'SEYCHELLES', 'SIERRA LEONE', 'SINGAPORE', 
    'SLOVAKIA', 'SLOVENIA', 'SOLOMON ISLANDS', 'SOMALIA', 'SOUTH AFRICA', 
    'SOUTH SUDAN', 'SPAIN', 'SRI LANKA', 'SUDAN', 'SURINAME', 'SWEDEN', 
    'SWITZERLAND', 'SYRIA', 'TAIWAN', 'TAJIKISTAN', 'TANZANIA', 'THAILAND', 
    'TIMOR-LESTE', 'TOGO', 'TONGA', 'TRINIDAD AND TOBAGO', 'TUNISIA', 'TURKEY', 
    'TURKMENISTAN', 'TUVALU', 'UGANDA', 'UKRAINE', 'UNITED ARAB EMIRATES', 
    'UNITED KINGDOM', 'UNITED STATES', 'URUGUAY', 'UZBEKISTAN', 'VANUATU', 
    'VATICAN CITY', 'VENEZUELA', 'VIETNAM', 'YEMEN', 'ZAMBIA', 'ZIMBABWE'
  ], []);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    return countries.filter(country => 
      country.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countries, countrySearch]);

  // Auto-clear success message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Auto-detect Indian state from pincode
  useEffect(() => {
    const detectIndianState = async () => {
      if (companyData.pincode.length === 6 && /^[1-9][0-9]{5}$/.test(companyData.pincode)) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${companyData.pincode}`);
          const data = await response.json();
          if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0];
            setCompanyData(prev => ({
              ...prev,
              state: postOffice.State,
              country: 'INDIA',
              city: postOffice.District || prev.city
            }));
          }
        } catch (error) {
          console.error('Error detecting state from pincode:', error);
        }
      }
    };

    detectIndianState();
  }, [companyData.pincode]);

  // Handle clicks outside dropdown and focus search input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
        setCountrySearch('');
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showCountryDropdown) {
        setShowCountryDropdown(false);
        setCountrySearch('');
      }
    };

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Focus search input when dropdown opens
      if (searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showCountryDropdown]);

  const formatGSTNumber = (value) => {
    const cleaned = value.toUpperCase().replace(/[^0-9A-Z]/g, '');
    return cleaned.slice(0, 15);
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned.slice(0, 10);
  };

  const formatEmail = (value) => {
    return value.replace(/\s/g, '');
  };

  const validateForm = () => {
    const errors = {};
    
    if (!companyData.name.trim()) errors.name = 'Company name is required';
    if (!companyData.companyCode.trim()) errors.companyCode = 'Company code is required';
    
    if (!companyData.gstNumber.trim()) {
      errors.gstNumber = 'GST number is required';
    } else if (!/^[0-9A-Z]{15}$/.test(companyData.gstNumber)) {
      errors.gstNumber = 'GST number must be 15 characters (numbers and uppercase letters)';
    }
    
    if (!companyData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!companyData.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(companyData.contactNumber)) {
      errors.contactNumber = 'Contact number must be 10 digits';
    }
    
    if (companyData.alternateNumber && !/^[0-9]{10}$/.test(companyData.alternateNumber)) {
      errors.alternateNumber = 'Alternate number must be 10 digits';
    }
    
    if (!companyData.address.trim()) errors.address = 'Address is required';
    if (!companyData.city.trim()) errors.city = 'City is required';
    if (!companyData.state.trim()) errors.state = 'State is required';
    
    if (!companyData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^[1-9][0-9]{5}$/.test(companyData.pincode)) {
      errors.pincode = 'Invalid pincode format';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Apply formatting based on field type
    if (name === 'gstNumber') {
      processedValue = formatGSTNumber(value);
    } else if (name === 'contactNumber' || name === 'alternateNumber') {
      processedValue = formatPhoneNumber(value);
    } else if (name === 'pincode') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    } else if (name === 'email') {
      processedValue = formatEmail(value);
    }

    setCompanyData(prevState => ({
      ...prevState,
      [name]: processedValue
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCountrySelect = (country) => {
    setCompanyData(prevState => ({
      ...prevState,
      country: country
    }));
    setShowCountryDropdown(false);
    setCountrySearch('');
  };

  const handleCountryDropdownToggle = () => {
    const newState = !showCountryDropdown;
    setShowCountryDropdown(newState);
    setCountrySearch('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors in the form');
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await Api.post(
        '/purchase/companies',
        companyData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage('Company added successfully!');
        setCompanyData({
          name: '',
          companyCode: '',
          gstNumber: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: 'INDIA',
          contactNumber: '',
          alternateNumber: '',
          email: '',
          currency: 'INR'
        });
      }
    } catch (err) {
      console.error('Error adding company:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to add company. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      companyData.name.trim() &&
      companyData.companyCode.trim() &&
      companyData.gstNumber.trim() &&
      companyData.address.trim() &&
      companyData.city.trim() &&
      companyData.state.trim() &&
      companyData.pincode.trim() &&
      companyData.contactNumber.trim() &&
      companyData.email.trim()
    );
  };

  const clearForm = () => {
    setCompanyData({
      name: '',
      companyCode: '',
      gstNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'INDIA',
      contactNumber: '',
      alternateNumber: '',
      email: '',
      currency: 'INR'
    });
    setFieldErrors({});
    setError('');
    setMessage('');
    setCountrySearch('');
    setShowCountryDropdown(false);
  };

  return (
    <div className="add-company-container">
      <div className="center-wrapper">
        <div className="form-content">
          <div className="page-header">
            <h1>Add New Company</h1>
            <p>Register a new supplier or vendor company in the system</p>
          </div>

          {message && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <div>
                <strong>Success!</strong> {message}
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠</span>
              <div>
                <strong>Error!</strong> {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="company-form">
            {/* Basic Information - Single Row */}
            <div className="form-section basic-info-section">
              <h2 className="section-title">Basic Information</h2>
              <div className="form-grid single-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={companyData.name}
                    onChange={handleChange}
                    required
                    className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                    placeholder="Enter company legal name"
                  />
                  {fieldErrors.name && (
                    <span className="field-error">{fieldErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="gstNumber" className="form-label">
                    GST Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="gstNumber"
                    name="gstNumber"
                    value={companyData.gstNumber}
                    onChange={handleChange}
                    required
                    className={`form-input ${fieldErrors.gstNumber ? 'error' : ''}`}
                    placeholder="Enter 15-character GST number"
                    maxLength="15"
                  />
                  {fieldErrors.gstNumber && (
                    <span className="field-error">{fieldErrors.gstNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="companyCode" className="form-label">
                    Company Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyCode"
                    name="companyCode"
                    value={companyData.companyCode}
                    onChange={handleChange}
                    required
                    className={`form-input ${fieldErrors.companyCode ? 'error' : ''}`}
                    placeholder="Unique company code"
                  />
                  {fieldErrors.companyCode && (
                    <span className="field-error">{fieldErrors.companyCode}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="currency" className="form-label">
                    Currency <span className="required">*</span>
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={companyData.currency}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="SGD">Singapore Dollar (SGD)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="form-section">
              <h2 className="section-title">Address Details</h2>
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Complete Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={companyData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                  className={`form-textarea ${fieldErrors.address ? 'error' : ''}`}
                  placeholder="Enter complete street address"
                />
                {fieldErrors.address && (
                  <span className="field-error">{fieldErrors.address}</span>
                )}
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={companyData.city}
                    onChange={handleChange}
                    required
                    className={`form-input ${fieldErrors.city ? 'error' : ''}`}
                    placeholder="Enter city"
                  />
                  {fieldErrors.city && (
                    <span className="field-error">{fieldErrors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state" className="form-label">
                    State <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={companyData.state}
                    onChange={handleChange}
                    required
                    className={`form-input ${fieldErrors.state ? 'error' : ''}`}
                    placeholder="Enter state"
                  />
                  {fieldErrors.state && (
                    <span className="field-error">{fieldErrors.state}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="pincode" className="form-label">
                    Pincode <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={companyData.pincode}
                    onChange={handleChange}
                    required
                    className={`form-input ${fieldErrors.pincode ? 'error' : ''}`}
                    placeholder="Enter 6-digit postal code"
                    maxLength="6"
                  />
                  {fieldErrors.pincode && (
                    <span className="field-error">{fieldErrors.pincode}</span>
                  )}
                </div>

                <div className="form-group country-group" ref={dropdownRef}>
                  <label htmlFor="country" className="form-label">
                    Country <span className="required">*</span>
                  </label>
                  <div className="custom-dropdown">
                    <div 
                      className="dropdown-header"
                      onClick={handleCountryDropdownToggle}
                      tabIndex={0}
                      role="button"
                      aria-expanded={showCountryDropdown}
                      aria-haspopup="listbox"
                    >
                      <span className="selected-country">{companyData.country}</span>
                      <span className="dropdown-arrow">
                        {showCountryDropdown ? '▲' : '▼'}
                      </span>
                    </div>
                    
                    {showCountryDropdown && (
                      <div className="dropdown-list">
                        <div className="search-container">
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search countries..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="search-input"
                          />
                        </div>
                        <div className="dropdown-options">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <div
                                key={country}
                                className={`dropdown-option ${
                                  companyData.country === country ? 'selected' : ''
                                }`}
                                onClick={() => handleCountrySelect(country)}
                                role="option"
                                aria-selected={companyData.country === country}
                              >
                                {country}
                              </div>
                            ))
                          ) : (
                            <div className="no-results">
                              No countries found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>
              <div className="form-grid responsive-grid">
                <div className="form-group">
                  <label htmlFor="contactNumber" className="form-label">
                    Contact Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={companyData.contactNumber}
                    onChange={handleChange}
                    required
                    className={`form-input ${fieldErrors.contactNumber ? 'error' : ''}`}
                    placeholder="Enter 10-digit contact number"
                    maxLength="10"
                  />
                  {fieldErrors.contactNumber && (
                    <span className="field-error">{fieldErrors.contactNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="alternateNumber" className="form-label">
                    Alternate Number
                  </label>
                  <input
                    type="tel"
                    id="alternateNumber"
                    name="alternateNumber"
                    value={companyData.alternateNumber}
                    onChange={handleChange}
                    className={`form-input ${fieldErrors.alternateNumber ? 'error' : ''}`}
                    placeholder="Optional 10-digit alternate number"
                    maxLength="10"
                  />
                  {fieldErrors.alternateNumber && (
                    <span className="field-error">{fieldErrors.alternateNumber}</span>
                  )}
                </div>

                <div className="form-group email-field">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={companyData.email}
                    onChange={handleChange}
                    required
                    className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                    placeholder="company@example.com"
                  />
                  {fieldErrors.email && (
                    <span className="field-error">{fieldErrors.email}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !isFormValid()}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Adding Company...
                  </>
                ) : (
                  'Add Company'
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={clearForm}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;