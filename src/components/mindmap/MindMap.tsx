import { useCallback } from 'react';
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
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { MindMapNode, BaseNodeData } from './types';
import { ComponentsSidebar } from './ComponentsSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const nodeTypes = {
  base: BaseNode,
};

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'base',
    data: { 
      label: 'Main Idea',
      nodeType: 'title',
      backgroundColor: 'white',
      strokeColor: 'black',
      strokeWidth: 1,
      strokeStyle: 'solid',
      fontSize: 12,
      textAlign: 'center',
      opacity: 1
    },
    position: { x: 400, y: 200 },
  },
];

const initialEdges: Edge[] = [];

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<MindMapNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  const addNode = (type: BaseNodeData['nodeType']) => {
    if (!type) return;
    
    const newNode: MindMapNode = {
      id: `${nodes.length + 1}`,
      type: 'base',
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1),
        nodeType: type,
        backgroundColor: 'white',
        strokeColor: 'black',
        strokeWidth: 1,
        strokeStyle: 'solid',
        fontSize: type === 'title' ? 12 : 12,
        textAlign: 'center',
        opacity: 1
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <SidebarProvider>
      <div className="w-full h-screen flex">
        <ComponentsSidebar onAddNode={addNode} />
        <div className="flex-1 relative">
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
      </div>
    </SidebarProvider>
  );
};