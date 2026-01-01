// import { Outlet } from "react-router-dom";
// import SideMenubar from '../../components/SidebarMenu/SideMenubar'

// const Layout = () => {
//   const role = localStorage.getItem("roleName");
  
//   return (
//     <div className="h-screen w-screen overflow-hidden flex flex-row bg-white">
//         <div className="w-[calc(100vw-85vw)] h-screen overflow-scroll p-6">
//           <SideMenubar role={role} />
//         </div>
//         <div className="w-[calc(100vw-15vw)] h-screen overflow-scroll p-6">
//           <Outlet />
//         </div>
//       </div>
//   );
// };

// export default Layout; 

import { Outlet } from "react-router-dom";
import SideMenubar from "../../components/SidebarMenu/SideMenubar";

const Layout = () => {
  const role = localStorage.getItem("roleName");

  return (
    <div className="h-screen w-screen flex bg-white overflow-hidden">

      {/* Sidebar - fixed width */}
      <div className="w-[260px] h-full overflow-y-auto bg-white border-r">
        <SideMenubar role={role} />
      </div>

      {/* Main content fills rest of screen */}
      <div className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;
