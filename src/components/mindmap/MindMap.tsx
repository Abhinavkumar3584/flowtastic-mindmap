
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
import { AdvancedComponentsSidebar } from './AdvancedComponentsSidebar';
import { EducationSidebar } from './EducationSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useMindMapNodeHandlers } from './hooks/useMindMapNodeHandlers';
import { useMindMapEdgeHandlers } from './hooks/useMindMapEdgeHandlers';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
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
import { mindMapHistory } from '@/utils/mindmapHistory';
import { useToast } from '@/hooks/use-toast';
import { ExamCategory, MindMapNode, MindMapEdge } from './types';
import { 
  AutoSaveConfig, 
  initAutoSaveConfig, 
  shouldAutoSave, 
  performAutoSave 
} from '@/utils/mindmapAutoSave';
import { BoundedArea } from './BoundedArea';

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
};

// Define the bounds for valid content (in pixels)
// These dimensions ensure content will fit nicely on web and mobile
const CONTENT_BOUNDS = {
  width: 800,  // Standard width that works well on most screens
  height: 1500, // Tall enough for scrollable content
};

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentMindMap, setCurrentMindMap] = useState<string>('');
  const [mindMapToDelete, setMindMapToDelete] = useState<string | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'basic' | 'advanced' | 'education'>('basic');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [autoSaveConfig, setAutoSaveConfig] = useState<AutoSaveConfig>(initAutoSaveConfig());
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const lastChangeRef = useRef<number>(Date.now());

  // Function to update undo/redo state
  const updateUndoRedoState = useCallback(() => {
    setCanUndo(mindMapHistory.canUndo());
    setCanRedo(mindMapHistory.canRedo());
  }, []);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const previousState = mindMapHistory.undo(nodes, edges);
    if (previousState) {
      setNodes(previousState.nodes as any);
      setEdges(previousState.edges as any);
      updateUndoRedoState();
    }
  }, [nodes, edges, setNodes, setEdges, updateUndoRedoState]);

  const handleRedo = useCallback(() => {
    const nextState = mindMapHistory.redo(nodes, edges);
    if (nextState) {
      setNodes(nextState.nodes as any);
      setEdges(nextState.edges as any);
      updateUndoRedoState();
    }
  }, [nodes, edges, setNodes, setEdges, updateUndoRedoState]);

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
    initialNodes
  });

  // Add a state to track nodes within bounds
  const [nodesWithinBounds, setNodesWithinBounds] = useState<string[]>([]);
  
  // Check if nodes are within bounds before saving
  const checkNodesWithinBounds = useCallback(() => {
    // Get nodes that are within the content boundaries
    const validNodeIds = nodes.filter(node => {
      // Calculate node center position
      const centerX = node.position.x + (node.width || 0) / 2;
      const centerY = node.position.y + (node.height || 0) / 2;
      
      // Check if node center is within bounds
      return (
        Math.abs(centerX) <= CONTENT_BOUNDS.width / 2 &&
        Math.abs(centerY) <= CONTENT_BOUNDS.height / 2
      );
    }).map(node => node.id);
    
    setNodesWithinBounds(validNodeIds);
    return validNodeIds;
  }, [nodes]);

  // Override save function to filter out nodes outside bounds
  const handleSaveMindMap = useCallback((name: string, examCategory: ExamCategory, subExamName: string) => {
    // Get nodes within bounds
    const validNodeIds = checkNodesWithinBounds();
    
    // Filter nodes and related edges
    const filteredNodes = nodes.filter(node => validNodeIds.includes(node.id));
    const filteredEdges = edges.filter(edge => 
      validNodeIds.includes(edge.source) && validNodeIds.includes(edge.target)
    );
    
    // Save only the filtered content
    saveCurrentMindMap(name, examCategory, subExamName, filteredNodes, filteredEdges);
  }, [nodes, edges, checkNodesWithinBounds, saveCurrentMindMap]);

  // Record changes to history
  useEffect(() => {
    // Don't record the initial state or states that are a result of undo/redo
    if (nodes !== initialNodes || edges !== initialEdges) {
      mindMapHistory.record(nodes as any, edges as any);
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
              { nodes, edges, name: currentMindMap },
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
  window.mindmapApi = {
    deleteNode,
    updateNodeData,
    updateEdge,
    copyNode,
    pasteNode,
    duplicateNode
  };

  // Toggle between sidebars
  const handleToggleSidebar = () => {
    if (sidebarMode === 'basic') {
      setSidebarMode('advanced');
    } else if (sidebarMode === 'advanced') {
      setSidebarMode('education');
    } else {
      setSidebarMode('basic');
    }
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

  // Render the appropriate sidebar based on mode
  const renderSidebar = () => {
    switch (sidebarMode) {
      case 'advanced':
        return (
          <AdvancedComponentsSidebar 
            onAddNode={addNode} 
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case 'education':
        return (
          <EducationSidebar 
            onAddNode={addNode} 
            onToggleSidebar={handleToggleSidebar}
          />
        );
      default:
        return (
          <ComponentsSidebar 
            onAddNode={addNode} 
            onToggleSidebar={handleToggleSidebar}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="w-full h-screen flex">
        {renderSidebar()}
        <div className="flex-1 relative">
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
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
            <BoundedArea width={CONTENT_BOUNDS.width} height={CONTENT_BOUNDS.height} />
            
            {selectedEdge && edges.find(edge => edge.id === selectedEdge) && (
              <EdgeSettings 
                id={selectedEdge} 
                data={edges.find(edge => edge.id === selectedEdge)?.data || {}} 
              />
            )}
          </ReactFlow>
          
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
