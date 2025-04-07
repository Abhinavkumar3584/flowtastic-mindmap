
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Export from "./pages/Export";
import ExamsData from "./pages/ExamsData";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/export" element={<Export />} />
        <Route path="/examsdata" element={<ExamsData />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
