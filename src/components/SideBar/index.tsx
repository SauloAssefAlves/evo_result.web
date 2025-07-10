import { NavLink, Outlet } from "react-router";
import { BsFillMoonFill, BsPeopleFill } from "react-icons/bs";
import { SiRedhat } from "react-icons/si";
import { TbWorldWww } from "react-icons/tb";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useTheme } from "../ThemeProvider";
import { BsFillSunFill } from "react-icons/bs";
import { useState, useEffect } from "react";

export default function SideBar() {
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true); // Inicia colapsada

  // Detectar tamanho da tela e ajustar sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsCollapsed(false); // Desktop: sempre expandida por padrão
      } else {
        setIsCollapsed(true); // Mobile: sempre colapsada por padrão
      }
    };

    // Executar na inicialização
    handleResize();
    
    // Escutar mudanças de tamanho
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-neutral overflow-y-hidden">
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-neutral opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-neutral text-neutral-content p-2 rounded-md"
      >
        {isCollapsed ? <HiMenuAlt3 size={24} /> : <HiX size={24} />}
        
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 bg-neutral text-neutral-content p-4 flex flex-col min-h-screen overflow-hidden z-40 transition-all duration-300
        ${isCollapsed 
          ? 'w-16 md:w-36' // Mobile: muito pequena, Desktop: normal
          : 'w-58' // Sempre normal quando expandida
        }
        
        ${isCollapsed && 'md:block'} // No desktop, sempre visível
        ${!isCollapsed || 'max-md:hidden'} // No mobile, esconder quando colapsada
      `}>
        
        {/* Botão toggle para desktop */}
        <div className="hidden md:flex items-end justify-end pt-2 mb-2">
          <button
            onClick={toggleSidebar}
            className="text-neutral-content hover:text-primary transition-colors"
          >
            <HiMenuAlt3 size={20} />
            
          </button>
        </div>
        {/* Theme toggle */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={toggleTheme}
            className="w-10 relative cursor-pointer"
          >
            <div className="flex items-center justify-center">
              <div className="relative text-center flex items-center justify-center">
                <BsFillSunFill
                  className={`absolute transition-all duration-500 text-primary ${
                    theme === "evo-theme-dark"
                      ? "-translate-x-10 opacity-0"
                      : "translate-x-0 opacity-100"
                  }`}
                />
                <BsFillMoonFill
                  className={`absolute transition-all duration-500  ${
                    theme === "evo-theme-dark"
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                  }`}
                />
              </div>
            </div>
          </button>
        </div>

        {/* Title */}
        <div className="pt-6 flex flex-col">
          {!isCollapsed && (
            <h2 className="text-xl font-bold mb-6 flex items-center justify-center flex-1">
              Painel <span className="text-primary">&nbsp;EVO</span>
            </h2>
          )}

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/dashboard/clientes"
              className={({ isActive }) =>
                `btn w-full ${isCollapsed ? 'px-2' : 'justify-start'} ${
                  isActive ? "btn-primary" : "btn-ghost"
                }`
              }
              title="Clientes"
            >
              <BsPeopleFill className={isCollapsed ? "" : "mr-2"} />
              {!isCollapsed && "Clientes"}
            </NavLink>
            <NavLink
              to="/dashboard/tintim"
              className={({ isActive }) =>
                `btn w-full ${isCollapsed ? 'px-2' : 'justify-start'} ${
                  isActive ? "btn-primary" : "btn-ghost"
                }`
              }
              title="TinTim"
            >
              <SiRedhat className={isCollapsed ? "" : "mr-2"} />
              {!isCollapsed && "TinTim"}
            </NavLink>
            <NavLink
              to="/dashboard/portais"
              className={({ isActive }) =>
                `btn w-full ${isCollapsed ? 'px-2' : 'justify-start'} ${
                  isActive ? "btn-primary" : "btn-ghost"
                }`
              }
              title="Portais"
            >
              <TbWorldWww className={isCollapsed ? "" : "mr-2"} />
              {!isCollapsed && "Portais"}
            </NavLink>
          </nav>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-auto pt-4 border-t border-neutral-600">
            <div className="text-sm text-neutral-400">© 2025 Painel Admin</div>
          </div>
        )}
      </aside>

      {/* Conteúdo principal */}
      <main className={`
        flex-1 bg-base-100 p-6 transition-all duration-300
        ${isCollapsed 
          ? 'ml-16 md:ml-36' // Mobile: margem pequena, Desktop: margem normal quando colapsada
          : 'ml-58' // Margem normal quando expandida
        }
        ${!isCollapsed && 'max-md:ml-0'} // No mobile, sem margem quando expandida (sidebar sobrepõe)
      `}>
        <Outlet  />
      </main>
    </div>
  );
}
