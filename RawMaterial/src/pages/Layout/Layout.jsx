import { Outlet } from "react-router-dom";
import SideMenubar from "../../components/SidebarMenu/SideMenubar";

const Layout = () => {
  const role = localStorage.getItem("roleName") ?? "guest";

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      <aside className="w-[220px] sm:w-[240px] md:w-[260px] h-screen border-r bg-white">
        <div className="h-full overflow-y-auto">
          <SideMenubar role={role} />
        </div>
      </aside>
      <main className="flex-1 h-screen overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
