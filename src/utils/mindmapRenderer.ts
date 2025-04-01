
import { MindMapData } from "@/components/mindmap/types";

// Helper function to ensure safe parsing of JSON data
const safeJSONParse = (jsonString: string, fallback: any = {}): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return fallback;
  }
};

// Helper function to validate node structure
const validateNodeStructure = (node: any): boolean => {
  // Check for required properties
  if (!node.id || typeof node.id !== 'string') {
    console.error('Node missing required id property:', node);
    return false;
  }
  
  // Ensure position is valid
  if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
    console.error('Node has invalid position:', node);
    return false;
  }
  
  // Ensure data exists
  if (!node.data) {
    console.error('Node missing data property:', node);
    return false;
  }
  
  return true;
};

// Helper function to validate edge structure
const validateEdgeStructure = (edge: any): boolean => {
  // Check for required properties
  if (!edge.id || typeof edge.id !== 'string') {
    console.error('Edge missing required id property:', edge);
    return false;
  }
  
  if (!edge.source || !edge.target) {
    console.error('Edge missing required source/target properties:', edge);
    return false;
  }
  
  return true;
};

export const renderMindMap = (name: string): MindMapData | null => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps');
    if (!mindmapsData) {
      console.error('No mind maps found in storage');
      return null;
    }

    const mindmaps = safeJSONParse(mindmapsData, {});
    const mindMap = mindmaps[name];

    if (!mindMap) {
      console.error('Mind map not found:', name);
      return null;
    }
    
    // Validate and fix nodes if necessary
    if (!Array.isArray(mindMap.nodes)) {
      console.error('Invalid nodes array in mind map:', name);
      mindMap.nodes = [];
    } else {
      // Filter out invalid nodes
      mindMap.nodes = mindMap.nodes.filter(node => validateNodeStructure(node));
      
      // Ensure each node has the proper type
      mindMap.nodes = mindMap.nodes.map(node => {
        // If node.type is missing but data.nodeType exists, set the type
        if (!node.type && node.data && node.data.nodeType) {
          node.type = node.data.nodeType;
        }
        
        // Default to 'base' type if no type is specified
        if (!node.type) {
          node.type = 'base';
        }
        
        return node;
      });
    }
    
    // Validate and fix edges if necessary
    if (!Array.isArray(mindMap.edges)) {
      console.error('Invalid edges array in mind map:', name);
      mindMap.edges = [];
    } else {
      // Filter out invalid edges
      mindMap.edges = mindMap.edges.filter(edge => validateEdgeStructure(edge));
    }

    console.log('Successfully loaded mind map:', mindMap);
    return mindMap;
  } catch (error) {
    console.error('Error rendering mind map:', error);
    return null;
  }
};
