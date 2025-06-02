
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MindMapEditor from "./pages/MindMapEditor";
import MindMapViewer from "./pages/MindMapViewer";
import ExamCatalog from "./pages/ExamCatalog";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MindMapEditor />} />
        <Route path="/view" element={<MindMapViewer />} />
        <Route path="/exams" element={<ExamCatalog />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
