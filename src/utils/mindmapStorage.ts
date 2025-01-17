import { Edge, Node } from '@xyflow/react';
import { BaseNodeData } from '@/components/mindmap/types';

export interface MindMapData {
  nodes: Node<BaseNodeData>[];
  edges: Edge[];
  name: string;
}

export const saveMindMap = (data: MindMapData) => {
  try {
    // Create mindmaps directory if it doesn't exist
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
    return mindmaps[name] || null;
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