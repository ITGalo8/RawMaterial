// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Layout from "./pages/Layout/Layout";
// import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
// import Login from "./pages/Login/Login";
// import LineWorkerDashboard from "./pages/LineWorker/LineWokerDashboard/LineWorkerDashboard";
// import StoreKeeper from "./pages/LineWorker/StoreKeeper/StoreKeeper";
// import UserStockData from "./pages/LineWorker/StoreKeeper/UserStockData/UserStockData";
// import StockUpdate from "./pages/LineWorker/StoreKeeper/StockUpdate/StockUpdate";
// import StockUpdateHistory from "./pages/LineWorker/StoreKeeper/StockUpdateHistory/StockUpdateHistory";

// const App = () => {
//   return ( 
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Layout />}>
//           <Route path="admin-dashboard" element={<AdminDashboard />} />
//            <Route path="store-keeper" element={<StoreKeeper />} />
//            <Route path="user-stock-data" element={<UserStockData />} />
//            <Route path="stock-update" element={<StockUpdate />} />
//            <Route path="stock-update-history" element={<StockUpdateHistory />} />
//           <Route
//             path="lineworker-dashboard"
//             element={<LineWorkerDashboard />}
//           />
//         </Route>
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// App.js
// App.js
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