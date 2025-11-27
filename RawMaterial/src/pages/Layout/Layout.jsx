import { Outlet } from "react-router-dom";
import SideMenubar from '../../components/SidebarMenu/SideMenubar'

const Layout = () => {
  const role = localStorage.getItem("roleName");
  
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row bg-white">
        <div className="w-[calc(100vw-85vw)] h-screen overflow-scroll p-6">
          <SideMenubar role={role} />
        </div>
        <div className="w-[calc(100vw-15vw)] h-screen overflow-scroll p-6">
          <Outlet />
        </div>
      </div>
  );
};

export default Layout; 