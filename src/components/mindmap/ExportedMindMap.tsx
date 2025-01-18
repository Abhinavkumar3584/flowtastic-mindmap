import { useEffect, useState } from 'react';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { renderMindMap } from '@/utils/mindmapRenderer';
import { useToast } from '@/hooks/use-toast';
import { MindMapData } from './types';

const nodeTypes = {
  base: BaseNode,
};

export const ExportedMindMap = () => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');

  useEffect(() => {
    if (!name) {
      toast({
        title: "Error",
        description: "No mind map name provided",
        variant: "destructive",
      });
      return;
    }

    const data = renderMindMap(name);
    if (data) {
      console.log('Mind map data loaded:', data);
      setMindMapData(data);
    } else {
      console.error('Failed to load mind map:', name);
      toast({
        title: "Error",
        description: `Failed to load mind map: ${name}`,
        variant: "destructive",
      });
    }
  }, [name, toast]);

  if (!mindMapData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading mind map...
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={mindMapData.nodes.map(node => ({
          ...node,
          draggable: false,
          selectable: false,
        }))}
        edges={mindMapData.edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};