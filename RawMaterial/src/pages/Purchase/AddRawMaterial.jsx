import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";

const AddRawMaterial = () => {
  const [rawMaterialName, setRawMaterialName] = useState("");
  const [rawMaterialDescription, setRawMaterialDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [unitList, setUnitList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unitLoading, setUnitLoading] = useState(false);
  const [conversionUnit, setConversionUnit] = useState("");
  const [conversionFactor, setConversionFactor] = useState("");

  // Fetch Units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setUnitLoading(true);
        const response = await Api.get("/common/unit/view");
        setUnitList(response?.data?.data || []);
      } catch (error) {
        alert("Failed to fetch units: " + (error?.message || ""));
      } finally {
        setUnitLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rawMaterialName || !unit) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        rawMaterialName,
        description: rawMaterialDescription,
        unit,
      };

      // Add conversion data only if both fields are provided
      if (conversionUnit && conversionFactor) {
        payload.conversionUnit = conversionUnit;
        payload.conversionFactor = parseFloat(conversionFactor);
      }

      const response = await Api.post("/common/raw-material/create", payload);

      alert(response?.data?.message || "Raw material added successfully");

      // Reset form
      setRawMaterialName("");
      setRawMaterialDescription("");
      setUnit("");
      setConversionUnit("");
      setConversionFactor("");
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Add Raw Material
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Enter raw material details below
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Raw Material Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Raw Material Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={rawMaterialName}
              onChange={(e) => setRawMaterialName(e.target.value)}
              placeholder="e.g. Steel Sheet"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Unit Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Base Unit <span className="text-red-500">*</span>
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              disabled={unitLoading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">
                {unitLoading ? "Loading units..." : "Select Unit"}
              </option>
              {unitList.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Conversion Unit Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Conversion Unit
            </label>
            <select
              value={conversionUnit}
              onChange={(e) => setConversionUnit(e.target.value)}
              disabled={unitLoading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Conversion Unit</option>
              {unitList.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Conversion Factor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Conversion Factor
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={conversionFactor}
              onChange={(e) => setConversionFactor(e.target.value)}
              placeholder="e.g., 0.001"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Factor to convert from base unit to conversion unit
            </p>
          </div>

          {/* Conversion Info Note */}
          {(conversionUnit || conversionFactor) && (
            <div className="sm:col-span-2 bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Note:</span> 1 {unit} = {conversionFactor || "?"} {conversionUnit}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={rawMaterialDescription}
              onChange={(e) => setRawMaterialDescription(e.target.value)}
              placeholder="Enter raw material description"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] rounded-lg bg-yellow-400 text-black font-semibold
              hover:bg-yellow-500 active:scale-[0.98] transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Add Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRawMaterial;