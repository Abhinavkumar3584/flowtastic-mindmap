import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Export from "./pages/Export";
import ExamsData from "./pages/ExamsData";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import { Toaster } from "@/components/ui/sonner";

const hasClerk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
                 import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  if (!hasClerk) {
    return <>{element}</>;
  }
  
  return (
    <>
      <SignedIn>{element}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/export" element={<Export />} />
        <Route path="/examsdata" element={<ExamsData />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route 
          path="/admin/dashboard/*" 
          element={<ProtectedRoute element={<Dashboard />} />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
