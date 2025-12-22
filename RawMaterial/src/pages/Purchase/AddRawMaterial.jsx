// import React, { useEffect, useState } from "react";
// import Api from "../../auth/Api";

// const AddRawMaterial = ({ isEditMode = false, editData = null, onSuccess, onCancel }) => {
//   console.log("Edit dATA: ", editData)
//   const [rawMaterialName, setRawMaterialName] = useState("");
//   const [rawMaterialDescription, setRawMaterialDescription] = useState("");
//   const [unit, setUnit] = useState("");
//   const [unitList, setUnitList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [unitLoading, setUnitLoading] = useState(false);

//   const [conversionUnit, setConversionUnit] = useState("");
//   const [conversionFactor, setConversionFactor] = useState("");

//   const [source, setSource] = useState("");

//   const SourceOption = [
//     { value: "Installation Material", label: "Installation Material" },
//     { value: "Raw Material", label: "Raw Material" },
//   ];

//   // Initialize form with edit data
//   useEffect(() => {
//     if (isEditMode && editData) {
//       setRawMaterialName(editData.name || "");
//       setRawMaterialDescription(editData.description || "");
//       setUnit(editData.unit || "");
//       setConversionUnit(editData.conversionUnit || "");
//       setConversionFactor(editData.conversionFactor || "");
//       setSource(editData.source || "");
//     }
//   }, [isEditMode, editData]);

//   // Fetch Units
//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         setUnitLoading(true);
//         const response = await Api.get("/common/unit/view");
//         setUnitList(response?.data?.data || []);
//       } catch (error) {
//         alert("Failed to fetch units");
//       } finally {
//         setUnitLoading(false);
//       }
//     };

//     fetchUnits();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!rawMaterialName || !unit || !source) {
//       alert("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         id: editData.id,
//         name: rawMaterialName,
//         description: rawMaterialDescription || null,
//         unit,
//         source,
//       };

//       // Only add conversion fields if both are provided
//       if (conversionUnit && conversionFactor) {
//         payload.conversionUnit = conversionUnit;
//         payload.conversionFactor = parseFloat(conversionFactor);
//       } else {
//         // If one is provided but not the other, set both to null
//         payload.conversionUnit = null;
//         payload.conversionFactor = null;
//       }

//       let response;
      
//       if (isEditMode && editData) {
//         // Update existing item - using PUT request
//         response = await Api.put(
//           `/common/item/update`,
//           payload
//         );
//       } else {
//         // Create new item
//         response = await Api.post(
//           `/common/item/create`,
//           payload
//         );
//       }

//       alert(response?.data?.message || 
//         (isEditMode ? "Item updated successfully" : "Item added successfully")
//       );

//       if (isEditMode && onSuccess) {
//         onSuccess({
//           ...payload,
//           id: editData.id,
//           conversionFactor: payload.conversionFactor,
//           conversionUnit: payload.conversionUnit
//         });
//       } else {
//         // Reset form for create mode
//         setRawMaterialName("");
//         setRawMaterialDescription("");
//         setUnit("");
//         setConversionUnit("");
//         setConversionFactor("");
//         setSource("");
        
//         if (onSuccess) {
//           onSuccess();
//         }
//       }
//     } catch (error) {
//       alert(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle clearing conversion fields
//   const handleClearConversion = () => {
//     setConversionUnit("");
//     setConversionFactor("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
//             {isEditMode ? "Edit Item" : "Add Item"}
//           </h2>
//           <p className="text-gray-500 mt-2 text-sm sm:text-base">
//             {isEditMode ? "Update item details below" : "Enter item details below"}
//           </p>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 sm:grid-cols-2 gap-6"
//         >
//           {/* Item Name */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={rawMaterialName}
//               onChange={(e) => setRawMaterialName(e.target.value)}
//               placeholder="e.g. NRV, Steel Sheet, etc."
//               className={`w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
//                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
//                 ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//               required
//               readOnly={isEditMode}
//             />
//             {isEditMode && (
//               <p className="text-xs text-gray-500 mt-1">
//                 Item name cannot be changed
//               </p>
//             )}
//           </div>

//           {/* Source Dropdown */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Source <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={source}
//               onChange={(e) => setSource(e.target.value)}
//               className={`w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
//                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
//                 ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//               required
//               disabled={isEditMode}
//             >
//               <option value="">Select Source</option>
//               {SourceOption.map((item) => (
//                 <option key={item.value} value={item.value}>
//                   {item.label}
//                 </option>
//               ))}
//             </select>
//             {isEditMode && (
//               <p className="text-xs text-gray-500 mt-1">
//                 Source cannot be changed
//               </p>
//             )}
//           </div>

//           {/* Base Unit */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Base Unit <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={unit}
//               onChange={(e) => setUnit(e.target.value)}
//               disabled={unitLoading}
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
//               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             >
//               <option value="">
//                 {unitLoading ? "Loading units..." : "Select Unit"}
//               </option>
//               {unitList.map((item) => (
//                 <option key={item.id} value={item.name}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>

      

//           {/* Conversion Unit */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Conversion Unit
//             </label>
//             <select
//               value={conversionUnit}
//               onChange={(e) => setConversionUnit(e.target.value)}
//               disabled={unitLoading}
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
//               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Conversion Unit</option>
//               {unitList.map((item) => (
//                 <option key={item.id} value={item.name}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Conversion Factor */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Conversion Factor
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 step="0.001"
//                 min="0"
//                 value={conversionFactor}
//                 onChange={(e) => setConversionFactor(e.target.value)}
//                 placeholder="e.g. 0.001"
//                 className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
//                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               {conversionUnit || conversionFactor ? (
//                 <button
//                   type="button"
//                   onClick={handleClearConversion}
//                   className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
//                 >
//                   Clear
//                 </button>
//               ) : null}
//             </div>
//             <p className="text-xs text-gray-500 mt-1">
//               Factor to convert from base unit (1 {unit} = ? {conversionUnit})
//             </p>
//           </div>

//           {/* Conversion Note */}
//           {(conversionUnit || conversionFactor) && (
//             <div className="sm:col-span-2 bg-blue-50 p-3 rounded-lg">
//               <p className="text-sm text-blue-700">
//                 <span className="font-semibold">Note:</span> 1 {unit} ={" "}
//                 {conversionFactor || "1"} {conversionUnit}
//               </p>
//               <p className="text-xs text-blue-600 mt-1">
//                 This means 1 {conversionUnit} = {(1 / (parseFloat(conversionFactor) || 1)).toFixed(6)} {unit}
//               </p>
//             </div>
//           )}

//           {/* Description */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               rows="3"
//               value={rawMaterialDescription}
//               onChange={(e) => setRawMaterialDescription(e.target.value)}
//               placeholder="Enter item description (optional)"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm resize-none
//               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="sm:col-span-2 flex gap-4">
//             {isEditMode && (
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="flex-1 h-[48px] rounded-lg bg-gray-200 text-gray-800 font-semibold
//                 hover:bg-gray-300 active:scale-[0.98] transition-all"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`h-[48px] rounded-lg bg-yellow-400 text-black font-semibold
//               hover:bg-yellow-500 active:scale-[0.98] transition-all
//               disabled:opacity-60 disabled:cursor-not-allowed ${isEditMode ? 'flex-1' : 'w-full'}`}
//             >
//               {loading 
//                 ? (isEditMode ? "Updating..." : "Saving...")
//                 : (isEditMode ? "Update Item" : "Add Item")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddRawMaterial;


import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";

const AddRawMaterial = ({
  isEditMode = false,
  editData = null,
  onSuccess,
  onCancel,
}) => {
  const [rawMaterialName, setRawMaterialName] = useState("");
  const [rawMaterialDescription, setRawMaterialDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [unitList, setUnitList] = useState([]);
  const [unitLoading, setUnitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [conversionUnit, setConversionUnit] = useState("");
  const [conversionFactor, setConversionFactor] = useState("");

  const [source, setSource] = useState("");

  const SourceOption = [
    { value: "Installation Material", label: "Installation Material" },
    { value: "Raw Material", label: "Raw Material" },
  ];

  /* -------------------- INIT EDIT DATA -------------------- */
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
    }
  }, [isEditMode, editData]);

  /* -------------------- FETCH UNITS -------------------- */
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

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rawMaterialName || !unit || !source) {
      alert("Please fill all required fields");
      return;
    }

    if (conversionUnit && conversionUnit === unit) {
      alert("Base unit and conversion unit cannot be the same");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: rawMaterialName,
        description: rawMaterialDescription || null,
        unit,
        source,
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
      } else {
        response = await Api.post("/common/item/create", payload);
      }

      alert(
        response?.data?.message ||
          (isEditMode ? "Item updated successfully" : "Item added successfully")
      );

      if (onSuccess) onSuccess();

      if (!isEditMode) {
        setRawMaterialName("");
        setRawMaterialDescription("");
        setUnit("");
        setConversionUnit("");
        setConversionFactor("");
        setSource("");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* HEADER */}
        <div className="mb-8 text-center">
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
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* NAME */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={rawMaterialName}
              onChange={(e) => setRawMaterialName(e.target.value)}
              readOnly={isEditMode}
              className={`w-full px-4 py-3 rounded-lg border
                ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                  e.target.value === "" ||
                  Number(e.target.value) >= 0
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

          {/* CONVERSION NOTE */}
          {safeFactor && conversionUnit && (
            <div className="sm:col-span-2 bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-700 text-sm font-semibold">
                1 {unit} = {safeFactor} {conversionUnit}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                1 {conversionUnit} = {(1 / safeFactor).toFixed(6)} {unit}
              </p>
            </div>
          )}

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

          {/* BUTTONS */}
          {/* <div className="sm:col-span-2 flex gap-4">
            {isEditMode && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 rounded-lg font-semibold"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`bg-yellow-400 rounded-lg font-semibold
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
          </div> */}

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
              disabled:opacity-60 disabled:cursor-not-allowed ${isEditMode ? 'flex-1' : 'w-full'}`}
            >
              {loading 
                ? (isEditMode ? "Updating..." : "Saving...")
                : (isEditMode ? "Update Item" : "Add Item")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRawMaterial;
