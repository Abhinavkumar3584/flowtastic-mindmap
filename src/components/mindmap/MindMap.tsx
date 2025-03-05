
import { useState } from 'react';
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
import { MindMapNode } from './node-components/MindMapNode';
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
import { NodeConnectors } from './NodeConnectors';

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
  mindmap: MindMapNode,
};

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentMindMap, setCurrentMindMap] = useState<string>('');
  const [mindMapToDelete, setMindMapToDelete] = useState<string | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'basic' | 'advanced' | 'education'>('basic');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

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
    initialNodes
  });

  // Assign API to window for global access
  window.mindmapApi = {
    deleteNode,
    updateNodeData,
    updateEdge,
    copyNode,
    pasteNode,
    duplicateNode
  };

  // Toggle between sidebars - MODIFIED to cycle in the correct order
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
            saveCurrentMindMap={saveCurrentMindMap}
            handleExport={handleExport}
            createNewMindMap={createNewMindMap}
            loadExistingMindMap={loadExistingMindMap}
            handleDeleteMindMap={handleDeleteMindMap}
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
            isEducationNode
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
