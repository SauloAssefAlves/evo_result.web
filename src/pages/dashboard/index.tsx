import { Outlet } from "react-router";
import SideBar from "../../components/SideBar";

export default function Dashboard() {
  return (
    <div className="flex flex-col bg-gray-100 ">
      {/* Sidebar fixa */}
      <SideBar />

      {/* Container principal com scroll controlado */}
      <div className="flex-1 flex py-0 flex-col min-h-0 ">
        {/* Conteúdo do Dashboard - área rolável */}
        <main className="flex-1 bg-base-100 p-6 overflow-y-visible overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
