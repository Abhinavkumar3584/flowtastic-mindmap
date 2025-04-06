
import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  PenSquare,
  BarChart3 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Dashboard sub-pages
import DashboardHome from '@/components/dashboard/DashboardHome';
import ExamManagement from '@/components/dashboard/ExamManagement';
import MindMapManagement from '@/components/dashboard/MindMapManagement';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import DashboardStats from '@/components/dashboard/DashboardStats';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: BookOpen, label: 'Exam Management', path: '/admin/dashboard/exams' },
    { icon: PenSquare, label: 'Mind Maps', path: '/admin/dashboard/mindmaps' },
    { icon: BarChart3, label: 'Statistics', path: '/admin/dashboard/stats' },
    { icon: Settings, label: 'Settings', path: '/admin/dashboard/settings' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} relative`}>
        <div className="sticky top-0 inset-x-0">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} h-16 px-4 border-b`}>
            {sidebarOpen && <h1 className="text-lg font-semibold">Admin Portal</h1>}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`${!sidebarOpen ? 'mx-auto' : ''}`}
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          </div>
          
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-2 rounded-md transition-colors ${
                  isActiveRoute(item.path) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}

            <Separator className="my-4" />
            
            <Link 
              to="/" 
              className={`flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors`}
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="ml-3">Back to Site</span>}
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <h2 className="text-xl font-semibold">
              {navItems.find(item => isActiveRoute(item.path))?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <UserButton />
            </div>
          </div>
        </header>
        <div className="p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="exams" element={<ExamManagement />} />
            <Route path="mindmaps" element={<MindMapManagement />} />
            <Route path="stats" element={<DashboardStats />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
