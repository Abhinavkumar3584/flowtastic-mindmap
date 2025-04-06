import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Export from './pages/Export';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/export" element={<Export />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;