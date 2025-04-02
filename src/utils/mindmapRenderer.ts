
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

// Filter nodes to only include those inside the workspace area
const filterNodesByWorkspace = (nodes: any[], workspaceSettings: WorkspaceSettings | undefined, viewportWidth: number): any[] => {
  if (!workspaceSettings || !workspaceSettings.enforced) {
    return nodes;
  }
  
  // Calculate workspace boundaries
  const workspaceWidth = workspaceSettings.width;
  const workspaceLeft = (viewportWidth - workspaceWidth) / 2;
  const workspaceRight = workspaceLeft + workspaceWidth;
  
  return nodes.filter(node => {
    const nodeWidth = node.width || 150; // Default width if not specified
    const nodeRight = node.position.x + nodeWidth;
    
    // Only include nodes that are entirely within the workspace
    return node.position.x >= workspaceLeft && nodeRight <= workspaceRight;
  });
};

// Filter edges to only include those connecting nodes inside the workspace
const filterEdgesByWorkspace = (edges: any[], includedNodeIds: Set<string>): any[] => {
  return edges.filter(edge => 
    includedNodeIds.has(edge.source) && includedNodeIds.has(edge.target)
  );
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
    
    // Get workspace settings
    const workspaceSettings = mindMap.workspaceSettings;
    const viewportWidth = window.innerWidth;
    
    // Validate and fix nodes if necessary
    if (!Array.isArray(mindMap.nodes)) {
      console.error('Invalid nodes array in mind map:', name);
      mindMap.nodes = [];
    } else {
      // Filter out invalid nodes
      mindMap.nodes = mindMap.nodes.filter(node => validateNodeStructure(node));
      
      // Filter nodes by workspace if enforced
      if (workspaceSettings && workspaceSettings.enforced) {
        mindMap.nodes = filterNodesByWorkspace(mindMap.nodes, workspaceSettings, viewportWidth);
      }
      
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
      
      // Filter edges to only include those connecting nodes inside the workspace
      if (workspaceSettings && workspaceSettings.enforced) {
        const includedNodeIds = new Set(mindMap.nodes.map(node => node.id));
        mindMap.edges = filterEdgesByWorkspace(mindMap.edges, includedNodeIds);
      }
    }

    console.log('Successfully loaded mind map:', mindMap);
    return mindMap;
  } catch (error) {
    console.error('Error rendering mind map:', error);
    return null;
  }
};
