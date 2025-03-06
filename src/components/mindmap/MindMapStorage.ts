
import { useCallback, useEffect } from 'react';
import { saveMindMap, loadMindMap, deleteMindMap } from '@/utils/mindmapStorage';
import { useToast } from '@/hooks/use-toast';
import { MindMapNode, MindMapEdge } from './types';
import { historyManager } from '@/utils/historyManager';
import { autoSaveManager } from '@/utils/autoSave';

interface UseMindMapStorageProps {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  setNodes: React.Dispatch<React.SetStateAction<MindMapNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<MindMapEdge[]>>;
  currentMindMap: string;
  setCurrentMindMap: React.Dispatch<React.SetStateAction<string>>;
  setMindMapToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  initialNodes: MindMapNode[];
}

export const useMindMapStorage = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  currentMindMap,
  setCurrentMindMap,
  setMindMapToDelete,
  initialNodes
}: UseMindMapStorageProps) => {
  const { toast } = useToast();

  // Initialize history
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      // Add initial state to history
      historyManager.saveState(nodes, edges);
    }
  }, []);

  // Undo handler
  const handleUndo = useCallback(() => {
    const success = historyManager.undo(setNodes, setEdges);
    if (!success) {
      toast({
        title: "Cannot Undo",
        description: "No more actions to undo",
        variant: "default",
      });
    }
  }, [setNodes, setEdges, toast]);

  // Redo handler
  const handleRedo = useCallback(() => {
    const success = historyManager.redo(setNodes, setEdges);
    if (!success) {
      toast({
        title: "Cannot Redo",
        description: "No more actions to redo",
        variant: "default",
      });
    }
  }, [setNodes, setEdges, toast]);

  // Auto-save handlers
  const toggleAutoSave = useCallback((enabled: boolean) => {
    autoSaveManager.updateConfig({ enabled });
    
    if (enabled && currentMindMap) {
      autoSaveManager.updateMindMapData({
        nodes,
        edges,
        name: currentMindMap
      });
      toast({
        title: "Auto Save Enabled",
        description: `Mind map will be saved automatically`,
      });
    } else if (enabled && !currentMindMap) {
      toast({
        title: "Warning",
        description: "Save your mind map first to enable auto-save",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Auto Save Disabled",
        description: "Automatic saving has been turned off",
      });
    }
  }, [currentMindMap, nodes, edges, toast]);

  const updateAutoSaveInterval = useCallback((interval: number) => {
    autoSaveManager.updateConfig({ interval });
    toast({
      title: "Auto Save Updated",
      description: `Interval set to ${interval / 1000} seconds`,
    });
  }, [toast]);

  const handleExport = useCallback(() => {
    if (!currentMindMap) {
      toast({
        title: "Error",
        description: "Please save your mind map before exporting",
        variant: "destructive",
      });
      return;
    }
    
    const exportUrl = `/export?name=${encodeURIComponent(currentMindMap)}`;
    window.open(exportUrl, '_blank');
  }, [currentMindMap, toast]);

  const createNewMindMap = useCallback(() => {
    const name = prompt('Enter a name for the new mind map:');
    if (!name) return;

    const success = saveMindMap({
      nodes: initialNodes,
      edges: [],
      name
    });

    if (success) {
      setNodes(initialNodes);
      setEdges([]);
      setCurrentMindMap(name);
      
      // Reset history for new mind map
      historyManager.clear();
      historyManager.saveState(initialNodes, []);
      
      toast({
        title: "Success",
        description: `Created new mind map: ${name}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to create new mind map",
        variant: "destructive",
      });
    }
  }, [initialNodes, setNodes, setEdges, setCurrentMindMap, toast]);

  const loadExistingMindMap = useCallback((name: string) => {
    const data = loadMindMap(name);
    if (data) {
      setNodes(data.nodes);
      setEdges(data.edges);
      setCurrentMindMap(name);
      
      // Reset history for loaded mind map
      historyManager.clear();
      historyManager.saveState(data.nodes, data.edges);
      
      toast({
        title: "Success",
        description: `Loaded mind map: ${name}`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to load mind map: ${name}`,
        variant: "destructive",
      });
    }
  }, [setNodes, setEdges, setCurrentMindMap, toast]);

  const handleDeleteMindMap = useCallback((name: string) => {
    setMindMapToDelete(name);
  }, [setMindMapToDelete]);

  const confirmDeleteMindMap = useCallback((mindMapToDelete: string | null) => {
    if (!mindMapToDelete) return;

    const success = deleteMindMap(mindMapToDelete);
    if (success) {
      if (currentMindMap === mindMapToDelete) {
        setNodes(initialNodes);
        setEdges([]);
        setCurrentMindMap('');
        
        // Reset history after deletion
        historyManager.clear();
        historyManager.saveState(initialNodes, []);
      }
      toast({
        title: "Success",
        description: `Deleted mind map: ${mindMapToDelete}`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to delete mind map: ${mindMapToDelete}`,
        variant: "destructive",
      });
    }
  }, [currentMindMap, initialNodes, setNodes, setEdges, setCurrentMindMap, toast]);

  const saveCurrentMindMap = useCallback(() => {
    if (!currentMindMap) {
      const name = prompt('Enter a name for the mind map:');
      if (!name) return;
      setCurrentMindMap(name);
      const saved = saveMindMap({ nodes, edges, name });
      if (saved) {
        toast({
          title: "Success",
          description: `Saved mind map as: ${name}`,
        });
      }
    } else {
      const saved = saveMindMap({ nodes, edges, name: currentMindMap });
      if (saved) {
        toast({
          title: "Success",
          description: `Saved changes to: ${currentMindMap}`,
        });
      }
    }
  }, [nodes, edges, currentMindMap, setCurrentMindMap, toast]);

  return {
    handleExport,
    createNewMindMap,
    loadExistingMindMap,
    handleDeleteMindMap,
    confirmDeleteMindMap,
    saveCurrentMindMap,
    handleUndo,
    handleRedo,
    toggleAutoSave,
    updateAutoSaveInterval
  };
};
