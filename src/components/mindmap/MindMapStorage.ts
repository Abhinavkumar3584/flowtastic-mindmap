
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MindMapData, MindMapNode, MindMapEdge, WorkspaceConfig } from './types';
import { initialNodes } from './MindMapInitialData';
import { useToast } from '@/hooks/use-toast';

// Default workspace configuration
const DEFAULT_WORKSPACE_CONFIG: WorkspaceConfig = {
  enabled: true,
  width: 800,
  x: 200,
  visible: true
};

interface SavedMindMap {
  name: string;
  data: MindMapData;
}

interface UseMindMapStorageProps {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  setNodes: React.Dispatch<React.SetStateAction<MindMapNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<MindMapEdge[]>>;
  currentMindMap: string;
  setCurrentMindMap: React.Dispatch<React.SetStateAction<string>>;
  setMindMapToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  initialNodes: MindMapNode[];
  workspace?: WorkspaceConfig;
}

export const useMindMapStorage = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  currentMindMap,
  setCurrentMindMap,
  setMindMapToDelete,
  initialNodes,
  workspace = DEFAULT_WORKSPACE_CONFIG
}: UseMindMapStorageProps) => {
  const { toast } = useToast();

  // Export the current mindmap as a JSON file
  const handleExport = useCallback((mindMapData: MindMapData) => {
    const dataStr = JSON.stringify(mindMapData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    // Create a link and trigger a download
    const exportName = mindMapData.name ? 
      `mindmap-${mindMapData.name}-${new Date().toISOString().split('T')[0]}.json` : 
      `mindmap-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();

    toast({
      title: "Export Successful",
      description: `Mind map exported as ${exportName}`,
    });
  }, [toast]);

  // Create a new mindmap
  const createNewMindMap = useCallback(() => {
    const newMindMapName = prompt("Enter a name for your new mind map:");
    
    if (!newMindMapName) return;
    
    // Check if a mind map with this name already exists
    const mindmapsData = localStorage.getItem('mindmaps');
    const mindmaps = mindmapsData ? JSON.parse(mindmapsData) : {};
    
    if (mindmaps[newMindMapName]) {
      toast({
        title: "Error",
        description: "A mind map with this name already exists",
        variant: "destructive",
      });
      return;
    }
    
    // Reset to initial state
    setNodes(initialNodes.map(node => ({ ...node, id: uuidv4() })));
    setEdges([]);
    setCurrentMindMap(newMindMapName);
    
    toast({
      title: "Success",
      description: `Created new mind map: ${newMindMapName}`,
    });
  }, [setNodes, setEdges, setCurrentMindMap, initialNodes, toast]);

  // Save the current mindmap to localStorage
  const saveCurrentMindMap = useCallback((workspace?: WorkspaceConfig) => {
    if (!currentMindMap) {
      toast({
        title: "Error",
        description: "Please create or load a mind map first",
        variant: "destructive",
      });
      return;
    }
    
    // Get existing mind maps from localStorage
    const mindmapsData = localStorage.getItem('mindmaps');
    const mindmaps = mindmapsData ? JSON.parse(mindmapsData) : {};
    
    // Save the current mind map state
    mindmaps[currentMindMap] = {
      nodes,
      edges,
      name: currentMindMap,
      workspace: workspace || DEFAULT_WORKSPACE_CONFIG
    };
    
    // Save back to localStorage
    localStorage.setItem('mindmaps', JSON.stringify(mindmaps));
    
    toast({
      title: "Success",
      description: `Saved mind map: ${currentMindMap}`,
    });
  }, [currentMindMap, nodes, edges, toast]);

  // Load a saved mindmap from localStorage
  const loadExistingMindMap = useCallback(() => {
    // Get the list of saved mind maps
    const mindmapsData = localStorage.getItem('mindmaps');
    
    if (!mindmapsData) {
      toast({
        title: "Error",
        description: "No saved mind maps found",
        variant: "destructive",
      });
      return;
    }
    
    const mindmaps = JSON.parse(mindmapsData);
    const mindMapNames = Object.keys(mindmaps);
    
    if (mindMapNames.length === 0) {
      toast({
        title: "Error",
        description: "No saved mind maps found",
        variant: "destructive",
      });
      return;
    }
    
    // Let the user select a mind map
    const mindMapToLoad = prompt(`Enter the name of the mind map to load (${mindMapNames.join(", ")}):`, mindMapNames[0]);
    
    if (!mindMapToLoad || !mindmaps[mindMapToLoad]) {
      toast({
        title: "Error",
        description: `Mind map '${mindMapToLoad}' not found`,
        variant: "destructive",
      });
      return;
    }
    
    // Load the selected mind map
    const loadedMindMap = mindmaps[mindMapToLoad];
    setNodes(loadedMindMap.nodes);
    setEdges(loadedMindMap.edges);
    setCurrentMindMap(mindMapToLoad);
    
    toast({
      title: "Success",
      description: `Loaded mind map: ${mindMapToLoad}`,
    });
  }, [setNodes, setEdges, setCurrentMindMap, toast]);

  // Initialize process for deleting a mindmap
  const handleDeleteMindMap = useCallback(() => {
    // Get the list of saved mind maps
    const mindmapsData = localStorage.getItem('mindmaps');
    
    if (!mindmapsData) {
      toast({
        title: "Error",
        description: "No saved mind maps found",
        variant: "destructive",
      });
      return;
    }
    
    const mindmaps = JSON.parse(mindmapsData);
    const mindMapNames = Object.keys(mindmaps);
    
    if (mindMapNames.length === 0) {
      toast({
        title: "Error",
        description: "No saved mind maps found",
        variant: "destructive",
      });
      return;
    }
    
    // Let the user select a mind map to delete
    const mindMapToDelete = prompt(`Enter the name of the mind map to delete (${mindMapNames.join(", ")}):`, currentMindMap);
    
    if (!mindMapToDelete || !mindmaps[mindMapToDelete]) {
      toast({
        title: "Error",
        description: `Mind map '${mindMapToDelete}' not found`,
        variant: "destructive",
      });
      return;
    }
    
    // Set the mind map to delete and show confirmation dialog
    setMindMapToDelete(mindMapToDelete);
  }, [currentMindMap, setMindMapToDelete, toast]);

  // Actually delete the mindmap once confirmed
  const confirmDeleteMindMap = useCallback((mindMapToDelete: string | null) => {
    if (!mindMapToDelete) return;
    
    // Get existing mind maps from localStorage
    const mindmapsData = localStorage.getItem('mindmaps');
    if (!mindmapsData) return;
    
    const mindmaps = JSON.parse(mindmapsData);
    
    // Delete the specified mind map
    delete mindmaps[mindMapToDelete];
    
    // Save the updated mind maps back to localStorage
    localStorage.setItem('mindmaps', JSON.stringify(mindmaps));
    
    // If the current mind map was deleted, reset the current mind map
    if (currentMindMap === mindMapToDelete) {
      setCurrentMindMap('');
      setNodes(initialNodes);
      setEdges([]);
    }
    
    toast({
      title: "Success",
      description: `Deleted mind map: ${mindMapToDelete}`,
    });
  }, [currentMindMap, setCurrentMindMap, setNodes, setEdges, initialNodes, toast]);

  return {
    handleExport,
    createNewMindMap,
    loadExistingMindMap,
    saveCurrentMindMap,
    handleDeleteMindMap,
    confirmDeleteMindMap,
  };
};

// Helper function to get all mind map names - useful for ExportedMindMap component
export const getAllMindMaps = (): string[] => {
  const mindmapsData = localStorage.getItem('mindmaps');
  if (!mindmapsData) return [];
  
  const mindmaps = JSON.parse(mindmapsData);
  return Object.keys(mindmaps);
};
