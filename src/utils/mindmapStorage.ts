
import { MindMapData } from '@/components/mindmap/types';

// Helper function to ensure safe parsing of JSON data
const safeJSONParse = (jsonString: string, fallback: any = {}): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return fallback;
  }
};

// Helper function to ensure all node properties are properly preserved
const processNodesForStorage = (nodes: any[]): any[] => {
  return nodes.map(node => {
    // Make a deep copy to avoid reference issues
    const processedNode = JSON.parse(JSON.stringify(node));
    
    // Ensure node type and data are preserved
    if (processedNode.data) {
      // Make sure nodeType is set if it's missing
      if (!processedNode.data.nodeType) {
        processedNode.data.nodeType = processedNode.type || 'topic';
      }
    }
    
    return processedNode;
  });
};

export const saveMindMap = (data: MindMapData): boolean => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps') || '{}';
    const mindmaps = safeJSONParse(mindmapsData, {});
    
    // Process nodes to ensure all properties are preserved
    const processedNodes = processNodesForStorage(data.nodes);
    
    mindmaps[data.name] = {
      nodes: processedNodes,
      edges: data.edges,
      name: data.name
    };
    
    localStorage.setItem('mindmaps', JSON.stringify(mindmaps));
    console.log('Mind map saved successfully:', data.name);
    return true;
  } catch (error) {
    console.error('Error saving mind map:', error);
    return false;
  }
};

export const loadMindMap = (name: string): MindMapData | null => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps') || '{}';
    const mindmaps = safeJSONParse(mindmapsData, {});
    
    if (!mindmaps[name]) {
      console.error('Mind map not found:', name);
      return null;
    }
    
    // Ensure loaded data has all required properties
    const loadedData = mindmaps[name];
    
    // Validate the structure of the loaded data
    if (!Array.isArray(loadedData.nodes) || !Array.isArray(loadedData.edges)) {
      console.error('Invalid mind map structure:', name);
      return null;
    }
    
    console.log('Mind map loaded successfully:', name);
    return loadedData;
  } catch (error) {
    console.error('Error loading mind map:', error);
    return null;
  }
};

export const getAllMindMaps = (): string[] => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps') || '{}';
    const mindmaps = safeJSONParse(mindmapsData, {});
    return Object.keys(mindmaps);
  } catch (error) {
    console.error('Error getting mind maps list:', error);
    return [];
  }
};

export const deleteMindMap = (name: string): boolean => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps') || '{}';
    const mindmaps = safeJSONParse(mindmapsData, {});
    
    if (mindmaps[name]) {
      delete mindmaps[name];
      localStorage.setItem('mindmaps', JSON.stringify(mindmaps));
      console.log('Mind map deleted:', name);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting mind map:', error);
    return false;
  }
};
