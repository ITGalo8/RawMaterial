import React from "react";
import { Outlet } from "react-router-dom";
import SideMenubar from "../../components/SidebarMenu/SideMenubar";

const Layout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideMenubar />
      <main style={{ flex: 1, padding: "20px", overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;