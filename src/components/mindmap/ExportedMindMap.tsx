import { ReactFlow, Background } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { MindMapNode } from './types';
import '@xyflow/react/dist/style.css';

interface ExportedMindMapProps {
  nodes: MindMapNode[];
  edges: any[];
}

const nodeTypes = {
  base: BaseNode,
};

export const ExportedMindMap = ({ nodes, edges }: ExportedMindMapProps) => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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