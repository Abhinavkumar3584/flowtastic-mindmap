
import { useCallback } from 'react';
import { saveMindMap, loadMindMap, deleteMindMap } from '@/utils/mindmapStorage';
import { useToast } from '@/hooks/use-toast';
import { MindMapNode, MindMapEdge } from './types';

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
      saveMindMap({ nodes, edges, name });
      toast({
        title: "Success",
        description: `Saved mind map as: ${name}`,
      });
    } else {
      saveMindMap({ nodes, edges, name: currentMindMap });
      toast({
        title: "Success",
        description: `Saved changes to: ${currentMindMap}`,
      });
    }
  }, [nodes, edges, currentMindMap, setCurrentMindMap, toast]);

  return {
    handleExport,
    createNewMindMap,
    loadExistingMindMap,
    handleDeleteMindMap,
    confirmDeleteMindMap,
    saveCurrentMindMap
  };
};
