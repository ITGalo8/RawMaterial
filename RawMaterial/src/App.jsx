import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard"
import Login from "./pages/Login/Login";
import LineWorkerDashboard from "./pages/LineWorker/LineWokerDashboard/LineWorkerDashboard";
// import Logout from "./pages/Logout/Logout";
// import RawMaterialStock from "./pages/RawMaterial/RawMaterialStock";
// import AddItem from "./pages/AddItem/AddItem";
// import UploadBom from "./pages/Bom/UploadBom";
// import AddRawMaterial from "./pages/Add Raw Material/AddRawMaterial";
// import ProductCount from "./pages/ProductCount/ProductCount";
// import RepairForm from "./pages/Repair/RepairForm";
// import RepairHistory from "./pages/Repair/RepairHistory";
// import RejectForm from "./pages/Reject/RejectForm";
// import RejectHistory from "./pages/Reject/RejectHistory";
// import ProductBom from './pages/Bom/ProductBom'
// import UpdateBom from './pages/Bom/UpdateBom'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="lineWorker-dashboard" element={<LineWorkerDashboard />} />
          {/* <Route path="raw-material-stock" element={<RawMaterialStock />} />
          <Route path="logout" element={<Logout />} />
          <Route path="add-item" element={<AddItem />} />
          <Route path="/Bom/upload-bom" element={<UploadBom />} />
          <Route path="/Bom/product-bom" element={<ProductBom />} />
           <Route path="/Bom/update-bom" element={<UpdateBom />} />
          <Route path="add-rawmaterial" element={<AddRawMaterial />} />
          <Route path="product-count" element={<ProductCount />} />
          <Route path="/repair/repairForm" element={<RepairForm />} />
          <Route path="/repair/repair-history" element={<RepairHistory />} />
          <Route path="/reject/reject-Form" element={<RejectForm />} />
          <Route path="/reject/reject-history" element={<RejectHistory />} /> */}
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
 