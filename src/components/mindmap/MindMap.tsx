import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MindMapNode } from './types';
import { 
  Lock, 
  HandIcon, 
  Square, 
  Diamond, 
  Circle,
  ArrowRight,
  Minus,
  Link2,
  Type,
  Image,
  Shapes,
  Share2,
  Library
} from 'lucide-react';

const nodeTypes = {
  base: BaseNode,
};

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'base',
    data: { 
      label: 'Main Idea',
      type: 'circle',
      backgroundColor: 'white',
      strokeColor: 'black',
      strokeWidth: 1,
      strokeStyle: 'solid',
      fontSize: 'M',
      textAlign: 'center',
      opacity: 1
    },
    position: { x: 400, y: 200 },
  },
];

const initialEdges: Edge[] = [];

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, [setNodes]);

  window.mindmapApi = {
    deleteNode,
  };

  const addNode = (type: 'rectangle' | 'circle' | 'diamond' | 'transparent') => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'base',
      data: { label: 'New Node', type } as BaseNodeData,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('mindmap', JSON.stringify({ nodes, edges }));
    toast({
      title: "Mind Map Saved",
      description: "Your mind map has been saved successfully.",
    });
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('mindmap');
    if (saved) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
      setNodes(savedNodes);
      setEdges(savedEdges);
      toast({
        title: "Mind Map Loaded",
        description: "Your mind map has been loaded successfully.",
      });
    }
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'mindmap.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="w-full h-screen">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white rounded-lg shadow-lg p-2">
        <Button variant="ghost" size="icon" onClick={saveToLocalStorage}>
          <Lock className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <HandIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-200" />
        <Button variant="ghost" size="icon" onClick={() => addNode('rectangle')}>
          <Square className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => addNode('diamond')}>
          <Diamond className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => addNode('circle')}>
          <Circle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Minus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Link2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Type className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Shapes className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-200" />
        <Button variant="ghost" size="icon" onClick={exportToJson}>
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={loadFromLocalStorage}>
          <Library className="h-4 w-4" />
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};