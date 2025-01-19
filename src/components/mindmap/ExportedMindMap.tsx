import { useEffect, useState } from 'react';
import { ReactFlow, Background, NodeTypes, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
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

const nodeTypes: NodeTypes = {
  base: BaseNode,
};

export const ExportedMindMap = () => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<BaseNodeData | null>(null);
  const { toast } = useToast();
  const mindMaps = getAllMindMaps();

  useEffect(() => {
    console.log('Available mind maps:', mindMaps);
  }, [mindMaps]);

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
    } else {
      console.error('Failed to load mind map:', selectedMap);
      toast({
        title: "Error",
        description: `Failed to load mind map: ${selectedMap}`,
        variant: "destructive",
      });
    }
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node<BaseNodeData>) => {
    if (node.data.content) {
      setSelectedNode(node.data);
    }
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
          <Button onClick={handleRender}>Render</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen">
        <ReactFlow
          nodes={mindMapData.nodes}
          edges={mindMapData.edges}
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
            <DialogTitle>{selectedNode?.content?.title || selectedNode?.label}</DialogTitle>
            <DialogDescription>
              Click outside to close
            </DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </>
  );
};