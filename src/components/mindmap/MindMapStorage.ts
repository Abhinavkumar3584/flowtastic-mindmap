
import { useCallback, useState } from 'react';
import { saveMindMap, loadMindMap, deleteMindMap } from '@/utils/mindmapStorage';
import { useToast } from '@/hooks/use-toast';
import { MindMapData, ExamCategory } from './types';
import { MindMapHeaderData } from './MindMapHeader';

interface UseMindMapStorageProps {
  nodes: any[];
  edges: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  setEdges: React.Dispatch<React.SetStateAction<any[]>>;
  currentMindMap: string;
  setCurrentMindMap: React.Dispatch<React.SetStateAction<string>>;
  setMindMapToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  initialNodes: any[];
  headerData?: MindMapHeaderData;
  setHeaderData?: React.Dispatch<React.SetStateAction<MindMapHeaderData>>;
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
  headerData,
  setHeaderData
}: UseMindMapStorageProps) => {
  const { toast } = useToast();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

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
      
      // Load header data if available
      if (data.headerData && setHeaderData) {
        setHeaderData(data.headerData);
      }
      
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
  }, [setNodes, setEdges, setCurrentMindMap, setHeaderData, toast]);

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

  const openSaveDialog = useCallback(() => {
    setIsSaveDialogOpen(true);
  }, []);

  const saveCurrentMindMap = useCallback((name: string, examCategory: ExamCategory, subExamName: string) => {
    const success = saveMindMap({ 
      nodes, 
      edges, 
      name,
      examCategory,
      subExamName,
      headerData
    });
    
    if (success) {
      setCurrentMindMap(name);
      toast({
        title: "Success",
        description: `Saved mind map: ${name} under ${examCategory} - ${subExamName}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save mind map",
        variant: "destructive",
      });
    }
  }, [nodes, edges, headerData, setCurrentMindMap, toast]);

  return {
    handleExport,
    createNewMindMap,
    loadExistingMindMap,
    handleDeleteMindMap,
    confirmDeleteMindMap,
    saveCurrentMindMap,
    openSaveDialog,
    isSaveDialogOpen,
    setIsSaveDialogOpen
  };
};
