import { MindMapData, WorkspaceSettings } from "@/components/mindmap/types";

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

// Map nodeType to actual type for proper rendering
const getNodeType = (nodeTypeValue: string | undefined): string => {
  const nodeTypeMap: Record<string, string> = {
    'title': 'base', 
    'topic': 'base',
    'subtopic': 'base',
    'paragraph': 'base',
    'section': 'section',
    'checklist': 'checklist',
    'timeline': 'timeline',
    'resource': 'resource',
    'circle': 'circle',
    'rectangle': 'rectangle',
    'square': 'square',
    'triangle': 'triangle',
    'flashcard': 'flashcard',
    'quiz': 'quiz',
    'mindmap': 'mindmap',
    'note': 'note',
    'concept': 'concept'
  };

  // Return the mapped type or default to 'base' if not found
  return nodeTypeValue && nodeTypeMap[nodeTypeValue] ? nodeTypeMap[nodeTypeValue] : 'base';
};

// Check if node is within workspace boundaries
const isNodeInWorkspaceArea = (node: any, workspaceSettings: WorkspaceSettings): boolean => {
  if (!workspaceSettings || !workspaceSettings.visible) {
    return true; // If workspace is not active, include all nodes
  }
  
  const halfWidth = workspaceSettings.width / 2;
  const nodeX = node.position.x;
  
  // Check if node is within the workspace boundaries
  return nodeX >= -halfWidth && nodeX <= halfWidth;
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
    
    // Extract workspace settings
    const workspaceSettings = mindMap.workspaceSettings || {
      width: 800,
      visible: false
    };
    
    // Validate and fix nodes if necessary
    if (!Array.isArray(mindMap.nodes)) {
      console.error('Invalid nodes array in mind map:', name);
      mindMap.nodes = [];
    } else {
      // Filter out invalid nodes
      mindMap.nodes = mindMap.nodes.filter(node => validateNodeStructure(node));
      
      // Filter nodes based on workspace boundaries
      mindMap.nodes = mindMap.nodes.filter(node => isNodeInWorkspaceArea(node, workspaceSettings));
      
      // Ensure each node has the proper type
      mindMap.nodes = mindMap.nodes.map(node => {
        // Set the node type based on data.nodeType
        if (node.data && node.data.nodeType) {
          node.type = getNodeType(node.data.nodeType);
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
      
      // Only keep edges where both source and target nodes are within the workspace
      const nodeIds = new Set(mindMap.nodes.map(node => node.id));
      mindMap.edges = mindMap.edges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
    }

    console.log('Successfully loaded mind map:', mindMap);
    
    return {
      ...mindMap,
      workspaceSettings
    };
  } catch (error) {
    console.error('Error rendering mind map:', error);
    return null;
  }
};
