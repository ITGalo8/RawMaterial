import { Outlet } from "react-router-dom";
import SideMenubar from '../../components/SidebarMenu/SideMenubar'

const Layout = () => {
  const role = localStorage.getItem("roleName");
  
  return (
    <div className="layout">
      <SideMenubar role={role} />
      <div className="main-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout; 