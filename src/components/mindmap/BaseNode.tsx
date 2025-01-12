import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export interface BaseNodeData {
  label: string;
  type?: 'rectangle' | 'circle' | 'diamond';
  backgroundColor?: string;
}

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
];

export const BaseNode = ({ data, id, selected }: NodeProps<BaseNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor || 'bg-mindmap-node-bg');

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
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`min-w-[100px] min-h-[50px] ${backgroundColor} border-2 border-mindmap-node-border 
                     shadow-lg ${shape} flex items-center justify-center p-4 transition-colors
                     hover:border-mindmap-node-selected relative`}
          onDoubleClick={handleDoubleClick}
        >
          <NodeResizer 
            minWidth={100}
            minHeight={50}
            isVisible={selected}
            lineClassName="border-mindmap-primary"
            handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
          />
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
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => window.mindmapApi?.deleteNode(id)}>
          Delete Node
        </ContextMenuItem>
        {colors.map((color) => (
          <ContextMenuItem key={color} onSelect={() => setBackgroundColor(color)}>
            <div className={`w-4 h-4 rounded-full ${color} mr-2`} />
            Set Color
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};