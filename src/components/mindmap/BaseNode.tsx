import { Handle, Position, NodeProps } from '@xyflow/react';
import { useState } from 'react';

export interface BaseNodeData {
  label: string;
  type?: 'rectangle' | 'circle' | 'diamond';
}

export const BaseNode = ({ data, id }: NodeProps<BaseNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const shape = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full aspect-square',
    diamond: 'rotate-45',
  }[data.type || 'rectangle'];

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={`min-w-[100px] min-h-[50px] bg-mindmap-node-bg border-2 border-mindmap-node-border 
                 shadow-lg ${shape} flex items-center justify-center p-4 transition-colors
                 hover:border-mindmap-node-selected`}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-mindmap-primary" />
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-center outline-none w-full"
          autoFocus
        />
      ) : (
        <div className={data.type === 'diamond' ? '-rotate-45' : ''}>
          {label}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-mindmap-primary" />
    </div>
  );
};