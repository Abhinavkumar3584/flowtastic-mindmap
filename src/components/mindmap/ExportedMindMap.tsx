
import { useEffect, useState } from 'react';
import { ReactFlow, Background, NodeTypes, Node } from '@xyflow/react';
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
import { MindMapData, BaseNodeData } from './types';
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

interface ExportedMindMapProps {
  predefinedMindMap?: MindMapData;
  containerHeight?: string;
}

export const ExportedMindMap = ({ predefinedMindMap, containerHeight = "100vh" }: ExportedMindMapProps) => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<BaseNodeData | null>(null);
  const { toast } = useToast();
  const mindMaps = getAllMindMaps();

  // If a predefined mind map is provided, use it
  useEffect(() => {
    if (predefinedMindMap) {
      setMindMapData(predefinedMindMap);
    }
  }, [predefinedMindMap]);

  const handleRender = () => {
    if (!selectedMap) {
      toast({
        title: "Error",
        description: "Please select a mind map to render",
        variant: "destructive",
      });
      return;
    }

    const data = renderMindMap(selectedMap);
    if (data) {
      console.log('Mind map data loaded:', data);
      setMindMapData(data);
      
      toast({
        title: "Success",
        description: `Loaded mind map: ${selectedMap}`,
      });
    } else {
      console.error('Failed to load mind map:', selectedMap);
      toast({
        title: "Error",
        description: `Failed to load mind map: ${selectedMap}`,
        variant: "destructive",
      });
    }
  };

  const handleNodeClick = (_: React.MouseEvent, node: any) => {
    console.log('Node clicked:', node);
    setSelectedNode(node.data);
  };

  // Render selection UI if no mind map data is available yet
  if (!mindMapData && !predefinedMindMap) {
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
          <Button onClick={handleRender}>Render</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full" style={{ height: containerHeight }}>
        <ReactFlow
          nodes={mindMapData?.nodes || []}
          edges={mindMapData?.edges || []}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNode?.label}</DialogTitle>
            <DialogDescription>
              Click outside to close
            </DialogDescription>
          </DialogHeader>
          
          {/* Display node content based on node type */}
          {selectedNode?.content && typeof selectedNode.content === 'object' && selectedNode.content.description && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedNode.content.description}
              </p>
            </div>
          )}
          
          {selectedNode?.content && typeof selectedNode.content === 'object' && selectedNode.content.links && selectedNode.content.links.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Links</h3>
              <div className="space-y-2">
                {selectedNode.content.links.map((link: any, index: number) => (
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
          {selectedNode?.nodeType === 'checklist' && (selectedNode as any).checklistItems && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Checklist Items</h3>
              <ul className="space-y-1">
                {(selectedNode as any).checklistItems.map((item: any) => (
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
          
          {selectedNode?.nodeType === 'note' && (selectedNode as any).noteContent && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Note Content</h3>
              <div className="p-3 rounded" style={{ backgroundColor: (selectedNode as any).noteColor || '#fffacd' }}>
                <p className="whitespace-pre-wrap">{(selectedNode as any).noteContent}</p>
              </div>
              {(selectedNode as any).tags && (selectedNode as any).tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {(selectedNode as any).tags.map((tag: string, index: number) => (
                    <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {selectedNode?.nodeType === 'concept' && (selectedNode as any).definition && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Concept Definition</h3>
              <p className="text-sm whitespace-pre-wrap">{(selectedNode as any).definition}</p>
              {(selectedNode as any).examples && (selectedNode as any).examples.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Examples:</h4>
                  <ul className="list-disc list-inside">
                    {(selectedNode as any).examples.map((example: string, index: number) => (
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
