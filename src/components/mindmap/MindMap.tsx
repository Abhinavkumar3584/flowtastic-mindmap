
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { SectionNode } from './node-components/SectionNode';
import { ChecklistNode } from './node-components/ChecklistNode';
import { TimelineNode } from './node-components/TimelineNode';
import { ResourceNode } from './node-components/ResourceNode';
import { CircleNode } from './node-components/CircleNode';
import { RectangleNode } from './node-components/RectangleNode';
import { SquareNode } from './node-components/SquareNode';
import { TriangleNode } from './node-components/TriangleNode';
import { FlashcardNode } from './node-components/FlashcardNode';
import { QuizNode } from './node-components/QuizNode';
import { MindMapNode as MindMapNodeComponent } from './node-components/MindMapNode';
import { NoteNode } from './node-components/NoteNode';
import { ConceptNode } from './node-components/ConceptNode';
import { EdgeSettings } from './EdgeSettings';
import { initialNodes, initialEdges } from './MindMapInitialData';
import { MindMapTopBar } from './MindMapTopBar';
import { MindMapDeleteDialog } from './MindMapDeleteDialog';
import { MindMapSaveDialog } from './MindMapSaveDialog';

import { useMindMapStorage } from './MindMapStorage';
import { ComponentsSidebar } from './ComponentsSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useMindMapNodeHandlers } from './hooks/useMindMapNodeHandlers';
import { useMindMapEdgeHandlers } from './hooks/useMindMapEdgeHandlers';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, ChevronRight } from 'lucide-react';
import { TimelineSettings } from './settings/TimelineSettings';
import { ChecklistSettings } from './settings/ChecklistSettings';
import { ResourceSettings } from './settings/ResourceSettings';
import { ShapeSettings } from './settings/ShapeSettings';
import { FlashcardSettings } from './settings/FlashcardSettings';
import { QuizSettings } from './settings/QuizSettings';
import { MindMapSettings } from './settings/MindMapSettings';
import { NoteSettings } from './settings/NoteSettings';
import { ConceptSettings } from './settings/ConceptSettings';
import { NodeConnectors } from './NodeConnectors';
import { MindMapHeader, MindMapHeaderData } from './MindMapHeader';
import { mindMapHistory } from '@/utils/mindmapHistory';
import { WorkspaceBoundaryNode, WORKSPACE_WIDTH, WORKSPACE_HEIGHT, WORKSPACE_X, WORKSPACE_Y } from './WorkspaceBoundary';
import { useToast } from '@/hooks/use-toast';
import { ExamCategory } from './types';
import { 
  AutoSaveConfig, 
  initAutoSaveConfig, 
  shouldAutoSave, 
  performAutoSave 
} from '@/utils/mindmapAutoSave';

const nodeTypes: NodeTypes = {
  base: BaseNode,
  section: SectionNode,
  checklist: ChecklistNode,
  timeline: TimelineNode,
  resource: ResourceNode,
  circle: CircleNode,
  rectangle: RectangleNode,
  square: SquareNode,
  triangle: TriangleNode,
  flashcard: FlashcardNode,
  quiz: QuizNode,
  mindmap: MindMapNodeComponent,
  note: NoteNode,
  concept: ConceptNode,
  workspace: WorkspaceBoundaryNode,
};

// The workspace boundary node (always present, non-interactive)
const workspaceBoundaryNode = {
  id: '__workspace_boundary__',
  type: 'workspace' as const,
  position: { x: WORKSPACE_X, y: WORKSPACE_Y },
  data: { id: '__workspace_boundary__', label: '' } as any,
  selectable: false,
  draggable: false,
  deletable: false,
  focusable: false,
  style: { zIndex: -1 },
};

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([workspaceBoundaryNode, ...initialNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentMindMap, setCurrentMindMap] = useState<string>('');
  const [mindMapToDelete, setMindMapToDelete] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [autoSaveConfig, setAutoSaveConfig] = useState<AutoSaveConfig>(initAutoSaveConfig());
  const [headerData, setHeaderData] = useState<MindMapHeaderData>({
    title: '',
    description: '',
    subDetails: ''
  });
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const lastChangeRef = useRef<number>(Date.now());

  // Node handlers
  const { 
    deleteNode, 
    updateNodeData, 
    addNode,
    copyNode,
    pasteNode,
    duplicateNode
  } = useMindMapNodeHandlers({ 
    nodes, 
    setNodes 
  });

  // Edge handlers
  const { selectedEdge, updateEdge, onConnect, onEdgeClick } = useMindMapEdgeHandlers({
    setEdges
  });

  // Storage handlers
  const {
    handleExport,
    createNewMindMap,
    loadExistingMindMap,
    handleDeleteMindMap,
    confirmDeleteMindMap,
    saveCurrentMindMap,
    openSaveDialog,
    isSaveDialogOpen,
    setIsSaveDialogOpen
  } = useMindMapStorage({
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
  });

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const previousState = mindMapHistory.undo(nodes, edges);
    if (previousState) {
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      toast({
        title: "Undo",
        description: "Previous action undone",
      });
      updateUndoRedoState();
    }
  }, [nodes, edges, setNodes, setEdges, toast]);

  const handleRedo = useCallback(() => {
    const nextState = mindMapHistory.redo(nodes, edges);
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      toast({
        title: "Redo",
        description: "Action redone",
      });
      updateUndoRedoState();
    }
  }, [nodes, edges, setNodes, setEdges, toast]);

  const updateUndoRedoState = useCallback(() => {
    setCanUndo(mindMapHistory.canUndo());
    setCanRedo(mindMapHistory.canRedo());
  }, []);

  // Handle saving mind map with exam category and sub-exam
  const handleSaveMindMap = useCallback((name: string, examCategory: ExamCategory, subExamName: string) => {
    saveCurrentMindMap(name, examCategory, subExamName);
  }, [saveCurrentMindMap]);

  // Record changes to history
  useEffect(() => {
    // Don't record the initial state or states that are a result of undo/redo
    if (nodes !== initialNodes || edges !== initialEdges) {
      mindMapHistory.record(nodes, edges);
      updateUndoRedoState();
      lastChangeRef.current = Date.now();
    }
  }, [nodes, edges, updateUndoRedoState]);

  // Auto-save functionality
  useEffect(() => {
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    // Setup new timer if auto-save is enabled
    if (autoSaveConfig.enabled) {
      autoSaveTimerRef.current = setInterval(() => {
        // Only auto-save if there's a current mind map and changes since last save
        if (currentMindMap && shouldAutoSave(autoSaveConfig)) {
          const timeSinceLastChange = Date.now() - lastChangeRef.current;
          
          // Only save if there were changes in the last minute
          if (timeSinceLastChange < 60000) {
            const newConfig = performAutoSave(
              { nodes, edges, name: currentMindMap, examCategory: (nodes[0]?.data as any)?.examCategory, subExamName: (nodes[0]?.data as any)?.subExamName },
              autoSaveConfig
            );
            
            if (newConfig.lastSaveTime !== autoSaveConfig.lastSaveTime) {
              setAutoSaveConfig(newConfig);
              console.log(`Auto-saved mind map: ${currentMindMap}`);
            }
          }
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [autoSaveConfig, currentMindMap, nodes, edges]);

  // Assign API to window for global access
  useEffect(() => {
    (window as any).mindmapApi = {
      deleteNode,
      updateNodeData,
      updateEdge,
      copyNode,
      pasteNode,
      duplicateNode
    };
    return () => {
      delete (window as any).mindmapApi;
    };
  }, [deleteNode, updateNodeData, updateEdge, copyNode, pasteNode, duplicateNode]);

  // Toggle sidebar visibility
  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Confirm deletion handler for mind maps
  const handleConfirmDeleteMindMap = () => {
    confirmDeleteMindMap(mindMapToDelete);
    setMindMapToDelete(null);
  };

  // Handle node click to show node settings
  const onNodeClick = (_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  };

  // Get the selected node data
  const getSelectedNodeData = () => {
    return nodes.find(node => node.id === selectedNode)?.data;
  };

  const selectedNodeData = getSelectedNodeData();
  const nodeType = selectedNodeData?.nodeType;
  
  // Check if the selected node is a shape
  const isShapeNode = nodeType === 'circle' || nodeType === 'rectangle' || nodeType === 'square' || nodeType === 'triangle';

  // Check if the selected node is an education node
  const isEducationNode = nodeType === 'flashcard' || nodeType === 'quiz' || nodeType === 'mindmap';

  return (
    <SidebarProvider>
      <div className="w-full h-screen flex">
        {!sidebarVisible && (
          <Button 
            variant="outline"
            size="sm"
            className="absolute top-16 left-4 z-50 bg-white shadow-md border flex items-center gap-1"
            onClick={handleToggleSidebar}
            title="Show Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
            <span>Tools</span>
          </Button>
        )}
        {sidebarVisible && (
          <ComponentsSidebar 
            onAddNode={addNode} 
            onToggleSidebar={handleToggleSidebar}
          />
        )}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <MindMapTopBar
            currentMindMap={currentMindMap}
            onSave={openSaveDialog}
            handleExport={handleExport}
            createNewMindMap={createNewMindMap}
            loadExistingMindMap={loadExistingMindMap}
            handleDeleteMindMap={handleDeleteMindMap}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            autoSaveConfig={autoSaveConfig}
            onAutoSaveConfigChange={setAutoSaveConfig}
          />
          
          {/* Mind Map Header */}
          <MindMapHeader
            data={headerData}
            onChange={setHeaderData}
            isCollapsed={isHeaderCollapsed}
            onToggleCollapse={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
          />
          
          <div className="flex-1 overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onEdgeClick={onEdgeClick}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              nodeExtent={[[WORKSPACE_X, WORKSPACE_Y], [WORKSPACE_X + WORKSPACE_WIDTH, WORKSPACE_Y + WORKSPACE_HEIGHT]]}
            >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
            
            {selectedEdge && edges.find(edge => edge.id === selectedEdge) && (
              <EdgeSettings 
                id={selectedEdge} 
                data={edges.find(edge => edge.id === selectedEdge)?.data || {}} 
              />
            )}
          </ReactFlow>
          </div>
          
          {/* Settings Button for specialized nodes - only visible when a specialized node is selected */}
          {selectedNode && (
            nodeType === 'timeline' || 
            nodeType === 'checklist' || 
            nodeType === 'resource' || 
            isShapeNode ||
            isEducationNode ||
            nodeType === 'note' ||
            nodeType === 'concept'
          ) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="absolute right-4 top-16 z-10 bg-white shadow-md border"
                  variant="outline"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {nodeType === 'timeline' ? 'Timeline' : 
                   nodeType === 'checklist' ? 'Checklist' : 
                   nodeType === 'resource' ? 'Resources' : 
                   nodeType === 'flashcard' ? 'Flashcards' :
                   nodeType === 'quiz' ? 'Quiz' :
                   nodeType === 'mindmap' ? 'Mind Map' :
                   nodeType === 'note' ? 'Note' :
                   nodeType === 'concept' ? 'Concept' :
                   'Shape'} Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto">
                {nodeType === 'timeline' && selectedNodeData && (
                  <TimelineSettings nodeId={selectedNode} data={selectedNodeData} />
                )}
                
                {nodeType === 'checklist' && selectedNodeData && (
                  <ChecklistSettings nodeId={selectedNode} data={selectedNodeData} />
                )}
                
                {nodeType === 'resource' && selectedNodeData && (
                  <ResourceSettings nodeId={selectedNode} data={selectedNodeData} />
                )}
                
                {isShapeNode && selectedNodeData && (
                  <ShapeSettings nodeId={selectedNode} data={selectedNodeData} />
                )}

                {nodeType === 'flashcard' && selectedNodeData && (
                  <FlashcardSettings nodeId={selectedNode} data={selectedNodeData} />
                )}
                
                {nodeType === 'quiz' && selectedNodeData && (
                  <QuizSettings nodeId={selectedNode} data={selectedNodeData} />
                )}
                
                {nodeType === 'mindmap' && selectedNodeData && (
                  <MindMapSettings nodeId={selectedNode} data={selectedNodeData} />
                )}
                
                {nodeType === 'note' && selectedNodeData && (
                  <NoteSettings nodeId={selectedNode} data={selectedNodeData} />
                )}
                
                {nodeType === 'concept' && selectedNodeData && (
                  <ConceptSettings nodeId={selectedNode} data={selectedNodeData} />
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Mind Map Delete Dialog */}
      <MindMapDeleteDialog
        mindMapToDelete={mindMapToDelete}
        setMindMapToDelete={setMindMapToDelete}
        confirmDeleteMindMap={handleConfirmDeleteMindMap}
      />

      {/* Mind Map Save Dialog */}
      <MindMapSaveDialog 
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSaveMindMap}
        currentName={currentMindMap}
      />
    </SidebarProvider>
  );
};
