import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import RawMaterialStock from "./pages/RawMaterial/RawMaterialStock";


const router = ()=> {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="RawMaterialStock" element={<RawMaterialStock />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default router;
