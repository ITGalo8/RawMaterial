// import React, { useEffect, useState } from "react";
// import Api from "../../auth/Api";

// const AddRawMaterial = ({
//   isEditMode = false,
//   editData = null,
//   onSuccess,
//   onCancel,
//   closeModal
// }) => {
//   const [rawMaterialName, setRawMaterialName] = useState("");
//   const [rawMaterialDescription, setRawMaterialDescription] = useState("");
//   const [unit, setUnit] = useState("");
//   const [unitList, setUnitList] = useState([]);
//   const [unitLoading, setUnitLoading] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [conversionUnit, setConversionUnit] = useState("");
//   const [conversionFactor, setConversionFactor] = useState("");
//   const [hsnCode, setHsnCode] = useState("");

//   const [source, setSource] = useState("");

//   const SourceOption = [
//     { value: "Installation Material", label: "Installation Material" },
//     { value: "Raw Material", label: "Raw Material" },
//   ];

//   useEffect(() => {
//     if (isEditMode && editData) {
//       setRawMaterialName(editData.name || "");
//       setRawMaterialDescription(editData.description || "");
//       setUnit(editData.unit || "");
//       setConversionUnit(editData.conversionUnit || "");
//       setConversionFactor(
//         editData.conversionFactor ? String(editData.conversionFactor) : ""
//       );
//       setSource(editData.source || "");
//       setHsnCode(editData.hsnCode || "");
//     }
//   }, [isEditMode, editData]);

//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         setUnitLoading(true);
//         const res = await Api.get("/common/unit/view");
//         setUnitList(res?.data?.data || []);
//       } catch (err) {
//         alert("Failed to fetch units: ", err?.response?.data?.message || err.message);
//       } finally {
//         setUnitLoading(false);
//       }
//     };

//     fetchUnits();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!rawMaterialName || !unit || !source || !hsnCode) {
//       alert("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         name: rawMaterialName,
//         description: rawMaterialDescription || null,
//         unit,
//         source,
//         hsnCode: hsnCode.trim(),
//       };

//       if (isEditMode && editData?.id) {
//         payload.id = editData.id;
//       }

//       if (conversionUnit && conversionFactor && Number(conversionFactor) > 0) {
//         payload.conversionUnit = conversionUnit;
//         payload.conversionFactor = Number(conversionFactor);
//       } else {
//         payload.conversionUnit = null;
//         payload.conversionFactor = null;
//       }

//       let response;
//       if (isEditMode) {
//         response = await Api.put("/common/item/update", payload);
//         console.log("Response of update:", response);
        
//         if (response?.data?.success) {
//           alert(response?.data?.message || "Item updated successfully");
          
//           // Create the updated data object with all current form values
//           const updatedItemData = {
//             id: editData?.id,
//             name: rawMaterialName,
//             description: rawMaterialDescription,
//             unit: unit,
//             source: source,
//             conversionUnit: conversionUnit || null,
//             conversionFactor: conversionFactor ? Number(conversionFactor) : null,
//             hsnCode: hsnCode
//           };
          
//           // Pass the updated data to parent component
//           if (onSuccess) onSuccess(updatedItemData);
          
//           closeModal(false);
//         }
//       } else {
//         response = await Api.post("/common/item/create", payload);
//         if (response?.data?.success) {
//           alert(response?.data?.message || "Item created successfully");
//           if (onSuccess) onSuccess();
//         }
//       }

//       if (!isEditMode) {
//         setRawMaterialName("");
//         setRawMaterialDescription("");
//         setUnit("");
//         setConversionUnit("");
//         setConversionFactor("");
//         setSource("");
//         setHsnCode("");
//       }
//     } catch (error) {
//       alert(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------- CLEAR CONVERSION -------------------- */
//   const handleClearConversion = () => {
//     setConversionUnit("");
//     setConversionFactor("");
//   };

//   return (
//     <div className="w-full bg-gradient-to-br from-slate-100 flex items-center justify-center px-4 ">
//       <div className="w-full bg-white shadow-xs p-2 sm:p-2">
//         {/* HEADER */}
//         <div className=" text-center ">
//           <h2 className="text-3xl font-bold text-gray-800">
//             {isEditMode ? "Edit Item" : "Add Item"}
//           </h2>
//           <p className="text-gray-500 mt-2">
//             {isEditMode ? "Update item details" : "Enter item details"}
//           </p>
//         </div>

//         {/* FORM */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 sm:grid-cols-3 gap-6"
//         >
//           {/* NAME */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm font-semibold mb-1">
//               Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               value={rawMaterialName}
//               onChange={(e) => setRawMaterialName(e.target.value)}
//               className={`w-full px-4 py-3 rounded-lg border`}
//               required
//             />
//           </div>

//           {/* SOURCE */}
//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               Source <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={source}
//               onChange={(e) => setSource(e.target.value)}
//               disabled={isEditMode}
//               className={`w-full px-4 py-3 rounded-lg border
//                 ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
//               required
//             >
//               <option value="">Select Source</option>
//               {SourceOption.map((s) => (
//                 <option key={s.value} value={s.value}>
//                   {s.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* BASE UNIT */}
//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               Base Unit <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={unit}
//               onChange={(e) => setUnit(e.target.value)}
//               disabled={unitLoading || isEditMode}
//               className={`w-full px-4 py-3 rounded-lg border
//                 ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
//               required
//             >
//               <option value="">
//                 {unitLoading ? "Loading..." : "Select Unit"}
//               </option>
//               {unitList.map((u) => (
//                 <option key={u.id} value={u.name}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* CONVERSION UNIT */}
//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               Conversion Unit
//             </label>
//             <select
//               value={conversionUnit}
//               onChange={(e) => setConversionUnit(e.target.value)}
//               disabled={!unit}
//               className="w-full px-4 py-3 rounded-lg border"
//             >
//               <option value="">Select Conversion Unit</option>
//               {unitList.map((u) => (
//                 <option key={u.id} value={u.name}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* CONVERSION FACTOR */}
//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               Conversion Factor
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 step="0.001"
//                 min="0"
//                 value={conversionFactor}
//                 onChange={(e) =>
//                   e.target.value === "" || Number(e.target.value) >= 0
//                     ? setConversionFactor(e.target.value)
//                     : null
//                 }
//                 className="flex-1 px-4 py-3 rounded-lg border"
//               />
//               {(conversionUnit || conversionFactor) && (
//                 <button
//                   type="button"
//                   onClick={handleClearConversion}
//                   className="px-3 bg-red-100 text-red-700 rounded-lg"
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               HSN Code <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={hsnCode}
//               onChange={(e) => setHsnCode(e.target.value)}
//               className="w-full px-4 py-3 rounded-lg border"
//               required
//               placeholder="Enter HSN code"
//               maxLength="10"
//             />
//           </div>
//           {/* DESCRIPTION */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm font-semibold mb-2">
//               Description
//             </label>
//             <textarea
//               rows="3"
//               value={rawMaterialDescription}
//               onChange={(e) => setRawMaterialDescription(e.target.value)}
//               className="w-full px-4 py-3 rounded-lg border resize-none"
//             />
//           </div>
//           <div className="sm:col-span-2 flex gap-4">
            
//             <button
//               type="submit"
//               disabled={loading}
//               className={`h-[48px] rounded-lg bg-yellow-400 text-black font-semibold
//               hover:bg-yellow-500 active:scale-[0.98] transition-all
//               disabled:opacity-60 disabled:cursor-not-allowed 
//                ${isEditMode ? "flex-1" : "w-full"}`}
//             >
//               {loading
//                 ? isEditMode
//                   ? "Updating..."
//                   : "Saving..."
//                 : isEditMode
//                 ? "Update Item"
//                 : "Add Item"}
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
  closeModal,
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

  const SourceOption = [
    { value: "Installation Material", label: "Installation Material" },
    { value: "Raw Material", label: "Raw Material" },
  ];

  /* ================= FETCH EDIT DATA ================= */
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

  /* ================= FETCH UNIT LIST ================= */
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setUnitLoading(true);
        const res = await Api.get("/common/unit/view");
        setUnitList(res?.data?.data || []);
      } catch (err) {
        alert(
          err?.response?.data?.message || "Failed to fetch units"
        );
      } finally {
        setUnitLoading(false);
      }
    };

    fetchUnits();
  }, []);

  /* ================= COMMON PAYLOAD BUILDER ================= */
  const buildPayload = () => {
    return {
      name: rawMaterialName,
      description: rawMaterialDescription || null,
      unit,
      source,
      hsnCode: hsnCode.trim(),
      conversionUnit:
        conversionUnit && conversionFactor
          ? conversionUnit
          : null,
      conversionFactor:
        conversionUnit && conversionFactor
          ? Number(conversionFactor)
          : null,
    };
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setRawMaterialName("");
    setRawMaterialDescription("");
    setUnit("");
    setConversionUnit("");
    setConversionFactor("");
    setSource("");
    setHsnCode("");
  };

  /* ================= UPDATE / ADD SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rawMaterialName || !unit || !source || !hsnCode) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = buildPayload();

      if (isEditMode && editData?.id) {
        payload.id = editData.id;
        const response = await Api.put("/common/item/update", payload);

        if (response?.data?.success) {
          alert(response?.data?.message || "Item updated successfully");

          if (onSuccess)
            onSuccess({
              ...payload,
              id: editData.id,
            });

          closeModal(false);
        }
      } else {
        const response = await Api.post("/common/item/create", payload);

        if (response?.data?.success) {
          alert(response?.data?.message || "Item created successfully");
          if (onSuccess) onSuccess();
          resetForm();
        }
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE NEW FROM EDIT MODE ================= */
  const handleCreateNew = async () => {
    if (!rawMaterialName || !unit || !source || !hsnCode) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = buildPayload();

      const response = await Api.post("/common/item/create", payload);

      if (response?.data?.success) {
        alert(response?.data?.message || "Item created successfully");
        if (onSuccess) onSuccess();
        resetForm();
        closeModal(false);
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLEAR CONVERSION ================= */
  const handleClearConversion = () => {
    setConversionUnit("");
    setConversionFactor("");
  };

  /* ================= UI ================= */
  return (
    <div className="w-full bg-gradient-to-br from-slate-100 flex items-center justify-center px-4">
      <div className="w-full bg-white shadow-xs p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {isEditMode ? "Edit Item" : "Add Item"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isEditMode ? "Update item details" : "Enter item details"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6"
        >
          {/* NAME */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Name *
            </label>
            <input
              value={rawMaterialName}
              onChange={(e) => setRawMaterialName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
              required
            />
          </div>

          {/* SOURCE */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Source *
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border`}
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
              Base Unit *
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border`}
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
                min="0"
                step="0.001"
                value={conversionFactor}
                onChange={(e) => setConversionFactor(e.target.value)}
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

          {/* HSN CODE */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              HSN Code *
            </label>
            <input
              type="text"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
              maxLength="10"
              className="w-full px-4 py-3 rounded-lg border"
              required
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
              onChange={(e) =>
                setRawMaterialDescription(e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border resize-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="sm:col-span-2 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`h-[48px] rounded-lg bg-yellow-400 font-semibold hover:bg-yellow-500 transition-all ${
                isEditMode ? "flex-1" : "w-full"
              }`}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Item"
                : "Add Item"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={handleCreateNew}
                disabled={loading}
                className="h-[48px] flex-1 rounded-lg bg-yellow-400 text-dark font-semibold hover:bg-yellow-400 transition-all"
              >
                Create New Item
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRawMaterial;
