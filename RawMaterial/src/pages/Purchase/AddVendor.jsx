// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import Api from '../../auth/Api';
// import './CSS/AddCompany.css';

// const AddVendor = () => {
//   const [companyData, setCompanyData] = useState({
//     name: '',
//     gstNumber: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country: 'INDIA',
//     contactNumber: '',
//     alternateNumber: '',
//     email: '',
//     currency: 'INR'
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [countrySearch, setCountrySearch] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});

//   const dropdownRef = useRef(null);
//   const searchInputRef = useRef(null);

//   const countries = useMemo(() => [
//     'AFGHANISTAN', 'ALBANIA', 'ALGERIA', 'ANDORRA', 'ANGOLA', 'ANTIGUA AND BARBUDA', 
//     'ARGENTINA', 'ARMENIA', 'AUSTRALIA', 'AUSTRIA', 'AZERBAIJAN', 'BAHAMAS', 
//     'BAHRAIN', 'BANGLADESH', 'BARBADOS', 'BELARUS', 'BELGIUM', 'BELIZE', 'BENIN', 
//     'BHUTAN', 'BOLIVIA', 'BOSNIA AND HERZEGOVINA', 'BOTSWANA', 'BRAZIL', 'BRUNEI', 
//     'BULGARIA', 'BURKINA FASO', 'BURUNDI', 'CABO VERDE', 'CAMBODIA', 'CAMEROON', 
//     'CANADA', 'CENTRAL AFRICAN REPUBLIC', 'CHAD', 'CHILE', 'CHINA', 'COLOMBIA', 
//     'COMOROS', 'CONGO', 'COSTA RICA', 'CROATIA', 'CUBA', 'CYPRUS', 'CZECHIA', 
//     'DENMARK', 'DJIBOUTI', 'DOMINICA', 'DOMINICAN REPUBLIC', 'ECUADOR', 'EGYPT', 
//     'EL SALVADOR', 'EQUATORIAL GUINEA', 'ERITREA', 'ESTONIA', 'ESWATINI', 'ETHIOPIA', 
//     'FIJI', 'FINLAND', 'FRANCE', 'GABON', 'GAMBIA', 'GEORGIA', 'GERMANY', 'GHANA', 
//     'GREECE', 'GRENADA', 'GUATEMALA', 'GUINEA', 'GUINEA-BISSAU', 'GUYANA', 'HAITI', 
//     'HONDURAS', 'HUNGARY', 'ICELAND', 'INDIA', 'INDONESIA', 'IRAN', 'IRAQ', 
//     'IRELAND', 'ISRAEL', 'ITALY', 'JAMAICA', 'JAPAN', 'JORDAN', 'KAZAKHSTAN', 
//     'KENYA', 'KIRIBATI', 'KOREA, NORTH', 'KOREA, SOUTH', 'KOSOVO', 'KUWAIT', 
//     'KYRGYZSTAN', 'LAOS', 'LATVIA', 'LEBANON', 'LESOTHO', 'LIBERIA', 'LIBYA', 
//     'LIECHTENSTEIN', 'LITHUANIA', 'LUXEMBOURG', 'MADAGASCAR', 'MALAWI', 'MALAYSIA', 
//     'MALDIVES', 'MALI', 'MALTA', 'MARSHALL ISLANDS', 'MAURITANIA', 'MAURITIUS', 
//     'MEXICO', 'MICRONESIA', 'MOLDOVA', 'MONACO', 'MONGOLIA', 'MONTENEGRO', 
//     'MOROCCO', 'MOZAMBIQUE', 'MYANMAR', 'NAMIBIA', 'NAURU', 'NEPAL', 
//     'NETHERLANDS', 'NEW ZEALAND', 'NICARAGUA', 'NIGER', 'NIGERIA', 'NORTH MACEDONIA', 
//     'NORWAY', 'OMAN', 'PAKISTAN', 'PALAU', 'PALESTINE', 'PANAMA', 'PAPUA NEW GUINEA', 
//     'PARAGUAY', 'PERU', 'PHILIPPINES', 'POLAND', 'PORTUGAL', 'QATAR', 'ROMANIA', 
//     'RUSSIA', 'RWANDA', 'SAINT KITTS AND NEVIS', 'SAINT LUCIA', 
//     'SAINT VINCENT AND THE GRENADINES', 'SAMOA', 'SAN MARINO', 'SAO TOME AND PRINCIPE', 
//     'SAUDI ARABIA', 'SENEGAL', 'SERBIA', 'SEYCHELLES', 'SIERRA LEONE', 'SINGAPORE', 
//     'SLOVAKIA', 'SLOVENIA', 'SOLOMON ISLANDS', 'SOMALIA', 'SOUTH AFRICA', 
//     'SOUTH SUDAN', 'SPAIN', 'SRI LANKA', 'SUDAN', 'SURINAME', 'SWEDEN', 
//     'SWITZERLAND', 'SYRIA', 'TAIWAN', 'TAJIKISTAN', 'TANZANIA', 'THAILAND', 
//     'TIMOR-LESTE', 'TOGO', 'TONGA', 'TRINIDAD AND TOBAGO', 'TUNISIA', 'TURKEY', 
//     'TURKMENISTAN', 'TUVALU', 'UGANDA', 'UKRAINE', 'UNITED ARAB EMIRATES', 
//     'UNITED KINGDOM', 'UNITED STATES', 'URUGUAY', 'UZBEKISTAN', 'VANUATU', 
//     'VATICAN CITY', 'VENEZUELA', 'VIETNAM', 'YEMEN', 'ZAMBIA', 'ZIMBABWE'
//   ], []);

//   const filteredCountries = useMemo(() => {
//     if (!countrySearch) return countries;
//     return countries.filter(country => 
//       country.toLowerCase().includes(countrySearch.toLowerCase())
//     );
//   }, [countries, countrySearch]);

//   // Auto-clear success message
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // Auto-detect Indian state from pincode
//   useEffect(() => {
//     const detectIndianState = async () => {
//       if (companyData.pincode.length === 6 && /^[1-9][0-9]{5}$/.test(companyData.pincode)) {
//         try {
//           const response = await fetch(`https://api.postalpincode.in/pincode/${companyData.pincode}`);
//           const data = await response.json();
//           if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
//             const postOffice = data[0].PostOffice[0];
//             setCompanyData(prev => ({
//               ...prev,
//               state: postOffice.State,
//               country: 'INDIA',
//               city: postOffice.District || prev.city
//             }));
//           }
//         } catch (error) {
//           console.error('Error detecting state from pincode:', error);
//         }
//       }
//     };

//     detectIndianState();
//   }, [companyData.pincode]);

//   // Handle clicks outside dropdown and focus search input
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowCountryDropdown(false);
//         setCountrySearch('');
//       }
//     };

//     const handleEscapeKey = (event) => {
//       if (event.key === 'Escape' && showCountryDropdown) {
//         setShowCountryDropdown(false);
//         setCountrySearch('');
//       }
//     };

//     if (showCountryDropdown) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.addEventListener('keydown', handleEscapeKey);
//       // Focus search input when dropdown opens
//       if (searchInputRef.current) {
//         setTimeout(() => {
//           searchInputRef.current?.focus();
//         }, 100);
//       }
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleEscapeKey);
//     };
//   }, [showCountryDropdown]);

//   const formatGSTNumber = (value) => {
//     const cleaned = value.toUpperCase().replace(/[^0-9A-Z]/g, '');
//     return cleaned.slice(0, 15);
//   };

//   const formatPhoneNumber = (value) => {
//     const cleaned = value.replace(/[^0-9]/g, '');
//     return cleaned.slice(0, 10);
//   };

//   const formatEmail = (value) => {
//     return value.replace(/\s/g, '');
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!companyData.name.trim()) errors.name = 'Company name is required';
//     // if (!companyData.companyCode.trim()) errors.companyCode = 'Company code is required';
    
//     if (!companyData.gstNumber.trim()) {
//       errors.gstNumber = 'GST number is required';
//     } else if (!/^[0-9A-Z]{15}$/.test(companyData.gstNumber)) {
//       errors.gstNumber = 'GST number must be 15 characters (numbers and uppercase letters)';
//     }
    
//     if (!companyData.email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
//       errors.email = 'Invalid email format';
//     }
    
//     if (!companyData.contactNumber.trim()) {
//       errors.contactNumber = 'Contact number is required';
//     } else if (!/^[0-9]{10}$/.test(companyData.contactNumber)) {
//       errors.contactNumber = 'Contact number must be 10 digits';
//     }
    
//     if (companyData.alternateNumber && !/^[0-9]{10}$/.test(companyData.alternateNumber)) {
//       errors.alternateNumber = 'Alternate number must be 10 digits';
//     }
    
//     if (!companyData.address.trim()) errors.address = 'Address is required';
//     if (!companyData.city.trim()) errors.city = 'City is required';
//     if (!companyData.state.trim()) errors.state = 'State is required';
    
//     if (!companyData.pincode.trim()) {
//       errors.pincode = 'Pincode is required';
//     } else if (!/^[1-9][0-9]{5}$/.test(companyData.pincode)) {
//       errors.pincode = 'Invalid pincode format';
//     }

//     return errors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let processedValue = value;
//     if (name === 'gstNumber') {
//       processedValue = formatGSTNumber(value);
//     } else if (name === 'contactNumber' || name === 'alternateNumber') {
//       processedValue = formatPhoneNumber(value);
//     } else if (name === 'pincode') {
//       processedValue = value.replace(/[^0-9]/g, '').slice(0, 6);
//     } else if (name === 'email') {
//       processedValue = formatEmail(value);
//     }

//     setCompanyData(prevState => ({
//       ...prevState,
//       [name]: processedValue
//     }));
//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleCountrySelect = (country) => {
//     setCompanyData(prevState => ({
//       ...prevState,
//       country: country
//     }));
//     setShowCountryDropdown(false);
//     setCountrySearch('');
//   };

//   const handleCountryDropdownToggle = () => {
//     const newState = !showCountryDropdown;
//     setShowCountryDropdown(newState);
//     setCountrySearch('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       setError('Please fix the errors in the form');
//       return;
//     }

//     setFieldErrors({});
//     setLoading(true);
//     setMessage('');
//     setError('');

//     try {
//       const response = await Api.post(
//         '/purchase/vendors',
//         companyData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setCompanyData({
//           name: '',
//         //   companyCode: '',
//           gstNumber: '',
//           address: '',
//           city: '',
//           state: '',
//           pincode: '',
//           country: 'INDIA',
//           contactNumber: '',
//           alternateNumber: '',
//           email: '',
//           currency: 'INR'
//         });
//       }
//       alert(response?.data?.message);
//     } catch (err) {
//       console.error('Error adding company:', err);
//       setError(
//         err.response?.data?.message || 
//         err.response?.data?.error || 
//         'Failed to add company. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isFormValid = () => {
//     return (
//       companyData.name.trim() &&
//     //   companyData.companyCode.trim() &&
//       companyData.gstNumber.trim() &&
//       companyData.address.trim() &&
//       companyData.city.trim() &&
//       companyData.state.trim() &&
//       companyData.pincode.trim() &&
//       companyData.contactNumber.trim() &&
//       companyData.email.trim()
//     );
//   };

//   const clearForm = () => {
//     setCompanyData({
//       name: '',
//     //   companyCode: '',
//       gstNumber: '',
//       address: '',
//       city: '',
//       state: '',
//       pincode: '',
//       country: 'INDIA',
//       contactNumber: '',
//       alternateNumber: '',
//       email: '',
//       currency: 'INR'
//     });
//     setFieldErrors({});
//     setError('');
//     setMessage('');
//     setCountrySearch('');
//     setShowCountryDropdown(false);
//   };

//   return (
//     <div className="add-company-container">
//       <div className="center-wrapper">
//         <div className="form-content">
//           <div className="page-header">
//             <h1>Add New Vendor</h1>
            
//           </div>

//           {message && (
//             <div className="alert alert-success">
//               <span className="alert-icon">✓</span>
//               <div>
//                 <strong>Success!</strong> {message}
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="alert alert-error">
//               <span className="alert-icon">⚠</span>
//               <div>
//                 <strong>Error!</strong> {error}
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="company-form">
//             {/* Basic Information - Single Row */}
//             <div className="form-section basic-info-section">
//               <h2 className="section-title">Basic Information</h2>
//               <div className="form-grid single-row">
//                 <div className="form-group">
//                   <label htmlFor="name" className="form-label">
//                     Company Name <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={companyData.name}
//                     onChange={handleChange}
//                     required
//                     className={`form-input ${fieldErrors.name ? 'error' : ''}`}
//                     placeholder="Enter company legal name"
//                   />
//                   {fieldErrors.name && (
//                     <span className="field-error">{fieldErrors.name}</span>
//                   )}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="gstNumber" className="form-label">
//                     GST Number <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="gstNumber"
//                     name="gstNumber"
//                     value={companyData.gstNumber}
//                     onChange={handleChange}
//                     required
//                     className={`form-input ${fieldErrors.gstNumber ? 'error' : ''}`}
//                     placeholder="Enter 15-character GST number"
//                     maxLength="15"
//                   />
//                   {fieldErrors.gstNumber && (
//                     <span className="field-error">{fieldErrors.gstNumber}</span>
//                   )}
//                 </div>

//                 {/* <div className="form-group">
//                   <label htmlFor="companyCode" className="form-label">
//                     Company Code <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="companyCode"
//                     name="companyCode"
//                     value={companyData.companyCode}
//                     onChange={handleChange}
//                     required
//                     className={`form-input ${fieldErrors.companyCode ? 'error' : ''}`}
//                     placeholder="Unique company code"
//                   />
//                   {fieldErrors.companyCode && (
//                     <span className="field-error">{fieldErrors.companyCode}</span>
//                   )}
//                 </div> */}

//                 <div className="form-group">
//                   <label htmlFor="currency" className="form-label">
//                     Currency <span className="required">*</span>
//                   </label>
//                   <select
//                     id="currency"
//                     name="currency"
//                     value={companyData.currency}
//                     onChange={handleChange}
//                     required
//                     className="form-select"
//                   >
//                     <option value="INR">Indian Rupee (INR)</option>
//                     <option value="USD">US Dollar (USD)</option>
//                     <option value="EUR">Euro (EUR)</option>
//                     <option value="GBP">British Pound (GBP)</option>
//                     <option value="AUD">Australian Dollar (AUD)</option>
//                     <option value="CAD">Canadian Dollar (CAD)</option>
//                     <option value="SGD">Singapore Dollar (SGD)</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Address Details */}
//             <div className="form-section">
//               <h2 className="section-title">Address Details</h2>
//               <div className="form-group">
//                 <label htmlFor="address" className="form-label">
//                   Complete Address <span className="required">*</span>
//                 </label>
//                 <textarea
//                   id="address"
//                   name="address"
//                   value={companyData.address}
//                   onChange={handleChange}
//                   rows="3"
//                   required
//                   className={`form-textarea ${fieldErrors.address ? 'error' : ''}`}
//                   placeholder="Enter complete street address"
//                 />
//                 {fieldErrors.address && (
//                   <span className="field-error">{fieldErrors.address}</span>
//                 )}
//               </div>
              
//               <div className="form-grid">
//                 <div className="form-group">
//                   <label htmlFor="city" className="form-label">
//                     City <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="city"
//                     name="city"
//                     value={companyData.city}
//                     onChange={handleChange}
//                     required
//                     className={`form-input ${fieldErrors.city ? 'error' : ''}`}
//                     placeholder="Enter city"
//                   />
//                   {fieldErrors.city && (
//                     <span className="field-error">{fieldErrors.city}</span>
//                   )}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="state" className="form-label">
//                     State <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="state"
//                     name="state"
//                     value={companyData.state}
//                     onChange={handleChange}
//                     required
//                     className={`form-input ${fieldErrors.state ? 'error' : ''}`}
//                     placeholder="Enter state"
//                   />
//                   {fieldErrors.state && (
//                     <span className="field-error">{fieldErrors.state}</span>
//                   )}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="pincode" className="form-label">
//                     Pincode <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="pincode"
//                     name="pincode"
//                     value={companyData.pincode}
//                     onChange={handleChange}
//                     required
//                     className={`form-input ${fieldErrors.pincode ? 'error' : ''}`}
//                     placeholder="Enter 6-digit postal code"
//                     maxLength="6"
//                   />
//                   {fieldErrors.pincode && (
//                     <span className="field-error">{fieldErrors.pincode}</span>
//                   )}
//                 </div>

//                 <div className="form-group country-group" ref={dropdownRef}>
//                   <label htmlFor="country" className="form-label">
//                     Country <span className="required">*</span>
//                   </label>
//                   <div className="custom-dropdown">
//                     <div 
//                       className="dropdown-header"
//                       onClick={handleCountryDropdownToggle}
//                       tabIndex={0}
//                       role="button"
//                       aria-expanded={showCountryDropdown}
//                       aria-haspopup="listbox"
//                     >
//                       <span className="selected-country">{companyData.country}</span>
//                       <span className="dropdown-arrow">
//                         {showCountryDropdown ? '▲' : '▼'}
//                       </span>
//                     </div>
                    
//                     {showCountryDropdown && (
//                       <div className="dropdown-list">
//                         <div className="search-container">
//                           <input
//                             ref={searchInputRef}
//                             type="text"
//                             placeholder="Search countries..."
//                             value={countrySearch}
//                             onChange={(e) => setCountrySearch(e.target.value)}
//                             className="search-input"
//                           />
//                         </div>
//                         <div className="dropdown-options">
//                           {filteredCountries.length > 0 ? (
//                             filteredCountries.map((country) => (
//                               <div
//                                 key={country}
//                                 className={`dropdown-option ${
//                                   companyData.country === country ? 'selected' : ''
//                                 }`}
//                                 onClick={() => handleCountrySelect(country)}
//                                 role="option"
//                                 aria-selected={companyData.country === country}
//                               >
//                                 {country}
//                               </div>
//                             ))
//                           ) : (
//                             <div className="no-results">
//                               No countries found
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="form-section">
//               <h2 className="section-title">Contact Information</h2>
//               <div className="form-grid responsive-grid">
//                 <div className="form-group">
//                   <label htmlFor="contactNumber" className="form-label">
//                     Contact Number <span className="required">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     id="contactNumber"
//                     name="contactNumber"
//                     value={companyData.contactNumber}
//                     onChange={handleChange}
//                     required
//                     className={`form-input ${fieldErrors.contactNumber ? 'error' : ''}`}
//                     placeholder="Enter 10-digit contact number"
//                     maxLength="10"
//                   />
//                   {fieldErrors.contactNumber && (
//                     <span className="field-error">{fieldErrors.contactNumber}</span>
//                   )}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="alternateNumber" className="form-label">
//                     Alternate Number
//                   </label>
//                   <input
//                     type="tel"
//                     id="alternateNumber"
//                     name="alternateNumber"
//                     value={companyData.alternateNumber}
//                     onChange={handleChange}
//                     className={`form-input ${fieldErrors.alternateNumber ? 'error' : ''}`}
//                     placeholder="Optional 10-digit alternate number"
//                     maxLength="10"
//                   />
//                   {fieldErrors.alternateNumber && (
//                     <span className="field-error">{fieldErrors.alternateNumber}</span>
//                   )}
//                 </div>

//                 <div className="form-group email-field">
//                   <label htmlFor="email" className="form-label">
//                     Email Address <span className="required">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={companyData.email}
//                     onChange={handleChange}
//                     required
//                     className={`form-input ${fieldErrors.email ? 'error' : ''}`}
//                     placeholder="company@example.com"
//                   />
//                   {fieldErrors.email && (
//                     <span className="field-error">{fieldErrors.email}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="form-actions">
//               <button 
//                 type="submit" 
//                 className="btn btn-primary"
//                 disabled={loading || !isFormValid()}
//               >
//                 {loading ? (
//                   <>
//                     <div className="spinner"></div>
//                     Adding Company...
//                   </>
//                 ) : (
//                   'Add Company'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddVendor;

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Api from '../../auth/Api';
import {
  BuildingOffice2Icon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  BuildingOffice2Icon as BuildingOffice2Solid,
  CheckCircleIcon as CheckCircleSolid
} from '@heroicons/react/24/solid';
import Button from '../../components/Button/Button'

const AddVendor = () => {
  const [companyData, setCompanyData] = useState({
    name: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'INDIA',
    contactNumber: '',
    alternateNumber: '',
    email: '',
    currency: 'INR',
    exchangerate: '' // Added exchange rate field
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [detectingState, setDetectingState] = useState(false);

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
        setDetectingState(true);
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
            setFieldErrors(prev => ({ ...prev, pincode: '' }));
          }
        } catch (error) {
          console.error('Error detecting state from pincode:', error);
        } finally {
          setDetectingState(false);
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

    // Exchange rate validation
    if (!companyData.exchangerate.trim()) {
      errors.exchangerate = 'Exchange rate is required';
    } else if (isNaN(companyData.exchangerate) || parseFloat(companyData.exchangerate) <= 0) {
      errors.exchangerate = 'Exchange rate must be a positive number';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'gstNumber') {
      processedValue = formatGSTNumber(value);
    } else if (name === 'contactNumber' || name === 'alternateNumber') {
      processedValue = formatPhoneNumber(value);
    } else if (name === 'pincode') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    } else if (name === 'email') {
      processedValue = formatEmail(value);
    } else if (name === 'exchangerate') {
      // Allow only numbers and decimal points
      processedValue = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = processedValue.split('.');
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    setCompanyData(prevState => ({
      ...prevState,
      [name]: processedValue
    }));
    
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
        '/purchase/vendors',
        companyData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage('Vendor added successfully!');
        setCompanyData({
          name: '',
          gstNumber: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: 'INDIA',
          contactNumber: '',
          alternateNumber: '',
          email: '',
          currency: 'INR',
          exchangerate: '' // Reset exchange rate
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
      companyData.gstNumber.trim() &&
      companyData.address.trim() &&
      companyData.city.trim() &&
      companyData.state.trim() &&
      companyData.pincode.trim() &&
      companyData.contactNumber.trim() &&
      companyData.email.trim() &&
      companyData.exchangerate.trim() // Added exchange rate validation
    );
  };

  const clearForm = () => {
    setCompanyData({
      name: '',
      gstNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'INDIA',
      contactNumber: '',
      alternateNumber: '',
      email: '',
      currency: 'INR',
      exchangerate: '' // Added exchange rate
    });
    setFieldErrors({});
    setError('');
    setMessage('');
    setCountrySearch('');
    setShowCountryDropdown(false);
  };

  const currencyOptions = [
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'SGD', label: 'Singapore Dollar (S$)' }
  ];

  // Helper function to get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AUD': 'A$',
      'CAD': 'C$',
      'SGD': 'S$'
    };
    return symbols[currencyCode] || currencyCode;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <BuildingOffice2Solid className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Add New Vendor</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Register a new vendor by filling in their complete business and contact information
          </p>
        </div> */}

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-start shadow-sm">
            <CheckCircleSolid className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <strong className="font-semibold text-green-800 text-lg">Success!</strong>
              <p className="text-green-700 mt-1">{message}</p>
            </div>
            <button
              onClick={() => setMessage('')}
              className="text-green-500 hover:text-green-700 ml-4"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-start shadow-sm">
            <XCircleIcon className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <strong className="font-semibold text-red-800 text-lg">Error!</strong>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-yellow-300 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-dark" />
                <h2 className="text-xl font-semibold text-dark">Vendor Registration Form</h2>
              </div>
              <div className="text-dark/80 text-sm">
                <InformationCircleIcon className="h-5 w-5 inline mr-1" />
                All fields marked with * are required
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Information Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    <p className="text-gray-500 text-sm">Primary details about the vendor</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Company Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <BuildingOffice2Icon className="h-4 w-4 mr-1 text-gray-400" />
                        Company Name <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={companyData.name}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                          fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter company legal name"
                      />
                      <BuildingOffice2Icon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.name && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  {/* GST Number */}
                  <div>
                    <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-400" />
                        GST Number <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="gstNumber"
                        name="gstNumber"
                        value={companyData.gstNumber}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                          fieldErrors.gstNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="15-character GST number"
                        maxLength="15"
                      />
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.gstNumber && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.gstNumber}
                      </span>
                    )}
                  </div>

                  {/* Currency */}
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                        Currency <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        id="currency"
                        name="currency"
                        value={companyData.currency}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400 appearance-none bg-white cursor-pointer"
                      >
                        {currencyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Exchange Rate - INPUT FIELD */}
                  <div>
                    <label htmlFor="exchangerate" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                        Exchange Rate <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="exchangerate"
                        name="exchangerate"
                        value={companyData.exchangerate}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                          fieldErrors.exchangerate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter exchange rate"
                      />
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.exchangerate && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.exchangerate}
                      </span>
                    )}
                    {!fieldErrors.exchangerate && companyData.exchangerate && !isNaN(companyData.exchangerate) && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Valid exchange rate: {getCurrencySymbol(companyData.currency)}1 = {getCurrencySymbol('INR')}{companyData.exchangerate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Details Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <MapPinIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>
                    <p className="text-gray-500 text-sm">Business location information</p>
                  </div>
                </div>

                {/* Address Textarea */}
                <div className="mb-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                      Complete Address <span className="text-red-500 ml-1">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="address"
                      name="address"
                      value={companyData.address}
                      onChange={handleChange}
                      rows="3"
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none ${
                        fieldErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter complete street address with landmark"
                    />
                    <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-4" />
                  </div>
                  {fieldErrors.address && (
                    <span className="text-red-600 text-sm mt-1 flex items-center">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      {fieldErrors.address}
                    </span>
                  )}
                </div>

                {/* Address Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={companyData.city}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                        fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter city"
                    />
                    {fieldErrors.city && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.city}
                      </span>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={companyData.state}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                        fieldErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter state"
                    />
                    {fieldErrors.state && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.state}
                      </span>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center justify-between">
                        Pincode <span className="text-red-500">*</span>
                        {detectingState && (
                          <span className="text-xs text-blue-600 flex items-center">
                            <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                            Detecting...
                          </span>
                        )}
                      </span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={companyData.pincode}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                        fieldErrors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="6-digit postal code"
                      maxLength="6"
                    />
                    {fieldErrors.pincode && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.pincode}
                      </span>
                    )}
                    {!fieldErrors.pincode && companyData.pincode.length === 6 && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Valid pincode format
                      </p>
                    )}
                  </div>

                  {/* Country Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <GlobeAltIcon className="h-4 w-4 mr-1 text-gray-400" />
                        Country <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div 
                        className={`w-full px-4 py-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center transition-all duration-200 ${
                          showCountryDropdown ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={handleCountryDropdownToggle}
                        tabIndex={0}
                        role="button"
                        aria-expanded={showCountryDropdown}
                        aria-haspopup="listbox"
                      >
                        <span className="truncate flex items-center">
                          <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                          {companyData.country}
                        </span>
                        <span className="text-gray-400 ml-2">
                          {showCountryDropdown ? '▲' : '▼'}
                        </span>
                      </div>
                      
                      {showCountryDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                          <div className="p-2 border-b border-gray-200 bg-gray-50">
                            <div className="relative">
                              <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search countries..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <div
                                  key={country}
                                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center ${
                                    companyData.country === country 
                                      ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500' 
                                      : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                  onClick={() => handleCountrySelect(country)}
                                  role="option"
                                  aria-selected={companyData.country === country}
                                >
                                  {companyData.country === country && (
                                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                                  )}
                                  <span className={companyData.country === country ? 'ml-2' : ''}>
                                    {country}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-center">
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

              {/* Contact Information Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <PhoneIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    <p className="text-gray-500 text-sm">Primary contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Contact Number */}
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                        Contact Number <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={companyData.contactNumber}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                          fieldErrors.contactNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="10-digit contact number"
                        maxLength="10"
                      />
                      <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.contactNumber && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.contactNumber}
                      </span>
                    )}
                    {!fieldErrors.contactNumber && companyData.contactNumber.length === 10 && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Valid contact number
                      </p>
                    )}
                  </div>

                  {/* Alternate Number */}
                  <div>
                    <label htmlFor="alternateNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="alternateNumber"
                        name="alternateNumber"
                        value={companyData.alternateNumber}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                          fieldErrors.alternateNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Optional 10-digit number"
                        maxLength="10"
                      />
                      <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.alternateNumber && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.alternateNumber}
                      </span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        Email Address <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={companyData.email}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                          fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="company@example.com"
                      />
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.email && (
                      <span className="text-red-600 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {fieldErrors.email}
                      </span>
                    )}
                    {!fieldErrors.email && companyData.email.includes('@') && companyData.email.includes('.') && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Valid email format
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="text-sm text-gray-500 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    {isFormValid() ? (
                      <span className="text-green-600 font-medium">All required fields are filled</span>
                    ) : (
                      <span>Please fill all required fields marked with *</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    {/* <button 
                      type="submit" 
                      className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        loading || !isFormValid()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-dark'
                      }`}
                      disabled={loading || !isFormValid()}
                    >
                      {loading ? (
                        <>
                          <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                          Adding Vendor...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Add Vendor
                        </>
                      )}
                    </button> */}

                   <Button
                      type="submit"
                      title={loading ? 'Adding Vendor...' : 'Add Vendor'}
                      disabled={loading || !isFormValid()}
                      variant="default"
                      className="px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                      onClick={null}
                    >
                      {loading && <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />}
                      {!loading && <CheckCircleIcon className="h-5 w-5 mr-2" />}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <span className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
              Data is securely stored
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center">
              <GlobeAltIcon className="h-4 w-4 text-blue-500 mr-1" />
              Supports international vendors
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center">
              <DocumentTextIcon className="h-4 w-4 text-purple-500 mr-1" />
              GST validation included
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVendor;