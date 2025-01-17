import { Edge } from '@xyflow/react';
import { BaseNodeData, MindMapNode } from '@/components/mindmap/types';

export interface MindMapData {
  nodes: MindMapNode[];
  edges: Edge[];
  name: string;
}

export const saveMindMap = (data: MindMapData) => {
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
    const data = mindmaps[name];
    
    if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      console.error('Invalid mind map data structure for:', name);
      return null;
    }
    
    console.log('Loading mind map data for:', name, data);
    return data;
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