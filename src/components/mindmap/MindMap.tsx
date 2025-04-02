
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  useReactFlow,
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
import { useMindMapKeyboardHandlers } from './MindMapKeyboardHandlers';
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
import { 
  AutoSaveConfig, 
  initAutoSaveConfig, 
  shouldAutoSave, 
  performAutoSave 
} from '@/utils/mindmapAutoSave';
import { WorkspaceArea } from './WorkspaceArea';
import { WorkspaceSettings } from './types';

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

// Default workspace settings
const defaultWorkspaceSettings: WorkspaceSettings = {
  width: 800,
  visible: true,
  enforced: true
};

const MindMapFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentMindMap, setCurrentMindMap] = useState<string>('');
  const [mindMapToDelete, setMindMapToDelete] = useState<string | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'basic' | 'advanced' | 'education'>('basic');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [autoSaveConfig, setAutoSaveConfig] = useState<AutoSaveConfig>(initAutoSaveConfig());
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>(defaultWorkspaceSettings);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const lastChangeRef = useRef<number>(Date.now());
  const reactFlowInstance = useReactFlow();

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
    saveCurrentMindMap
  } = useMindMapStorage({
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
  });

  // Enforce workspace constraints
  useEffect(() => {
    if (workspaceSettings.enforced && nodes.length > 0) {
      const workspaceLeft = (window.innerWidth - workspaceSettings.width) / 2;
      const workspaceRight = workspaceLeft + workspaceSettings.width;
      
      let nodesUpdated = false;
      
      const updatedNodes = nodes.map(node => {
        if (node.position.x < workspaceLeft) {
          nodesUpdated = true;
          return {
            ...node,
            position: {
              ...node.position,
              x: workspaceLeft + 10 // Add some padding
            }
          };
        }
        
        // Check right edge considering node width
        const nodeWidth = node.width || 150; // Default width if not specified
        if (node.position.x + nodeWidth > workspaceRight) {
          nodesUpdated = true;
          return {
            ...node,
            position: {
              ...node.position,
              x: workspaceRight - nodeWidth - 10 // Add some padding
            }
          };
        }
        
        return node;
      });
      
      if (nodesUpdated) {
        setNodes(updatedNodes);
      }
    }
  }, [nodes, workspaceSettings, setNodes]);

  // Modify addNode to respect workspace boundaries
  const addNodeWithinWorkspace = useCallback((type: any, additionalData: any = {}) => {
    if (workspaceSettings.enforced) {
      // Get viewport center
      const { x, y, zoom } = reactFlowInstance.getViewport();
      
      // Calculate workspace boundaries
      const workspaceLeft = (window.innerWidth - workspaceSettings.width) / 2;
      const workspaceRight = workspaceLeft + workspaceSettings.width;
      const viewportCenter = (workspaceLeft + workspaceRight) / 2;
      
      // Ensure node is placed within workspace boundaries
      const screenPosition = { x: viewportCenter, y: window.innerHeight / 2 };
      const flowPosition = reactFlowInstance.screenToFlowPosition(screenPosition);
      
      // Call the original addNode with adjusted position
      addNode(type, {
        ...additionalData,
        position: flowPosition
      });
    } else {
      addNode(type, additionalData);
    }
  }, [addNode, workspaceSettings, reactFlowInstance]);

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
              { nodes, edges, name: currentMindMap, workspaceSettings },
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
  }, [autoSaveConfig, currentMindMap, nodes, edges, workspaceSettings]);

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
            onAddNode={addNodeWithinWorkspace} 
            onToggleSidebar={handleToggleSidebar}
          />
        );
      case 'education':
        return (
          <EducationSidebar 
            onAddNode={addNodeWithinWorkspace} 
            onToggleSidebar={handleToggleSidebar}
          />
        );
      default:
        return (
          <ComponentsSidebar 
            onAddNode={addNodeWithinWorkspace} 
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
            saveCurrentMindMap={saveCurrentMindMap}
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
            workspaceSettings={workspaceSettings}
            onWorkspaceSettingsChange={setWorkspaceSettings}
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
            <WorkspaceArea settings={workspaceSettings} />
            
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

      <MindMapDeleteDialog
        mindMapToDelete={mindMapToDelete}
        setMindMapToDelete={setMindMapToDelete}
        confirmDeleteMindMap={handleConfirmDeleteMindMap}
      />
    </SidebarProvider>
  );
};

// Wrap with ReactFlowProvider to avoid zustand provider error
export const MindMap = () => {
  return (
    <ReactFlowProvider>
      <MindMapFlow />
    </ReactFlowProvider>
  );
};
