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
  InformationCircleIcon,
  UserIcon
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
    contactPerson: '',
    contactNumber: '',
    alternateNumber: '',
    email: '',
    currency: '',
    exchangeRate: '1',
    zipCode: '',
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
    return cleaned.slice(0, 20);
  };

  const formatEmail = (value) => {
    return value.replace(/\s/g, '');
  };

  const validateForm = () => {
    const errors = {};
    
    if (!companyData.name.trim()) errors.name = 'Company name is required';
    
    // if (!companyData.gstNumber.trim()) {
    //   errors.gstNumber = 'GST number is required';
    // } else if (!/^[0-9A-Z]{15}$/.test(companyData.gstNumber)) {
    //   errors.gstNumber = 'GST number must be 15 characters (numbers and uppercase letters)';
    // }
    
    if (!companyData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person name is required';
    }
  
    
    // if (!companyData.contactNumber.trim()) {
    //   errors.contactNumber = 'Contact number is required';
    // } else if (!/^[0-20]{10}$/.test(companyData.contactNumber)) {
    //   errors.contactNumber = 'Contact number must be 10 digits';
    // }

    if (companyData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
      errors.email = 'Invalid email format';
    }
  
    if (!companyData.address.trim()) errors.address = 'Address is required';
    if (!companyData.city.trim()) errors.city = 'City is required';
    if (!companyData.state.trim()) errors.state = 'State is required';
    
    // if (!companyData.pincode.trim()) {
    //   errors.pincode = 'Pincode is required';
    // } else if (!/^[1-9][0-9]{5}$/.test(companyData.pincode)) {
    //   errors.pincode = 'Invalid pincode format';
    // }

    // if (companyData.currency !== 'INR') {
    //   if (!companyData.exchangeRate.trim()) {
    //     errors.exchangeRate = 'Exchange rate is required';
    //   } else if (isNaN(companyData.exchangeRate) || parseFloat(companyData.exchangeRate) <= 0) {
    //     errors.exchangeRate = 'Exchange rate must be a positive number';
    //   }
    // }

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
      processedValue = value.replace(/[^0-9]/g, '');
    }else if (name === 'zipCode') {
      processedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'email') {
      processedValue = formatEmail(value);
    } else if (name === 'exchangeRate') {
      processedValue = value.replace(/[^0-9.]/g, '');
      const parts = processedValue.split('.');
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else if (name === 'currency') {
      if (value === 'INR') {
        setCompanyData(prevState => ({
          ...prevState,
          currency: value,
          exchangeRate: '1'
        }));
        return;
      }
    } else if (name === 'contactPerson') {
      processedValue = value.replace(/[^a-zA-Z\s.'-]/g, '');
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
      alert("Successfully: Submit Vendor",)

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
          contactPerson: '',
          contactNumber: '',
          alternateNumber: '',
          email: '',
          currency: '',
          exchangeRate: '1',
          zipCode: '',

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
    const baseValidations = (
      companyData.name.trim() &&
      companyData.contactPerson.trim() &&
      companyData.address.trim() &&
      companyData.city.trim() &&
      companyData.state.trim() &&
      companyData.contactNumber.trim()
    );

    if (companyData.currency === 'INR') {
      return baseValidations;
    }
    
    return baseValidations && companyData.exchangeRate.trim();
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
      contactPerson: '',
      contactNumber: '',
      alternateNumber: '',
      email: '',
      currency: 'INR',
      exchangeRate: '1',
      zipCode: '',
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
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:py-6 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Success Message */}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircleSolid className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <strong className="font-medium text-green-800">Success!</strong>
              <p className="text-green-700 text-sm mt-0.5">{message}</p>
            </div>
            <button
              onClick={() => setMessage('')}
              className="text-green-500 hover:text-green-700 ml-2"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <strong className="font-medium text-red-800">Error!</strong>
              <p className="text-red-700 text-sm mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Form Header */}
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5 text-gray-700" />
                <h2 className="text-base sm:text-lg font-medium text-gray-900">Vendor Registration Form</h2>
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">
                <InformationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                All fields marked with * are required
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Basic Information Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-2">
                    <BuildingOffice2Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
                    <p className="text-gray-500 text-xs">Primary details about the vendor</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                  {/* Company Name */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <BuildingOffice2Icon className="h-3 w-3 mr-1 text-gray-400" />
                        Company Name <span className="text-red-500 ml-0.5">*</span>
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
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                          fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter company legal name"
                      />
                      <BuildingOffice2Icon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.name && (
                      <span className="text-red-600 text-xs mt-0.5 flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-0.5" />
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  {/* GST Number */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label htmlFor="gstNumber" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <DocumentTextIcon className="h-3 w-3 mr-1 text-gray-400" />
                        GST Number <span className="text-red-500 ml-0.5"></span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="gstNumber"
                        name="gstNumber"
                        value={companyData.gstNumber}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                          fieldErrors.gstNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="15-character GST number"
                        maxLength="15"
                      />
                      <DocumentTextIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.gstNumber && (
                      <span className="text-red-600 text-xs mt-0.5 flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-0.5" />
                        {fieldErrors.gstNumber}
                      </span>
                    )}
                  </div>

                  {/* Currency */}
                  <div className="md:col-span-1">
                    <label htmlFor="currency" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <CurrencyDollarIcon className="h-3 w-3 mr-1 text-gray-400" />
                        Currency <span className="text-red-500 ml-0.5"></span>
                      </span>
                    </label>
                    <div className="relative">

                      <select
                        id="currency"
                        name="currency"
                        value={companyData.currency}
                        onChange={handleChange}
                        className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm hover:border-gray-400 appearance-none bg-white cursor-pointer"
                      >
                        {currencyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <CurrencyDollarIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                      <ChevronDownIcon className="h-4 w-4 text-gray-400 absolute right-2.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Exchange Rate or INR Info */}
                  {/* {companyData.currency !== 'INR' ? (
                    <div className="md:col-span-1">
                      <label htmlFor="exchangeRate" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="h-3 w-3 mr-1 text-gray-400" />
                          Exchange Rate (to INR) <span className="text-red-500 ml-0.5">*</span>
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="exchangeRate"
                          name="exchangeRate"
                          value={companyData.exchangeRate}
                          onChange={handleChange}
                          required
                          className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                            fieldErrors.exchangeRate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder={`1 ${getCurrencySymbol(companyData.currency)} = ? ₹`}
                        />
                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                      </div>
                      {fieldErrors.exchangeRate && (
                        <span className="text-red-600 text-xs mt-0.5 flex items-center">
                          <XCircleIcon className="h-3 w-3 mr-0.5" />
                          {fieldErrors.exchangeRate}
                        </span>
                      )}
                      {!fieldErrors.exchangeRate && companyData.exchangeRate && !isNaN(companyData.exchangeRate) && (
                        <p className="text-green-600 text-xs mt-0.5 flex items-center">
                          <CheckCircleIcon className="h-3 w-3 mr-0.5" />
                          {getCurrencySymbol(companyData.currency)}1 = ₹{companyData.exchangeRate}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="md:col-span-2 lg:col-span-1">
                      <div className="bg-blue-50 border border-blue-100 rounded-md p-3 h-full">
                        <div className="flex items-start">
                          <InformationCircleIcon className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-blue-700 font-medium">INR Selected</p>
                            <p className="text-xs text-blue-600 mt-0.5">
                              Exchange rate is automatically set to 1 for Indian Rupee (base currency).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Address Details Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center mr-2">
                    <MapPinIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Address Details</h3>
                    <p className="text-gray-500 text-xs">Business location information</p>
                  </div>
                </div>

                {/* Address Textarea */}
                <div className="mb-4">
                  <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <MapPinIcon className="h-3 w-3 mr-1 text-gray-400" />
                      Complete Address <span className="text-red-500 ml-0.5">*</span>
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
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-sm ${
                        fieldErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter complete street address with landmark"
                    />
                    <MapPinIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>
                  {fieldErrors.address && (
                    <span className="text-red-600 text-xs mt-0.5 flex items-center">
                      <XCircleIcon className="h-3 w-3 mr-0.5" />
                      {fieldErrors.address}
                    </span>
                  )}
                </div>

                {/* Address Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* City */}
                  <div className="sm:col-span-1">
                    <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={companyData.city}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                        fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter city"
                    />
                    {fieldErrors.city && (
                      <span className="text-red-600 text-xs mt-0.5 flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-0.5" />
                        {fieldErrors.city}
                      </span>
                    )}
                  </div>

                  {/* State */}
                  <div className="sm:col-span-1">
                    <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={companyData.state}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                        fieldErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter state"
                    />
                    {fieldErrors.state && (
                      <span className="text-red-600 text-xs mt-0.5 flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-0.5" />
                        {fieldErrors.state}
                      </span>
                    )}
                  </div>

                  {/* Pincode */}
                  <div className="sm:col-span-1">
                    <label htmlFor="pincode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center justify-between">
                        Pincode <span className="text-red-500"></span>
                        {detectingState && (
                          <span className="text-xs text-blue-600 flex items-center">
                            <ArrowPathIcon className="h-3 w-3 mr-0.5 animate-spin" />
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
                      className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                        fieldErrors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="postal code"
                      maxLength="6"
                    />
                    {fieldErrors.pincode && (
                      <span className="text-red-600 text-xs mt-0.5 flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-0.5" />
                        {fieldErrors.pincode}
                      </span>
                    )}
                    {!fieldErrors.pincode && companyData.pincode.length === 6 && (
                      <p className="text-green-600 text-xs mt-0.5 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-0.5" />
                        Valid pincode format
                      </p>
                    )}
                  </div>
                   <div className="sm:col-span-1">
                    <label htmlFor="zipCode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      ZipCode <span className="text-red-500"></span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={companyData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                        fieldErrors.zipCode ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter Zip Code"
                    />
                    {fieldErrors.zipCode && (
                      <span className="text-red-600 text-xs mt-0.5 flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-0.5" />
                        {fieldErrors.zipCode}
                      </span>
                    )}
                  </div>

                  {/* Country Dropdown */}
                  <div className="sm:col-span-1 relative" ref={dropdownRef}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <GlobeAltIcon className="h-3 w-3 mr-1 text-gray-400" />
                        Country <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div 
                        className={`w-full px-3 py-2 border rounded-md bg-white cursor-pointer flex justify-between items-center transition-colors text-sm ${
                          showCountryDropdown ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={handleCountryDropdownToggle}
                        tabIndex={0}
                        role="button"
                        aria-expanded={showCountryDropdown}
                        aria-haspopup="listbox"
                      >
                        <span className="truncate flex items-center">
                          <GlobeAltIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                          {companyData.country}
                        </span>
                        <span className="text-gray-400 ml-1 text-xs">
                          {showCountryDropdown ? '▲' : '▼'}
                        </span>
                      </div>
                      
                      {showCountryDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">
                          <div className="p-2 border-b border-gray-200 bg-gray-50">
                            <div className="relative">
                              <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search countries..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                              />
                              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <div
                                  key={country}
                                  className={`px-3 py-2 cursor-pointer transition-colors flex items-center text-sm ${
                                    companyData.country === country 
                                      ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500' 
                                      : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                  onClick={() => handleCountrySelect(country)}
                                  role="option"
                                  aria-selected={companyData.country === country}
                                >
                                  {companyData.country === country && (
                                    <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-2" />
                                  )}
                                  <span className={companyData.country === country ? 'ml-0' : ''}>
                                    {country}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-gray-500 text-center text-sm">
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
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-2">
                    <PhoneIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Contact Information</h3>
                    <p className="text-gray-500 text-xs">Primary contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Contact Person Name */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label htmlFor="contactPerson" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <UserIcon className="h-3 w-3 mr-1 text-gray-400" />
                        Contact Person Name <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={companyData.contactPerson}
                        onChange={handleChange}
                        required
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                          fieldErrors.contactPerson ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="John Smith"
                      />
                      <UserIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.contactPerson && (
                      <span className="text-red-600 text-xs mt-0.5 flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-0.5" />
                        {fieldErrors.contactPerson}
                      </span>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label htmlFor="contactNumber" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <PhoneIcon className="h-3 w-3 mr-1 text-gray-400" />
                        Contact Number <span className="text-red-500 ml-0.5">*</span>
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
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                          fieldErrors.contactNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="contact number"
                      />
                      <PhoneIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                  
                  </div>

                  {/* Email Address */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <EnvelopeIcon className="h-3 w-3 mr-1 text-gray-400" />
                        Email Address
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={companyData.email}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                          fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="company@example.com"
                      />
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors.email && (
                      <span className="text-red-600 text-xs mt-0.5 flex items-center">
                        <XCircleIcon className="h-3 w-3 mr-0.5" />
                        {fieldErrors.email}
                      </span>
                    )}
                    {!fieldErrors.email && companyData.email.includes('@') && companyData.email.includes('.') && (
                      <p className="text-green-600 text-xs mt-0.5 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-0.5" />
                        Valid email format
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                  <div className="text-xs text-gray-500 flex items-center w-full md:w-auto">
                    <InformationCircleIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>
                      {isFormValid() ? (
                        <span className="text-green-600 font-medium">All required fields are filled</span>
                      ) : (
                        <span>Please fill all required fields marked with *</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={clearForm}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <TrashIcon className="h-4 w-4 mr-1.5" />
                      Clear Form
                    </button>
                    
                    <Button
                      type="submit"
                      title={loading ? 'Adding Vendor...' : 'Add Vendor'}
                      disabled={loading || !isFormValid()}
                      variant="default"
                      className="px-4 py-2 rounded-md font-medium flex items-center justify-center text-sm"
                      onClick={null}
                    >
                      {loading && <ArrowPathIcon className="animate-spin h-4 w-4 mr-1.5" />}
                      {!loading && <CheckCircleIcon className="h-4 w-4 mr-1.5" />}
                      <span>{loading ? 'Adding...' : 'Add Vendor'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-gray-500">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-1.5 sm:gap-3">
            <span className="flex items-center text-xs">
              <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
              Data is securely stored
            </span>
            <span className="hidden sm:inline text-xs">•</span>
            <span className="flex items-center text-xs">
              <GlobeAltIcon className="h-3 w-3 text-blue-500 mr-1" />
              Supports international vendors
            </span>
            <span className="hidden sm:inline text-xs">•</span>
            <span className="flex items-center text-xs">
              <DocumentTextIcon className="h-3 w-3 text-purple-500 mr-1" />
              GST validation included
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVendor;