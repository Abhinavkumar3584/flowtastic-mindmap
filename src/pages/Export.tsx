import { useEffect, useState } from 'react';
import { ExportedMindMap } from '@/components/mindmap/ExportedMindMap';
import { loadMindMap } from '@/utils/mindmapStorage';
import { useSearchParams } from 'react-router-dom';
import { MindMapData } from '@/utils/mindmapStorage';

const Export = () => {
  const [searchParams] = useSearchParams();
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const name = searchParams.get('name');
    if (!name) {
      setError('No mind map name provided');
      return;
    }

    const data = loadMindMap(name);
    if (data) {
      console.log('Loading mind map data:', data);
      if (!data.nodes || !data.edges) {
        setError('Invalid mind map data structure');
        return;
      }
      setMindMapData(data);
      console.log('Successfully loaded mind map data:', data);
    } else {
      console.error('Failed to load mind map:', name);
      setError(`Failed to load mind map: ${name}`);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!mindMapData) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading mind map...
      </div>
    );
  }

  return <ExportedMindMap nodes={mindMapData.nodes} edges={mindMapData.edges} />;
};

export default Export;