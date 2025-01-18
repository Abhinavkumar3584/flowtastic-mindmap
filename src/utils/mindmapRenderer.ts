import { MindMapData } from "@/components/mindmap/types";

export const renderMindMap = (name: string): MindMapData | null => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps');
    if (!mindmapsData) {
      console.error('No mind maps found in storage');
      return null;
    }

    const mindmaps = JSON.parse(mindmapsData);
    const mindMap = mindmaps[name];

    if (!mindMap) {
      console.error('Mind map not found:', name);
      return null;
    }

    console.log('Successfully loaded mind map:', mindMap);
    return mindMap;
  } catch (error) {
    console.error('Error rendering mind map:', error);
    return null;
  }
};