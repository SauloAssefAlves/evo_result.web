import { NavLink } from "react-router";

export default function SideBar() {
  return (
    <aside className="w-64 bg-neutral text-neutral-content p-4 flex flex-col min-h-screen overflow-hidden">
      <h2 className="text-xl font-bold mb-6">Painel</h2>

      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard/clientes"
          className={({ isActive }) =>
            `btn w-full ${isActive ? "btn-warning" : "btn-ghost"}`
          }
        >
          Clientes
        </NavLink>
        <NavLink
          to="/dashboard/tintim"
          className={({ isActive }) =>
            `btn w-full ${isActive ? "btn-warning" : "btn-ghost"}`
          }
        >
          TinTim
        </NavLink>
      </nav>
    </aside>
  );
}
