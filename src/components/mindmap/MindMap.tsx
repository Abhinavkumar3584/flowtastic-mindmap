
import { ReactFlow, Controls, Background, Edge, NodeTypes, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { MindMapData, MindMapNode, MindMapEdge, BaseNodeData } from './types';
import { ComponentsSidebar } from './ComponentsSidebar';
import SectionNode from './node-components/SectionNode';
import { SidebarProvider } from '../ui/sidebar';

const nodeTypes: NodeTypes = {
  title: BaseNode,
  topic: BaseNode,
  subtopic: BaseNode,
  paragraph: BaseNode,
  section: SectionNode,
};

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<BaseNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params: any) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const onAddNode = (type: string) => {
    const newNode: MindMapNode = {
      id: crypto.randomUUID(),
      type,
      position: { x: 100, y: 100 },
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        nodeType: type as BaseNodeData['nodeType'],
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // Register the mindmap API for external usage
  React.useEffect(() => {
    window.mindmapApi = {
      deleteNode: (id: string) => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
      },
      updateNodeData: (id: string, data: Partial<BaseNodeData>) => {
        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    ...data,
                  },
                }
              : node
          )
        );
      },
      updateEdge: (id: string, data: Partial<BaseNodeData>) => {
        setEdges((edges) =>
          edges.map((edge) =>
            edge.id === id
              ? {
                  ...edge,
                  ...data,
                }
              : edge
          )
        );
      },
    };
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-screen">
      <SidebarProvider>
        <ComponentsSidebar onAddNode={onAddNode} />
      </SidebarProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background variant="lines" />
        <Controls />
      </ReactFlow>
    </div>
  );
};
