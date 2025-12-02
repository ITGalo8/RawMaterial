import React, { useEffect, useState } from "react";
import Api from "../../auth/Api";

const RawMaterialStock = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRawMaterials = async () => {
    try {
      const res = await Api.get(`/store-keeper/getRawMaterialList`);
      setRawMaterials(res.data.data || []);
    } catch (error) {
      console.log("Error fetching raw materials:", error?.response?.data?.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  return (
    <div className="w-full min-h-screen p-4 md:p-6">
      {/* Centered Title */}
      <div className="flex justify-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Raw Material Stock
        </h1>
      </div>

      {/* Full-width responsive table container */}
      <div className="w-full">
        {loading ? (
          <div className="text-center text-lg font-medium py-10">Loading...</div>
        ) : (
          <div className="w-full overflow-hidden shadow-lg rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 border text-left font-medium text-gray-700">S.No</th>
                    <th className="px-4 py-3 border text-left font-medium text-gray-700">Raw Material</th>
                    <th className="px-4 py-3 border text-left font-medium text-gray-700">Stock</th>
                    <th className="px-4 py-3 border text-left font-medium text-gray-700">Unit</th>
                    <th className="px-4 py-3 border text-left font-medium text-gray-700">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {rawMaterials.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border ${
                        item.outOfStock ? "bg-red-50 hover:bg-red-100" : "bg-white hover:bg-gray-50"
                      } transition-colors duration-150`}
                    >
                      <td className="px-4 py-3 border text-gray-700">{index + 1}</td>
                      <td className="px-4 py-3 border font-medium text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 border text-gray-700">{item.stock}</td>
                      <td className="px-4 py-3 border text-gray-700">{item.unit}</td>
                      <td className="px-4 py-3 border">
                        {item.outOfStock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RawMaterialStock;