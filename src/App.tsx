
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Export from './pages/Export';
import ExamTabs from './components/ExamTabs';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/export" element={<Export />} />
        <Route path="/exams" element={<ExamTabs />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
