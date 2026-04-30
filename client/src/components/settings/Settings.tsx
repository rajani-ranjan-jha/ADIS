import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Bot, ArrowLeft } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();

  const navItems = [
    { name: "General", path: "general", icon: <SettingsIcon size={20} /> },
    { name: "Assistant", path: "assistant", icon: <Bot size={20} /> },
  ];

  return (
    <div className="h-screen w-full flex bg-app text-primary overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-b bg-sidebar flex flex-col transition-all duration-300 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-sidebar">
           <button 
             onClick={() => navigate('/')}
             className="p-2 -ml-2 rounded-lg hover:bg-sidebar-item-hover transition-colors text-secondary hover:text-primary"
           >
             <ArrowLeft size={20} />
           </button>
           <h1 className="text-xl font-bold tracking-tight text-white">Settings</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-label mb-2 mt-2">
            Preferences
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium
                ${isActive 
                  ? 'bg-sidebar-item-active text-accent shadow-[inset_3px_0_0_var(--color-accent-primary)]' 
                  : 'text-secondary hover:bg-sidebar-item-hover hover:text-primary'}
              `}
            >
              <span className="opacity-80">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-main relative overflow-x-hidden overflow-y-auto z-10">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-main-gradient pointer-events-none rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto p-8 lg:p-12 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
