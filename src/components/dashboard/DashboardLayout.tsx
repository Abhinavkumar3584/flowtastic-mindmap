
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Map, 
  BarChart2, 
  Settings, 
  Menu, 
  LogOut, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Exam Management",
      path: "/admin/exams",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Mind Maps",
      path: "/admin/mindmaps",
      icon: <Map className="h-5 w-5" />,
    },
    {
      name: "Statistics",
      path: "/admin/stats",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="md:hidden bg-white p-4 shadow flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu />
        </Button>
        <h1 className="font-bold text-lg">Admin Dashboard</h1>
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] md:h-screen">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform md:relative md:translate-x-0`}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold">Exam Admin</h2>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
                {user?.email.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.email || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
