
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Export from "./pages/Export";
import ExamsData from "./pages/ExamsData";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import { Toaster } from "@/components/ui/sonner";

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
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } 
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
