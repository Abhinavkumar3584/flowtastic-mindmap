
import { MindMap } from "@/components/mindmap/MindMap";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadMindMap } from "@/utils/mindmapStorage";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [mindMapToLoad, setMindMapToLoad] = useState<string | null>(null);

  useEffect(() => {
    const mapName = searchParams.get('map');
    if (mapName) {
      setMindMapToLoad(mapName);
    }
  }, [searchParams]);

  return <MindMap initialMapToLoad={mindMapToLoad} />;
};

export default Index;
