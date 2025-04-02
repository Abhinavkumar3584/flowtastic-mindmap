
import { useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  NodeTypes,
  Node,
  ReactFlowProvider
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
import { renderMindMap } from '@/utils/mindmapRenderer';
import { useToast } from '@/hooks/use-toast';
import { MindMapData, BaseNodeData, WorkspaceSettings } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getAllMindMaps } from '@/utils/mindmapStorage';

// Define all node types to ensure all components load properly
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
  // Map the nodeType to the component for any missing types
  title: BaseNode,
  topic: BaseNode,
  subtopic: BaseNode,
  paragraph: BaseNode,
};

const ExportedMindMapContent = () => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<BaseNodeData | null>(null);
  const { toast } = useToast();
  const mindMaps = getAllMindMaps();

  // Get map name from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mapName = params.get('name');
    
    if (mapName && mindMaps.includes(mapName)) {
      setSelectedMap(mapName);
      handleRender(mapName);
    }
  }, [mindMaps]);

  const handleRender = (mapName?: string) => {
    const nameToRender = mapName || selectedMap;
    
    if (!nameToRender) {
      toast({
        title: "Error",
        description: "Please select a mind map to render",
        variant: "destructive",
      });
      return;
    }

    const data = renderMindMap(nameToRender);
    if (data) {
      console.log('Mind map data loaded:', data);
      setMindMapData(data);
      
      toast({
        title: "Success",
        description: `Loaded mind map: ${nameToRender}`,
      });
    } else {
      console.error('Failed to load mind map:', nameToRender);
      toast({
        title: "Error",
        description: `Failed to load mind map: ${nameToRender}`,
        variant: "destructive",
      });
    }
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node<BaseNodeData>) => {
    console.log('Node clicked:', node);
    setSelectedNode(node.data);
  };

  if (!mindMapData) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <div className="flex gap-4 items-center">
          <Select value={selectedMap} onValueChange={setSelectedMap}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a mind map" />
            </SelectTrigger>
            <SelectContent>
              {mindMaps.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => handleRender()}>Render</Button>
        </div>
      </div>
    );
  }

  // Calculate optimal viewport settings based on workspace
  const calculateViewport = () => {
    const workspaceSettings = mindMapData.workspaceSettings || { width: 800, visible: false };
    
    // If there are no nodes, return default settings
    if (!mindMapData.nodes.length) {
      return { x: 0, y: 0, zoom: 1 };
    }
    
    // Calculate the optimal zoom level based on the workspace width
    const padding = 20; // Add some padding to ensure everything is visible
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Calculate default zoom
    let zoom = 1;
    
    // If workspace is defined and active, center the view on the workspace
    if (workspaceSettings.visible) {
      const halfWorkspaceWidth = workspaceSettings.width / 2;
      zoom = Math.min((containerWidth - padding * 2) / workspaceSettings.width, 1);
      
      return { 
        x: (containerWidth / 2) - (halfWorkspaceWidth * zoom), 
        y: padding, 
        zoom 
      };
    }
    
    // Default return
    return { x: 0, y: 0, zoom: 1 };
  };

  const viewport = calculateViewport();

  return (
    <>
      <div className="w-full h-screen">
        <ReactFlow
          nodes={mindMapData.nodes}
          edges={mindMapData.edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          defaultViewport={viewport}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          fitView={!mindMapData.workspaceSettings?.visible}
        >
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNode?.content?.title || selectedNode?.label}</DialogTitle>
            <DialogDescription>
              Click outside to close
            </DialogDescription>
          </DialogHeader>
          
          {/* Display node content based on node type */}
          {selectedNode?.content?.description && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedNode.content.description}
              </p>
            </div>
          )}
          
          {selectedNode?.content?.links && selectedNode.content.links.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Links</h3>
              <div className="space-y-2">
                {selectedNode.content.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Display specialized content based on node type */}
          {selectedNode?.nodeType === 'checklist' && selectedNode.checklistItems && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Checklist Items</h3>
              <ul className="space-y-1">
                {selectedNode.checklistItems.map(item => (
                  <li key={item.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={item.isChecked} readOnly className="h-4 w-4" />
                    <span className={item.isChecked ? 'line-through text-gray-500' : ''}>{item.text}</span>
                    {item.priority && (
                      <span className={`text-xs px-1 rounded ${
                        item.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.priority}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {selectedNode?.nodeType === 'note' && selectedNode.noteContent && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Note Content</h3>
              <div className="p-3 rounded" style={{ backgroundColor: selectedNode.noteColor || '#fffacd' }}>
                <p className="whitespace-pre-wrap">{selectedNode.noteContent}</p>
              </div>
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedNode.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {selectedNode?.nodeType === 'concept' && selectedNode.definition && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Concept Definition</h3>
              <p className="text-sm whitespace-pre-wrap">{selectedNode.definition}</p>
              {selectedNode.examples && selectedNode.examples.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Examples:</h4>
                  <ul className="list-disc list-inside">
                    {selectedNode.examples.map((example, index) => (
                      <li key={index} className="text-sm">{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const ExportedMindMap = () => {
  return (
    <ReactFlowProvider>
      <ExportedMindMapContent />
    </ReactFlowProvider>
  );
};
