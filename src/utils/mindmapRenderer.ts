
import { MindMapData, MindMapNode, MindMapEdge, BaseNodeData } from '@/components/mindmap/types';
import { Edge, Position } from '@xyflow/react';

// Function to check if a string is a valid JSON
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// Function to check if a value is serializable to JSON
export const isSerializable = (obj: any): boolean => {
  try {
    JSON.stringify(obj);
    return true;
  } catch (e) {
    return false;
  }
};

// Function to prepare node data for serialization
export const prepareNodeData = (data: any): any => {
  if (!data) return null;
  
  // Create a new object to hold the cleaned data
  const cleanedData: any = { ...data };

  // Clean date objects
  if (cleanedData.timelineEvents) {
    cleanedData.timelineEvents = cleanedData.timelineEvents.map((event: any) => {
      // If event.date is a Date object, convert it to ISO string
      if (event.date instanceof Date) {
        return { ...event, date: event.date.toISOString() };
      }
      return event;
    });
  }

  return cleanedData;
};

// Check if a mind map with the given name exists
export const mindMapExists = (name: string): boolean => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps');
    if (!mindmapsData || !isValidJson(mindmapsData)) return false;
    
    const mindmaps = JSON.parse(mindmapsData);
    return mindmaps.some((mindmap: any) => mindmap.name === name);
  } catch (error) {
    console.error('Error checking if mind map exists:', error);
    return false;
  }
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

export const renderMindMap = (name: string): MindMapData | null => {
  try {
    const mindmapsData = localStorage.getItem('mindmaps');
    if (!mindmapsData || !isValidJson(mindmapsData)) {
      console.error('No valid mind maps data found');
      return null;
    }
    
    const mindmaps = JSON.parse(mindmapsData);
    const mindMap = mindmaps.find((mindmap: any) => mindmap.name === name);
    
    if (!mindMap) {
      console.error(`Mind map with name "${name}" not found`);
      return null;
    }
    
    // Process nodes to ensure they have correct types and handle special properties
    if (mindMap.nodes && Array.isArray(mindMap.nodes)) {
      // Validate and fix any issues with nodes
      mindMap.nodes = mindMap.nodes
        .filter((node: any) => node && typeof node === 'object')
        .map((node: MindMapNode) => {
          // Make a deep copy to avoid mutating the original
          const processedNode = { ...node };
          
          // Extract data for safety
          const data = processedNode.data ? { ...processedNode.data } : {} as BaseNodeData;
          
          // Set the node type based on data.nodeType
          if (data && data.nodeType) {
            processedNode.type = getNodeType(data.nodeType);
          } else if (!processedNode.type) {
            // Default to base type if no type is specified
            processedNode.type = 'base';
          }
          
          // Ensure node has a position
          if (!processedNode.position) {
            processedNode.position = { x: 0, y: 0 };
          }
          
          return processedNode;
        });
    } else {
      // Initialize nodes array if it doesn't exist
      mindMap.nodes = [];
    }
    
    // Process edges to ensure they are valid
    if (mindMap.edges && Array.isArray(mindMap.edges)) {
      // Validate and fix any issues with edges
      mindMap.edges = mindMap.edges
        .filter((edge: Edge) => 
          edge && typeof edge === 'object' && 
          typeof edge.source === 'string' && typeof edge.target === 'string')
        .map((edge: MindMapEdge) => {
          // Make a deep copy to avoid mutating the original
          const processedEdge = { ...edge };
          
          // Add default properties if missing
          if (!processedEdge.id) {
            processedEdge.id = `e-${edge.source}-${edge.target}`;
          }
          
          // Ensure sourceHandle and targetHandle are valid or clear them
          if (!processedEdge.sourceHandle) {
            delete processedEdge.sourceHandle;
          }
          
          if (!processedEdge.targetHandle) {
            delete processedEdge.targetHandle;
          }
          
          return processedEdge;
        });
    } else {
      // Initialize edges array if it doesn't exist
      mindMap.edges = [];
    }
    
    return mindMap as MindMapData;
  } catch (error) {
    console.error('Error rendering mind map:', error);
    return null;
  }
};
