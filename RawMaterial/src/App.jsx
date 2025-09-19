import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import RawMaterialStock from "./pages/RawMaterial/RawMaterialStock";
import AddItem from "./pages/AddItem/AddItem";
import UploadBom from "./pages/Bom/UploadBom";
import AddRawMaterial from "./pages/Add Raw Material/AddRawMaterial";
import ProductCount from "./pages/ProductCount/ProductCount";
import RepairForm from "./pages/Repair/RepairForm";
import RepairHistory from "./pages/Repair/RepairHistory";
import RejectForm from "./pages/Reject/RejectForm";
import RejectHistory from "./pages/Reject/RejectHistory";
import ProductBom from './pages/Bom/ProductBom'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="raw-material-stock" element={<RawMaterialStock />} />
          <Route path="logout" element={<Logout />} />
          <Route path="add-item" element={<AddItem />} />
          <Route path="/Bom/upload-bom" element={<UploadBom />} />
          <Route path="/Bom/product-bom" element={<ProductBom />} />
          <Route path="add-rawmaterial" element={<AddRawMaterial />} />
          <Route path="product-count" element={<ProductCount />} />
          <Route path="/repair/repairForm" element={<RepairForm />} />
          <Route path="/repair/repair-history" element={<RepairHistory />} />
          <Route path="/reject/reject-Form" element={<RejectForm />} />
          <Route path="/reject/reject-history" element={<RejectHistory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
 