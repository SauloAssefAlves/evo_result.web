import { Outlet } from "react-router";
import SideBar from "../../components/SideBar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <SideBar />

      {/* Conteúdo do Dashboard */}
      <main className="flex-1 p-6">
     

        {/* Outlet para carregar as páginas internas */}
        <Outlet />
      </main>
    </div>
  );
}
