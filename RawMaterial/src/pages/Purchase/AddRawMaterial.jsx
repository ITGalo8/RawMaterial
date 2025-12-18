import React, { useState } from "react";
import Api from "../../auth/Api";

const AddRawMaterial = () => {
  const [rawMaterialName, setRawMaterialName] = useState("");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rawMaterialName || !unit) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await Api.post("/common/raw-material/create", {
        rawMaterialName,
        unit,
      });

      alert(response?.data?.message || "Raw material added successfully");
      setRawMaterialName("");
      setUnit("");
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Raw Material Name */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Raw Material Name
            </label>
            <input
              type="text"
              value={rawMaterialName}
              onChange={(e) => setRawMaterialName(e.target.value)}
              placeholder="e.g. Steel Sheet"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unit
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="kg / pcs / meter"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] rounded-lg bg-yellow-400 text-black font-semibold
                hover:bg-yellow-400 active:scale-[0.98] transition-all duration-200
                disabled:opacity-60"
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
