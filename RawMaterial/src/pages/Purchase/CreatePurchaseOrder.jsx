import React, { useState, useEffect, useRef } from "react";
import Api from "../../auth/Api";
import { useLocation } from "react-router-dom";
import { removeStartingZero } from "../../utils/number/removeStartingZero";

const CreatePurchaseOrder = () => {
  const location = useLocation();

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [vendorsList, setVendorsList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");

  const [selectedGstType, setSelectedGstType] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("");
  const [warranty, setWarranty] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [cellNo, setCellNo] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState("1.00");
  const [gstRate, setGstRate] = useState("");
  const [itemList, setItemList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [itemDetails, setItemDetails] = useState([
    {
      id: 1,
      selectedItem: "",
      hsnCode: "",
      modelNumber: "",
      selectedUnit: "",
      rate: "",
      quantity: "",
      gstRate: "",
      amount: "",
      taxableAmount: 0,
      gstAmount: 0,
      totalAmount: 0,
      itemDetail: "",
    },
  ]);

  const [otherCharges, setOtherCharges] = useState([
    {
      id: 1,
      name: "",
      amount: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [processingReorder, setProcessingReorder] = useState(false);
  const [pendingReorderItems, setPendingReorderItems] = useState([]);
  const [isItemListLoaded, setIsItemListLoaded] = useState(false);
  const [skipCalculation, setSkipCalculation] = useState({});
  const [showOtherCharges, setShowOtherCharges] = useState(false);

  // Add state for tracking loading status for individual items
  const [loadingItems, setLoadingItems] = useState({});

  // Add state for tracking if HSN code should be editable
  const [editableHsn, setEditableHsn] = useState({});

  // Make unitTypes state modifiable - start as empty array
  const [unitTypes, setUnitTypes] = useState([]);

  // Add state for dropdown visibility and search query
  const [openItemDropdown, setOpenItemDropdown] = useState(null); // Track which item dropdown is open
  const [searchQuery, setSearchQuery] = useState({}); // Store search query per item
  const dropdownRefs = useRef({});

  const currencyOptions = [
    { value: "INR", label: "INR" },
    { value: "USD", label: "USD" },
    { value: "CNY", label: "CNY" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "AED", label: "AED" },
  ];

  const gstTypes = [
    { value: "IGST_5", label: "IGST 5%" },
    { value: "IGST_12", label: "IGST 12%" },
    { value: "IGST_18", label: "IGST 18%" },
    { value: "IGST_28", label: "IGST 28%" },
    { value: "IGST_EXEMPTED", label: "IGST Exempted" },
    { value: "LGST_5", label: "LGST 5%" },
    { value: "LGST_12", label: "LGST 12%" },
    { value: "LGST_18", label: "LGST 18%" },
    { value: "LGST_28", label: "LGST 28%" },
    { value: "LGST_EXEMPTED", label: "LGST Exempted" },
    { value: "IGST_ITEMWISE", label: "IGST Itemwise" },
    { value: "LGST_ITEMWISE", label: "LGST Itemwise" },
  ];

  const isItemWiseGST =
    selectedGstType === "IGST_ITEMWISE" || selectedGstType === "LGST_ITEMWISE";

  // Get currency symbol
  const getCurrencySymbol = (curr) => {
    const currency = currencyOptions.find((c) => c.value === curr);
    return currency ? currency.label.match(/\((.*?)\)/)?.[1] || "" : "₹";
  };

  // Extract GST rate from GST type (e.g., IGST_5 -> 5)
  const getFixedGSTRate = () => {
    if (selectedGstType.includes("EXEMPTED")) return 0;
    const rateMatch = selectedGstType.match(/(\d+)/);
    return rateMatch ? parseFloat(rateMatch[1]) : 0;
  };

  // Fetch units from API
  const fetchUnits = async () => {
    try {
      const response = await Api.get("/common/unit/view");
      if (response.data.success) {
        // Transform the API response to match our format {value, label}
        const formattedUnits = response.data.data.map((unit) => ({
          value: unit.name,
          label: unit.name,
          id: unit.id, // Keep the ID for reference if needed
        }));
        setUnitTypes(formattedUnits);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      // Fallback to static units if API fails
    }
  };

  // Add useEffect to handle adding custom units from API responses
  useEffect(() => {
    // Check if any items have units not in unitTypes
    const customUnits = itemDetails
      .map((item) => item.selectedUnit)
      .filter(
        (unit) =>
          unit && unit.trim() && !unitTypes.some((u) => u.value === unit)
      )
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

    if (customUnits.length > 0) {
      // Add custom units to unitTypes
      const newUnitTypes = [...unitTypes];
      let addedUnits = false;

      customUnits.forEach((unit) => {
        if (!newUnitTypes.some((u) => u.value === unit)) {
          newUnitTypes.push({ value: unit, label: unit });
          addedUnits = true;
        }
      });

      if (addedUnits) {
        setUnitTypes(newUnitTypes);
      }
    }
  }, [itemDetails, unitTypes]);

  // Helper function to check and log unit issues
  const checkUnitStatus = (item) => {
    if (item.selectedItem && !item.selectedUnit) {
      console.log(`Warning: Item ${item.selectedItem} has no unit set.`);
    }
  };

  // Call this function in useEffect to check unit status
  useEffect(() => {
    itemDetails.forEach((item) => {
      if (item.selectedItem) {
        checkUnitStatus(item);
      }
    });
  }, [itemDetails]);

  const fetchWarehouses = async () => {
    try {
      const res = await Api.get(`/purchase/warehouses`);
      const formatted = res?.data?.data?.map((w) => ({
        label: w.warehouseName,
        value: w._id,
      }));
      setWarehouseList(formatted);
    } catch (err) {
      alert("Error loading warehouses");
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/purchase/companies");
      setCompanies(response?.data?.data || []);
    } catch (error) {
      alert("Error: " + (error?.response?.data?.message || error?.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/purchase/vendors");
      setVendorsList(response?.data?.data || []);
    } catch (error) {
      alert("Error: " + (error?.response?.data?.message || error?.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchItemList = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/purchase/items");
      setItemList(response?.data?.items || []);
      setIsItemListLoaded(true);
    } catch (error) {
      alert("Error: " + (error?.response?.data?.message || error?.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle reorder data from ShowPurchaseOrder
  useEffect(() => {
    if (location.state?.reorderData) {
      const reorderData = location.state.reorderData;
      console.log("Received reorder data:", reorderData);

      // Set basic information
      setSelectedCompany(reorderData.companyId);
      setSelectedVendor(reorderData.vendorId);
      setSelectedGstType(reorderData.gstType);
      setCurrency(reorderData.currency || "INR");
      setExchangeRate(reorderData.exchangeRate || "1.00");
      setPaymentTerms(reorderData.paymentTerms || "");
      setDeliveryTerms(reorderData.deliveryTerms || "");
      setWarranty(reorderData.warranty || "");
      setContactPerson(reorderData.contactPerson || "");
      setCellNo(reorderData.cellNo || "");
      setSelectedWarehouse(reorderData.warehouseId || "");

      // Store items for processing after itemList is loaded
      if (reorderData.items && reorderData.items.length > 0) {
        setPendingReorderItems(reorderData.items);
      }

      // Set other charges
      if (reorderData.otherCharges && reorderData.otherCharges.length > 0) {
        const mappedCharges = reorderData.otherCharges.map((charge, index) => ({
          id: index + 1,
          name: charge.name || "",
          amount: charge.amount || "",
        }));
        setOtherCharges(mappedCharges);
        setShowOtherCharges(true)
      }
    }
  }, [location.state]);

  // Process reorder items when itemList is loaded
  useEffect(() => {
    if (pendingReorderItems.length > 0 && isItemListLoaded) {
      setProcessingReorder(true);

      const mappedItems = pendingReorderItems.map((item, index) => {
        // Try to find the item in itemList
        let foundItem = null;

        // First try by ID
        if (item.itemId || item.id) {
          foundItem = itemList.find(
            (i) => String(i.id) === String(item.itemId || item.id)
          );
        }

        // If not found by ID, try by name
        if (!foundItem && item.itemName) {
          foundItem = itemList.find(
            (i) =>
              i.name.toLowerCase().includes(item.itemName.toLowerCase()) ||
              (item.itemName &&
                i.name.toLowerCase() === item.itemName.toLowerCase())
          );
        }

        // Calculate amounts
        const rate = parseFloat(item.rate) || 0;
        const quantity = parseFloat(item.quantity) || 1;
        const total = rate * quantity;

        // For itemwise GST, use item's gstRate, otherwise use fixed rate from GST type
        let itemGstRate = 0;
        if (isItemWiseGST) {
          itemGstRate = parseFloat(item.gstRate) || 0;
        } else {
          itemGstRate = getFixedGSTRate();
        }

        const gstAmount = (total * itemGstRate) / 100;

        return {
          id: index + 1,
          selectedItem: foundItem?.id || "",
          hsnCode: foundItem?.hsnCode || item.hsnCode || "",
          modelNumber: foundItem?.modelNumber || item.modelNumber || "",
          selectedUnit: foundItem?.unit || item.unit || "",
          rate: rate.toString(),
          quantity: quantity.toString(),
          gstRate: itemGstRate.toString(),
          amount: total.toString(),
          taxableAmount: total,
          gstAmount: gstAmount,
          totalAmount: total + gstAmount,
          itemDetail: foundItem?.itemDetail || item.itemDetail || "",
        };
      });

      setItemDetails(mappedItems);
      setPendingReorderItems([]);

      // Show success message
      setTimeout(() => {
        setProcessingReorder(false);
        console.log("Reorder items processed:", mappedItems);
      }, 500);
    }
  }, [isItemListLoaded, pendingReorderItems, selectedGstType, itemList]);

  // Reset exchange rate when currency changes
  useEffect(() => {
    if (currency === "INR") {
      setExchangeRate("1.00");
    } else {
      setExchangeRate("");
    }
  }, [currency]);

  const addItemDetail = () => {
    const newId = itemDetails.length + 1;
    setItemDetails([
      ...itemDetails,
      {
        id: newId,
        selectedItem: "",
        hsnCode: "",
        modelNumber: "",
        selectedUnit: "",
        rate: "",
        quantity: "",
        gstRate: "",
        amount: "",
        taxableAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        itemDetail: "",
      },
    ]);
  };

  const removeItemDetail = (id) => {
    if (itemDetails.length > 1) {
      setItemDetails(itemDetails.filter((item) => item.id !== id));
      // Remove loading state for removed item
      setLoadingItems((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      // Remove editable HSN state
      setEditableHsn((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const addOtherCharge = () => {
    const newId = otherCharges.length + 1;
    setOtherCharges([
      ...otherCharges,
      {
        id: newId,
        name: "",
        amount: "",
      },
    ]);
  };

  const removeOtherCharge = (id) => {
    if (otherCharges.length > 1) {
      setOtherCharges(otherCharges.filter((charge) => charge.id !== id));
    }
  };

  const updateOtherCharge = (id, field, value) => {
    setOtherCharges(
      otherCharges.map((charge) => {
        if (charge.id === id) {
          return { ...charge, [field]: value };
        }
        return charge;
      })
    );
  };

  // Calculate missing value among rate, quantity, and amount
  const calculateMissingValue = (rate, quantity, amount) => {
    const r = rate === "" ? 0 : parseFloat(rate) || 0;
    const q = quantity === "" ? 0 : parseFloat(quantity) || 0;
    const a = amount === "" ? 0 : parseFloat(amount) || 0;

    // Count how many valid (non-empty) values we have
    const rateValid = rate !== "" && !isNaN(r) && r > 0;
    const quantityValid = quantity !== "" && !isNaN(q) && q > 0;
    const amountValid = amount !== "" && !isNaN(a) && a > 0;

    const validCount = [rateValid, quantityValid, amountValid].filter(
      Boolean
    ).length;

    // Only calculate if we have exactly 2 valid values
    if (validCount === 2) {
      if (rateValid && quantityValid && !amountValid) {
        // Calculate amount from rate and quantity
        return { amount: r * q, rate: r, quantity: q };
      } else if (rateValid && amountValid && !quantityValid) {
        // Calculate quantity from rate and amount
        return { amount: a, rate: r, quantity: a / r };
      } else if (quantityValid && amountValid && !rateValid) {
        // Calculate rate from quantity and amount
        return { amount: a, rate: a / q, quantity: q };
      }
    }

    // If all three are valid, recalculate amount for consistency
    if (validCount === 3) {
      return { amount: r * q, rate: r, quantity: q };
    }

    // Otherwise, return as-is (allowing partial inputs)
    return { amount: a, rate: r, quantity: q };
  };

  const calculateItemAmounts = (item) => {
    const rate = item.rate || 0;
    const quantity = item.quantity || 0;
    const amount = item.amount || 0;

    // Calculate missing values
    const calculated = calculateMissingValue(rate, quantity, amount);

    const total = calculated.amount;

    let gstRate = 0;

    if (isItemWiseGST) {
      gstRate = parseFloat(item.gstRate) || 0;
    } else {
      gstRate = getFixedGSTRate();
    }

    const taxableAmount = total;
    const gstAmount = (taxableAmount * gstRate) / 100;
    const finalTotalAmount = taxableAmount + gstAmount;

    return {
      amount: total,
      rate: calculated.rate,
      quantity: calculated.quantity,
      taxableAmount,
      gstAmount,
      totalAmount: finalTotalAmount,
      gstRate: gstRate.toString(),
    };
  };

  // Updated handleItemSelect with HSN code handling
  const handleItemSelect = async (id, itemId) => {
    console.log(`Item changed: ${itemId} for item ${id}`);

    if (!itemId) {
      // If item is cleared, reset all fields including HSN
      setItemDetails(
        itemDetails.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              selectedItem: "",
              hsnCode: "",
              modelNumber: "",
              selectedUnit: "", // Reset unit to empty
              rate: "",
              itemDetail: "",
            };
          }
          return item;
        })
      );

      // Reset editable HSN state for this item
      setEditableHsn((prev) => ({ ...prev, [id]: false }));

      // Clear loading state
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
      return;
    }

    const selectedItemData = itemList.find((item) => item.id === itemId);
    if (selectedItemData) {
      // Set loading state for this specific item
      setLoadingItems((prev) => ({ ...prev, [id]: true }));

      try {
        // Check if item has HSN code
        const hasHsnCode =
          selectedItemData.hsnCode && selectedItemData.hsnCode.trim() !== "";

        // First, update with basic information from itemList
        let updatedItemDetails = itemDetails.map((item) => {
          if (item.id === id) {
            const updatedItem = {
              ...item,
              selectedItem: itemId,
              hsnCode: hasHsnCode ? selectedItemData.hsnCode : "", // Only set if exists
              modelNumber: selectedItemData.modelNumber || "",
              selectedUnit: "", // RESET TO EMPTY - will be updated by API
              rate: selectedItemData.rate || "",
              itemDetail: selectedItemData.itemDetail || "",
            };

            const calculatedAmounts = calculateItemAmounts(updatedItem);
            return {
              ...updatedItem,
              rate: calculatedAmounts.rate.toString(),
              quantity: calculatedAmounts.quantity.toString(),
              amount: calculatedAmounts.amount.toString(),
              taxableAmount: calculatedAmounts.taxableAmount,
              gstAmount: calculatedAmounts.gstAmount,
              totalAmount: calculatedAmounts.totalAmount,
            };
          }
          return item;
        });

        setItemDetails(updatedItemDetails);

        // Set editable state for HSN
        setEditableHsn((prev) => ({
          ...prev,
          [id]: !hasHsnCode, // Editable if no HSN code exists
        }));

        // Fetch detailed item information from the API
        try {
          const response = await Api.get(`/purchase/items/details/${itemId}`);

          if (response.data.success) {
            const detailedItem = response.data.item;

            // Check if API provides HSN code
            const apiHasHsnCode =
              detailedItem.hsnCode && detailedItem.hsnCode.trim() !== "";

            // Update item with detailed information from API
            setItemDetails((prevItemDetails) =>
              prevItemDetails.map((item) => {
                if (item.id === id) {
                  // Use API's unit if available and not empty, otherwise keep empty
                  const apiUnit = detailedItem.unit;
                  let newUnit = "";

                  if (
                    apiUnit !== undefined &&
                    apiUnit !== null &&
                    apiUnit.toString().trim() !== ""
                  ) {
                    newUnit = apiUnit.toString().trim();
                  }

                  // Use API's description if available and not empty, otherwise keep empty
                  const apiDescription = detailedItem.description;
                  let newDescription = "";

                  if (
                    apiDescription !== undefined &&
                    apiDescription !== null &&
                    apiDescription.toString().trim() !== ""
                  ) {
                    newDescription = apiDescription.toString().trim();
                  }

                  // Use API's HSN code if available, otherwise keep existing
                  let newHsnCode = item.hsnCode;
                  if (apiHasHsnCode) {
                    newHsnCode = detailedItem.hsnCode.trim();
                  }

                  console.log(`API Response for item ${itemId}:`, {
                    source: response.data.source,
                    apiUnit,
                    apiDescription,
                    apiHsnCode: detailedItem.hsnCode,
                    newUnit,
                    newDescription,
                    newHsnCode,
                  });

                  const updatedItem = {
                    ...item,
                    selectedUnit: newUnit,
                    itemDetail: newDescription,
                    hsnCode: newHsnCode,
                  };

                  // Update editable HSN state based on API response
                  setEditableHsn((prev) => ({
                    ...prev,
                    [id]: !apiHasHsnCode, // Editable if no HSN code from API
                  }));

                  // Recalculate amounts if needed
                  const calculatedAmounts = calculateItemAmounts(updatedItem);

                  return {
                    ...updatedItem,
                    rate: calculatedAmounts.rate.toString(),
                    quantity: calculatedAmounts.quantity.toString(),
                    amount: calculatedAmounts.amount.toString(),
                    taxableAmount: calculatedAmounts.taxableAmount,
                    gstAmount: calculatedAmounts.gstAmount,
                    totalAmount: calculatedAmounts.totalAmount,
                  };
                }
                return item;
              })
            );

            // Show notification if data was fetched from API
            console.log(
              `Item ${id}: Loaded from ${response.data.source} - unit="${detailedItem.unit}", description="${detailedItem.description}", HSN="${detailedItem.hsnCode}"`
            );
          }
        } catch (apiError) {
          console.error("Error fetching item details:", apiError);
          // Continue with itemList data if API fails
        }
      } catch (error) {
        console.error("Error in handleItemSelect:", error);
      } finally {
        // Clear loading state
        setLoadingItems((prev) => ({ ...prev, [id]: false }));
      }
    } else {
      // If item not found in itemList, reset HSN
      setItemDetails(
        itemDetails.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              selectedItem: itemId,
              selectedUnit: "", // Reset unit to empty
              hsnCode: "", // Reset HSN code
            };
          }
          return item;
        })
      );

      // Set HSN as editable
      setEditableHsn((prev) => ({ ...prev, [id]: true }));

      setLoadingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Function to toggle HSN edit mode
  const toggleHsnEditMode = (itemId) => {
    setEditableHsn((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Function to handle HSN code change
  const handleHsnCodeChange = (itemId, value) => {
    setItemDetails(
      itemDetails.map((item) => {
        if (item.id === itemId) {
          return { ...item, hsnCode: value };
        }
        return item;
      })
    );
  };

  const updateItemDetail = (id, field, value) => {
    // If clearing a value, mark that we should skip calculation temporarily
    if (
      value === "" &&
      (field === "rate" || field === "quantity" || field === "amount")
    ) {
      setSkipCalculation((prev) => ({ ...prev, [id]: true }));

      // Clear the skip after a short delay
      setTimeout(() => {
        setSkipCalculation((prev) => ({ ...prev, [id]: false }));
      }, 100);
    }

    setItemDetails(
      itemDetails.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // If we're currently in skip calculation mode for this item, just update the field
          if (
            skipCalculation[id] &&
            (field === "rate" || field === "quantity" || field === "amount")
          ) {
            return updatedItem;
          }

          // If any of the three main fields change, recalculate
          if (field === "rate") {
            const newAmount = Number(value) * Number(updatedItem.quantity || 0);

            return {
              ...updatedItem,
              rate: value,
              amount: Number(newAmount.toFixed(3)),
            };
          }
          if (field === "amount") {
            const newRate = Number(value) / Number(updatedItem.quantity);
            return {
              ...updatedItem,
              rate: Number(newRate.toFixed(3)),
              amount: value,
            };
          }
          if (field === "quantity") {
            const newAmount = Number(value) * Number(updatedItem.rate);
            const newValue = Number(removeStartingZero(value));
            return {
              ...updatedItem,
              quantity: value,
              amount: Number(newAmount.toFixed(3)),
            };
          }
          // For GST rate changes (only for itemwise GST)
          if (isItemWiseGST && field === "gstRate") {
            const calculatedAmounts = calculateItemAmounts(updatedItem);
            return {
              ...updatedItem,
              gstRate: value,
              taxableAmount: calculatedAmounts.taxableAmount,
              gstAmount: calculatedAmounts.gstAmount,
              totalAmount: calculatedAmounts.totalAmount,
            };
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Recalculate item amounts when GST type changes
  useEffect(() => {
    if (selectedGstType) {
      setItemDetails(
        itemDetails.map((item) => {
          const calculatedAmounts = calculateItemAmounts(item);
          return {
            ...item,
            taxableAmount: calculatedAmounts.taxableAmount,
            gstAmount: calculatedAmounts.gstAmount,
            totalAmount: calculatedAmounts.totalAmount,
            gstRate: calculatedAmounts.gstRate,
          };
        })
      );
    }
  }, [selectedGstType]);

  // Initialize search query for each item
  useEffect(() => {
    const initialSearchQueries = {};
    itemDetails.forEach((item) => {
      initialSearchQueries[item.id] = "";
    });
    setSearchQuery(initialSearchQueries);
  }, [itemDetails]);

  // Filter items based on search query for each dropdown
  const getFilteredItems = (itemId) => {
    const query = searchQuery[itemId] || "";
    if (!query.trim()) return itemList;

    return itemList.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.hsnCode &&
          item.hsnCode.toLowerCase().includes(query.toLowerCase())) ||
        (item.modelNumber &&
          item.modelNumber.toLowerCase().includes(query.toLowerCase()))
    );
  };

  // Handle search input change
  const handleSearchChange = (itemId, value) => {
    setSearchQuery((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  // Toggle dropdown for specific item
  const toggleItemDropdown = (itemId) => {
    if (openItemDropdown === itemId) {
      setOpenItemDropdown(null);
      // Clear search query when closing
      setSearchQuery((prev) => ({ ...prev, [itemId]: "" }));
    } else {
      setOpenItemDropdown(itemId);
      // Initialize search query if not exists
      if (!searchQuery[itemId]) {
        setSearchQuery((prev) => ({ ...prev, [itemId]: "" }));
      }
    }
  };

  // Handle item selection from dropdown
  const handleItemSelectFromDropdown = async (itemId, selectedItemId) => {
    await handleItemSelect(itemId, selectedItemId);
    setOpenItemDropdown(null);
    // Clear search query after selection
    setSearchQuery((prev) => ({ ...prev, [itemId]: "" }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      let isOutside = true;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          isOutside = false;
        }
      });

      if (isOutside) {
        setOpenItemDropdown(null);
        // Clear all search queries when closing dropdown
        const clearedQueries = {};
        itemDetails.forEach((item) => {
          clearedQueries[item.id] = "";
        });
        setSearchQuery(clearedQueries);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [itemDetails]);

  const itemTotals = itemDetails.reduce(
    (acc, item) => {
      return {
        amount: acc.amount + (parseFloat(item.amount) || 0),
        taxableAmount:
          acc.taxableAmount + (parseFloat(item.taxableAmount) || 0),
        gstAmount: acc.gstAmount + (parseFloat(item.gstAmount) || 0),
        totalAmount: acc.totalAmount + (parseFloat(item.totalAmount) || 0),
      };
    },
    { amount: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 }
  );

  const otherChargesTotal = otherCharges.reduce((total, charge) => {
    return total + (parseFloat(charge.amount) || 0);
  }, 0);

  const finalTotals = {
    amount: itemTotals.amount,
    taxableAmount: itemTotals.taxableAmount,
    gstAmount: itemTotals.gstAmount,
    otherCharges: otherChargesTotal,
    totalAmount:
      itemTotals.taxableAmount + itemTotals.gstAmount + otherChargesTotal,
  };

  const handleDownload = async (poId) => {
    if (!poId) return;

    setDownloadLoading(true);
    try {
      const response = await Api.post(
        `/purchase/purchase-orders/download/${poId}`,
        {},
        {
          responseType: "blob",
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;

      // Get filename from content-disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      let fileName = `${poId}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadLoading(false);
    } catch (error) {
      console.error("Error downloading purchase order:", error);
      alert(
        "Error downloading purchase order: " +
          (error?.response?.data?.message || error?.message)
      );
      setDownloadLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedWarehouse) {
      alert("Please select a warehouse");
      return;
    }
    if (!expectedDeliveryDate) {
      alert("Please select expected delivery date");
      return;
    }
    if (!selectedVendor) {
      alert("Please select a vendor");
      return;
    }
    if (!selectedGstType) {
      alert("Please select a GST type");
      return;
    }
    if (
      currency !== "INR" &&
      (!exchangeRate || parseFloat(exchangeRate) <= 0)
    ) {
      alert("Please enter a valid exchange rate for non-INR currency");
      return;
    }

    // Check if any item is missing HSN code
    const itemsWithoutHsn = itemDetails.filter(
      (item) => !item.hsnCode || item.hsnCode.trim() === ""
    );

    if (itemsWithoutHsn.length > 0) {
      alert("Please enter HSN code for all items");
      return;
    }

    const invalidItems = itemDetails.filter(
      (item) =>
        !item.selectedItem || !item.hsnCode || !item.rate || !item.quantity
    );

    if (invalidItems.length > 0) {
      alert("Please fill all required fields for all items");
      return;
    }

    try {
      const purchaseOrderData = {
        companyId: selectedCompany,
        vendorId: selectedVendor,
        gstType: selectedGstType,
        currency: currency,
        exchangeRate: exchangeRate,
        paymentTerms,
        deliveryTerms,
        warranty,
        contactPerson,
        expectedDeliveryDate,
        cellNo,
        warehouseId: selectedWarehouse,
        items: itemDetails.map((item) => {
          const selectedItemData = itemList.find(
            (i) => i.id === item.selectedItem
          );
          const itemData = {
            id: item.selectedItem,
            name: selectedItemData?.name || "",
            source: selectedItemData?.source || "",
            hsnCode: item.hsnCode,
            modelNumber: item.modelNumber,
            itemDetail: item.itemDetail,
            unit: item.selectedUnit,
            quantity: item.quantity.toString(),
            rate: item.rate.toString(),
          };

          // Only add gstRate for itemwise GST types
          if (isItemWiseGST) {
            itemData.gstRate = item.gstRate.toString();
          }

          return itemData;
        }),
        otherCharges: otherCharges.map((charge) => ({
          name: charge.name,
          amount: charge.amount.toString(),
        })),
      };

      console.log("Purchase Order Data:", purchaseOrderData);

      const response = await Api.post(
        "/purchase/purchase-orders/create",
        purchaseOrderData
      );

      if (response.data.success) {
        const poId = response.data.data.id;
        const poNumber = response.data.data.poNumber;
        alert("Purchase Order created successfully!");
        
        const shouldDownload = window.confirm(
          "Do you want to download the purchase order PDF?"
        );
        if (shouldDownload) {
          await handleDownload(poId);
        }
        handleReset();
      } else {
        alert("Error creating purchase order: " + response.data.message);
      }
    } catch (error) {
      console.log("Error creating purchase order:", error);
      alert(
        "Error creating purchase order: " +
          (error?.response?.data?.message || error?.message)
      );
    }
  };

  const handleReset = () => {
    setSelectedCompany("");
    setSelectedVendor("");
    setSelectedGstType("");
    setGstRate("");
    setCurrency("INR");
    setExchangeRate("1.00");
    setSelectedWarehouse("");
    setPaymentTerms("");
    setDeliveryTerms("");
    setWarranty("");
    setContactPerson("");
    setCellNo("");
    setItemDetails([
      {
        id: 1,
        selectedItem: "",
        hsnCode: "",
        modelNumber: "",
        selectedUnit: "",
        rate: "",
        quantity: "",
        gstRate: "",
        amount: "",
        taxableAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        itemDetail: "",
      },
    ]);
    setOtherCharges([
      {
        id: 1,
        name: "",
        amount: "",
      },
    ]);
    setPendingReorderItems([]);
    setSkipCalculation({});
    setShowOtherCharges(false);
    setLoadingItems({});
    setEditableHsn({});
    setOpenItemDropdown(null);
    setSearchQuery({});
  };

  useEffect(() => {
    fetchCompanies();
    fetchVendors();
    fetchItemList();
    fetchWarehouses();
    fetchUnits();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
      
        {(processingReorder || downloadLoading) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">
                {processingReorder && "Loading reorder data..."}
                {downloadLoading && "Downloading Purchase Order..."}
              </p>
            </div>
          </div>
        )}
        {downloadLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Downloading Purchase Order...</p>
            </div>
          </div>
        )}

        {processingReorder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Loading reorder data...</p>
            </div>
          </div>
        )}

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {location.state?.reorderData
              ? "ReOrder Purchase Order"
              : "Create Purchase Order"}
          </h1>
          <p className="text-gray-600">
            {location.state?.reorderData
              ? "Review and modify the reorder details below"
              : "Fill in the details below to create a new purchase order"}
          </p>

          {location.state?.reorderData && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reorder Mode - All fields are editable
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            Basic Information
          </h2>

          <div className="space-y-6">
            {/* FIRST ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Company *
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">-- Select Company --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Vendor *
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">-- Select Vendor --</option>
                  {vendorsList.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select GST Type *
                </label>
                <select
                  value={selectedGstType}
                  onChange={(e) => setSelectedGstType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">-- Select GST Type --</option>
                  {gstTypes.map((gst) => (
                    <option key={gst.value} value={gst.value}>
                      {gst.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {currencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECOND ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exchange Rate{" "}
                  {currency !== "INR" && `(1 ${currency} = ? INR)`}
                </label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder={
                    currency === "INR" ? "1.00 (Fixed)" : "Enter exchange rate"
                  }
                  step="0.01"
                  min="0.01"
                  disabled={currency === "INR"}
                />
                {currency === "INR" && (
                  <p className="mt-1 text-sm text-gray-500">
                    INR is base currency
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Warehouse *
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">-- Select Warehouse --</option>
                  {warehouseList.map((warehouse) => (
                    <option key={warehouse.value} value={warehouse.value}>
                      {warehouse.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="e.g., 60 Days Credit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Terms
                </label>
                <input
                  type="text"
                  value={deliveryTerms}
                  onChange={(e) => setDeliveryTerms(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="e.g., Immediate"
                />
              </div>
            </div>

            {/* THIRD ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter warranty details"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Expected Delivery Date
                </label>

                <input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={cellNo}
                  onChange={(e) => setCellNo(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ITEM SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* GST Type Info */}
          {selectedGstType && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-blue-800">
                  Selected GST Type:
                </span>
                <span className="ml-2 text-blue-700">
                  {gstTypes.find((gst) => gst.value === selectedGstType)?.label}
                  {!isItemWiseGST && (
                    <span className="ml-2 font-medium">
                      (Rate: {getFixedGSTRate()}%)
                    </span>
                  )}
                  {isItemWiseGST && (
                    <span className="ml-2 font-medium">
                      (Itemwise GST - Enter rate for each item)
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Currency Info */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-yellow-800">Currency:</span>
              <span className="ml-2 text-yellow-700">
                All amounts are in {currency} ({getCurrencySymbol(currency)})
                {currency !== "INR" && exchangeRate && (
                  <span className="ml-2">
                    (Exchange Rate: 1 {currency} ={" "}
                    {parseFloat(exchangeRate).toFixed(3)} INR)
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {itemDetails.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Item {index + 1}
                  </h3>
                  {itemDetails.length > 1 && (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                      onClick={() => removeItemDetail(item.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {/* Item Selection Row */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
                    Item Details
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div
                      className="relative"
                      ref={(el) => (dropdownRefs.current[item.id] = el)}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Item *
                        {loadingItems[item.id] && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <svg
                              className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Loading...
                          </span>
                        )}
                      </label>

                      {/* Custom Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => toggleItemDropdown(item.id)}
                        disabled={loadingItems[item.id]}
                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 flex justify-between items-center ${
                          loadingItems[item.id] ? "opacity-50" : ""
                        }`}
                      >
                        <span className="truncate">
                          {item.selectedItem
                            ? (() => {
                                const selected = itemList.find(
                                  (i) => i.id === item.selectedItem
                                );
                                return selected
                                  ? selected.name
                                  : "-- Choose Item --";
                              })()
                            : "-- Choose Item --"}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transform transition-transform ${
                            openItemDropdown === item.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Custom Dropdown Menu with Search */}
                      {openItemDropdown === item.id && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
                          {/* Search Bar */}
                          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                            <div className="relative">
                              <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                              <input
                                type="text"
                                value={searchQuery[item.id] || ""}
                                onChange={(e) =>
                                  handleSearchChange(item.id, e.target.value)
                                }
                                placeholder="Search items by name, HSN, or model..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                              />
                              {searchQuery[item.id] && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSearchChange(item.id, "")
                                  }
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              Type to search items. Showing{" "}
                              {getFilteredItems(item.id).length} of{" "}
                              {itemList.length} items.
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="overflow-y-auto max-h-64">
                            {getFilteredItems(item.id).length > 0 ? (
                              getFilteredItems(item.id).map((itemOption) => (
                                <button
                                  key={itemOption.id}
                                  type="button"
                                  onClick={() =>
                                    handleItemSelectFromDropdown(
                                      item.id,
                                      itemOption.id
                                    )
                                  }
                                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0 ${
                                    item.selectedItem === itemOption.id
                                      ? "bg-blue-50"
                                      : ""
                                  }`}
                                >
                                  <div className="font-medium text-gray-900">
                                    {itemOption.name + " - "}
                                    {itemOption.source === "mongo"
                                      ? "Installation Material"
                                      : "Raw Material"}
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {itemOption.hsnCode && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        HSN: {itemOption.hsnCode}
                                      </span>
                                    )}
                                    {itemOption.modelNumber && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        Model: {itemOption.modelNumber}
                                      </span>
                                    )}
                                    {itemOption.rate && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        {getCurrencySymbol(currency)}
                                        {parseFloat(itemOption.rate).toFixed(3)}
                                      </span>
                                    )}
                                  </div>
                                  {itemOption.itemDetail && (
                                    <div className="mt-1 text-xs text-gray-500 truncate">
                                      {itemOption.itemDetail}
                                    </div>
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-8 text-center">
                                <svg
                                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <p className="text-gray-500">
                                  No items found for "{searchQuery[item.id]}"
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Try different search terms
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {!item.selectedItem &&
                        location.state?.reorderData?.items?.[index] && (
                          <p className="mt-1 text-sm text-gray-500">
                            Original:{" "}
                            {location.state.reorderData.items[index].itemName}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Unit
                        {loadingItems[item.id] && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <svg
                              className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Loading...
                          </span>
                        )}
                      </label>
                      <select
                        value={item.selectedUnit}
                        onChange={(e) =>
                          updateItemDetail(
                            item.id,
                            "selectedUnit",
                            e.target.value
                          )
                        }
                        disabled={loadingItems[item.id]}
                        className={`w-full px-4 py-2.5 border ${
                          item.selectedItem && !item.selectedUnit
                            ? "border-orange-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          loadingItems[item.id] ? "opacity-50" : ""
                        }`}
                      >
                        <option value="">-- Choose Unit --</option>
                        {unitTypes.length === 0 ? (
                          <option value="" disabled>
                            Loading units...
                          </option>
                        ) : (
                          unitTypes.map((u) => (
                            <option key={u.value} value={u.value}>
                              {u.label}
                            </option>
                          ))
                        )}
                      </select>
                      {item.selectedUnit ? (
                        <p className="mt-1 text-xs text-green-600">
                          Current unit: {item.selectedUnit}
                        </p>
                      ) : item.selectedItem && !loadingItems[item.id] ? (
                        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                          <p className="text-xs text-orange-600 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            No unit available for this item. Please select a
                            unit manually.
                          </p>
                        </div>
                      ) : null}
                      {loadingItems[item.id] && (
                        <p className="mt-1 text-xs text-blue-600">
                          Fetching item details from database...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* HSN Code and Model Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* HSN Code Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        HSN Code *
                      </label>

                      {/* If HSN code exists and not in edit mode, show read-only with edit button */}
                      {!editableHsn[item.id] &&
                      item.hsnCode &&
                      item.hsnCode.trim() !== "" ? (
                        <div className="relative">
                          <div className="w-full px-4 py-2.5 border border-green-300 bg-green-50 rounded-lg text-gray-700 font-medium flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="font-semibold">
                                {item.hsnCode}
                              </span>
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                From Item
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleHsnEditMode(item.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
                            >
                              Edit
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-green-600">
                            HSN code loaded from item data
                          </p>
                        </div>
                      ) : (
                        // Show input field for editing/entering HSN code
                        <div className="relative">
                          <input
                            type="text"
                            value={item.hsnCode}
                            onChange={(e) =>
                              handleHsnCodeChange(item.id, e.target.value)
                            }
                            className={`w-full px-4 py-2.5 border ${
                              !item.hsnCode
                                ? "border-orange-300"
                                : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                            placeholder="Enter HSN code"
                            required
                          />

                          {/* Show info message based on state */}
                          {editableHsn[item.id] &&
                          item.hsnCode &&
                          item.hsnCode.trim() !== "" ? (
                            <p className="mt-1 text-xs text-blue-600">
                              Enter HSN code for this item
                            </p>
                          ) : editableHsn[item.id] &&
                            (!item.hsnCode || item.hsnCode.trim() === "") ? (
                            <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                              <p className="text-xs text-orange-600 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                  />
                                </svg>
                                This item doesn't have HSN code. Please enter
                                one.
                              </p>
                            </div>
                          ) : null}

                          {/* Show save button when in edit mode with value */}
                          {editableHsn[item.id] &&
                            item.hsnCode &&
                            item.hsnCode.trim() !== "" && (
                              <div className="absolute right-2 top-2">
                                <button
                                  type="button"
                                  onClick={() => toggleHsnEditMode(item.id)}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  Save
                                </button>
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Model Number Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Number
                      </label>
                      <input
                        type="text"
                        value={item.modelNumber}
                        onChange={(e) =>
                          updateItemDetail(
                            item.id,
                            "modelNumber",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Enter model number"
                      />
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          // allow only digits
                          if (/^\d*\.?\d*$/.test(value)) {
                            updateItemDetail(item.id, "quantity", value);
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        Enter quantity in {item.selectedUnit || "unit"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate
                      </label>
                      <input
                        type="text"
                        value={item.rate}
                        onChange={(e) => {
                          const value = e.target.value;
                          // allow only digits
                          if (/^\d*\.?\d*$/.test(value)) {
                            updateItemDetail(item.id, "rate", value);
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={!item.quantity.toString().length >= 1}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter rate per unit
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount
                      </label>
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          // allow only digits
                          if (/^\d*\.?\d*$/.test(value)) {
                            updateItemDetail(item.id, "amount", value);
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={!item.quantity.toString().length >= 1}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Total without GST
                      </p>
                    </div>
                  </div>

                  {/* GST Rate Section - Only show for itemwise GST */}
                  {isItemWiseGST && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GST Rate (%) *
                          </label>
                          <input
                            type="number"
                            value={item.gstRate}
                            onChange={(e) =>
                              updateItemDetail(
                                item.id,
                                "gstRate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            max="100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Taxable Amount ({getCurrencySymbol(currency)})
                          </label>
                          <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
                            {item.taxableAmount.toFixed(3)}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GST Amount ({getCurrencySymbol(currency)})
                          </label>
                          <div className="px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg text-gray-700 font-medium">
                            {item.gstAmount.toFixed(3)}
                          </div>
                        </div>
                      </div>

                      {item.gstRate && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          <svg
                            className="w-4 h-4 mr-1.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Item GST Rate: {item.gstRate}%
                        </div>
                      )}
                    </div>
                  )}

                  {/* Item Description */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Description
                      {loadingItems[item.id] && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          <svg
                            className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </span>
                      )}
                    </label>
                    <textarea
                      value={item.itemDetail}
                      onChange={(e) =>
                        updateItemDetail(item.id, "itemDetail", e.target.value)
                      }
                      disabled={loadingItems[item.id]}
                      className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        loadingItems[item.id] ? "opacity-50" : ""
                      }`}
                      placeholder="Enter item specifications, description, and other details..."
                      rows="3"
                    />
                    {loadingItems[item.id] && (
                      <p className="mt-1 text-xs text-blue-600">
                        Item description will be auto-filled from database if
                        available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
            <button
              type="button"
              className="px-4 py-2.5 bg-yellow-400 text-dark rounded-lg  transition-colors duration-200 font-medium flex items-center"
              onClick={addItemDetail}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        {/* OTHER CHARGES SECTION - Collapsible */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
                Other Charges
              </h2>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium flex items-center"
                onClick={() => setShowOtherCharges(!showOtherCharges)}
              >
                <svg
                  className={`w-5 h-5 mr-2 transform transition-transform ${
                    showOtherCharges ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {showOtherCharges ? "Hide Charges" : "Show Charges"}
              </button>
            </div>

            {showOtherCharges && (
              <button
                type="button"
                className="px-4 py-2.5 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-400 transition-colors duration-200 font-medium flex items-center"
                onClick={addOtherCharge}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Charge
              </button>
            )}
          </div>

          {showOtherCharges && (
            <div className="space-y-6">
              {otherCharges.map((charge, index) => (
                <div
                  key={charge.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Charge {index + 1}
                    </h3>
                    {otherCharges.length > 1 && (
                      <button
                        type="button"
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                        onClick={() => removeOtherCharge(charge.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Charge Name *
                        </label>
                        <input
                          type="text"
                          value={charge.name}
                          onChange={(e) =>
                            updateOtherCharge(charge.id, "name", e.target.value)
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="e.g., Freight, Loading, Packaging, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount ({getCurrencySymbol(currency)}) *
                        </label>
                        <input
                          type="number"
                          value={charge.amount}
                          onChange={(e) =>
                            updateOtherCharge(
                              charge.id,
                              "amount",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showOtherCharges && (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 mb-4">No charges added yet</p>
              <button
                type="button"
                className="px-4 py-2.5 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-400 transition-colors duration-200 font-medium flex items-center mx-auto"
                onClick={() => {
                  setShowOtherCharges(true);
                  addOtherCharge();
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Charge
              </button>
            </div>
          )}
        </div>

        {/* SUMMARY SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-600">
                  Currency: <span className="font-medium">{currency}</span>
                </p>
                {currency !== "INR" && exchangeRate && (
                  <p className="text-sm text-gray-600 mt-1">
                    Exchange Rate:{" "}
                    <span className="font-medium">
                      1 {currency} = {parseFloat(exchangeRate).toFixed(2)} INR
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              onClick={handleReset}
            >
              Reset Form
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-yellow-400 text-dark rounded-lg hover:bg-yellow-400 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={
                !selectedCompany ||
                !selectedVendor ||
                !selectedGstType ||
                (currency !== "INR" &&
                  (!exchangeRate || parseFloat(exchangeRate) <= 0))
              }
            >
              {location.state?.reorderData
                ? "Create ReOrder"
                : "Create Purchase Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
