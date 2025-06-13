import { NavLink } from "react-router";

export default function SideBar() {
  return (
    <div className="flex  ">
      {/* Sidebar for small screens
      <aside className="hidden lg:flex w-64   bg-neutral text-neutral-content p-4 py-0 flex-col min-h-screen overflow-hidden pt-6">
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
          <NavLink
            to="/dashboard/portais"
            className={({ isActive }) =>
              `btn w-full ${isActive ? "btn-warning" : "btn-ghost"}`
            }
          >
            Portais
          </NavLink>
        </nav>
      </aside> */}

      {/* Top bar for medium screens and above */}
      <header className="flex h-14  w-full bg-neutral text-neutral-content p-4 items-center justify-between">
        <h2 className="text-xl font-bold">Painel</h2>

        <nav className="flex space-x-4">
          <NavLink
            to="/dashboard/clientes"
            className={({ isActive }) =>
              `btn ${isActive ? "btn-warning" : "btn-ghost"}`
            }
          >
            Clientes
          </NavLink>
          <NavLink
            to="/dashboard/tintim"
            className={({ isActive }) =>
              `btn ${isActive ? "btn-warning" : "btn-ghost"}`
            }
          >
            TinTim
          </NavLink>
          <NavLink
            to="/dashboard/portais"
            className={({ isActive }) =>
              `btn ${isActive ? "btn-warning" : "btn-ghost"}`
            }
          >
            Portais
          </NavLink>
        </nav>
      </header>
    </div>
  );
}
