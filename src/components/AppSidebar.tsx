import { Home, FolderKanban } from "lucide-react";
import { NavLink } from "react-router-dom";
const navigation = [{
  name: "Início",
  path: "/",
  icon: Home
}, {
  name: "Projetos",
  path: "/projetos",
  icon: FolderKanban
}];
export function AppSidebar() {
  return <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Devfy Test Tool</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Automation Tool</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map(item => <NavLink key={item.path} to={item.path} end={item.path === "/"} className={({
        isActive
      }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>)}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/40">
          v1.0.0
        </div>
      </div>
    </aside>;
}