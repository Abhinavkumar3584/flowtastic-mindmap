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
import { BaseNode, BaseNodeData } from './BaseNode';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const nodeTypes = {
  base: BaseNode,
};

const initialNodes: Node<BaseNodeData>[] = [
  {
    id: '1',
    type: 'base',
    data: { label: 'Main Idea', type: 'circle' },
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

  const addNode = (type: 'rectangle' | 'circle' | 'diamond') => {
    const newNode: Node<BaseNodeData> = {
      id: `${nodes.length + 1}`,
      type: 'base',
      data: { label: 'New Node', type },
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
      <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap max-w-[200px]">
        <Button onClick={() => addNode('rectangle')}>Add Rectangle</Button>
        <Button onClick={() => addNode('circle')}>Add Circle</Button>
        <Button onClick={() => addNode('diamond')}>Add Diamond</Button>
        <Button onClick={saveToLocalStorage}>Save</Button>
        <Button onClick={loadFromLocalStorage}>Load</Button>
        <Button onClick={exportToJson}>Export</Button>
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