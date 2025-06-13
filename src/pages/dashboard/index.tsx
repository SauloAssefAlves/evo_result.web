import { Outlet } from "react-router";
import SideBar from "../../components/SideBar";

export default function Dashboard() {
  return (
    <div className="flex flex-col bg-gray-100 overflow-hidden">
      {/* Sidebar fixa */}
      <SideBar />

      {/* Container principal com scroll controlado */}
      <div className="flex-1 flex py-0 flex-col min-h-0 ">
        {/* Conteúdo do Dashboard - área rolável */}
        <main className="flex-1 px-6 pt-6 py-0 overflow-y-auto">
            <div className="min-h-[calc(100vh-80px)]">
            <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
}
