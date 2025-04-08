
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Export from "./pages/Export";
import ExamsData from "./pages/ExamsData";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import ExamManagement from "./pages/dashboard/ExamManagement";
import MindMapManagement from "./pages/dashboard/MindMapManagement";
import DashboardStats from "./pages/dashboard/DashboardStats";
import Settings from "./pages/dashboard/Settings";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "./hooks/useAuth";
import DashboardLayout from "./components/dashboard/DashboardLayout";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/export" element={<Export />} />
        <Route path="/examsdata" element={<ExamsData />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        
        {/* Protected dashboard routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="exams" element={<ExamManagement />} />
          <Route path="mindmaps" element={<MindMapManagement />} />
          <Route path="stats" element={<DashboardStats />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
