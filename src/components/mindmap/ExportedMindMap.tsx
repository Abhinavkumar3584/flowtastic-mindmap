
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
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Node types mapping for the viewer
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
  title: BaseNode,
  topic: BaseNode,
  subtopic: BaseNode,
  paragraph: BaseNode,
};

interface MindMapViewerProps {
  predefinedMindMap?: MindMapData;
  containerHeight?: string;
}

export const ExportedMindMap = ({ predefinedMindMap, containerHeight = "100vh" }: MindMapViewerProps) => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<BaseNodeData | null>(null);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const mindMaps = getAllMindMaps();

  // Auto-load mind map from URL parameter
  useEffect(() => {
    const mapName = searchParams.get('map');
    if (mapName) {
      setSelectedMap(mapName);
      handleRenderMap(mapName);
    }
  }, [searchParams]);

  // Use predefined mind map if provided
  useEffect(() => {
    if (predefinedMindMap) {
      setMindMapData(predefinedMindMap);
    }
  }, [predefinedMindMap]);

  const handleRenderMap = (mapName: string) => {
    if (!mapName) {
      toast({
        title: "Error",
        description: "Please select a mind map to view",
        variant: "destructive",
      });
      return;
    }

    const data = renderMindMap(mapName);
    if (data) {
      console.log('Mind map loaded for viewing:', data);
      setMindMapData(data);
      
      toast({
        title: "Success",
        description: `Loaded mind map: ${mapName}`,
      });
    } else {
      console.error('Failed to load mind map:', mapName);
      toast({
        title: "Error",
        description: `Failed to load mind map: ${mapName}`,
        variant: "destructive",
      });
    }
  };

  const handleRender = () => {
    handleRenderMap(selectedMap);
  };

  const handleNodeClick = (_: React.MouseEvent, node: any) => {
    console.log('Node selected for details:', node);
    setSelectedNode(node.data);
  };

  // Render map selection interface if no data is available
  if (!mindMapData && !predefinedMindMap) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
        <div className="absolute top-4 left-4">
          <Link to="/exams">
            <Button variant="outline" className="flex gap-2 items-center">
              <ArrowLeft size={16} />
              <span>Back to Catalog</span>
            </Button>
          </Link>
        </div>
        
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mind Map Viewer</h1>
          <p className="text-gray-600 mb-6">Select a mind map to view in presentation mode</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Select value={selectedMap} onValueChange={setSelectedMap}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Choose a mind map to view" />
            </SelectTrigger>
            <SelectContent>
              {mindMaps.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRender} disabled={!selectedMap}>
            View Mind Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-10">
        <Link to="/exams">
          <Button variant="outline" className="flex gap-2 items-center">
            <ArrowLeft size={16} />
            <span>Back to Catalog</span>
          </Button>
        </Link>
      </div>

      <div 
        className="w-full mindmap-viewer" 
        style={{ 
          height: containerHeight,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <ReactFlow
          nodes={mindMapData?.nodes || []}
          edges={mindMapData?.edges || []}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          className="mindmap-display"
        />

        <style>{`
          .mindmap-viewer .react-flow__handle {
            display: none !important;
          }
          .mindmap-viewer .react-flow__resize-control {
            display: none !important;
          }
          .mindmap-viewer .react-flow__node button {
            display: none !important;
          }
        `}</style>
      </div>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedNode?.label}</DialogTitle>
            <DialogDescription>
              Node details and content
            </DialogDescription>
          </DialogHeader>
          
          {/* Display node content based on node type - safely handle nullable content */}
          {selectedNode?.content && typeof selectedNode.content === 'object' && selectedNode.content?.description && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedNode.content?.description}
              </p>
            </div>
          )}
          
          {selectedNode?.content && typeof selectedNode.content === 'object' && selectedNode.content?.links && selectedNode.content?.links.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Links</h3>
              <div className="space-y-2">
                {selectedNode.content?.links.map((link: any, index: number) => (
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
