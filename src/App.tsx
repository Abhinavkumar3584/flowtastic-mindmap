
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Export from './pages/Export';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AuthGuard from './components/AuthGuard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } />
        
        <Route path="/admin" element={
          <AuthGuard requiredRole="admin">
            <Admin />
          </AuthGuard>
        } />
        
        {/* Mind map editor route */}
        <Route path="/" element={
          <AuthGuard>
            <Index />
          </AuthGuard>
        } />
        
        {/* Export route */}
        <Route path="/export" element={<Export />} />
        
        {/* Redirect to login by default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
