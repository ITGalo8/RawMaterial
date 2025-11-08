import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from './Context/UserContext'
import Layout from "./pages/Layout/Layout";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import Login from "./pages/Login/Login";
import LineWorkerDashboard from "./pages/LineWorker/LineWokerDashboard/LineWorkerDashboard";
import StoreKeeper from "./pages/LineWorker/StoreKeeper/StoreKeeper";
import UserStockData from "./pages/LineWorker/StoreKeeper/UserStockData/UserStockData";
import StockUpdate from "./pages/LineWorker/StoreKeeper/StockUpdate/StockUpdate";
import StockUpdateHistory from "./pages/LineWorker/StoreKeeper/StockUpdateHistory/StockUpdateHistory";
import PurchaseDashboard from "./pages/Purchase/PurchaseDashboard";
import AddCompany from "./pages/Purchase/AddCompany"; // Add this import
import UpdateCompany from "./pages/Purchase/UpdateCompany";
import AddVendor from "./pages/Purchase/AddVendor";
import UpdateVendor from "./pages/Purchase/UpdateVendor";
import CreatePurchaseOrder from "./pages/Purchase/CreatePurchaseOrder";
import ShowPurchaseOrder from "./pages/Purchase/ShowPurchaseOrder";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

const AppRoutes = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/" replace />} 
      />
      
      <Route path="/" element={<Layout />}>
        {/* Redirect to appropriate dashboard based on role */}
        <Route 
          index 
          element={
            user ? (
              user.role === "Admin" || user.role === "SuperAdmin" || user.role === "Superadmin" ? 
                <Navigate to="/admin-dashboard" replace /> :
              user.role === "Store" ?
                <Navigate to="/store-keeper" replace /> :
              user.role === "Purchase" ?
                <Navigate to="/purchase-dashboard" replace /> :
                <Navigate to="/lineworker-dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Admin", "SuperAdmin", "Superadmin", "Testing"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* StoreKeeper Routes */}
        <Route 
          path="store-keeper" 
          element={
            <ProtectedRoute allowedRoles={["Store"]}>
              <StoreKeeper />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="user-stock-data" 
          element={
            <ProtectedRoute allowedRoles={["Store"]}>
              <UserStockData />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="stock-update" 
          element={
            <ProtectedRoute allowedRoles={["Store"]}>
              <StockUpdate />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="stock-update-history" 
          element={
            <ProtectedRoute allowedRoles={["Store"]}>
              <StockUpdateHistory />
            </ProtectedRoute>
          } 
        />
        
        {/* Line Worker Routes */}
        <Route 
          path="lineworker-dashboard" 
          element={
            <ProtectedRoute allowedRoles={[
              "MPC Work", 
              "Assemble", 
              "Diassemble", 
              "Stamping", 
              "Testing", 
              "Winding", 
              "Winding Connection"
            ]}>
              <LineWorkerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Purchase Routes */}
        <Route 
          path="purchase-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Purchase"]}>
              <PurchaseDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Add Company Route */}
        <Route 
          path="add-company" 
          element={
            <ProtectedRoute allowedRoles={["Purchase"]}>
              <AddCompany />
            </ProtectedRoute>
          } 
        />

         <Route 
          path="update-company" 
          element={
            <ProtectedRoute allowedRoles={["Purchase"]}>
              <UpdateCompany />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="add-vendor" 
          element={
            <ProtectedRoute allowedRoles={["Purchase"]}>
              <AddVendor />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="update-vendor" 
          element={
            <ProtectedRoute allowedRoles={["Purchase"]}>
              <UpdateVendor />
            </ProtectedRoute>
          } 
        />

         <Route 
          path="create-purchase-order" 
          element={
            <ProtectedRoute allowedRoles={["Purchase"]}>
              <CreatePurchaseOrder />
            </ProtectedRoute>
          } 
        />

         <Route 
          path="show-purchase-orders" 
          element={
            <ProtectedRoute allowedRoles={["Purchase"]}>
              <ShowPurchaseOrder />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
};

const App = () => {
  return ( 
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;