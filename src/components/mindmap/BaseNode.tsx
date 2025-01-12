import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Textarea } from "@/components/ui/textarea";
import { NodeSettings } from './NodeSettings';
import { MindMapNode, BaseNodeData } from './types';

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-transparent',
];

export const BaseNode = ({ data, id, selected }: NodeProps<BaseNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [nodeData, setNodeData] = useState<BaseNodeData>(data);

  const shape = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full aspect-square',
    diamond: 'rotate-45',
    transparent: 'rounded-lg bg-opacity-20',
  }[data.type || 'rectangle'];

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const handleSettingsChange = (updates: Partial<BaseNodeData>) => {
    setNodeData(prev => ({ ...prev, ...updates }));
  };

  const getFontSize = () => {
    switch (nodeData.fontSize) {
      case 'S': return 'text-sm';
      case 'M': return 'text-base';
      case 'L': return 'text-lg';
      case 'XL': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getBorderStyle = () => {
    const width = nodeData.strokeWidth || 1;
    const style = nodeData.strokeStyle || 'solid';
    const color = nodeData.strokeColor || 'black';
    return `${width}px ${style} ${color}`;
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`min-w-[100px] min-h-[50px] ${nodeData.backgroundColor || 'bg-white'} 
                     ${shape} flex items-center justify-center p-4 transition-colors
                     hover:border-mindmap-node-selected relative ${getFontSize()}`}
          style={{
            border: getBorderStyle(),
            fontFamily: nodeData.fontFamily,
            opacity: nodeData.opacity || 1,
            textAlign: nodeData.textAlign || 'center',
          }}
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
            <Textarea
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-center outline-none w-full resize-none"
              autoFocus
            />
          ) : (
            <div className={data.type === 'diamond' ? '-rotate-45' : ''} style={{ whiteSpace: 'pre-wrap' }}>
              {label}
            </div>
          )}
          <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-mindmap-primary" />
          {selected && <NodeSettings data={nodeData} onChange={handleSettingsChange} />}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => window.mindmapApi?.deleteNode(id)}>
          Delete Node
        </ContextMenuItem>
        {colors.map((color) => (
          <ContextMenuItem key={color} onSelect={() => handleSettingsChange({ backgroundColor: color })}>
            <div className={`w-4 h-4 rounded-full ${color} mr-2 border border-gray-300`} />
            Set Color
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};