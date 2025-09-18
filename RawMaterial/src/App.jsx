import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import RawMaterialStock from "./pages/RawMaterial/RawMaterialStock";
import AddItem from "./pages/AddItem/AddItem";
import ProductBom from "./pages/Bom/ProductBom";


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
          <Route path="product-bom" element={<ProductBom />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
 