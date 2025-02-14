import { ReactFlow, Controls, Background, Edge, NodeTypes, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { MindMapData, MindMapNode, MindMapEdge, BaseNodeData } from './types';
import { ComponentsSidebar } from './ComponentsSidebar';
import SectionNode from './node-components/SectionNode';

const nodeTypes: NodeTypes = {
  title: BaseNode,
  topic: BaseNode,
  subtopic: BaseNode,
  paragraph: BaseNode,
  section: SectionNode,
};

interface MindMapProps {
  initialData?: MindMapData;
}

export const MindMap = ({ initialData }: MindMapProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChange, onConnect] = useEdgesState(initialData?.edges || []);

  const onAddNode = (type: string) => {
    const id = crypto.randomUUID();

    const newNode: MindMapNode = {
      id: id,
      type: type,
      position: { x: 0, y: 0 },
      data: { label: type },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onAddEdge = (source: string, target: string) => {
    const id = `e${source}-${target}`;

    const newEdge: MindMapEdge = {
      id: id,
      source: source,
      target: target,
    };

    setEdges((eds) => eds.concat(newEdge));
  };

  window.mindmapApi = {
    deleteNode: (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    },
    updateNodeData: (id: string, data: Partial<BaseNodeData>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, ...data } };
          }
          return node;
        })
      );
    },
    updateEdge: (id: string, data: Partial<EdgeData>) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === id) {
            return { ...edge, data: { ...edge.data, ...data } };
          }
          return edge;
        })
      );
    },
  };

  return (
    <div className="h-full w-full flex">
      <ComponentsSidebar onAddNode={onAddNode} />
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          className="bg-mindmap-background"
          fitView
        >
          <Controls />
          <Background color="#aaa" variant="dots" />
        </ReactFlow>
      </div>
    </div>
  );
};
