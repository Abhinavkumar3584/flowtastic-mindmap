
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useToast } from '@/hooks/use-toast';
import { MindMapData, MindMapNode, MindMapEdge, WorkspaceSettings } from './types';
import { initialNodes } from './MindMapInitialData';
import { saveMindMap, loadMindMap, getAllMindMaps, deleteMindMap } from '@/utils/mindmapStorage';

interface UseMindMapStorageProps {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  setNodes: React.Dispatch<React.SetStateAction<MindMapNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<MindMapEdge[]>>;
  currentMindMap: string;
  setCurrentMindMap: React.Dispatch<React.SetStateAction<string>>;
  setMindMapToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  initialNodes: MindMapNode[];
  workspaceSettings?: WorkspaceSettings;
  setWorkspaceSettings?: React.Dispatch<React.SetStateAction<WorkspaceSettings>>;
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
  workspaceSettings,
  setWorkspaceSettings
}: UseMindMapStorageProps) => {
  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();

  // Save the current mind map
  const saveCurrentMindMap = useCallback(() => {
    if (!currentMindMap) {
      toast({
        title: "Error",
        description: "Please name your mind map before saving",
        variant: "destructive",
      });
      return;
    }

    const success = saveMindMap({ 
      nodes, 
      edges, 
      name: currentMindMap,
      workspaceSettings
    });

    if (success) {
      toast({
        title: "Success",
        description: `Mind map "${currentMindMap}" saved successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save mind map",
        variant: "destructive",
      });
    }
  }, [nodes, edges, currentMindMap, toast, workspaceSettings]);

  // Create a new mind map
  const createNewMindMap = useCallback((name: string) => {
    // Check if a mind map with this name already exists
    const existingMaps = getAllMindMaps();
    if (existingMaps.includes(name)) {
      toast({
        title: "Error",
        description: `A mind map named "${name}" already exists`,
        variant: "destructive",
      });
      return;
    }

    // Reset the canvas
    setNodes(initialNodes);
    setEdges([]);
    setCurrentMindMap(name);

    // Save the new mind map
    const success = saveMindMap({ 
      nodes: initialNodes, 
      edges: [], 
      name,
      workspaceSettings 
    });

    if (success) {
      toast({
        title: "Success",
        description: `New mind map "${name}" created`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to create new mind map",
        variant: "destructive",
      });
    }
  }, [initialNodes, setNodes, setEdges, setCurrentMindMap, toast, workspaceSettings]);

  // Load an existing mind map
  const loadExistingMindMap = useCallback((name: string) => {
    const data = loadMindMap(name);
    
    if (data) {
      // Check if the data has the proper structure
      if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        setNodes(data.nodes);
        setEdges(data.edges);
        setCurrentMindMap(name);
        
        // Load workspace settings if they exist
        if (data.workspaceSettings && setWorkspaceSettings) {
          setWorkspaceSettings(data.workspaceSettings);
        }
        
        // Fit view to show all nodes
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.2 });
        }, 100);
        
        toast({
          title: "Success",
          description: `Mind map "${name}" loaded successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid mind map structure",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: `Failed to load mind map "${name}"`,
        variant: "destructive",
      });
    }
  }, [setNodes, setEdges, setCurrentMindMap, reactFlowInstance, toast, setWorkspaceSettings]);

  // Handle exporting the mind map
  const handleExport = useCallback(() => {
    if (!currentMindMap) {
      toast({
        title: "Error",
        description: "Please save your mind map before exporting",
        variant: "destructive",
      });
      return;
    }

    // Save the current state before exporting
    saveCurrentMindMap();
    
    // Navigate to the export view
    window.open(`/export?map=${encodeURIComponent(currentMindMap)}`, '_blank');
    
    toast({
      title: "Info",
      description: "Opening export view in new tab",
    });
  }, [currentMindMap, saveCurrentMindMap, toast]);

  // Handle requesting deletion of a mind map
  const handleDeleteMindMap = useCallback((name: string) => {
    setMindMapToDelete(name);
  }, [setMindMapToDelete]);

  // Confirm deletion of a mind map
  const confirmDeleteMindMap = useCallback((name: string | null) => {
    if (!name) return;
    
    const success = deleteMindMap(name);
    
    if (success) {
      // If the deleted mind map is the current one, reset the canvas
      if (name === currentMindMap) {
        setNodes(initialNodes);
        setEdges([]);
        setCurrentMindMap('');
      }
      
      toast({
        title: "Success",
        description: `Mind map "${name}" deleted successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to delete mind map "${name}"`,
        variant: "destructive",
      });
    }
  }, [currentMindMap, setNodes, setEdges, setCurrentMindMap, initialNodes, toast]);

  return {
    saveCurrentMindMap,
    createNewMindMap,
    loadExistingMindMap,
    handleExport,
    handleDeleteMindMap,
    confirmDeleteMindMap,
  };
};
