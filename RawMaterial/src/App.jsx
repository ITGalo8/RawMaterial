import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import Login from "./pages/Login/Login";
import LineWorkerDashboard from "./pages/LineWorker/LineWokerDashboard/LineWorkerDashboard";
import StoreKeeper from "./pages/LineWorker/StoreKeeper/StoreKeeper";
import UserStockData from "./pages/LineWorker/StoreKeeper/UserStockData/UserStockData";

const App = () => {
  return ( 
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
           <Route path="store-keeper" element={<StoreKeeper />} />
           <Route path="user-stock-data" element={<UserStockData />} />
          <Route
            path="lineworker-dashboard"
            element={<LineWorkerDashboard />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
