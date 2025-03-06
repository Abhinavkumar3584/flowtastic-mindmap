
import { MindMapData } from '@/components/mindmap/types';
import { historyManager } from './historyManager';
import { autoSaveManager } from './autoSave';

export const saveMindMap = (data: MindMapData): boolean => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps') || '{}';
    const mindmaps = JSON.parse(mindmapsData);
    
    mindmaps[data.name] = {
      nodes: data.nodes,
      edges: data.edges,
      name: data.name
    };
    
    localStorage.setItem('mindmaps', JSON.stringify(mindmaps));
    console.log('Mind map saved:', data.name);
    
    // Update history manager
    historyManager.setLastSavedState(data.nodes, data.edges);
    
    // Update auto-save manager
    autoSaveManager.updateMindMapData(data);
    
    return true;
  } catch (error) {
    console.error('Error saving mind map:', error);
    return false;
  }
};

export const loadMindMap = (name: string): MindMapData | null => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps') || '{}';
    const mindmaps = JSON.parse(mindmapsData);
    const mindMap = mindmaps[name] || null;
    
    if (mindMap) {
      // Reset history when loading a new mind map
      historyManager.clear();
      
      // Set loaded state as the first history entry
      if (mindMap.nodes && mindMap.edges) {
        historyManager.saveState(mindMap.nodes, mindMap.edges);
        historyManager.setLastSavedState(mindMap.nodes, mindMap.edges);
      }
      
      // Update auto-save
      autoSaveManager.updateMindMapData(mindMap);
    }
    
    return mindMap;
  } catch (error) {
    console.error('Error loading mind map:', error);
    return null;
  }
};

export const getAllMindMaps = (): string[] => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps') || '{}';
    const mindmaps = JSON.parse(mindmapsData);
    return Object.keys(mindmaps);
  } catch (error) {
    console.error('Error getting mind maps list:', error);
    return [];
  }
};

export const deleteMindMap = (name: string): boolean => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps') || '{}';
    const mindmaps = JSON.parse(mindmapsData);
    
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
