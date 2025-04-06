
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Export from './pages/Export';
import ExamsData from './pages/ExamsData';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/export" element={<Export />} />
        <Route path="/examsdata" element={<ExamsData />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
