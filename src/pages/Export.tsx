import { useEffect, useState } from 'react';
import { ExportedMindMap } from '@/components/mindmap/ExportedMindMap';
import { loadMindMap } from '@/utils/mindmapStorage';
import { useSearchParams } from 'react-router-dom';

const Export = () => {
  const [searchParams] = useSearchParams();
  const [mindMapData, setMindMapData] = useState<any>(null);
  
  useEffect(() => {
    const name = searchParams.get('name');
    if (name) {
      const data = loadMindMap(name);
      if (data) {
        setMindMapData(data);
      }
    }
  }, [searchParams]);

  if (!mindMapData) {
    return <div className="flex items-center justify-center h-screen">Loading mind map...</div>;
  }

  return <ExportedMindMap nodes={mindMapData.nodes} edges={mindMapData.edges} />;
};

export default Export;