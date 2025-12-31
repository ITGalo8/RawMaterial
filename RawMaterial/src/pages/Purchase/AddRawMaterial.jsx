import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";
import { useNavigate } from "react-router-dom";

const AddRawMaterial = ({
  isEditMode = false,
  editData = null,
  onSuccess,
  onCancel,
  closeModal
}) => {
  const [rawMaterialName, setRawMaterialName] = useState("");
  const [rawMaterialDescription, setRawMaterialDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [unitList, setUnitList] = useState([]);
  const [unitLoading, setUnitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [conversionUnit, setConversionUnit] = useState("");
  const [conversionFactor, setConversionFactor] = useState("");
  const [hsnCode, setHsnCode] = useState("");

  const [source, setSource] = useState("");
  const navigate = useNavigate();

  const SourceOption = [
    { value: "Installation Material", label: "Installation Material" },
    { value: "Raw Material", label: "Raw Material" },
  ];

  useEffect(() => {
    if (isEditMode && editData) {
      setRawMaterialName(editData.name || "");
      setRawMaterialDescription(editData.description || "");
      setUnit(editData.unit || "");
      setConversionUnit(editData.conversionUnit || "");
      setConversionFactor(
        editData.conversionFactor ? String(editData.conversionFactor) : ""
      );
      setSource(editData.source || "");
      setHsnCode(editData.hsnCode || "");
    }
  }, [isEditMode, editData]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setUnitLoading(true);
        const res = await Api.get("/common/unit/view");
        setUnitList(res?.data?.data || []);
      } catch (err) {
        alert("Failed to fetch units");
      } finally {
        setUnitLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rawMaterialName || !unit || !source || !hsnCode) {
      alert("Please fill all required fields");
      return;
    }

    // if (conversionUnit && conversionUnit === unit) {
    //   alert("Base unit and conversion unit cannot be the same");
    //   return;
    // }

    try {
      setLoading(true);

      const payload = {
        name: rawMaterialName,
        description: rawMaterialDescription || null,
        unit,
        source,
        hsnCode: hsnCode.trim(),
      };

      if (isEditMode && editData?.id) {
        payload.id = editData.id;
      }

      if (conversionUnit && conversionFactor && Number(conversionFactor) > 0) {
        payload.conversionUnit = conversionUnit;
        payload.conversionFactor = Number(conversionFactor);
      } else {
        payload.conversionUnit = null;
        payload.conversionFactor = null;
      }

      let response;
      if (isEditMode) {
        response = await Api.put("/common/item/update", payload);
      }

      alert(
        response?.data?.message ||
          (isEditMode ? "Item updated successfully" : "Item added successfully")
      );
      closeModal(false);
      

      if (onSuccess) onSuccess();

      if (!isEditMode) {
        setRawMaterialName("");
        setRawMaterialDescription("");
        setUnit("");
        setConversionUnit("");
        setConversionFactor("");
        setSource("");
        setHsnCode("");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- CLEAR CONVERSION -------------------- */
  const handleClearConversion = () => {
    setConversionUnit("");
    setConversionFactor("");
  };

  const safeFactor =
    conversionFactor && Number(conversionFactor) > 0
      ? Number(conversionFactor)
      : null;

  return (
    <div className="w-full bg-gradient-to-br from-slate-100 flex items-center justify-center px-4 ">
      <div className="w-full bg-white  shadow-xs p-2 sm:p-2">
        {/* HEADER */}
        <div className=" text-center ">
          <h2 className="text-3xl font-bold text-gray-800">
            {isEditMode ? "Edit Item" : "Add Item"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isEditMode ? "Update item details" : "Enter item details"}
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {/* NAME */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={rawMaterialName}
              onChange={(e) => setRawMaterialName(e.target.value)}
              // readOnly={isEditMode}
              className={`w-full px-4 py-3 rounded-lg border`}
              required
            />
          </div>

          {/* SOURCE */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Source <span className="text-red-500">*</span>
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={isEditMode}
              className={`w-full px-4 py-3 rounded-lg border
                ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
              required
            >
              <option value="">Select Source</option>
              {SourceOption.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* BASE UNIT */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Base Unit <span className="text-red-500">*</span>
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              disabled={unitLoading || isEditMode}
              className={`w-full px-4 py-3 rounded-lg border
                ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
              required
            >
              <option value="">
                {unitLoading ? "Loading..." : "Select Unit"}
              </option>
              {unitList.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* CONVERSION UNIT */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Conversion Unit
            </label>
            <select
              value={conversionUnit}
              onChange={(e) => setConversionUnit(e.target.value)}
              disabled={!unit}
              className="w-full px-4 py-3 rounded-lg border"
            >
              <option value="">Select Conversion Unit</option>
              {unitList.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* CONVERSION FACTOR */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Conversion Factor
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.001"
                min="0"
                value={conversionFactor}
                onChange={(e) =>
                  e.target.value === "" || Number(e.target.value) >= 0
                    ? setConversionFactor(e.target.value)
                    : null
                }
                className="flex-1 px-4 py-3 rounded-lg border"
              />
              {(conversionUnit || conversionFactor) && (
                <button
                  type="button"
                  onClick={handleClearConversion}
                  className="px-3 bg-red-100 text-red-700 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              HSN Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
              required
              placeholder="Enter HSN code"
              maxLength="10"
            />
          </div>
          {/* DESCRIPTION */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={rawMaterialDescription}
              onChange={(e) => setRawMaterialDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border resize-none"
            />
          </div>
          <div className="sm:col-span-2 flex gap-4">
            {isEditMode && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 h-[48px] rounded-lg bg-gray-200 text-gray-800 font-semibold
                hover:bg-gray-300 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`h-[48px] rounded-lg bg-yellow-400 text-black font-semibold
              hover:bg-yellow-500 active:scale-[0.98] transition-all
              disabled:opacity-60 disabled:cursor-not-allowed 
               ${isEditMode ? "flex-1" : "w-full"}`}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Item"
                : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRawMaterial;