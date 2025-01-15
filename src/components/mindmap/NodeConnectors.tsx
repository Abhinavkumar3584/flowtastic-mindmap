import { Handle, Position } from '@xyflow/react';

export const NodeConnectors = () => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-mindmap-primary"
        id="top"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-mindmap-primary"
        id="right"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-3 h-3 !bg-mindmap-primary"
        id="bottom"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 !bg-mindmap-primary"
        id="left"
      />
    </>
  );
};