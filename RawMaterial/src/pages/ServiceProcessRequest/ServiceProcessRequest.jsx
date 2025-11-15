import React, { useState, useEffect } from 'react'
import './ServiceProcessRequest.css'
import Api from '../../auth/Api'

const ServiceProcessRequest = () => {
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([])
  const [defectiveItems, setDefectiveItems] = useState([])
  const [loading, setLoading] = useState({
    products: true,
    items: false,
    defectiveItems: false
  })
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedDefectiveItem, setSelectedDefectiveItem] = useState('')
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false)
  const [isDefectiveDropdownOpen, setIsDefectiveDropdownOpen] = useState(false)
  
  // Input fields state
  const [serialNumber, setSerialNumber] = useState('')
  const [quantity, setQuantity] = useState('')

  // Fetch products on component mount
  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }))
      setError(null)
      
      const response = await Api.get('/common/getProduct')
      setProducts(response?.data?.data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(prev => ({ ...prev, products: false }))
    }
  }

  // Fetch items based on selected product
  const fetchItemsByProductId = async (productId) => {
    try {
      setLoading(prev => ({ ...prev, items: true }))
      setError(null)
      setItems([])
      setSelectedItem('')
      setDefectiveItems([])
      setSelectedDefectiveItem('')
      
      const response = await Api.get(`/common/getItemsByProductId?productId=${productId}`)
      setItems(response?.data?.data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch items')
      setItems([])
    } finally {
      setLoading(prev => ({ ...prev, items: false }))
    }
  }

  // Fetch defective items based on selected item
  const fetchDefectiveItems = async (itemName) => {
    try {
      setLoading(prev => ({ ...prev, defectiveItems: true }))
      setError(null)
      setDefectiveItems([])
      setSelectedDefectiveItem('')
      
      const response = await Api.get(`/common/showDefectiveItemsList?itemName=${encodeURIComponent(itemName)}`)
      setDefectiveItems(response?.data?.data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch defective items')
      setDefectiveItems([])
    } finally {
      setLoading(prev => ({ ...prev, defectiveItems: false }))
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setIsProductDropdownOpen(false)
    setSelectedItem('')
    setItems([])
    setDefectiveItems([])
    setSelectedDefectiveItem('')
    setSerialNumber('')
    setQuantity('')
    
    // Fetch items for the selected product
    if (product?.id) {
      fetchItemsByProductId(product.id)
    }
  }

  const handleItemSelect = (item) => {
    setSelectedItem(item)
    setIsItemDropdownOpen(false)
    setDefectiveItems([])
    setSelectedDefectiveItem('')
    setSerialNumber('')
    setQuantity('')
    
    // Fetch defective items for the selected item
    if (item?.name) {
      fetchDefectiveItems(item.name)
    }
  }

  const handleDefectiveItemSelect = (defectiveItem) => {
    setSelectedDefectiveItem(defectiveItem)
    setIsDefectiveDropdownOpen(false)
    // Reset quantity when defective item changes
    setQuantity('')
  }

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen)
    setIsItemDropdownOpen(false)
    setIsDefectiveDropdownOpen(false)
  }

  const toggleItemDropdown = () => {
    if (items.length > 0) {
      setIsItemDropdownOpen(!isItemDropdownOpen)
      setIsProductDropdownOpen(false)
      setIsDefectiveDropdownOpen(false)
    }
  }

  const toggleDefectiveDropdown = () => {
    if (defectiveItems.length > 0) {
      setIsDefectiveDropdownOpen(!isDefectiveDropdownOpen)
      setIsProductDropdownOpen(false)
      setIsItemDropdownOpen(false)
    }
  }

  const handleSerialNumberChange = (e) => {
    setSerialNumber(e.target.value)
  }

  const handleQuantityChange = (e) => {
    const value = e.target.value
    // Allow only numbers
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!selectedDefectiveItem) {
      alert('Please select a defective item')
      return
    }
    
    if (!serialNumber.trim()) {
      alert('Please enter a serial number')
      return
    }
    
    if (!quantity || parseInt(quantity) <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    // Check if quantity exceeds available defective count
    if (parseInt(quantity) > selectedDefectiveItem.defective) {
      alert(`Quantity cannot exceed available defective count (${selectedDefectiveItem.defective})`)
      return
    }

    // Prepare data for submission
    const formData = {
      product: selectedProduct.productName,
      item: selectedItem.name,
      defectiveItem: selectedDefectiveItem.itemName,
      defectiveItemId: selectedDefectiveItem._id,
      serialNumber: serialNumber.trim(),
      quantity: parseInt(quantity),
      timestamp: new Date().toISOString()
    }

    console.log('Form Data:', formData)
    // Here you would typically send the data to your API
    alert('Service request submitted successfully!')
    
    // Reset form
    setSerialNumber('')
    setQuantity('')
  }

  const getSelectedProductName = () => {
    if (!selectedProduct) return 'Select Product'
    return selectedProduct.productName
  }

  const getSelectedItemName = () => {
    if (!selectedItem) return 'Select Item'
    return selectedItem.name
  }

  const getSelectedDefectiveItemName = () => {
    if (!selectedDefectiveItem) return 'Select Defective Item'
    return `${selectedDefectiveItem.itemName}`
  }

  if (loading.products) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading products...</div>
      </div>
    )
  }

  if (error && !selectedProduct) {
    return (
      <div className="error-container">
        <div className="error-message">
          <strong>Error: </strong> {error}
        </div>
      </div>
    )
  }

  return (
    <div className="service-process-container">
      <div className="header-section">
        <h1 className="page-title">Service Process Request</h1>
      </div>

      {/* All three dropdowns in one line */}
      <div className="dropdowns-row">
        {/* Product Dropdown */}
        <div className="dropdown-column">
          <label className="dropdown-label">Product</label>
          <div className="dropdown-container">
            <div 
              className="dropdown-header"
              onClick={toggleProductDropdown}
            >
              <span className="dropdown-selected-text">
                {getSelectedProductName()}
              </span>
              <span className="dropdown-arrow">
                {isProductDropdownOpen ? '▲' : '▼'}
              </span>
            </div>

            {isProductDropdownOpen && (
              <div className="dropdown-list">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`dropdown-item ${
                      selectedProduct && selectedProduct.id === product.id ? 'dropdown-item-selected' : ''
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <span className="dropdown-item-name">{product.productName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Item Dropdown */}
        <div className="dropdown-column">
          <label className="dropdown-label">Item</label>
          <div className="dropdown-container">
            <div 
              className={`dropdown-header ${items.length === 0 ? 'dropdown-disabled' : ''}`}
              onClick={toggleItemDropdown}
            >
              <span className="dropdown-selected-text">
                {loading.items ? 'Loading...' : getSelectedItemName()}
              </span>
              <span className="dropdown-arrow">
                {isItemDropdownOpen ? '▲' : '▼'}
              </span>
            </div>

            {isItemDropdownOpen && items.length > 0 && (
              <div className="dropdown-list">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`dropdown-item ${
                      selectedItem && selectedItem.id === item.id ? 'dropdown-item-selected' : ''
                    }`}
                    onClick={() => handleItemSelect(item)}
                  >
                    <span className="dropdown-item-name">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Defective Items Dropdown */}
        <div className="dropdown-column">
          <label className="dropdown-label">Defective Item</label>
          <div className="dropdown-container">
            <div 
              className={`dropdown-header ${defectiveItems.length === 0 ? 'dropdown-disabled' : ''}`}
              onClick={toggleDefectiveDropdown}
            >
              <span className="dropdown-selected-text">
                {loading.defectiveItems ? 'Loading...' : getSelectedDefectiveItemName()}
              </span>
              <span className="dropdown-arrow">
                {isDefectiveDropdownOpen ? '▲' : '▼'}
              </span>
            </div>

            {isDefectiveDropdownOpen && defectiveItems.length > 0 && (
              <div className="dropdown-list">
                {defectiveItems.map((defectiveItem, index) => (
                  <div
                    key={`${defectiveItem._id}-${index}`}
                    className={`dropdown-item ${
                      selectedDefectiveItem && selectedDefectiveItem._id === defectiveItem._id && selectedDefectiveItem.itemName === defectiveItem.itemName ? 'dropdown-item-selected' : ''
                    }`}
                    onClick={() => handleDefectiveItemSelect(defectiveItem)}
                  >
                    <span className="dropdown-item-name">{defectiveItem.itemName}</span>
                    <span className={`defective-count ${defectiveItem.defective > 0 ? 'defective-count-high' : 'defective-count-zero'}`}>
                      {defectiveItem.defective}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Fields Row */}
      {selectedDefectiveItem && (
        <div className="input-fields-row">
          <div className="input-column">
            <label className="input-label">Serial Number *</label>
            <input
              type="text"
              value={serialNumber}
              onChange={handleSerialNumberChange}
              placeholder="Enter serial number"
              className="input-field"
              required
            />
          </div>

          <div className="input-column">
            <div className="quantity-container">
              <label className="input-label">Quantity *</label>
              <div className="quantity-input-wrapper">
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter quantity"
                  className="input-field"
                  required
                />
                <div className="available-defective-info">
                  Available defective: <span className="available-count">{selectedDefectiveItem.defective}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="submit-column">
            <button 
              type="button" 
              onClick={handleSubmit}
              className="submit-button"
              disabled={!serialNumber.trim() || !quantity || parseInt(quantity) <= 0}
            >
              Submit Request
            </button>
          </div>
        </div>
      )}
      {/* Loading and Error States */}
      {loading.items && (
        <div className="loading-indicator">Loading items...</div>
      )}

      {loading.defectiveItems && (
        <div className="loading-indicator">Loading defective items...</div>
      )}

      {!loading.defectiveItems && selectedItem && defectiveItems.length === 0 && (
        <div className="no-data-message">
          No defective items found for {selectedItem.name}
        </div>
      )}

      {error && selectedProduct && (
        <div className="error-container">
          <div className="error-message">
            <strong>Error: </strong> {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceProcessRequest